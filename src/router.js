import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from '@/views/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'DeviceGroupInfo',
          name: 'DeviceGroupInfo',
          component: () => import('@/views/DeviceGroupInfo/DeviceGroupInfo.vue'),
        },
        {
          path: 'DeviceInfo',
          name: 'DeviceInfo',
          component: () => import('@/views/DeviceInfo/DeviceInfo.vue'),
        },
        {
          path: 'BatchInfo',
          name: 'BatchInfo',
          component: () => import('@/views/BatchInfo/BatchInfo.vue'),
        },
        {
          path: 'TechnologyInfo',
          name: 'TechnologyInfo',
          component: () => import('@/views/TechnologyInfo/TechnologyInfo.vue')
        }
      ]
    }
  ]
})
