<template>
    <div style="margin-top: 40px; width: 100%; border: 1px solid lightgray;">
		<el-row>
			<el-col :span="4" style="height:45px; line-height:45px; float: left; font-weight: 700; font-size: 15px;">事件/地点/任务</el-col>
			<el-col :span="16"></el-col>
			<el-col :span="4" style="height:45px; line-height:45px; float: right; font-size: 12px; color: darkgray;">*为必填项</el-col>
		</el-row>
		<div style="width: 100%; height: 100%; margin-top: 30px;margin-left: 20px;">
			<el-form :model="taskForm" :rules="rules" ref="taskForm" label-width="100px" class="demo-ruleForm">
				<el-row type="flex" style="height: 80px;line-height:80px; margin-left: 30px; font-weight: 700;">
					事件
				</el-row>
				<el-row type="flex" class="row-bg">
					<el-col :span="7">
						<el-form-item label="事件类型"
						 prop="event">
						    <el-select v-model="taskForm.event" placeholder="请选择类型" @change="changetoArr()">
						      <el-option label="洪水" value="洪水"></el-option>
						      <el-option label="火灾" value="火灾"></el-option>
							  <el-option label="地震" value="地震"></el-option>
							  <el-option label="泥石流" value="泥石流"></el-option>
							  <el-option label="塌方" value="塌方"></el-option>
							  <el-option label="踩踏" value="踩踏"></el-option>
							  <el-option label="矿难" value="矿难"></el-option>
						    </el-select>
						 </el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="事件规模" prop="scale">
						    <el-select v-model="taskForm.scale" placeholder="请选择类型" @change="changetoArr()">
						      <el-option label="一般" value="一般"></el-option>
						      <el-option label="较大" value="较大"></el-option>
							  <el-option label="重大" value="重大"></el-option>
							  <el-option label="特别重大" value="特别重大"></el-option>
						    </el-select>
						 </el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" style="height: 80px;line-height:80px; margin-left: 30px;font-weight: 700;">
					地点
				</el-row>
				<el-row type="flex" class="row-bg">
					<el-col :span="7">
						<el-form-item label="地点类型" prop="environment">
						    <el-select v-model="taskForm.environment" placeholder="请选择类型" @change="changetoArr()">
						      <el-option label="居民区" value="居民区"></el-option>
						      <el-option label="商业区" value="商业区"></el-option>
							  <el-option label="森林" value="森林"></el-option>
							  <el-option label="山地" value="山地"></el-option>
							  <el-option label="工厂" value="工厂"></el-option>
							  <el-option label="矿区" value="矿区"></el-option>
						    </el-select>
						 </el-form-item>
					</el-col>
				</el-row>
				<el-row type="flex" style="height: 80px;line-height:80px; margin-left: 30px;font-weight: 700;">
					任务
				</el-row>
				<el-row type="flex" class="row-bg">
					<el-col :span="7">
						<el-form-item label="救援任务" prop="task">
						    <el-select v-model="taskForm.task" placeholder="请选择类型" @change="changetoArr()">
						      <el-option label="救援受害人员" value="救援受害人员"></el-option>
						      <el-option label="控制危险源" value="控制危险源"></el-option>
							  <el-option label="恢复现场" value="恢复现场"></el-option>
						    </el-select>
						 </el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="数据任务" prop="datatask">
						    <el-select v-model="taskForm.datatask" placeholder="请选择类型" @change="changetoArr()">
						      <el-option label="语音通讯" value="语音通讯"></el-option>
						      <el-option label="数据报文" value="数据报文"></el-option>
							  <el-option label="数据采集" value="数据采集"></el-option>
							  <el-option label="视频回传" value="视频回传"></el-option>
						    </el-select>
						 </el-form-item>
					</el-col>
				</el-row>
				<div style="text-align: center; margin-top: 120px; ">
							<el-button @click="resetForm('taskForm')" style="width: 130px;">重置</el-button>
							<el-button type="primary" @click="NextStep('taskForm')" style="width: 130px;">下一步</el-button>
				</div>		
			</el-form>
		</div>
	</div> 
</template>
 
<script>
export default {
    name:"MissionInput",
    data(){
			return{
				taskdata: [
					{
						name: '事件类型',
						result: ''
					}, 
					{
						name: '事件规模',
						result: ''
					},
					{
						name: '地点类型',
						result: ''
					},
					{
						name: '救援任务',
						result: ''
					},
					{
						name: '数据任务',
						result: ''
					}
				],
				taskForm: {
				          event: '',
				          scale: '',
				          environment: '',
				          task: '',
				          datatask: ''
				        },
					
				rules: {
				          event: [
				            { required: true, message: '请选择事件类型', trigger: 'change' }
				          ],
						  scale: [
						    { required: true, message: '请选择事件规模', trigger: 'change' }
						  ],
						  environment: [
						    { required: true, message: '请选择地点类型', trigger: 'change' }
						  ],
						  task: [
						    { required: true, message: '请选择救援任务', trigger: 'change' }
						  ],
						  datatask: [
						    { required: true, message: '请选择数据任务', trigger: 'change' }
						  ]
				    }
				
			};
		},
    methods:{
      changetoArr(){
        this.taskdata[0].result = this.taskForm.event;
        this.taskdata[1].result = this.taskForm.scale;
        this.taskdata[2].result = this.taskForm.environment;
        this.taskdata[3].result = this.taskForm.task;
        this.taskdata[4].result = this.taskForm.datatask;
        },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      NextStep(formName){
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
          this.$emit("Missionfinished",2)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
}
</script>

<style>

</style>