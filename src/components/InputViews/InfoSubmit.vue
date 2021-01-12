<template>
  <div>
    <h1>事件导入</h1> 
    {{weatherForm}}
    <h1>事件导入</h1> 
     {{deviceForm}}
     <el-button 
        style="float:right;" 
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
    data(){
        return{
            weatherForm:"",
            deviceForm:""
        }
    },
    mounted(){
        var that = this
        bus.$on("sendWeatherinfo",function(weatherForm){
            that.weatherForm = weatherForm
        })
        bus.$on("sendDeviceinfo",function(deviceForm){
            that.deviceForm = deviceForm
        })
    },
    methods:{
      NextStep(){
        this.$emit("Submitfinished",5)
      }
    }
}
</script>

<style>

</style>