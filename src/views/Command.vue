<template>
  <el-container>
    <el-header>
      <top-header style="width:100%"></top-header>
    </el-header>
    <el-main
      style="
            width:100%;
            display:flex;"
    >
      <el-tabs v-model="activeForm" style="margin-right:10px;">
        <el-tab-pane label="地图信息" name="map">
          <div
            style="
                  width:1000px;
                  height:625px;
                  border: 2px solid rgb(6, 103, 248);"
          >
            <deploy-map :deploy_location="deploy_location"></deploy-map>
          </div>
        </el-tab-pane>
        <el-tab-pane label="网络拓扑" name="topo">
          <div
            id="topology"
            style="
                  width:1000px;
                  height:625px;
                  border: 2px solid rgb(6, 103, 248);"
          ></div>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeMission">
        <el-tab-pane label="图表" name="charts">
          <div
            style="
                  width:440px;
                  height:625px;
                  overflow-y:auto;"
          >
            <div
              id="trafficCapacity"
              :style="{ width: '100%', height: '300px' }"
            ></div>
            <div
              id="uploadSpeed"
              :style="{ width: '100%', height: '300px' }"
            ></div>
            <div
              id="downloadSpeed"
              :style="{ width: '100%', height: '300px' }"
            ></div>
            <div
              id="networkDelay"
              :style="{ width: '100%', height: '300px' }"
            ></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作" name="operate">
          <h4>业务变更:</h4>
          <div>
            <el-select v-model="businessValue" placeholder="请选择业务">
              <el-option
                v-for="item in businessList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>

          <h4>任务变更:</h4>
          <div>
            <el-select v-model="missionValue" placeholder="请选择任务">
              <el-option
                v-for="item in missionList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>

          <el-button
            style="margin-top:30px;"
            type="primary"
            round
            @click="SubmitChange"
          >
            确认变更
          </el-button>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-main style="width:100%;">
      <h4>实际部署对比表</h4>
      <el-table :data="positionTable" style="width: 100%;">
        <el-table-column
          prop="name"
          label="设备名称"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="set_longitude"
          label="预设经度"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="set_latitude"
          align="center"
          label="预设纬度"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="cur_longitude"
          align="center"
          label="实际经度"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="cur_latitude"
          align="center"
          label="实际纬度"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="dif_longitude"
          align="center"
          label="经度差值"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="dif_latitude"
          align="center"
          label="纬度差值"
          width="150"
        >
        </el-table-column>
      </el-table>

      <h4>设备运行信息</h4>
      <el-table :data="deviceWorkingTable" style="width: 100%">
        <el-table-column
          prop="name"
          align="center"
          label="设备名称"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          label="设备类型"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="运行状态"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="uploadspeed"
          align="center"
          label="上行速率"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="downloadspeed"
          align="center"
          label="下行速率"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="battery" align="center" label="电量" width="150">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { option } from "../../static/mock/option.js";
import DeployMap from "../components/deployViews/DeployMap";

