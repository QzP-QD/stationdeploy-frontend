<template>
  <div style="width: 100%; height: 900px;">
		<div style="width: 100%; height: 70%;">
			<div style="position: relative; float: left; margin-left: 10px; margin-top: 20px; width: 28%; height: 95%;border: 1px solid black;">
				<el-row style="border: 1px solid black;">
					<el-col :span="7" style="height:30px; line-height:30px; float: left; font-weight: 700; font-size: 17px;">可用设备</el-col>
				</el-row>
				<div style="width: 100%; height: 200px; margin-left: 20px; margin-top: 10px;">
					<el-row>
						  <el-col :span="6" v-for="(item,index) in items" :key = index :offset="index === 0 ? 0 : (index%3 === 0 ? '0' : '1')" style="margin-bottom:25px;'">
								<el-card :body-style="{ padding: '0px' }">
									  <img src=" ../../../static/devicepic/uav.png" class="image">
								</el-card>
						   </el-col>
					</el-row>
				</div>
				<el-row style="border: 1px solid black;">
					<el-col :span="7" style="height:30px; line-height:30px; float: left; font-weight: 700; font-size: 17px;">可用标注</el-col>
				</el-row>
				<div style="width: 100%; height: 150px; margin-left: 20px; margin-top: 10px;">
					<el-row>
						  <el-col :span="6" v-for="(item,index) in tag" :key = index :offset="index === 0 ? 0 : (index%3 === 0 ? '0' : '1')" style="margin-bottom:25px;'">
								<el-card :body-style="{ padding: '0px' }">
									  <div style="padding: 14px;">
										<span>{{item}}</span>
									  </div>
								</el-card>
						   </el-col>
					</el-row>
				</div>
				<el-row style="border: 1px solid black;">
					<el-col :span="7" style="height:30px; line-height:30px; float: left; font-weight: 700; font-size: 17px;">操作区</el-col>
				</el-row>
				<div style="width: 100%; height: 150px;">
					<div style="float: left;width: 55%;height: 150px;">
						<div style=" width: 100%; height: 60px; line-height: 75px; text-align:center">
							<el-button type="primary">恢复默认</el-button>
						</div>
						<div style="width: 100%; height: 75px; line-height: 75px;text-align:center">
							<el-button type="primary">信息预览</el-button>
						</div>
					</div>					
					<div style="float: left; width: 45%; height: 150px; line-height: 150px;">
						<el-button style="width: 90px; height: 90px; background-color: red; color: white;"
							circle
							@click="confirmDeploy">
								部署完毕
						</el-button>
					</div>
				</div>

			</div>
			<div style="float: left; margin-left: 15px; margin-top: 20px; width: 60%; height: 95%; border: 2px solid skyblue;">
				
				
			</div>
		</div>
	</div>
</template>

<script>
import bus from "./eventbus";
export default {	
    name:"SuggestPosition",
    data() {
	    return {
		  items: [1,2,3,4,5,6,7,8], 
		  tag: ['文字','线段','矩形','圆形','其他'],
	      currentDate: new Date()
	    }
	  },
    methods:{
	  confirmDeploy(){
		  this.$router.push({name:'CommandPage'});
		  bus.$emit("setActiveindex", '2');
	  }
    }
}
</script>

<style>
	  .time {
	    font-size: 13px;
	    color: #999;
	  }
	  
	  .bottom {
	    margin-top: 13px;
	    line-height: 12px;
	  }
	
	  .button {
	    padding: 0;
	    float: right;
	  }
	
	  .image {
	    width: 100%;
	    display: block;
	  }
	
	  .clearfix:before,
	  .clearfix:after {
	      display: table;
	      content: "";
	  }
	  
	  .clearfix:after {
	      clear: both
	  }
</style>
