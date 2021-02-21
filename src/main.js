import Vue from 'vue'
import App from './App'
import VueRouter from "vue-router"
import axios from 'axios'
import VueAxios from 'vue-axios'
//扫描路由配置
import router from "./router"
//导入elementUI
import ElementUI from "element-ui"
//导入element CSS
import 'element-ui/lib/theme-chalk/index.css'
// 导入vue-baidu-map
import BaiduMap from 'vue-baidu-map'

//导入 自定义公共组件
//导入顶部导航栏
import Header from "./components/header"
import InputHeader from './components/InputHeader'
import SuggestHeader from './components/SuggestHeader'

import echarts from 'echarts'
import PositionInput from "./components/InputViews/PositionInput"
import MissionInput from "./components/InputViews/MissionInput"
import WeatherIput from "./components/InputViews/WeatherInput"
import DeviceInput from "./components/InputViews/DeviceInput"
import InfoSubmit from "./components/InputViews/InfoSubmit"

//使用
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.use(BaiduMap, {
  ak: 'GKHhUN0e9oEwt9OTgVcM9Lrr8kxWEvct'
})
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.component("top-header", Header)
Vue.component("input-header", InputHeader)
Vue.component("suggest-header", SuggestHeader)

//信息导组件
Vue.component("position-block", PositionInput)
Vue.component("missioin-block", MissionInput)
Vue.component("weather-block", WeatherIput)
Vue.component("device-block", DeviceInput)
Vue.component("submit-block", InfoSubmit)

new Vue({
  el: '#app',
  router,
  render:h => h(App)
})
