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
          <div v-show="activeIndex===0" style="background-color:red">
              <h1>1</h1> 
          </div>
          <!-- 事件/任务导入 -->
          <div v-show="activeIndex===1" style="background-color:red">
              <h1>2</h1> 
          </div>

          <!-- 天气导入 -->
          <div v-show="activeIndex===2" >
              <el-container 
                direction="horizontal">
                <el-main 
                  style="margin-right:20px;
                        width:400px; 
                        border:2px solid #D7D7D7;
                        background-color:#FFFFFF;">
                  <el-form 
                    ref="wform" 
                    :model="weatherForm" 
                    :rules="weatherForm.WeatherRules" 
                    label-width="80px">
                    <el-form-item label="天气" prop="weather"> 
                         <el-select 
                          placeholder="请选择天气" 
                          style="width:400px" 
                          v-model="weatherForm.weather">
                          <el-option 
                            v-for="(item,index) of weatherForm.weatherlist" 
                            :key='index'
                            :label=item
                            :value=index>
                          </el-option>
                         </el-select>
                    </el-form-item>

                    <el-form-item label="温度" 
                                  prop="temperature"
                                  style="font-size:large"> 
                         <el-input 
                          placeholder="请输入当前温度" 
                          style="width:400px" 
                          v-model.number="weatherForm.temperature">
                          </el-input> 摄氏度（℃）
                    </el-form-item>

                    <el-form-item label="风力" prop="wind"> 
                         <el-select 
                            placeholder="请选择风力等级" 
                            style="width:400px" 
                            v-model="weatherForm.wind">
                           <el-option v-for="level of [0,1,2,3,4,5,6,7,8,9,10,11]"
                            :key='level'
                            :label= level+1
                            :value= level>
                          </el-option>
                         </el-select>级
                    </el-form-item>

                    <el-form-item label="湿度" prop="humidity"> 
                         <el-input placeholder="请输入当前湿度" style="width:400px" v-model.number="weatherForm.humidity"></el-input>  %
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="confirmWeather('wform')">确认输入</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="getWeather()">根据位置生成</el-button>
                    </el-form-item>

                  </el-form>

                </el-main>
                <el-main style="border-radius: 50px; 
                                width:400px;"
                          :style="{'background-color':weatherForm.weatherBackground[weatherForm.previewweather]}">
                  <div 
                    style="color:#FFFFFF;" 
                    v-show="weatherForm.previewweather===1">
                    <div style="border-radius: 20px; 
                                border:2px solid #FFFFFF;
                                height:200px;
                                width:200px;
                                text-align:center;
                                background-color:#1176A2;">
                      {{weatherForm.temperature}}℃
                    </div><br>
                    <div style="border-radius: 20px;
                                border:2px solid #FFFFFF;
                                width:20%;
                                text-align:center;
                                background-color:#1176A2;">
                      {{weatherForm.weatherlist[weatherForm.weather]}}
                    </div><br>
                    <div style="border-radius: 20px; 
                                border:2px solid #FFFFFF;
                                width:20%;
                                text-align:center;
                                background-color:#1176A2;">
                      风力{{weatherForm.wind}}级
                    </div><br>
                    <div style="border-radius: 20px; 
                                border:2px solid #FFFFFF;
                                width:200px;
                                font-size:25px;
                                text-align:center;
                                background-color:#1176A2;">
                      相对湿度：{{weatherForm.humidity}} %
                    </div>
                  </div>
                </el-main>
              </el-container>
          </div>

          <!-- 设备导入 -->
          <div v-show="activeIndex===3" style="background-color:red">
            <el-container>
              <el-header>
                <h5 style="height:20px; display:inline-block;">设备列表</h5>            
                <el-button v-show="deviceForm.displayform_index === 0" style="width:7%; font-size:10px; display:inline-block;" type="primary" @click="switch_displayform()">
                  切换列表形式
                </el-button>
                <el-button v-show="deviceForm.displayform_index === 1" style="width:7%; font-size:10px; display:inline-block;" type="primary" @click="switch_displayform()">
                  切换图片形式
                </el-button>
              </el-header>

              <!-- 图表格式 -->
              <el-main v-show="deviceForm.displayform_index === 0">
                  <el-tabs type="card" @tab-click="device_tab_click">
                    <el-tab-pane v-for="(item,index) of deviceForm.device_data.classification"
                      :key=index
                      :label=item
                      :name=item>
                      <div v-for="(deviceitem, itemid) of 
                        divide_data_class(item).slice((deviceForm.graph_form.pages[index].currentpage-1)*deviceForm.graph_form.pages[index].pagesize, deviceForm.graph_form.pages[index].currentpage*deviceForm.graph_form.pages[index].pagesize)" 
                          :key=itemid
                          style="width:1200px;
                                 display:flex;">
                        <el-image style="width: 600px;
                                        height: 600px"
                                  :src="deviceitem.picurl">
                        </el-image>
                        <div style="width: 600px">
                          <h4>
                            {{deviceitem.name}}
                          </h4>
                          <h6>简介: <br>
                            {{deviceitem.short_cut}}
                          </h6>
                          <h5>技术参数：</h5>
                          <el-table
                            border
                            stripe
                            :data="deviceitem.params"
                            style="width: 600px;
                                    font-size:small;">
                            <el-table-column
                              prop="p_title"
                              label="属性名"
                              width="180">
                            </el-table-column>
                            <el-table-column
                              prop="p_value"
                              label="属性值"
                              width="400">
                            </el-table-column>
                          </el-table>
                          <h5>部署数量：</h5>
                          <el-input-number 
                            v-model="deviceitem.active_num" 
                            :min="0" 
                            :max="deviceitem.repository_num" 
                            label="数量">
                          </el-input-number>
                        </div>
                      </div>
                      <el-pagination
                        background
                        @current-change="handleCurrentChange_graph"
                        :current-page="deviceForm.graph_form.pages[index].currentpage"
                        :page-size="deviceForm.graph_form.pages[index].pagesize"
                        layout="total,prev,pager,next"
                        :total="divide_data_class(item).length">
                      </el-pagination>
                    </el-tab-pane>
                  </el-tabs>
              </el-main>

              <!-- 列表格式 -->
              <el-main v-show="deviceForm.displayform_index === 1">
                  <el-table 
                    border
                    stripe
                    :data="(deviceForm.list_form.devices_onshow).slice((deviceForm.list_form.currentpage-1)*deviceForm.list_form.pagesize, deviceForm.list_form.currentpage*deviceForm.list_form.pagesize)"
                    style="width: 1500px;
                            font-size:small;"
                    @filter-change="filterChange">
                    <el-table-column
                      prop="name"
                      label="设备名称"
                      width="150">
                    </el-table-column>
                    <el-table-column
                      :filters="deviceForm.list_form.class_filter"
                      column-key="device_class"
                      prop="class"
                      label="设备分类"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      :filters="deviceForm.list_form.type_filter"
                      column-key="device_type"
                      prop="devicetype"
                      label="设备通信类型"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="purpose"
                      label="设备用途"
                      width="260">
                    </el-table-column>
                    <el-table-column
                      label="设备参数"
                      width="420">
                      <template slot-scope="scope">
                        <div 
                          v-for="(paramitem,paramidex) of deviceForm.list_form.devices_onshow[(scope.$index+(deviceForm.list_form.currentpage-1)*deviceForm.list_form.pagesize)].params"
                          :key=paramidex>
                          {{paramitem.p_title}}：
                          {{paramitem.p_value}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="repository_num"
                      label="设备库存"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      width="200">
                      <template slot-scope="scope2">
                        <el-input-number 
                          v-model="deviceForm.list_form.devices_onshow[(scope2.$index+(deviceForm.list_form.currentpage-1)*deviceForm.list_form.pagesize)].active_num" 
                          :min="0" 
                          :max="deviceForm.list_form.devices_onshow[(scope2.$index+(deviceForm.list_form.currentpage-1)*deviceForm.list_form.pagesize)].repository_num" 
                          label="数量"
                          size="small">
                        </el-input-number>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                      background
                      @current-change="handleCurrentChange_list"
                      :current-page="deviceForm.list_form.currentpage"
                      :page-size="deviceForm.list_form.pagesize"
                      layout="total,prev,pager,next"
                      :total="deviceForm.list_form.devices_onshow.length"
                      style="text-align:right">
                  </el-pagination>
                  <br>
              </el-main>
            </el-container>
          </div>

          <!-- 信息提交 -->
          <div v-show="activeIndex===4" style="background-color:red">
              <h1>5</h1>
          </div>

          <!-- 显示建议基站部署位置 -->
          <div v-show="activeIndex===5" style="background-color:red">
              <h1>6</h1> 
          </div>
          <el-button 
            style="float:right;" 
            type="primary" @click="NextStep()">
              下一步
          </el-button>
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
  beforeMount(){
      //钩子函数，获取设备信息
      this.getdevicedata()
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
        this.$router.push({ path: '/command'})  //此处放 下一步 地址
      }
    },
    getWeather(){
      //1、通过地理位置获取气象信息
      let that = this
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/static/mock/weatherdata.json'
        }).then(function (response) {
          that.weatherForm.weather = response.data.weatherdata.weather
          that.weatherForm.temperature = response.data.weatherdata.temperature
          that.weatherForm.wind = response.data.weatherdata.wind
          that.weatherForm.humidity = response.data.weatherdata.humidity
        })
      //2、获取成功，显示天气
      if(this.activeIndex === 2)
        this.weatherForm.previewweather = 1
    },
    confirmWeather(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            this.weatherForm.previewweather = 1
          } else {
            alert('error submit!!');
            return false;
          }
        });
    },
    
    //设备导入页面——方法
    switch_displayform(){                               //切换展示形式（图表，列表）
      this.deviceForm.displayform_index = (this.deviceForm.displayform_index + 1) % 2
    },
    getdevicedata(){                                    //获取设备信息
      var that = this
      this.axios({
        method:'get',
        url:"http://localhost:8080/static/mock/devicedata_2.json"
      }).then(function(response){
        //将获取的数据导入到data域中
        that.deviceForm.device_data = response.data.device_data
        //设备（列表展示下）的要显示的数据
        that.deviceForm.list_form.devices_onshow =  that.divide_data(that.deviceForm.list_form.last_deviceclass_list, that.deviceForm.list_form.last_devicetype_list)

        //设备（列表展示下）的筛选条件
        var classification = that.deviceForm.device_data.classification
        var type = that.deviceForm.device_data.type
        for(var i=0 ; i<classification.length; i++){
          that.deviceForm.list_form.class_filter.push({"text":classification[i], value:classification[i]})
        }
        for(var i=0 ; i<type.length; i++){
          that.deviceForm.list_form.type_filter.push({"text":type[i], value:type[i]})
        }
        //设备（图片展示下）的分页情况
        var num = that.deviceForm.device_data.classification.length
        for(var i=0; i<num ; i++){
          var tempobj = {currentpage:1, pagesize:2}
          that.deviceForm.graph_form.pages.push(tempobj)
        }
      })
    },
    divide_data(deviceclass_list, devicetype_list){    //按照 “设备分类”&“设备通信类型” 进行分类
      var resultlist=[]
      var midresult = []
      var temp = this.deviceForm.device_data.devices
      //先对 “设备分类” 筛选
      if(deviceclass_list.length != 0){
        for(var i=0 ; i<deviceclass_list.length; i ++){
          for(var j=0; j<temp.length; j++){
            if(temp[j].class === deviceclass_list[i]){
              midresult.push(temp[j])
            }
          }
        }
      }else{
        midresult = temp;
      }
      //再对 “设备通信类型”进行筛选
      if(devicetype_list.length != 0){
        for(var i=0 ; i<devicetype_list.length; i ++){
          for(var j=0; j<midresult.length; j++){
            if(midresult[j].devicetype === devicetype_list[i]){
              resultlist.push(midresult[j])
            }
          }
        }
      }else{
        resultlist = midresult;
      }

      return resultlist
    },
    divide_data_class(deviceclass){                   //按照 “设备分类” 进行分类
      var resultlist=[]
      var temp = this.deviceForm.device_data.devices
      if(deviceclass === null )
        return temp
      for(var i=0; i<temp.length; i++){
        if(temp[i].class === deviceclass)
          resultlist.push(temp[i])
      }
      return resultlist
    },
    device_tab_click(tab, event){                     //“图片形式”下，切换选项卡
      this.deviceForm.graph_form.currentindex = tab.index
    },
    handleCurrentChange_graph(val){                   //”图片形式“下翻页
      this.deviceForm.graph_form.pages[this.deviceForm.graph_form.currentindex].currentpage = val
    },
    handleCurrentChange_list(val){                    //”列表形式“下翻页
      this.deviceForm.list_form.currentpage = val
    },
    filterChange(filters){                            //"列表形式"下筛选操作
      this.sync_devicenum_list()

      var deviceclass_list = []
      var last_deviceclass_list = this.deviceForm.list_form.last_deviceclass_list

      //如果对 设备分类 提出新的筛选要求，则记录新的筛选要求
      if(filters.device_class != null){
        for(var i = 0; i<filters.device_class.length ; i++){
          deviceclass_list.push(filters.device_class[i])
        }
        //重新设置last_deviceclass_list
        this.deviceForm.list_form.last_deviceclass_list.splice(0,this.deviceForm.list_form.last_deviceclass_list.length)
        for(var i=0; i<deviceclass_list.length ;i++){
          this.deviceForm.list_form.last_deviceclass_list.push(deviceclass_list[i])
        }
      }else{  
        //如果没有对 设备分类 提出新的筛选要求，则延续上一次的筛选
        for(var i=0 ; i<last_deviceclass_list.length; i++){
          deviceclass_list.push(last_deviceclass_list[i])
        }
      }

      var devicetype_list = []
      var last_devicetype_list = this.deviceForm.list_form.last_devicetype_list
      //如果对 设备通信类型 提出新的筛选要求，则记录新的筛选要求
      if(filters.device_type != null){
        for(var i = 0; i<filters.device_type.length ; i++){
          devicetype_list.push(filters.device_type[i])
        }
        //重新设置last_devicetype_list
        this.deviceForm.list_form.last_devicetype_list.splice(0,this.deviceForm.list_form.last_devicetype_list.length)
        for(var i=0; i<devicetype_list.length ;i++){
          this.deviceForm.list_form.last_devicetype_list.push(devicetype_list[i])
        }
      }else{
        //如果没有对 设备通信类型 提出新的筛选要求，则延续上一次的筛选
        for(var i=0 ; i<last_devicetype_list.length; i++){
          devicetype_list.push(last_devicetype_list[i])
        }
      }

      //重新获取device_onshow
      this.deviceForm.list_form.devices_onshow = this.divide_data(deviceclass_list, devicetype_list)
      this.deviceForm.list_form.currentpage = 1
    },
    sync_devicenum_list(){                                 //将devices_onshow中的设备数量同步到devices中
      var devices = this.deviceForm.device_data.devices
      var onshow = this.deviceForm.list_form.devices_onshow

      for(var i=0 ; i<onshow.length; i++){
        for(var j=0 ; j < devices.length; j++){
          if(onshow[i].name === devices[j].name){   //这里的name起到了主键的作用
            this.deviceForm.device_data.devices[j].active_num = onshow[i].active_num
          }
        }
      }
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