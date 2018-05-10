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
      component: Login
    },
    {
      path: '/index',
      name: 'Home',
      component: Home
    },
    {
      path: '/role',
      name: 'Role',
      component: Role
    }
  ]
})
