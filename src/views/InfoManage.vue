<template>
    <el-container>
        <el-header>
            <top-header style="width:100%"></top-header>
        </el-header>
        <el-main>输入信息管理</el-main>
        <el-footer>Footer</el-footer>
    </el-container>
</template>

<script>
export default {
    name:'InfoManage'
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #999999;
    
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
</style>