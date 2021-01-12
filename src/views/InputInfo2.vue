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
          <h1>nmsl</h1>
          <!-- 位置导入 -->
          <div v-show="activeIndex===0" style="background-color:red">
              <position-block @Positionfinished="SetSection"></position-block>
          </div>
          <!-- 事件/任务导入 -->
          <div v-show="activeIndex===1" style="background-color:red">
              <missioin-block @Missionfinished="SetSection"></missioin-block>
          </div>

          <!-- 天气导入 -->
          <div v-show="activeIndex===2" >
              <weather-block @Weatherfinished="SetSection"></weather-block>
          </div>

          <!-- 设备导入 -->
          <div v-show="activeIndex===3" style="background-color:red">
            <device-block @Devicefinished="SetSection"></device-block>
          </div>

          <!-- 信息提交 -->
          <div v-show="activeIndex===4" style="background-color:red">
              <submit-block @Submitfinished="SetSection"></submit-block>
          </div>

          <!-- 显示建议基站部署位置 -->
          <div v-show="activeIndex===5" style="background-color:red">
              <suggest-block></suggest-block>
          </div>
          <!-- <el-button 
            style="float:right;" 
            type="primary" @click="NextStep()">
              下一步
          </el-button> -->
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
      weatherForm:{
          weatherlist:[
            '晴','多云','阴','小雨','中雨','大雨','小雪','中雪','大雪','雷','霾'
          ],
          weatherlist_icon:[

          ],
          //气象，温度，风力，湿度
          weather:"",
          temperature: "",
          wind:"",
          humidity: "",
          previewweather:0,
          weatherBackground:['#FFFFFF','#169BD5'],
          WeatherRules:{
            weather:[
              {
                required: true, message: '请选择天气', trigger: 'blur' 
              }
            ],
            temperature:[
              {
                required: true, message: '请输入温度', trigger: 'blur'
              },
              { type: 'number', message: '温度必须为数字值'}
            ],
            wind:[
              {
                required: true, message: '请选择风力等级', trigger: 'blur'
              }
            ],
            humidity:[
              {
                required: true, message: '请输入湿度', trigger: 'blur'
              },
               { type: 'number', message: '湿度必须为数字值'}
            ]
          }
      },
      deviceForm:{   
        displayform_index: 0, //0：图片形式  1：列表形式
        device_data:"",
        graph_form:{
          currentindex:"",
          pages:[],
        },
        list_form:{
          devices_onshow:[],
          last_deviceclass_list:[],
          last_devicetype_list:[],
          currentpage:1,
          pagesize:4,
          class_value:"不限",
          devicetype_value:"不限",
          class_filter:[],
          type_filter:[]
        }
      }
    }
  },  
  methods:{
    SelectStep(index){
      if(this.stepSuc.includes(index) === true){
        this.activeIndex = index
      }
    },
    NextStep(){
      if(this.activeIndex < 5){
        this.activeIndex ++
        this.stepSuc.push(this.activeIndex)
      }else if(this.activeIndex == 5){
        this.$router.push({ path: '/command' })  //此处放 下一步 地址
      }
    },
    SetSection(index){
        this.activeIndex = index
        this.stepSuc.push(this.activeIndex)
        console.log(index)
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