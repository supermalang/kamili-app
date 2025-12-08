<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
      <p class="text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Today's Revenue -->
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">Revenus du jour</p>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ formatCurrency(stats.todayRevenue) }}
            </h3>
            <p class="text-sm mt-1" :class="stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'">
              <span>{{ stats.revenueChange >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.revenueChange) }}%</span>
              <span class="text-gray-500 ml-1">vs hier</span>
            </p>
          </div>
          <div class="stat-icon bg-green-100">
            <el-icon :size="24" color="#10b981"><Money /></el-icon>
          </div>
        </div>
      </el-card>

      <!-- Total Orders -->
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">Commandes totales</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</h3>
            <p class="text-sm mt-1 text-gray-600">
              <span class="text-yellow-600 font-medium">{{ stats.pendingOrders }}</span>
              <span> en attente</span>
            </p>
          </div>
          <div class="stat-icon bg-blue-100">
            <el-icon :size="24" color="#3b82f6"><ShoppingCart /></el-icon>
          </div>
        </div>
      </el-card>

      <!-- Active Deliveries -->
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">Livraisons actives</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ stats.activeDeliveries }}</h3>
            <p class="text-sm mt-1 text-gray-600">
              <span class="text-blue-600 font-medium">{{ stats.readyOrders }}</span>
              <span> prêtes</span>
            </p>
          </div>
          <div class="stat-icon bg-purple-100">
            <el-icon :size="24" color="#8b5cf6"><Van /></el-icon>
          </div>
        </div>
      </el-card>

      <!-- New Customers -->
      <el-card shadow="hover" class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">Nouveaux clients</p>
            <h3 class="text-2xl font-bold text-gray-900">{{ stats.newCustomers }}</h3>
            <p class="text-sm mt-1 text-gray-600">
              <span>Ce mois-ci</span>
            </p>
          </div>
          <div class="stat-icon bg-pink-100">
            <el-icon :size="24" color="#ec4899"><User /></el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Revenus (7 derniers jours)</h3>
            <el-button size="small" text>Voir plus</el-button>
          </div>
        </template>
        <div v-loading="loading" style="height: 300px;">
          <div ref="revenueChartRef" style="width: 100%; height: 100%;"></div>
        </div>
      </el-card>

      <!-- Orders Distribution -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Distribution des commandes</h3>
            <el-button size="small" text>Voir plus</el-button>
          </div>
        </template>
        <div v-loading="loading" style="height: 300px;">
          <div ref="ordersChartRef" style="width: 100%; height: 100%;"></div>
        </div>
      </el-card>
    </div>

    <!-- Recent Orders & Popular Products -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Commandes récentes</h3>
            <el-button size="small" @click="$router.push({ name: 'admin-orders' })">
              Voir tout
            </el-button>
          </div>
        </template>
        <div v-loading="loading">
          <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-500">
            Aucune commande récente
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              @click="$router.push({ name: 'admin-order-detail', params: { id: order.id } })"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-gray-900">#{{ order.orderNumber }}</span>
                  <el-tag :type="getStatusType(order.status)" size="small">
                    {{ getStatusLabel(order.status) }}
                  </el-tag>
                </div>
                <p class="text-sm text-gray-600">
                  {{ order.customer?.firstName }} {{ order.customer?.lastName }}
                  <span class="mx-2">•</span>
                  {{ formatRelativeTime(order.createdAt) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ formatCurrency(order.totalAmount) }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- Popular Products -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Produits populaires</h3>
            <el-button size="small" @click="$router.push({ name: 'admin-products' })">
              Voir tout
            </el-button>
          </div>
        </template>
        <div v-loading="loading">
          <div v-if="popularProducts.length === 0" class="text-center py-8 text-gray-500">
            Aucune donnée disponible
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(product, index) in popularProducts"
              :key="product.id"
              class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span class="text-sm font-bold text-red-600">#{{ index + 1 }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 truncate">{{ product.name }}</p>
                <p class="text-sm text-gray-600">{{ product.orders }} commandes</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ formatCurrency(product.revenue) }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { formatCurrency, formatRelativeTime } from '@/utils/formatters'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/utils/constants'
