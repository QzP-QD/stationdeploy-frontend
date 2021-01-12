<template>
  <div>
    <h1>
        地点信息导入
    </h1>
    <el-button 
      style="float:right;" 
      type="primary" @click="NextStep()">
        下一步
    </el-button>
  </div>
</template>

<script>
export default {
    name:"PositionInput",
    methods:{
      NextStep(){
        this.$emit("Positionfinished",1)
      }
    }
}
</script>

<style>

</style>