<template>
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
        <el-footer style="background-color:#FFFFFF;">
            <el-button 
                style="
                    height:50px;
                    width:140px;
                    float:right;" 
                type="primary" @click="NextStep()">
                下一步
            </el-button>
        </el-footer>
    </el-container>  
</template>

<script>
//引入bus作为数据传输总线
import bus from "./eventbus";

export default {
    name:"DeviceInput",
    data(){
        return{
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
        },
        NextStep(){
            bus.$emit("sendDeviceinfo",this.deviceForm)
            this.$emit("Devicefinished",4)
        }
    }
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #999999; 
  }
  .el-main {
    background-color: #FFFFFF;
    color: #333;
  }
  a {
    text-decoration: none;
  }
</style>