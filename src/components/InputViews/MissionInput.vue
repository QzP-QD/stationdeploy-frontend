<template>
    <div>
        <h1>事件导入</h1> 
        <el-button 
            style="float:right;" 
            type="primary" @click="NextStep()">
                下一步
        </el-button>
    </div>
</template>

<script>
export default {
    name:"MissionInput",
    methods:{
      NextStep(){
        this.$emit("Missionfinished",2)
      }
    }
}
</script>

<style>

</style>