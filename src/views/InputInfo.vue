<template>
    <el-container id="outside" direction="vertical" >
      <el-header height="105px">
          <top-header style="width:100%"></top-header>
          <div id="topline">
              <div v-for="(title, index) of titlelist"
                :key='index'
                v-show="activeIndex===index">{{titlelist[index]}}</div>
          </div>
      </el-header>

      <el-main>
          <el-steps v-bind:active="activeIndex" align-center>
              <el-step v-for="(title,index) of titlelist"
                :key="index"
                @click.native="SelectStep(index)"
                :title="title"/>
          </el-steps>
          <!-- 位置导入 -->
          <div v-show="activeIndex===0">
              <position-block @Positionfinished="SetSection"></position-block>
          </div>
          <!-- 事件/任务导入 -->
          <div v-show="activeIndex===1">
              <missioin-block @Missionfinished="SetSection"></missioin-block>
          </div>

          <!-- 天气导入 -->
          <div v-show="activeIndex===2" >
              <weather-block @Weatherfinished="SetSection"></weather-block>
          </div>

          <!-- 设备导入 -->
          <div v-show="activeIndex===3">
            <device-block @Devicefinished="SetSection"></device-block>
          </div>

          <!-- 信息提交 -->
          <div v-show="activeIndex===4">
              <submit-block @Submitfinished="SetSection"></submit-block>
          </div>

          <!-- 显示建议基站部署位置 -->
          <div v-show="activeIndex===5">
              <suggest-block></suggest-block>
          </div>
      </el-main>
      <el-footer>
         <br>
        @北京邮电大学BUPT 计算机学院（国家示范性软件学院） 高性能计算及组网实验室
      </el-footer>
    </el-container>

</template>

<script>
export default {
  name: "Input",
  data(){
    return{
      //初始步骤
      activeIndex: 0,
      //已完成步骤 编号列表
      stepSuc:[0],
      titlelist:["位置导入",
                  "事件/任务导入",
                  "天气导入",
                  "设备导入",
                  "信息提交",
                  "显示建议基站部署位置"],
    }
  },
  methods:{
    SelectStep(index){
      if(this.stepSuc.includes(index) === true){
        this.activeIndex = index
      }
    },
    SetSection(index){
        this.activeIndex = index
        this.stepSuc.push(this.activeIndex)
    }
  }
}
</script>

<style scoped>
  #topline{
    width:100%;
    text-indent:7em;
    font-size:large;
    vertical-align:middle;
    background-color: #FFFFFF;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #999999;

  }

  .el-main {
    background-color: #FFFFFF;
    color: #333;
  }
  .router-link-active {
    text-decoration: none;
  }
  a {
    text-decoration: none;
  }
  #outside{
    width:1440px;
  }

</style>
