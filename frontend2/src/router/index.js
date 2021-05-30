import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import appLayout from '@/views/appLayout.vue'
import adminLayout from '@/views/adminLayout.vue'


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
      },
      {
        path:'community',
        name:'community',
        component : ()=> import('@/components/community.vue')
      },
      {
        path:'contact',
        name:'contact',
        component : ()=> import('@/components/contact.vue')
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
      },
      {
        path:'salesManagement',
        name:'admin_salesManagement',
        component : ()=> import('@/components/admin_salesManagement.vue')
      },
      {
        path:'inquiryManagement',
        name:'admin_inquiryManagement',
        component : ()=> import('@/components/admin_inquiryManagement.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
