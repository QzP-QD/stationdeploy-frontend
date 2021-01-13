<template>
  	<div style="width: 100%; height: 900px;">
		<div style="width: 100%; height: 95%;">
			<div style="position: relative; float: left; margin-left: 10px; margin-top: 20px; width: 68%; height: 95%;">
				<!-- 放置地图模块 -->
				<div style="position: relative;width: 100%; height: 100%;  background: url(../../assets/logo.png);background-size: 100px 100px; border: 1px solid gray;border-radius: 4px;">
					<div style="position: absolute;">
						<el-input v-model="input" placeholder="请输入地点" style="margin-top: 10px;margin-left:10px ;">
							<el-button slot="append" icon="el-icon-search"></el-button>
						</el-input>
					</div>
				</div>				
			</div>
			<div style="float: left; margin-left: 15px; margin-top: 20px; width: 28%; height: 95%; border: 1px solid gray;border-radius: 4px;">
				<div style="float: left; margin-top:20px ; margin-left: 10px;">
					  <el-form ref="form" :model="form" label-width="90px" size="mini">
						  <el-form-item label="事故地点数:">
						      <el-select v-model="region" placeholder="请选择" style="width: 100px; ">
						        <el-option label="1" value="1"></el-option>
						        <el-option label="2" value="2"></el-option>
								<el-option label="3" value="3"></el-option>
								<el-option label="4" value="4"></el-option>
								<el-option label="5" value="5"></el-option>
						      </el-select>
						    </el-form-item>
					  </el-form>
				</div>
				
				<div style="margin-top: 80px; width: 90%; height: 90%; overflow:auto; margin-left: 15px;">
					<el-collapse v-model="activeNames"  >
				  <el-collapse-item title="地点1" name="1" v-show="region>=1">
				    <div style="float: left;">
						<el-form ref="locdata" :model="locdata" label-width="40px" size="mini">
							<el-form-item label="">
								  <el-radio-group v-model="locdata[0].direc1" style="display: block;">
								    <el-radio label="东经"></el-radio>
								    <el-radio label="西经"></el-radio>
								  </el-radio-group>
								</el-form-item>
						<el-row type="flex" class="row-bg">
							<el-col :span="24">
								<el-form-item label="经度:" prop="jing" label-width="55px">
									<el-input style="width: 80px;" v-model="locdata[0].jing">
										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
									</el-input>
									<el-input style="width: 80px;" v-model="locdata[0].jingfen">
										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="">
							  <el-radio-group v-model="locdata[0].direc2" style="display: block;">
							    <el-radio label="北纬"></el-radio>
							    <el-radio label="南纬"></el-radio>
							  </el-radio-group>
							</el-form-item>
						<el-row type="flex" class="row-bg">
							<el-col :span="24">
								<el-form-item label="纬度:" prop="wei" label-width="55px">
									<el-input style="width: 80px;" v-model="locdata[0].wei">
										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
									</el-input>
									<el-input style="width: 80px;" v-model="locdata[0].weifen">
										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="具体地址:" label-width="80px">
						    <el-input v-model="locdata[0].address" style="width: 130px;"></el-input>
						  </el-form-item>
						  <el-form-item label="扩散半径:" label-width="80px">
						      <el-input-number v-model="locdata[0].radius"   :min="0" :max="100" label="描述文字"></el-input-number>
						    </el-form-item>
							<el-slider
							      v-model="locdata[0].radius"
								  style="margin-left: 20px;"
							      >
							</el-slider>
						</el-form>
					</div>
				  </el-collapse-item>
				  <el-collapse-item title="地点2" name="2" v-show="region>=2">
				    <div style="float: left;">
				  						<el-form ref="locdata" :model="locdata" label-width="40px" size="mini">
				  							<el-form-item label="">
				  								  <el-radio-group v-model="locdata[1].direc1" style="display: block;">
				  								    <el-radio label="东经"></el-radio>
				  								    <el-radio label="西经"></el-radio>
				  								  </el-radio-group>
				  								</el-form-item>
				  						<el-row type="flex" class="row-bg">
				  							<el-col :span="24">
				  								<el-form-item label="经度:" prop="jing" label-width="55px">
				  									<el-input style="width: 80px;" v-model="locdata[1].jing">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
				  									</el-input>
				  									<el-input style="width: 80px;" v-model="locdata[1].jingfen">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
				  									</el-input>
				  								</el-form-item>
				  							</el-col>
				  						</el-row>
				  						<el-form-item label="">
				  							  <el-radio-group v-model="locdata[1].direc2" style="display: block;">
				  							    <el-radio label="北纬"></el-radio>
				  							    <el-radio label="南纬"></el-radio>
				  							  </el-radio-group>
				  							</el-form-item>
				  						<el-row type="flex" class="row-bg">
				  							<el-col :span="24">
				  								<el-form-item label="纬度:" prop="wei" label-width="55px">
				  									<el-input style="width: 80px;" v-model="locdata[1].wei">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
				  									</el-input>
				  									<el-input style="width: 80px;" v-model="locdata[1].weifen">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
				  									</el-input>
				  								</el-form-item>
				  							</el-col>
				  						</el-row>
				  						<el-form-item label="具体地址:" label-width="80px">
				  						    <el-input v-model="locdata[1].address" style="width: 130px;"></el-input>
				  						  </el-form-item>
				  						  <el-form-item label="扩散半径:" label-width="80px">
				  						      <el-input-number v-model="locdata[1].radius"   :min="0" :max="100" label="描述文字"></el-input-number>
				  						    </el-form-item>
				  							<el-slider
				  							      v-model="locdata[1].radius"
				  								  style="margin-left: 20px;"
				  							      >
				  							</el-slider>
				  						</el-form>
				  					</div>
				  </el-collapse-item>
				  <el-collapse-item title="地点3" name="3" v-show="region>=3">
				    <div style="float: left;">
				  						<el-form ref="locdata" :model="locdata" label-width="40px" size="mini">
				  							<el-form-item label="">
				  								  <el-radio-group v-model="locdata[2].direc1" style="display: block;">
				  								    <el-radio label="东经"></el-radio>
				  								    <el-radio label="西经"></el-radio>
				  								  </el-radio-group>
				  								</el-form-item>
				  						<el-row type="flex" class="row-bg">
				  							<el-col :span="24">
				  								<el-form-item label="经度:" prop="jing" label-width="55px">
				  									<el-input style="width: 80px;" v-model="locdata[2].jing">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
				  									</el-input>
				  									<el-input style="width: 80px;" v-model="locdata[2].jingfen">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
				  									</el-input>
				  								</el-form-item>
				  							</el-col>
				  						</el-row>
				  						<el-form-item label="">
				  							  <el-radio-group v-model="locdata[2].direc2" style="display: block;">
				  							    <el-radio label="北纬"></el-radio>
				  							    <el-radio label="南纬"></el-radio>
				  							  </el-radio-group>
				  							</el-form-item>
				  						<el-row type="flex" class="row-bg">
				  							<el-col :span="24">
				  								<el-form-item label="纬度:" prop="wei" label-width="55px">
				  									<el-input style="width: 80px;" v-model="locdata[2].wei">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
				  									</el-input>
				  									<el-input style="width: 80px;" v-model="locdata[2].weifen">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
				  									</el-input>
				  								</el-form-item>
				  							</el-col>
				  						</el-row>
				  						<el-form-item label="具体地址:" label-width="80px">
				  						    <el-input v-model="locdata[2].address" style="width: 130px;"></el-input>
				  						  </el-form-item>
				  						  <el-form-item label="扩散半径:" label-width="80px">
				  						      <el-input-number v-model="locdata[2].radius"   :min="0" :max="100" label="描述文字"></el-input-number>
				  						    </el-form-item>
				  							<el-slider
				  							      v-model="locdata[2].radius"
				  								  style="margin-left: 20px;"
				  							      >
				  							</el-slider>
				  						</el-form>
				  					</div>
				  </el-collapse-item>
				  <el-collapse-item title="地点4" name="4" v-show="region>=4">
				    <div style="float: left;">
				  						<el-form ref="locdata" :model="locdata" label-width="40px" size="mini">
				  							<el-form-item label="">
				  								  <el-radio-group v-model="locdata[3].direc1" style="display: block;">
				  								    <el-radio label="东经"></el-radio>
				  								    <el-radio label="西经"></el-radio>
				  								  </el-radio-group>
				  								</el-form-item>
				  						<el-row type="flex" class="row-bg">
				  							<el-col :span="24">
				  								<el-form-item label="经度:" prop="jing" label-width="55px">
				  									<el-input style="width: 80px;" v-model="locdata[3].jing">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
				  									</el-input>
				  									<el-input style="width: 80px;" v-model="locdata[3].jingfen">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
				  									</el-input>
				  								</el-form-item>
				  							</el-col>
				  						</el-row>
				  						<el-form-item label="">
				  							  <el-radio-group v-model="locdata[3].direc2" style="display: block;">
				  							    <el-radio label="北纬"></el-radio>
				  							    <el-radio label="南纬"></el-radio>
				  							  </el-radio-group>
				  							</el-form-item>
				  						<el-row type="flex" class="row-bg">
				  							<el-col :span="24">
				  								<el-form-item label="纬度:" prop="wei" label-width="55px">
				  									<el-input style="width: 80px;" v-model="locdata[3].wei">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
				  									</el-input>
				  									<el-input style="width: 80px;" v-model="locdata[3].weifen">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
				  									</el-input>
				  								</el-form-item>
				  							</el-col>
				  						</el-row>
				  						<el-form-item label="具体地址:" label-width="80px">
				  						    <el-input v-model="locdata[3].address" style="width: 130px;"></el-input>
				  						  </el-form-item>
				  						  <el-form-item label="扩散半径:" label-width="80px">
				  						      <el-input-number v-model="locdata[3].radius"  :min="0" :max="100" label="描述文字"></el-input-number>
				  						    </el-form-item>
				  							<el-slider
				  							      v-model="locdata[3].radius"
				  								  style="margin-left: 20px;"
				  							      >
				  							</el-slider>
				  						</el-form>
				  					</div>
				  </el-collapse-item>
				  <el-collapse-item title="地点5" name="5" v-show="region>=5">
				    <div style="float: left;">
				  						<el-form ref="locdata" :model="locdata" label-width="40px" size="mini">
				  							<el-form-item label="">
				  								  <el-radio-group v-model="locdata[4].direc1" style="display: block;">
				  								    <el-radio label="东经"></el-radio>
				  								    <el-radio label="西经"></el-radio>
				  								  </el-radio-group>
				  								</el-form-item>
				  						<el-row type="flex" class="row-bg">
				  							<el-col :span="24">
				  								<el-form-item label="经度:" prop="jing" label-width="55px">
				  									<el-input style="width: 80px;" v-model="locdata[4].jing">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
				  									</el-input>
				  									<el-input style="width: 80px;" v-model="locdata[4].jingfen">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
				  									</el-input>
				  								</el-form-item>
				  							</el-col>
				  						</el-row>
				  						<el-form-item label="">
				  							  <el-radio-group v-model="locdata[4].direc2" style="display: block;">
				  							    <el-radio label="北纬"></el-radio>
				  							    <el-radio label="南纬"></el-radio>
				  							  </el-radio-group>
				  							</el-form-item>
				  						<el-row type="flex" class="row-bg">
				  							<el-col :span="24">
				  								<el-form-item label="纬度:" prop="wei" label-width="55px">
				  									<el-input style="width: 80px;" v-model="locdata[4].wei">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">度</i>
				  									</el-input>
				  									<el-input style="width: 80px;" v-model="locdata[4].weifen">
				  										<i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
				  									</el-input>
				  								</el-form-item>
				  							</el-col>
				  						</el-row>
				  						<el-form-item label="具体地址:" label-width="80px">
				  						    <el-input v-model="locdata[4].address" style="width: 130px;"></el-input>
				  						  </el-form-item>
				  						  <el-form-item label="扩散半径:" label-width="80px">
				  						      <el-input-number v-model="locdata[4].radius" :min="0" :max="100" label="描述文字"></el-input-number>
				  						    </el-form-item>
				  							<el-slider
				  							      v-model="locdata[4].radius"
				  								  style="margin-left: 20px;"
				  							      >
				  							</el-slider>
				  						</el-form>
				  					</div>
				  </el-collapse-item>
				  
					</el-collapse>
				</div>
			</div>
		</div>
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
    name:"PositionInput",
    data() {
	    return {
	      input: '',
		  region: '',
		  locdata: [
			  {
				  name: '地点1',
				  jing: '',
				  jingfen: '',
				  wei: '',
				  weifen: '',
				  direc1: '',
				  direc2: '',
				  address: '',
				  radius: ''
			  },
			  {
				  name: '地点2',
				  jing: '',
				  jingfen: '',
				  wei: '',
				  weifen: '',
				  direc1: '',
				  direc2: '',
				  address: '',
				  radius: ''
			  },
			  {
				  name: '地点3',
				  jing: '',
				  jingfen: '',
				  wei: '',
				  weifen: '',
				  direc1: '',
				  direc2: '',
				  address: '',
				  radius: ''
			  },
			  {
				  name: '地点4',
				  jing: '',
				  jingfen: '',
				  wei: '',
				  weifen: '',
				  direc1: '',
				  direc2: '',
				  address: '',
				  radius: ''
			  },
			  {
				  name: '地点5',
				  jing: '',
				  jingfen: '',
				  wei: '',
				  weifen: '',
				  direc1: '',
				  direc2: '',
				  address: '',
				  radius: ''
			  }
		  ],
		  activeNames: ['1']
	    }
	  
	},
    methods:{
      NextStep(){
		this.$emit("Positionfinished",1)
		bus.$emit("sendPositioninfo_1",this.locdata)
		bus.$emit("sendPositioninfo_2",this.input)
      }
    }
}
</script>

<style scoped>

</style>