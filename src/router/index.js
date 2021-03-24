//导入vue
import Vue from 'vue'
import VueRouter from 'vue-router'

//导入组件
import Input from "../views/InputInfo"
import Command from "../views/Command"
import InfoManage from "../views/InfoManage"
import SuggestDeploy from '../views/SuggestDeploy'
import Speed from '../components/charts/Speed.vue'
import downloadSpeed from '../components/charts/downloadSpeed.vue'

//使用
Vue.use(VueRouter);
//导出
export default new VueRouter({
    mode: 'history',
    routes:[
        {
            path: '/',
            redirect: '/input'
        },
        {
            //信息导入界面
            path:'/input',
            component: Input,
        },
        {
            path: '/suggest',
            component: SuggestDeploy
        },
        {
            path:'/command',
            component:Command
        },
        {
            //输入信息管理界面
            path:'/infomanage',
            component:InfoManage
        },
        {
            //图表
            path:'/Speed',
            component:Speed
        },
        {
            //图表
            path:'/downloadSpeed',
            component:downloadSpeed
        },


    ]
})