export default {
  name: "Command",
  components: {
    DeployMap
  },
  data() {
    return {
      activeForm: "map", //与name关联
      activeMission: "charts",
      businessValue: "",
      missionValue: "",
      businessList: "",
      missionList: "",
      positionTable: [],
      deviceWorkingTable: [],
      topology_data: [],
      points: [],
      deploy_location: null
    };
  },
  mounted() {
    this.getBusinessList();
    this.getMissionList();
    this.getDeviceData();
    this.drawLine();
    this.getPoints();
    this.drawTopology();
    this.getDeployLocation();
  },
  methods: {
    getBusinessList() {
      var that = this;
      this.axios({
        method: "get",
        url: "http://localhost:8080/static/mock/businesslist.json"
      }).then(function(response) {
        that.businessList = response.data.businessList;
      });
    },
    getMissionList() {
      var that = this;
      this.axios({
        method: "get",
        url: "http://localhost:8080/static/mock/missionlist.json"
      }).then(function(response) {
        that.missionList = response.data.missionList;
      });
    },
    SubmitChange() {
      //提交任务修改信息到后台
      //获取后台建议数据后修改路由
      this.$router.replace("/suggest");
    },

    drawLine() {
      var trafficCapacity = this.$echarts.init(
        document.getElementById("trafficCapacity")
      );
      trafficCapacity.setOption({
        title: {
          text: "设备实时通信量"
        },
        tooltip: {},
        xAxis: {
          data: ["设备1", "设备2", "设备3", "设备4", "设备5", "设备6"]
        },
        yAxis: {},
        series: [
          {
            name: "通信量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });

      var uploadSpeed = this.$echarts.init(
        document.getElementById("uploadSpeed")
      );
      uploadSpeed.setOption({
        title: {
          text: "设备上行速率"
        },
        tooltip: {},
        xAxis: {
          data: ["设备1", "设备2", "设备3", "设备4", "设备5", "设备6"]
        },
        yAxis: {},
        series: [
          {
            name: "速率",
            type: "line",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });

      var downloadSpeed = this.$echarts.init(
        document.getElementById("downloadSpeed")
      );
      downloadSpeed.setOption({
        title: {
          text: "设备下行速率"
        },
        tooltip: {},
        xAxis: {
          data: ["设备1", "设备2", "设备3", "设备4", "设备5", "设备6"]
        },
        yAxis: {},
        series: [
          {
            name: "速率",
            type: "line",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });

      var networkDelay = this.$echarts.init(
        document.getElementById("networkDelay")
      );
      networkDelay.setOption({
        title: {
          text: "设备网络时延"
        },
        tooltip: {},
        xAxis: {
          data: ["设备1", "设备2", "设备3", "设备4", "设备5", "设备6"]
        },
        yAxis: {},
        series: [
          {
            name: "时延",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    },
    getDeviceData() {
      var that = this;
      this.axios({
        method: "get",
        url: "http://localhost:8080/static/mock/devicepositiondata.json"
      }).then(function(response) {
        that.positionTable = response.data.positionTable;
      });

      this.axios({
        method: "get",
        url: "http://localhost:8080/static/mock/deviceworkingdata.json"
      }).then(function(response) {
        that.deviceWorkingTable = response.data.deviceWorkingTable;
      });
    },
    getPoints() {
      var that = this;
      var points = [];
      this.axios({
        method: "get",
        url: "http://localhost:8080/static/mock/suggestdata.json" //需要替换成修改后的值
      }).then(function(response) {
        that.topology_data = response.data.suggest_location;
        for (let i = 0; i < that.topology_data.length; i++) {
          const node1 = {
            name: that.topology_data[i].device_mapID,
            draggable: true,
            category: 1
          };

          points.push(node1);
          //option.series[0].data.push(node)
          // var node={name:'设备'+i,category: 0,draggable: true,}
          // option.series[0].data.push(node)
        }

        that.points = points;
      });
    },
    drawTopology() {
      //生成设备拓扑图
      var that = this;
      var topology = this.$echarts.init(document.getElementById("topology"));
      topology.setOption(option);
      that.axios
        .get("http://localhost:8080/static/mock/topology.json")
        .then(res => {
          setTimeout(() => {
            console.log(res);
            //console.log(res.data.links);
            topology.setOption({
              series: [
                {
                  data: res.data.data,
                  links: res.data.links
                }
              ]
            });
          }, 500);
        })
        .catch(err => {
          console.log(err);
        });

      // option.series[0].data=points;

      //console.log(points)

      //node.name='设备6'
      //option.series[0].data.push(node)

      // console.log("option：")
      // console.log(option.series[0])
      // console.log("points：")

      // for(let i=0;i<7;i++){
      //   var node={name:'设备'+i,category: 0,draggable: true,}
      //   option.series[0].data.push(node)

      // }
      //console.log(that.points);

      console.log(option.series[0]);
      //topology.setOption(option)
    },
    getDeployLocation() {
      this.axios({
        method: "get",
        url: "http://localhost:8080/static/mock/deploydata.json"
      }).then(response => {
        this.deploy_location = response.data;
      });
    }
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #999999;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
