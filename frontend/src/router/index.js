import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue'
import appLayout from '@/views/appLayout.vue'
import adminLayout from '@/views/adminLayout.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path:'/app',
    name:'app',
    component: appLayout,
    children:[
      {
        path:'dashboard',
        name:'dashboard',
        component : ()=> import('@/components/dashboard.vue')
      },
      {
        path:'play',
        name:'play',
        component : ()=> import('@/components/play.vue')
      }
    ]
  },
  {
    path:'/admin',
    name:'admin',
    component: adminLayout,
    children:[
      {
        path:'memberManagement',
        name:'admin_memberManagement',
        component : ()=> import('@/components/admin_memberManagement.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
