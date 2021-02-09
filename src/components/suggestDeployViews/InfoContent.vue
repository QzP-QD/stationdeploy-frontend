<template>
  <div class="container">
    <el-tag>基本信息</el-tag>
    <div style="width: 370px; border: 1px black solid; margin-bottom: 10px; padding: 0 5px">
      <div class="imgbox">
        <img style="width: 150px;height: 150px;" :src="device_item.icon.url"/>
      </div>
      <div class="infobox">
        <div class="infoitem">
          <label>设备标号：</label>
          <span>{{ device_item.mapID }}</span>
        </div>
        <div class="infoitem">
          <label>设备名称：</label>
          <span>{{ device_item.device_libID }}</span>
        </div>
        <div class="infoitem">
          <label>设备类型：</label>
          <span>{{ device_item.mapID }}</span>
        </div>
        <div class="infoitem">
          <label v-html="lng"></label>
          <span>{{ device_item.position.lng }}</span>
        </div>
        <div class="infoitem">
          <label v-html="lat"></label>
          <span>{{ device_item.position.lat }}</span>
        </div>
      </div>
    </div>
    <el-tag>连接情况</el-tag>
    <div class="connectbox">
        <el-table :data="tableData" height="170">
          <el-table-column prop="mapID" label="设备标号" width="120" align="center">
          </el-table-column>
          <el-table-column prop="distance" label="直线距离/km" width="120" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelConnect(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
    </div>
    <el-tag>节点操作</el-tag>
    <el-row class="btnbox">
      <el-col :span="12"><el-button type="primary" @click="handleAddConnect">新增连接</el-button></el-col>
      <el-col :span="12"> <el-button type="danger" @click="handleDelNode">删除节点</el-button></el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      lng: '经度：',
      lat: '纬度：',
      tableData: null
    }
  },
  props: {
    device_item: Object,
    connect_objs: Array
  },
  watch: {
    device_item: {
      handler (val) {
      }
    },
    connect_objs: {
      handler (val) {
        this.tableData = this.connect_objs
      }
    }
  },
  created () {},
  methods: {
    handleDelConnect (index, rowObj) {
      this.$emit('del_connect', [rowObj.mapID, this.device_item.mapID])
    },
    handleDelNode () {
      this.$emit('del_node', this.device_item.mapID)
    },
    handleAddConnect () {
      this.$emit('add_connect', this.device_item.mapID)
    }
  },
  components: {}
}
</script>

<style scoped>
.el-col {
  text-align: center;
}
.el-tag {
  margin-bottom: 5px;
}
.container {
  width: 324px;
  padding: 10px;
}
.imgbox {
  width: 150px;
  height: 150px;
  margin: 5px 10px 0 0;
  float: left;
}
.infobox {
  width: 150px;
  height: 150px;
  display: inline-block;
  margin: 5px 0;
}
.infoitem {
  height: 30px;
  margin: auto 0;
  line-height: 170%;
}
.connectbox {
  width: 380px;
  max-height: 170px;
  border: 1px black solid;
  margin-bottom: 10px;
}
.btnbox {
  height: 40px;
  margin-bottom: 10px;
}
label {
  font-weight: bold;
}
</style>
