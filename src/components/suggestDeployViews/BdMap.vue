<template>
  <div
    class="container"
    @dragover.prevent
    @drop="handle_drop"
  >
    <el-dialog title="添加链路" v-if="node_onClick" :visible.sync="dialog_visible">
      <label>设备地图标号：</label>
      <el-select
        v-model="path_model"
        multiple
        collapse-tags
        style="margin-left: 20px;"
        placeholder="请选择被连接设备"
      >
        <el-option
          v-for="(item, index) in device_graph"
          :key="index"
          :label="item.mapID"
          :value="index"
          :disabled="isConnected(index_on_click, index)"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="concelAddPath">取 消</el-button>
        <el-button type="primary" @click="doAddPath">确 定</el-button>
      </div>
    </el-dialog>
    <baidu-map
      class="map"
      :center="center"
      :zoom="zoom"
      @ready="handler"
      :mapClick="false"
    >
      <bm-marker
        v-for="(item, index) in device_graph"
        :key="index"
        :position="item.position"
        :dragging="true"
        :icon="item.icon"
        @click="popPrompt(index)"
        @dragstart="dragNodeStart(index)"
        @dragging="nodeDragging($event, index)"
        @dragend="dragNodeEnd($event, index)"
      >
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
            @del_connect="handleDelConnect($event)"
            @del_node="handleDelNode($event)"
            @add_connect="handleAddConnect($event)"
          ></InfoContent>
        </bm-info-window>
      </bm-marker>
      <template v-for="(node, i) in device_graph">
        <template v-for="(paths, j) in node.down_path">
          <bm-polyline
            :key="paths.key"
            :path="paths.path"
            stroke-color="blue"
            :stroke-opacity="0.5"
            :stroke-weight="5"
            @click="delConnect(i, j)"
          >
          </bm-polyline>
        </template>
      </template>
    </baidu-map>
  </div>
