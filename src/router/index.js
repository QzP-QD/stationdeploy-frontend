//导入vue
import Vue from 'vue'
import VueRouter from 'vue-router'

//导入组件
import Input from "../views/InputInfo2"
import Command from "../views/Command"
import InfoManage from "../views/InfoManage"

//使用
Vue.use(VueRouter);
//导出
export default new VueRouter({
    routes:[
        {
            //信息导入界面
            path:'/input',
            component: Input,
            
        },
        {
            //指挥调度界面
            path:'/command',
            component:Command
        },
        {
            //输入信息管理界面
            path:'/infomanage',
            component:InfoManage
        },
    ]
})