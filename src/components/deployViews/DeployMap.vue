<template>
  <div class="container">
    <baidu-map
      class="map"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="handler"
      :mapClick="false"
    >
      <bm-control>
        <el-popover placement="right" width="150" trigger="click">
          <div style="margin-bottom: 5px;">
            <label>隐藏辐射区域：</label>
            <el-switch
              v-model="circle_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
          <div>
            <label>隐藏设备链路：</label>
            <el-switch
              v-model="path_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
          <el-button icon="el-icon-setting" circle slot="reference"></el-button>
        </el-popover>
      </bm-control>
      <bm-scale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-scale>
      <template v-for="(item, index) in device_graph">
        <bm-marker
          :key="index"
          :position="item.position"
          :dragging="false"
          :icon="item.icon"
          @click="popPrompt(index)"
        >
          <template v-if="circle_show">
            <bm-circle
              :center="item.position"
              :radius="item.radiation_radius"
              stroke-color="red"
              :stroke-opacity="0.8"
              :stroke-weight="1"
              fill-color="#1791fc"
              :fill-opacity="0.1"
            ></bm-circle>
          </template>
          <bm-label
            :content="item.mapID + ''"
            :labelStyle="{
              color: 'balck',
              fontSize: '12px',
              background: 'rgba(0, 0, 0, 0)',
              border: '0px'
            }"
            :offset="{ width: 3, height: 28 }"
          />
          <bm-info-window
            :show="device_graph[index].show_window"
            :width="info_window_width"
            @close="infoWindowClose(index)"
          >
            <InfoContent
              :device_item="device_graph[index]"
              :connect_objs="connect_objs_onClick"
            ></InfoContent>
          </bm-info-window>
        </bm-marker>
        <template v-for="paths in item.down_path">
          <bm-polyline
            v-if="path_show"
            :key="paths.key"
            :path="paths.path"
            stroke-color="green"
            :stroke-opacity="0.5"
            :stroke-weight="5"
          >
          </bm-polyline>
        </template>
      </template>
    </baidu-map>
  </div>
</template>
<script>
import InfoContent from "../suggestDeployViews/InfoContent";
export default {
  components: { InfoContent },
  data() {
    return {
      // 地图数据
      map: null,
      BMap: null,
      center: { lng: 0, lat: 0 },
      zoom: 15,
      // 图数据
      device_graph: [],
      // 控制数据
      picsize_limit: { width: 32, height: 32 },
      info_window_width: 290,
      connect_objs_onClick: null,
      circle_show: true,
      path_show: true
    };
  },
  props: {
    deploy_location: Object
  },
  watch: {
    deploy_location: {
      handler(deployLocation) {
        // 设置地图设备起始标号
        this.device_graph = []; // 清空
        this.generateGraphByDeploy(deployLocation.deploy_location);
      }
    }
  },
  methods: {
    infoWindowClose(index) {
      this.device_graph[index].show_window = false;
    },
    generateGraphByDeploy(deployLocation) {
      for (let i = 0; i < deployLocation.length; i++) {
        const node = {};
        node.mapID = deployLocation[i].device_mapID;
        node.icon = {
          url: deployLocation[i].picurl,
          size: this.picsize_limit
        };
        node.device_name = deployLocation[i].device_name;
        node.device_type = deployLocation[i].device_type;
        node.radiation_radius = deployLocation[i].radiation_radius;
        node.position = deployLocation[i].location;
        node.show_window = false;
        node.device_libID = deployLocation[i].device_libID;
        const downPath = [];
        for (let j = 0; j < deployLocation[i].down_connect_mapID.length; j++) {
          downPath.push({
            key: node.mapID + "" + deployLocation[i].down_connect_mapID[j],
            mapID: deployLocation[i].down_connect_mapID[j],
            path: [
              node.position,
              this.getLocationByMapID(
                deployLocation[i].down_connect_mapID[j],
                deployLocation
              )
            ]
          });
        }
        node.down_path = downPath;
        this.device_graph.push(node);
      }
    },
    getLocationByMapID(mapID, deployLocation) {
      if (deployLocation != null) {
        for (let i = 0; i < deployLocation.length; i++) {
          if (mapID === deployLocation[i].device_mapID) {
            return deployLocation[i].location;
          }
        }
      }
      return null;
    },
    getIndexByMapID(mapID) {
      for (let i = 0; i < this.device_graph.length; i++) {
        if (this.device_graph[i].mapID === mapID) {
          return i;
        }
      }
    },
    popPrompt(index) {
      this.device_graph[index].show_window = !this.device_graph[index]
        .show_window;
      this.connect_objs_onClick = this.getConnectObj(index);
    },
    // 得到相连节点 [{mapID, distace}, ...]
    getConnectObj(index) {
      const res = [];
      const tempID = this.device_graph[index].mapID;
      // 向上寻找
      for (let i = 0; i < index; i++) {
        for (let j = 0; j < this.device_graph[i].down_path.length; j++) {
          if (this.device_graph[i].down_path[j].mapID === tempID) {
            res.push({
              mapID: this.device_graph[i].mapID,
              distance: (
                this.getDistance(
                  this.device_graph[i].down_path[j].path[0],
                  this.device_graph[i].down_path[j].path[1]
                ) / 1000
              ).toFixed(2)
            });
          }
        }
      }
      // 向下寻找
      for (let i = 0; i < this.device_graph[index].down_path.length; i++) {
        res.push({
          mapID: this.device_graph[index].down_path[i].mapID,
          distance: (
            this.getDistance(
              this.device_graph[index].down_path[i].path[0],
              this.device_graph[index].down_path[i].path[1]
            ) / 1000
          ).toFixed(2)
        });
      }
      return res;
    },
    handler({ BMap, map }) {
      this.map = map;
      this.BMap = BMap;
      this.center = { lng: 116.400047, lat: 39.917546 };
    },
    // 百度api静态方法
    fD(a, b, c) {
      for (; a > c; ) {
        a -= c - b;
      }
      for (; a < b; ) {
        a += c - b;
      }
      return a;
    },
    jD(a, b, c) {
      b != null && (a = Math.max(a, b));
      c != null && (a = Math.min(a, c));
      return a;
    },
    yk(a) {
      return (Math.PI * a) / 180;
    },
    Ce(a, b, c, d) {
      var dO = 6370996.81;
      return (
        dO *
        Math.acos(
          Math.sin(c) * Math.sin(d) +
            Math.cos(c) * Math.cos(d) * Math.cos(b - a)
        )
      );
    },
    getDistance(a, b) {
      if (!a || !b) {
        return 0;
      }
      a.lng = this.fD(a.lng, -180, 180);
      a.lat = this.jD(a.lat, -74, 74);
      b.lng = this.fD(b.lng, -180, 180);
      b.lat = this.jD(b.lat, -74, 74);
      return this.Ce(
        this.yk(a.lng),
        this.yk(b.lng),
        this.yk(a.lat),
        this.yk(b.lat)
      );
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}
</style>