</template>
<script>
import InfoContent from './InfoContent.vue'
export default {
  components: { InfoContent },
  data () {
    return {
      // 地图数据
      map: null,
      BMap: null,
      center: { lng: 0, lat: 0 },
      zoom: 15,
      // 图数据
      mapID_start: -1,
      device_graph: [],
      device_origin_graph: [],
      path_model: [],
      // 控制数据
      picsize_limit: { width: 32, height: 32 },
      index_on_click: 0,
      mapID_on_click: 0,
      dialog_visible: false,
      info_window_width: 410,
      connect_objs_onClick: null,
      node_onClick: false
    }
  },
  props: {
    suggest_location: Object
  },
  watch: {
    suggest_location: {
      handler (suggestLocation) {
        // 设置地图设备起始标号
        this.mapID_start = suggestLocation.mapID_start
        this.device_graph = [] // 清空
        this.generateGraphBySuggest(suggestLocation.suggest_location)
      }
    }
  },
  methods: {
    infoWindowClose (index) {
      this.device_graph[index].show_window = false
    },
    handleDelConnect (args) {
      let i
      let j
      if (args[0] < args[1]) {
        i = args[0]
        j = args[1]
      } else {
        j = args[0]
        i = args[1]
      }
      for (let k = 0; k < this.device_graph[this.getIndexByMapID(i)].down_path.length; k++) {
        if (this.device_graph[this.getIndexByMapID(i)].down_path[k].mapID === j) {
          this.delConnect(this.getIndexByMapID(i), k)
          this.infoWindowClose(this.getIndexByMapID(args[1]))
          return
        }
      }
    },
    handleDelNode (args) {
      this.delNode(this.getIndexByMapID(args))
    },
    handleAddConnect (args) {
      this.addConnect(args)
      this.infoWindowClose(this.getIndexByMapID(args))
    },
    generateGraphBySuggest (suggestLocation) {
      for (let i = 0; i < suggestLocation.length; i++) {
        const node = {}
        node.mapID = suggestLocation[i].device_mapID
        node.icon = {
          url: suggestLocation[i].picurl,
          size: this.picsize_limit
        }
        node.position = suggestLocation[i].location
        node.show_window = false
        node.device_libID = suggestLocation[i].device_libID
        const downPath = []
        for (let j = 0; j < suggestLocation[i].down_connect_mapID.length; j++) {
          downPath.push({
            key: node.mapID + '' + suggestLocation[i].down_connect_mapID[j],
            mapID: suggestLocation[i].down_connect_mapID[j],
            path: [
              node.position,
              this.getLocationByMapID(
                suggestLocation[i].down_connect_mapID[j],
                suggestLocation
              )
            ]
          })
        }
        node.down_path = downPath
        this.addNode(node)
      }
      this.copyObj(this.device_graph, this.device_origin_graph)
    },
    copyObj (from, to) {
      to = JSON.parse(JSON.stringify(from))
    },
    addNode (node) {
      this.device_graph.push(node)
    },
    addConnect (index) {
      this.dialog_visible = true
    },
    getLocationByMapID (mapID, suggestLocation) {
      if (suggestLocation != null) {
        for (let i = 0; i < suggestLocation.length; i++) {
          if (mapID === suggestLocation[i].device_mapID) {
            return suggestLocation[i].location
          }
        }
      }
      return null
    },
    dragNodeStart (index) {
      // 关闭信息窗口
      if (this.device_graph[index].show_window) {
        this.device_graph[index].show_window = false
      }
    },
    nodeDragging (e, index) {
      const newPosition = e.point
      // 实时更新node坐标
      this.device_graph[index].position = newPosition
      // 实时更新线段路径
      this.updatePath(newPosition, index)
    },
    dragNodeEnd (e, index) {
      const newPosition = e.point
      // 实时更新node坐标
      this.device_graph[index].position = newPosition
      // 实时更新线段路径
      this.updatePath(newPosition, index)
    },
    updatePath (newPosition, index) {
      // 向下更改路径
      for (let i = 0; i < this.device_graph[index].down_path.length; i++) {
        this.$set(this.device_graph[index].down_path[i].path, 0, newPosition)
      }
      // 向上更改路径
      for (let i = 0; i < index; i++) {
        for (let j = 0; j < this.device_graph[i].down_path.length; j++) {
          if (
            this.device_graph[i].down_path[j].mapID ===
            this.device_graph[index].mapID
          ) {
            this.$set(this.device_graph[i].down_path[j].path, 1, newPosition)
          }
        }
      }
    },
    delNode (index) {
      // 停止渲染增加线对话框
      this.node_onClick = false
      // 删除节点上行路径
      const mapID = this.device_graph[index].mapID
      for (let i = 0; i < index; i++) {
        for (let j = 0; j < this.device_graph[i].down_path.length; j++) {
          if (
            this.device_graph[i].down_path[j].mapID ===
            this.device_graph[index].mapID
          ) {
            this.device_graph[i].down_path.splice(j, 1)
          }
        }
      }
      // 删除节点
      this.device_graph.splice(index, 1)
    },
    // 判断是否节点已经相连
    isConnected (indexOnClick, index) {
      if (indexOnClick === index) {
        return true
      }
      if (indexOnClick > index) {
        for (let i = 0; i < this.device_graph[index].down_path.length; i++) {
          if (
            this.device_graph[index].down_path[i].mapID ===
            this.device_graph[indexOnClick].mapID
          ) {
            return true
          }
        }
        return false
      } else {
        for (
          let i = 0;
          i < this.device_graph[indexOnClick].down_path.length;
          i++
        ) {
          if (
            this.device_graph[indexOnClick].down_path[i].mapID ===
            this.device_graph[index].mapID
          ) {
            return true
          }
        }
        return false
      }
    },
    // 得到相连节点 [{mapID, distace}, ...]
    getConnectObj (index) {
      const res = []
      const tempID = this.device_graph[index].mapID
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
            })
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
        })
      }
      return res
    },
    //
    delConnect (i, j) {
      this.$confirm(
        '是否删除链路' +
          '(' +
          this.device_graph[i].down_path[j].key.substring(0, 1) +
          '<<->>' +
          this.device_graph[i].down_path[j].key.substring(1) +
          ') ?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.device_graph[i].down_path.splice(j, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getIndexByMapID (mapID) {
      for (let i = 0; i < this.device_graph.length; i++) {
        if (this.device_graph[i].mapID === mapID) {
          return i
        }
      }
    },
    popPrompt (index) {
      this.index_on_click = index
      this.mapID_on_click = this.device_graph[index].mapID
      this.node_onClick = true
      this.device_graph[index].show_window = !this.device_graph[index]
        .show_window
      this.connect_objs_onClick = this.getConnectObj(index)
    },
    handler ({ BMap, map }) {
      this.map = map
      this.BMap = BMap
      this.center = { lng: 116.404, lat: 39.915 }
      this.zoom = 15
    },
    doAddPath () {
      this.dialog_visible = false

      for (let i = 0; i < this.path_model.length; i++) {
        if (this.path_model[i] < this.index_on_click) {
          // 向前添加路径
          this.device_graph[this.path_model[i]].down_path.push({
            key:
              this.device_graph[this.path_model[i]].mapID +
              '' +
              this.mapID_on_click,
            mapID: this.mapID_on_click,
            path: [
              this.device_graph[this.path_model[i]].position,
              this.device_graph[this.index_on_click].position
            ]
          })
        } else {
          // 向后添加路径
          this.device_graph[this.index_on_click].down_path.push({
            key:
              this.mapID_on_click +
              '' +
              this.device_graph[this.path_model[i]].mapID,
            mapID: this.device_graph[this.path_model[i]].mapID,
            path: [
              this.device_graph[this.index_on_click].position,
              this.device_graph[this.path_model[i]].position
            ]
          })
        }
      }
      this.path_model = []
    },
    concelAddPath () {
      this.dialog_visible = false
      this.path_model = []
    },
    handle_drop (e) {
      // 处理拖拽添加节点
      const result = JSON.parse(e.dataTransfer.getData('text/plain'))
      const position = this.map.pixelToPoint({
        x: e.offsetX - 500,
        y: e.offsetY - 500
      })
      this.addNode({
        mapID: this.mapID_start,
        device_libID: result.device_libID,
        position: position,
        show_window: false,
        icon: {
          url: result.picurl,
          size: this.picsize_limit
        },
        down_path: []
      })
      this.mapID_start += 1
    },
    // 百度api静态方法
    fD (a, b, c) {
      for (; a > c;) {
        a -= c - b
      }
      for (; a < b;) {
        a += c - b
      }
      return a
    },
    jD (a, b, c) {
      b != null && (a = Math.max(a, b))
      c != null && (a = Math.min(a, c))
      return a
    },
    yk (a) {
      return (Math.PI * a) / 180
    },
    Ce (a, b, c, d) {
      var dO = 6370996.81
      return (
        dO *
        Math.acos(
          Math.sin(c) * Math.sin(d) +
            Math.cos(c) * Math.cos(d) * Math.cos(b - a)
        )
      )
    },
    getDistance (a, b) {
      if (!a || !b) {
        return 0
      }
      a.lng = this.fD(a.lng, -180, 180)
      a.lat = this.jD(a.lat, -74, 74)
      b.lng = this.fD(b.lng, -180, 180)
      b.lat = this.jD(b.lat, -74, 74)
      return this.Ce(
        this.yk(a.lng),
        this.yk(b.lng),
        this.yk(a.lat),
        this.yk(b.lat)
      )
    }
  }
}
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
