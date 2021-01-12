<template>
    <div>
        <el-menu 
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#333333"
            text-color="#EDEDED"
            active-text-color="#FFFFFF">

            <el-menu-item>
                <el-image style="width: 50px; height: 50px" :src="url" ></el-image>
                应急网络部署软件
            </el-menu-item>
            <el-menu-item  index="1">
              <router-link to="/input">信息输入</router-link>
            </el-menu-item>
            <el-menu-item  index="2">
              <router-link to="/command">通信指挥</router-link>
            </el-menu-item >
            <el-menu-item  index="3">
              <router-link to="/infomanage">输入信息管理</router-link>
            </el-menu-item>

        </el-menu>
    </div>
</template>
<script>
  export default {
    name:"Header",
    data() {
      return {
        activeIndex: '1',
        url: '../static/logo.png'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style scoped>
    el-menu-item {
        height: 100px;
        font-size: 80px;
    }
    .router-link-active { 
      text-decoration: none;
    }
    a {
      text-decoration: none;
     }
</style>