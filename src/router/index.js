// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes = [
  // Customer routes
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
    path: '/articles',
    name: 'articles',
    component: () => import('@/views/ArticlesView.vue')
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
  },

  // Admin login (no auth required)
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/LoginView.vue'),
    meta: { requiresGuest: true }
  },

  // Admin routes (protected)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue')
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/admin/orders/OrdersListView.vue')
      },
      {
        path: 'orders/:id',
        name: 'admin-order-detail',
        component: () => import('@/views/admin/orders/OrderDetailView.vue')
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/views/admin/products/ProductsListView.vue')
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/categories/CategoriesView.vue')
      },
      {
        path: 'deliveries',
        name: 'admin-deliveries',
        component: () => import('@/views/admin/deliveries/DeliveriesView.vue')
      },
      {
        path: 'delivery/locations',
        name: 'admin-delivery-locations',
        component: () => import('@/views/admin/delivery/LocationsView.vue')
      },
      {
        path: 'delivery/options',
        name: 'admin-delivery-options',
        component: () => import('@/views/admin/delivery/OptionsView.vue')
      },
      {
        path: 'delivery/pricing',
        name: 'admin-delivery-pricing',
        component: () => import('@/views/admin/delivery/PricingView.vue')
      },
      {
        path: 'delivery/promotions',
        name: 'admin-delivery-promotions',
        component: () => import('@/views/admin/delivery/PromotionsView.vue')
      },
      {
        path: 'delivery/orders',
        name: 'admin-delivery-orders',
        component: () => import('@/views/admin/delivery/OrdersView.vue')
      },
      {
        path: 'customers',
        name: 'admin-customers',
        component: () => import('@/views/admin/customers/CustomersListView.vue')
      },
      {
        path: 'customers/:id',
        name: 'admin-customer-detail',
        component: () => import('@/views/admin/customers/CustomerDetailView.vue')
      },
      {
        path: 'loyalty',
        name: 'admin-loyalty',
        component: () => import('@/views/admin/loyalty/LoyaltyView.vue')
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('@/views/admin/reports/ReportsView.vue')
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/views/admin/settings/SettingsView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store on first navigation
  if (!authStore.user && authStore.token) {
    await authStore.checkAuth()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login
      next({
        name: 'admin-login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.meta.requiresGuest) {
    // Redirect authenticated users away from login
    if (authStore.isAuthenticated) {
      next({ name: 'admin-dashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router