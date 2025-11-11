// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  //{
  //  path: '/about',
  //  name: 'about',
  //  component: () => import('@/views/AboutView.vue') // lazy loading
  //}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router