<template>
<div>
		<!-- 位置信息 -->
		<div style="width: 100%; height:auto; border: 1px solid gray;margin-top: 60px;">
			<el-row>
				<el-col :span="2" style="height:45px; line-height:45px; float: left; font-weight: 700; font-size: 13px;">地点信息</el-col>
			</el-row>
			<el-table
			  :data="locdata.filter(data => data.radius!=null && data.radius>0)"
			  border
			  :header-cell-style="{background:'#FAFAFA'}"
			  style="width: 90% ;margin:0px auto; margin-bottom: 30px;">
			  <el-table-column
			    prop="name"
			    label="地点"
			    width="90">
			  </el-table-column>
			  <el-table-column
			  prop="address"
			    label="具体位置"
			    width="250">
			  </el-table-column>
			  <el-table-column
			  prop="jingwei"
			    label="经纬度"
			    width="210">
				<template
				slot-scope="scope">
				{{scope.row.direc1}}{{scope.row.jing}}°{{scope.row.jingfen}}'—{{scope.row.direc2}}{{scope.row.wei}}°{{scope.row.weifen}}'
				</template>
			  </el-table-column>
			  <el-table-column
			  prop="radius"
			    label="范围(km)"
			    width="170">
			  </el-table-column>
			  <el-table-column label="操作">
			    <template slot-scope="scope">
					<!-- scope.$index 即可获得行索引号 -->
			      <el-button
			        size="mini"
			        @click="editInfo(scope.$index)">调整</el-button>
			    </template>
			  </el-table-column>
			</el-table>
		</div>

		<!-- 事件信息 -->
		<div style="width: 100%; height: auto; border: 1px solid gray;margin-top: 40px;">
			<el-row>
				<el-col :span="2" style="height:45px; line-height:45px; float: left; font-weight: 700; font-size: 13px;">事件信息</el-col>
			</el-row>
			<el-table
			:data="taskdata"
			  border
			  :header-cell-style="{background:'#FAFAFA'}"
			  style="width: 90% ;margin:0px auto;margin-bottom: 30px;">
			  <el-table-column
			    prop="name"
			    label="输入类型"
			    width="250">
			  </el-table-column>
			  <el-table-column
			  prop="result"
			    label="输入结果"
			    width="350">
				<template
				slot-scope="scope">
				{{scope.row.result}}
				</template>
			  </el-table-column>
			  <el-table-column label="操作">
			    <template slot-scope="scope">
			      <el-button
			        size="mini"
			        @click="editEvent(scope.$index)">调整</el-button>
			    </template>
			  </el-table-column>
			</el-table>
		</div>

		<!-- 设备信息 -->
		<div style="width: 100%; height: auto; border: 1px solid gray;margin-top: 40px;">
			<el-row>
				<el-col :span="2" style="height:45px; line-height:45px; float: left; font-weight: 700; font-size: 13px;">设备信息</el-col>
			</el-row>
			<el-table
			border
			stripe
			:data="(deviceForm.list_form.devices_onshow).slice((deviceForm.list_form.currentpage-1)*deviceForm.list_form.pagesize, deviceForm.list_form.currentpage*deviceForm.list_form.pagesize)"
			style="width: 100%;
			        font-size:small; "
			>
			<!-- filter(data => data.active_num>0). -->
			<el-table-column
			    prop="name"
			    label="设备名称"
			    width="150">
			</el-table-column>
			<el-table-column
			    column-key="device_class"
			    prop="class"
			    label="设备分类"
			    width="120">
			</el-table-column>
			<el-table-column
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
				  style="text-align:right; margin-bottom: 30px;">
			</el-pagination>
		</div>

		<el-dialog title="调整" :visible.sync="dialogFormVisible" width="25%">
		  <el-form ref="temloc" :model="temloc" label-width="40px" size="mini">
		  	<el-form-item label="">
		  		  <el-radio-group v-model="temloc.direc1" style="display: block;">
		  		    <el-radio label="东经"></el-radio>
		  		    <el-radio label="西经"></el-radio>
		  		  </el-radio-group>
		  		</el-form-item>
		  <el-row type="flex" class="row-bg">
		  	<el-col :span="24">
		  		<el-form-item label="经度:" prop="jing" label-width="55px">
		  			<el-input style="width: 80px;" v-model="temloc.jing">
		  				<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
		  			</el-input>
		  			<el-input style="width: 80px;" v-model="temloc.jingfen">
		  				<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
		  			</el-input>
		  		</el-form-item>
		  	</el-col>
		  </el-row>
		  <el-form-item label="">
		  	  <el-radio-group v-model="temloc.direc2" style="display: block;">
		  	    <el-radio label="北纬"></el-radio>
		  	    <el-radio label="南纬"></el-radio>
		  	  </el-radio-group>
		  	</el-form-item>
		  <el-row type="flex" class="row-bg">
		  	<el-col :span="24">
		  		<el-form-item label="纬度:" prop="wei" label-width="55px">
		  			<el-input style="width: 80px;" v-model="temloc.wei">
		  				<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
		  			</el-input>
		  			<el-input style="width: 80px;" v-model="temloc.weifen">
		  				<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
		  			</el-input>
		  		</el-form-item>
		  	</el-col>
		  </el-row>
		  <el-form-item label="具体地址:" label-width="80px">
		      <el-input v-model="temloc.address" style="width: 130px;"></el-input>
		    </el-form-item>
		    <el-form-item label="扩散半径:" label-width="80px">
		        <el-input-number v-model="temloc.radius" @change="handleChange" :min="0" :max="100" label="描述文字"></el-input-number>
		      </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editSub()">确 定</el-button>
		  </div>
		</el-dialog>

		<el-dialog title="调整" :visible.sync="dialogFormVisible1" width="30%">
			<el-form :model="taskdata" ref="taskdata" label-width="100px" class="demo-ruleForm" >
			<el-form-item label="事件类型">
				<el-select v-model="taskdata[0].result" placeholder="请选择类型">
				  <el-option label="洪水" value="洪水"></el-option>
				  <el-option label="火灾" value="火灾"></el-option>
				  <el-option label="地震" value="地震"></el-option>
				  <el-option label="泥石流" value="泥石流"></el-option>
				  <el-option label="塌方" value="塌方"></el-option>
				  <el-option label="踩踏" value="踩踏"></el-option>
				  <el-option label="矿难" value="矿难"></el-option>
				</el-select>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button type="primary" @click="dialogFormVisible1 = false">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="调整" :visible.sync="dialogFormVisible2" width="30%">
			<el-form :model="taskdata" ref="taskdata" label-width="100px" class="demo-ruleForm" >
			<el-form-item label="事件类型">
				<el-select v-model="taskdata[1].result" placeholder="请选择类型">
				  <el-option label="一般" value="一般"></el-option>
				  <el-option label="较大" value="较大"></el-option>
				  <el-option label="重大" value="重大"></el-option>
				  <el-option label="特别重大" value="特别重大"></el-option>
				</el-select>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="调整" :visible.sync="dialogFormVisible3" width="30%">
			<el-form :model="taskdata" ref="taskdata" label-width="100px" class="demo-ruleForm" >
			<el-form-item label="事件类型">
				<el-select v-model="taskdata[2].result" placeholder="请选择类型">
				  <el-option label="居民区" value="居民区"></el-option>
				  <el-option label="商业区" value="商业区"></el-option>
				  <el-option label="森林" value="森林"></el-option>
				  <el-option label="山地" value="山地"></el-option>
				  <el-option label="工厂" value="工厂"></el-option>
				  <el-option label="矿区" value="矿区"></el-option>
				</el-select>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button type="primary" @click="dialogFormVisible3 = false">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="调整" :visible.sync="dialogFormVisible4" width="30%">
			<el-form :model="taskdata" ref="taskdata" label-width="100px" class="demo-ruleForm" >
			<el-form-item label="事件类型">
				<el-select v-model="taskdata[3].result" placeholder="请选择类型">
				  <el-option label="救援受害人员" value="救援受害人员"></el-option>
				  <el-option label="控制危险源" value="控制危险源"></el-option>
				  <el-option label="恢复现场" value="恢复现场"></el-option>
				</el-select>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button type="primary" @click="dialogFormVisible4 = false">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="调整" :visible.sync="dialogFormVisible5" width="30%">
			<el-form :model="taskdata" ref="taskdata" label-width="100px" class="demo-ruleForm" >
			<el-form-item label="事件类型">
				<el-select v-model="taskdata[4].result" placeholder="请选择类型">
				  <el-option label="语音通讯" value="语音通讯"></el-option>
				  <el-option label="数据报文" value="数据报文"></el-option>
				  <el-option label="数据采集" value="数据采集"></el-option>
				  <el-option label="视频回传" value="视频回传"></el-option>
				</el-select>
			</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button type="primary" @click="dialogFormVisible5 = false">确 定</el-button>
			</div>
		</el-dialog>
    <el-button 
      style="
        height:50px;
        width:140px;
        float:right;" 
      type="primary" @click="NextStep()">
        下一步
    </el-button>
	</div>
