<template>
  <div id="app">
    <el-container>
      <el-header>
        <suggest-header style="width:100%"></suggest-header>
      </el-header>
      <el-container style="padding: 10px 25px 0 25px">
        <el-aside class="left">
          <item-container
            @restore-default="restoreDefault($event)"
          ></item-container>
        </el-aside>
        <el-main class="main">
          <SuggestMap :suggest_location="suggest_location"></SuggestMap>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import ItemContainer from "../components/suggestDeployViews/ItemContainer";
import SuggestMap from "../components/suggestDeployViews/SuggestMap";

export default {
  data() {
    return {
      suggest_location: null
    };
  },
  name: "app",
  components: {
    ItemContainer,
    SuggestMap
  },
  methods: {
    restoreDefault(suggestLocation) {
      this.suggest_location = suggestLocation;
    }
  }
};
</script>

<style scoped>
.left {
  width: 300px !important;
}

.main {
  border: 2px solid rgb(6, 103, 248);
}

.el-main {
  padding: 0px !important;
}
</style>
