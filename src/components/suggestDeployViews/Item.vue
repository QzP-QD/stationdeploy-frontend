<template>
  <div class="container">
    <div
      class="img_box"
      @dragstart="handle_start"
    >
      <img :src="device_data.picurl" />
    </div>
    <div class="title_box">
      {{ device_data.name }}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  props: {
    device_data: null
  },
  methods: {
    handle_start (e) {
      console.log('dragstart-', e.clientX, ',', e.clientY)
      var transData = { picurl: this.device_data.picurl, device_libID: this.device_data.id }
      e.dataTransfer.setData('text/plain', JSON.stringify(transData))
      e.dataTransfer.effectAllowed = 'copy'
    }
  }
}
</script>

<style scoped>
.container {
  width: 50px !important;
  height: 50px !important;
  min-height: 0px !important;
  border-style: solid;
  margin: 0 auto;
}

.img_box {
  width: 50%;
  height: 50%;
  margin: 0 auto;
  padding: 5px;
}

img {
  height: 100%;
  width: 100%;
}

.title_box {
  height: 20%;
  text-align: center;
  font-size: 12px;
  line-height: 1;
}
</style>
