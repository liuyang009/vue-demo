import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Role from '@/components/Role'
import Login from '@/components/Login'

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
        component: Role,
        hidden:true
      }]
    }

  ]
})