import { Money, ShoppingCart, Van, User } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// Loading state
const loading = ref(true)

// Stats data
const stats = ref({
  todayRevenue: 125000,
  revenueChange: 12.5,
  totalOrders: 42,
  pendingOrders: 5,
  activeDeliveries: 3,
  readyOrders: 2,
  newCustomers: 18
})

// Recent orders (mock data)
const recentOrders = ref([
  {
    id: 1,
    orderNumber: '2024-001',
    status: 'pending',
    customer: { firstName: 'Jean', lastName: 'Dupont' },
    totalAmount: 15000,
    createdAt: new Date(Date.now() - 10 * 60000) // 10 minutes ago
  },
  {
    id: 2,
    orderNumber: '2024-002',
    status: 'preparing',
    customer: { firstName: 'Marie', lastName: 'Martin' },
    totalAmount: 22000,
    createdAt: new Date(Date.now() - 25 * 60000) // 25 minutes ago
  },
  {
    id: 3,
    orderNumber: '2024-003',
    status: 'delivering',
    customer: { firstName: 'Paul', lastName: 'Bernard' },
    totalAmount: 18500,
    createdAt: new Date(Date.now() - 45 * 60000) // 45 minutes ago
  },
  {
    id: 4,
    orderNumber: '2024-004',
    status: 'delivered',
    customer: { firstName: 'Sophie', lastName: 'Dubois' },
    totalAmount: 12000,
    createdAt: new Date(Date.now() - 2 * 60 * 60000) // 2 hours ago
  }
])

// Popular products (mock data)
const popularProducts = ref([
  { id: 1, name: 'Pizza Margherita', orders: 45, revenue: 135000 },
  { id: 2, name: 'Pizza 4 Fromages', orders: 38, revenue: 152000 },
  { id: 3, name: 'Pizza Pepperoni', orders: 32, revenue: 128000 },
  { id: 4, name: 'Pizza Végétarienne', orders: 28, revenue: 112000 },
  { id: 5, name: 'Coca-Cola 33cl', orders: 65, revenue: 65000 }
])

// Chart refs
const revenueChartRef = ref(null)
const ordersChartRef = ref(null)
let revenueChart = null
let ordersChart = null

// Get status label
function getStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] || status
}

// Get status type for el-tag
function getStatusType(status) {
  return ORDER_STATUS_COLORS[status] || 'info'
}

// Initialize revenue chart
function initRevenueChart() {
  if (!revenueChartRef.value) return

  revenueChart = echarts.init(revenueChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        return `${params[0].name}<br/>${formatCurrency(params[0].value)}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#6b7280',
        formatter: (value) => `${value / 1000}k`
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        data: [85000, 92000, 78000, 105000, 125000, 148000, 132000],
        type: 'bar',
        itemStyle: {
          color: '#dc2626',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }

  revenueChart.setOption(option)
}

// Initialize orders chart
function initOrdersChart() {
  if (!ordersChartRef.value) return

  ordersChart = echarts.init(ordersChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#6b7280'
      }
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        center: ['60%', '50%'],
        data: [
          { value: 5, name: 'En attente', itemStyle: { color: '#f59e0b' } },
          { value: 8, name: 'En préparation', itemStyle: { color: '#3b82f6' } },
          { value: 3, name: 'Prêtes', itemStyle: { color: '#10b981' } },
          { value: 3, name: 'En livraison', itemStyle: { color: '#8b5cf6' } },
          { value: 23, name: 'Livrées', itemStyle: { color: '#22c55e' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  ordersChart.setOption(option)
}

// Handle window resize
function handleResize() {
  revenueChart?.resize()
  ordersChart?.resize()
}

// Lifecycle hooks
onMounted(() => {
  // Simulate data loading
  setTimeout(() => {
    loading.value = false
    initRevenueChart()
    initOrdersChart()
  }, 1000)

  // Add resize listener
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // Dispose charts
  revenueChart?.dispose()
  ordersChart?.dispose()

  // Remove resize listener
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
  max-width: 1600px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
