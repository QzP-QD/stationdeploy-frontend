<template>
  <div id="app">
    <el-container>
      <el-aside class="left">
        <item-container
          @restore-default="restoreDefault($event)"
          @deploy-success="deploySuccess($event)"
        ></item-container>
      </el-aside>
      <el-main class="main">
        <BdMap :suggest_location="suggest_location"></BdMap>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ItemContainer from "../suggestDeployViews/ItemContainer";
import BdMap from "../suggestDeployViews/BdMap";

export default {
  data() {
    return {
      suggest_location: null
    };
  },
  name: "app",
  components: {
    ItemContainer,
    BdMap
  },
  methods: {
    restoreDefault(suggestLocation) {
      this.suggest_location = suggestLocation;
    },
    deploySuccess(GprsLocation) {
      console.log("deploy", GprsLocation);
    }
  }
};
</script>

<style scoped>
.left {
  width: 330px !important;
}

.main {
  border: 2px solid rgb(8, 175, 241);
}

.el-hearder {
  height: 100px;
}

.el-main {
  padding: 0px !important;
}
</style>
