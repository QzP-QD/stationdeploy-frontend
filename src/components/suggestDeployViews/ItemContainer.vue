<template>
  <div class="container">
    <el-collapse v-model="activeNames">
      <el-collapse-item class="head_mdy content_mdy" name="0">
        <template slot="title">
          <div class="title">{{ titles[0] }}</div>
        </template>
        <div class="content">
          <el-row
            v-for="(device_row, index) in device_rows"
            :key="index"
            :gutter="15"
          >
            <el-col
              v-for="(device_item, index) in device_row"
              :key="index"
              :span="8"
            >
              <Item :device_data="device_item"></Item>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item class="head_mdy content_mdy" name="1">
        <template slot="title">
          <div class="title">{{ titles[1] }}</div>
        </template>
        <div class="content">
          <div style="width: 100%; height: 150px;">
            <div style="float: left;width: 55%;height: 150px;">
              <div
                style=" width: 100%; height: 60px; line-height: 75px; text-align:center"
              >
                <el-button type="primary" @click="restoreDefault"
                  >恢复默认</el-button
                >
              </div>
              <div
                style="width: 100%; height: 75px; line-height: 75px;text-align:center"
              >
                <el-button type="primary" @click="infoPreview"
                  >信息预览</el-button
                >
              </div>
            </div>
            <div
              style="float: left; width: 45%; height: 150px; line-height: 150px;"
            >
              <el-button
                style="width: 90px; height: 90px; background-color: rgba(201, 50, 30, 0.822); color: white;"
                @click="deploySuccess"
                circle
                >部署完毕</el-button
              >
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script type="text/ecmascript-6">
import Item from './Item'

export default {
  data () {
    return {
      activeNames: ['0', '1'],
      titles: ['可用设备库', '操作区'],
      device_rows: [],
      mark_rows: [],
      suggest_location: null
    }
  },
  methods: {
    getDeviceData () {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/static/mock/devicedata_sd.json'
      }).then(rep => {
        const data = rep.data.devices
        this.device_rows = this.devideRow(data)
      })
    },
    // getDeviceData 使用的工具方法
    devideRow (arrayObj) {
      const rows = Math.ceil(arrayObj.length / 3)
      const res = []
      for (let i = 0; i < rows; i++) {
        if (i === rows - 1) {
          res.push(arrayObj.slice(i * 3, arrayObj.length))
        } else {
          res.push(arrayObj.slice(i * 3, (i + 1) * 3))
        }
      }
      return res
    },
    restoreDefault () {
      // 生成算法建议部署位置
      this.fetchSuggestLocation()
    },
    fetchSuggestLocation () {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/static/mock/suggestdata.json'
      }).then(rep => {
        this.suggest_location = rep.data
        this.$emit('restore-default', this.suggest_location)
      })
    },
    deploySuccess () {
      this.$router.push('/command')
    },
  },
  created () { this.getDeviceData() },
  mounted () { this.restoreDefault() },
  components: {
    Item
  }
}
</script>

<style scoped>
.title {
  font-size: 15px;
  font-weight: bold;
  line-height: 1.4;
}

.head_mdy >>> .el-collapse-item__header {
  height: auto !important;
  padding: 3px;
  padding-left: 8px;
  border-bottom-style: solid;
  border-bottom-color: black;
}

.content_mdy >>> .el-collapse-item__content {
  padding: 5px !important;
}

.container {
  border: 1px solid black;
  width: 262px;
  min-height: 650px;
  /* margin: 0 auto;  // 居中*/
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 10px;
}

.el-col {
  border-radius: 4px;
}
</style>