</template>

<script>
//引入bus作为数据传输总线
import bus from "./eventbus";

export default {
    name:"InfoSubmit",
    data() {
	    return {
			weatherForm:"",
		  	deviceForm:"",
		  
			input: "",
			dialogFormVisible: false,
			dialogFormVisible1: false,
			dialogFormVisible2: false,
			dialogFormVisible3: false,
			dialogFormVisible4: false,
			dialogFormVisible5: false,
			formLabelWidth: '120px',
			index1: '',
			index2: '',
			temloc:
			{
				name: 'tem',
				jing: '',
				jingfen: '',
				wei: '',
				weifen: '',
				direc1: '',
				direc2: '',
				address: '',
				radius: ''
			},
			locdata: "",
			taskdata:"",
	    }

	},
    beforeCreate(){
		console.log("beforeCreate")
		console.log(this.deviceForm)
    },
    created(){
		console.log("created")
		console.log(this.deviceForm)
	},
	beforeMount(){
		console.log("beforeMount")
		console.log(this.deviceForm)
	},
	mounted(){
		var that = this
        bus.$on("sendWeatherinfo",function(weatherForm){
            that.weatherForm = weatherForm
        })
        bus.$on("sendDeviceinfo",function(deviceForm){
			console.log(123)
			that.deviceForm = deviceForm
			that.getactivedevices()
		})
		bus.$on("sendMissioninfo",function(taskdata){
            that.taskdata = taskdata
		})
		bus.$on("sendPositioninfo_1",function(locdata){
            that.locdata = locdata
		})
		bus.$on("sendPositioninfo_2",function(input){
            that.input = input
		})
		
	},
    methods:{
      NextStep(){
        this.$emit("Submitfinished",5)
      },
      onSubmit() {
	        console.log('submit!');
	      },
		  editInfo(index){
			const _this = this
			_this.temloc.jing = _this.locdata[index].jing
			_this.temloc.jingfen = _this.locdata[index].jingfen
			_this.temloc.wei = _this.locdata[index].wei
			_this.temloc.weifen = _this.locdata[index].weifen
			_this.temloc.direc1 = _this.locdata[index].direc1
			_this.temloc.direc2 = _this.locdata[index].direc2
			_this.temloc.address = _this.locdata[index].address
			_this.temloc.radius = _this.locdata[index].radius
			_this.dialogFormVisible = true
			_this.index1 = index
			//_this.findOneByStoreId(row)
		  },
		  editSub(){
			  const _this = this
			  _this.locdata[_this.index1].jing = _this.temloc.jing
			  _this.locdata[_this.index1].jingfen = _this.temloc.jingfen
			  _this.locdata[_this.index1].wei = _this.temloc.wei
			  _this.locdata[_this.index1].weifen = _this.temloc.weifen
			  _this.locdata[_this.index1].direc1 = _this.temloc.direc1
			  _this.locdata[_this.index1].direc2 = _this.temloc.direc2
			  _this.locdata[_this.index1].address = _this.temloc.address
			  _this.locdata[_this.index1].radius = _this.temloc.radius
			  _this.dialogFormVisible = false
		  },
		  editEvent(index){
			  const _this = this
				if(index==0)
						_this.dialogFormVisible1 = true
				if(index==1)
						_this.dialogFormVisible2 = true
				if(index==2)
						_this.dialogFormVisible3 = true
				if(index==3)
						_this.dialogFormVisible4 = true
				if(index==4)
						_this.dialogFormVisible5 = true
		  },
		  handleChange(val) {
		          console.log(val);
		  },
		  handleCurrentChange_list(val){                    //”列表形式“下翻页
		      this.deviceForm.list_form.currentpage = val
		  },
		getactivedevices(){
			const _this = this
			var resultlist = []
			for(var i=0; i<_this.deviceForm.device_data.devices.length; i++){
				if(_this.deviceForm.device_data.devices[i].active_num>0)
				resultlist.push(_this.deviceForm.device_data.devices[i])
			}
			_this.deviceForm.list_form.devices_onshow.splice(0,_this.deviceForm.list_form.devices_onshow.length)
			console.log(_this.deviceForm.list_form.devices_onshow)
			for(var i=0; i<resultlist.length ;i++){
				_this.deviceForm.list_form.devices_onshow.push(resultlist[i])
			}
		}
    }
}
</script>

<style>

</style>