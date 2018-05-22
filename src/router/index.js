import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Index from '@/components/Index'
import Login from '@/components/Login'
import ShopManager from '@/components/ShopManager'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      hidden:true
    },
    {
      path: '/home',
      name: '主页',
      component: Home,
      hidden:true,
      meta:{
        requireAuth:true
      },
      children:[{
        path: '/index',
        name: '主页',
        component: Index,
        hidden:true
      },{
        path: '/shopManager/:id',
        name: '店铺管理',
        component: ShopManager,
        hidden:true
      }]
    }

  ]
})
