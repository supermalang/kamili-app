<template>
  <div class="admin-layout min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-40"
      :class="[isCollapsed ? 'w-16' : 'w-64']"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 v-if="!isCollapsed" class="text-xl font-bold text-white">Kamili Admin</h1>
        <span v-else class="text-2xl font-bold">K</span>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.route"
          class="flex items-center px-4 py-3 mb-1 rounded-lg hover:bg-gray-800 transition-colors"
          :class="[
            isActiveRoute(item.route) ? 'bg-red-600 hover:bg-red-700' : 'text-gray-300'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span v-if="!isCollapsed" class="ml-3">{{ item.label }}</span>
          <el-badge
            v-if="item.badge && !isCollapsed"
            :value="item.badge"
            class="ml-auto"
            :type="item.badgeType || 'danger'"
          />
        </router-link>
      </nav>

      <!-- Collapse Toggle -->
      <button
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        @click="toggleSidebar"
      >
        <el-icon>
          <DArrowLeft v-if="!isCollapsed" />
          <DArrowRight v-else />
        </el-icon>
      </button>
    </aside>

    <!-- Main Content -->
    <div
      class="transition-all duration-300"
      :class="[isCollapsed ? 'ml-16' : 'ml-64']"
    >
      <!-- Header -->
      <header class="h-16 bg-white shadow-sm fixed top-0 right-0 left-0 z-30 transition-all duration-300"
        :class="[isCollapsed ? 'ml-16' : 'ml-64']"
      >
        <div class="h-full px-6 flex items-center justify-between">
          <!-- Breadcrumbs -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ name: 'admin-dashboard' }">Accueil</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRouteName">
              {{ currentRouteName }}
            </el-breadcrumb-item>
          </el-breadcrumb>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <el-badge :value="pendingOrdersCount" :max="99" :hidden="pendingOrdersCount === 0">
              <el-button :icon="Bell" circle />
            </el-badge>

            <!-- User Dropdown -->
            <el-dropdown trigger="click" @command="handleUserMenuCommand">
              <div class="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-colors">
                <el-avatar :size="32" :icon="UserFilled" class="bg-red-600" />
                <span class="font-medium">{{ authStore.userName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="User" command="profile">Mon profil</el-dropdown-item>
                  <el-dropdown-item :icon="Setting" command="settings">Paramètres</el-dropdown-item>
                  <el-dropdown-item :icon="View" command="view-site">Voir le site</el-dropdown-item>
                  <el-dropdown-item :icon="SwitchButton" command="logout" divided>
                    Déconnexion
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="pt-16 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Histogram,
  ShoppingCart,
  Box,
  Grid,
  Van,
  User,
  UserFilled,
  Trophy,
  Document,
  Setting,
  DArrowLeft,
  DArrowRight,
  Bell,
  ArrowDown,
  SwitchButton,
  View,
  Location,
  Tickets,
  Money,
  Discount
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Sidebar state
const isCollapsed = ref(false)

// Mock data (replace with real data)
const pendingOrdersCount = ref(5)

// Menu items
const menuItems = [
  {
    name: 'dashboard',
    label: 'Tableau de bord',
    icon: Histogram,
    route: { name: 'admin-dashboard' }
  },
  {
    name: 'orders',
    label: 'Commandes',
    icon: ShoppingCart,
    route: { name: 'admin-orders' },
    badge: pendingOrdersCount.value,
    badgeType: 'danger'
  },
  {
    name: 'products',
    label: 'Produits',
    icon: Box,
    route: { name: 'admin-products' }
  },
  {
    name: 'categories',
    label: 'Catégories',
    icon: Grid,
    route: { name: 'admin-categories' }
  },
  {
    name: 'deliveries',
    label: 'Livraisons',
    icon: Van,
    route: { name: 'admin-deliveries' }
  },
  {
    name: 'delivery-locations',
    label: 'Zones de livraison',
    icon: Location,
    route: { name: 'admin-delivery-locations' }
  },
  {
    name: 'delivery-options',
    label: 'Options livraison',
    icon: Tickets,
    route: { name: 'admin-delivery-options' }
  },
  {
    name: 'delivery-pricing',
    label: 'Tarifs livraison',
    icon: Money,
    route: { name: 'admin-delivery-pricing' }
  },
  {
    name: 'delivery-promotions',
    label: 'Promotions livraison',
    icon: Discount,
    route: { name: 'admin-delivery-promotions' }
  },
  {
    name: 'delivery-orders',
    label: 'Commandes livraison',
    icon: ShoppingCart,
    route: { name: 'admin-delivery-orders' }
  },
  {
    name: 'customers',
    label: 'Clients',
    icon: User,
    route: { name: 'admin-customers' }
  },
  {
    name: 'loyalty',
    label: 'Fidélité',
    icon: Trophy,
    route: { name: 'admin-loyalty' }
  },
  {
    name: 'reports',
    label: 'Rapports',
    icon: Document,
    route: { name: 'admin-reports' }
  },
  {
    name: 'settings',
    label: 'Paramètres',
    icon: Setting,
    route: { name: 'admin-settings' }
  }
]

// Current route name
const currentRouteName = computed(() => {
  const item = menuItems.find(item => item.name === route.name?.replace('admin-', ''))
  return item?.label || ''
})

// Toggle sidebar
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

// Check if route is active
function isActiveRoute(targetRoute) {
  if (typeof targetRoute === 'string') {
    return route.path === targetRoute
  }
  return route.name === targetRoute.name
}

// Handle user menu commands
async function handleUserMenuCommand(command) {
  switch (command) {
    case 'profile':
      ElMessage.info('Profil - À venir')
      break
    case 'settings':
      router.push({ name: 'admin-settings' })
      break
    case 'view-site':
      window.open('/', '_blank')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          'Êtes-vous sûr de vouloir vous déconnecter ?',
          'Déconnexion',
          {
            confirmButtonText: 'Oui, déconnecter',
            cancelButtonText: 'Annuler',
            type: 'warning'
          }
        )
        await authStore.logout()
        ElMessage.success('Déconnexion réussie')
        router.push({ name: 'admin-login' })
      } catch {
        // User cancelled
      }
      break
  }
}
</script>

<style scoped>
.admin-layout {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.router-link-active {
  background-color: #dc2626 !important;
}

:deep(.el-badge__content) {
  background-color: #dc2626;
  border-color: #dc2626;
}

:deep(.el-button) {
  border-color: #e5e7eb;
}

:deep(.el-button:hover) {
  color: #dc2626;
  border-color: #dc2626;
}
</style>
