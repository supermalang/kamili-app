// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('@/views/MenuView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue')
  },
  {
    path: '/livraison',
    name: 'delivery',
    component: () => import('@/views/DeliveryView.vue')
  },
  {
    path: '/a-emporter',
    name: 'takeaway',
    component: () => import('@/views/TakeawayView.vue')
  },
  {
    path: '/boutique',
    name: 'shop',
    component: () => import('@/views/ShopView.vue')
  },
  {
    path: '/fidelite',
    name: 'loyalty',
    component: () => import('@/views/LoyaltyView.vue')
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetailView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router