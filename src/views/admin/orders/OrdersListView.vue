<template>
  <div class="orders-list">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Commandes</h1>
        <p class="text-gray-600 mt-1">Gérez toutes vos commandes</p>
      </div>
      <div class="flex gap-3">
        <el-button :icon="Refresh" @click="fetchOrders">Actualiser</el-button>
        <el-button type="primary" :icon="Plus" @click="showNewOrderModal">
          Nouvelle commande
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <el-card shadow="never" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Status Filter -->
        <el-select v-model="filters.status" placeholder="Tous les statuts" clearable @change="fetchOrders">
          <el-option label="Tous les statuts" value="" />
          <el-option
            v-for="(label, value) in ORDER_STATUS_LABELS"
            :key="value"
            :label="label"
            :value="value"
          />
        </el-select>

        <!-- Order Type Filter -->
        <el-select v-model="filters.orderType" placeholder="Type de commande" clearable @change="fetchOrders">
          <el-option label="Tous les types" value="" />
          <el-option label="Livraison" value="delivery" />
          <el-option label="À emporter" value="takeaway" />
        </el-select>

        <!-- Date Range -->
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="à"
          start-placeholder="Date début"
          end-placeholder="Date fin"
          format="DD/MM/YYYY"
          @change="fetchOrders"
        />

        <!-- Search -->
        <el-input
          v-model="filters.search"
          placeholder="Rechercher..."
          :prefix-icon="Search"
          clearable
          @change="fetchOrders"
        />
      </div>
    </el-card>

    <!-- Orders Table -->
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="orders"
        style="width: 100%"
        @row-click="handleRowClick"
        class="cursor-pointer"
      >
        <el-table-column prop="orderNumber" label="N° Commande" width="140">
          <template #default="{ row }">
            <span class="font-semibold text-red-600">#{{ row.orderNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Client" min-width="180">
          <template #default="{ row }">
            <div>
              <div class="font-semibold text-gray-900">
                {{ row.customer?.firstName }} {{ row.customer?.lastName }}
              </div>
              <div class="text-sm text-gray-600">{{ formatPhone(row.customer?.phone) }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Type" width="120">
          <template #default="{ row }">
            <el-tag :type="row.orderType === 'delivery' ? 'primary' : 'success'" size="small">
              {{ row.orderType === 'delivery' ? 'Livraison' : 'À emporter' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Statut" width="140">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Montant" width="140" align="right">
          <template #default="{ row }">
            <span class="font-semibold text-gray-900">
              {{ formatCurrency(row.totalAmount) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Paiement" width="120">
          <template #default="{ row }">
            <el-tag :type="row.paymentStatus === 'paid' ? 'success' : 'warning'" size="small">
              {{ row.paymentStatus === 'paid' ? 'Payé' : 'En attente' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Date" width="180">
          <template #default="{ row }">
            <div>
              <div class="text-sm text-gray-900">{{ formatDateOnly(row.createdAt) }}</div>
              <div class="text-xs text-gray-500">{{ formatTimeOnly(row.createdAt) }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="100" fixed="right">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="(cmd) => handleAction(cmd, row)">
              <el-button text :icon="MoreFilled" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view" :icon="View">Voir détails</el-dropdown-item>
                  <el-dropdown-item command="edit" :icon="Edit">Modifier statut</el-dropdown-item>
                  <el-dropdown-item command="print" :icon="Printer">Imprimer</el-dropdown-item>
                  <el-dropdown-item command="delete" :icon="Delete" divided>Supprimer</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-600">
          Affichage de {{ (pagination.page - 1) * pagination.pageSize + 1 }} à
          {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }}
          sur {{ pagination.total }} commandes
        </div>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 25, 50, 100]"
          :total="pagination.total"
          layout="sizes, prev, pager, next"
          @current-change="fetchOrders"
          @size-change="fetchOrders"
        />
      </div>
    </el-card>

    <!-- Status Update Modal -->
    <el-dialog v-model="statusModalVisible" title="Modifier le statut" width="400px">
      <el-form label-position="top">
        <el-form-item label="Nouveau statut">
          <el-select v-model="selectedStatus" class="w-full">
            <el-option
              v-for="(label, value) in ORDER_STATUS_LABELS"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusModalVisible = false">Annuler</el-button>
        <el-button type="primary" @click="updateOrderStatus">Confirmer</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency, formatPhone, formatDateOnly, formatTimeOnly } from '@/utils/formatters'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/utils/constants'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Refresh,
  Search,
  View,
  Edit,
  Delete,
  Printer,
  MoreFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// State
const loading = ref(false)
const orders = ref([])
const statusModalVisible = ref(false)
const selectedOrder = ref(null)
const selectedStatus = ref('')

// Filters
const filters = reactive({
  status: '',
  orderType: '',
  dateRange: null,
  search: ''
})

// Pagination
const pagination = reactive({
  page: 1,
  pageSize: 25,
  total: 0
})

// Mock orders data
const mockOrders = [
  {
    id: 1,
    orderNumber: '2024-001',
    status: 'pending',
    orderType: 'delivery',
    paymentStatus: 'pending',
    customer: { firstName: 'Jean', lastName: 'Dupont', phone: '+221771234567' },
    totalAmount: 15000,
    createdAt: new Date(Date.now() - 10 * 60000)
  },
  {
    id: 2,
    orderNumber: '2024-002',
    status: 'preparing',
    orderType: 'delivery',
    paymentStatus: 'paid',
    customer: { firstName: 'Marie', lastName: 'Martin', phone: '+221771234568' },
    totalAmount: 22000,
    createdAt: new Date(Date.now() - 25 * 60000)
  },
  {
    id: 3,
    orderNumber: '2024-003',
    status: 'delivering',
    orderType: 'delivery',
    paymentStatus: 'paid',
    customer: { firstName: 'Paul', lastName: 'Bernard', phone: '+221771234569' },
    totalAmount: 18500,
    createdAt: new Date(Date.now() - 45 * 60000)
  },
  {
    id: 4,
    orderNumber: '2024-004',
    status: 'delivered',
    orderType: 'takeaway',
    paymentStatus: 'paid',
    customer: { firstName: 'Sophie', lastName: 'Dubois', phone: '+221771234570' },
    totalAmount: 12000,
    createdAt: new Date(Date.now() - 2 * 60 * 60000)
  },
  {
    id: 5,
    orderNumber: '2024-005',
    status: 'confirmed',
    orderType: 'delivery',
    paymentStatus: 'paid',
    customer: { firstName: 'Luc', lastName: 'Robert', phone: '+221771234571' },
    totalAmount: 28000,
    createdAt: new Date(Date.now() - 3 * 60 * 60000)
  }
]

// Get status label
function getStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] || status
}

// Get status type for el-tag
function getStatusType(status) {
  return ORDER_STATUS_COLORS[status] || 'info'
}

// Fetch orders
async function fetchOrders() {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Filter mock data based on filters
    let filteredOrders = [...mockOrders]

    if (filters.status) {
      filteredOrders = filteredOrders.filter(o => o.status === filters.status)
    }

    if (filters.orderType) {
      filteredOrders = filteredOrders.filter(o => o.orderType === filters.orderType)
    }

    if (filters.search) {
      const search = filters.search.toLowerCase()
      filteredOrders = filteredOrders.filter(o =>
        o.orderNumber.toLowerCase().includes(search) ||
        `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(search)
      )
    }

    orders.value = filteredOrders
    pagination.total = filteredOrders.length
  } catch (error) {
    console.error('Error fetching orders:', error)
    ElMessage.error('Erreur lors du chargement des commandes')
  } finally {
    loading.value = false
  }
}

// Handle row click
function handleRowClick(row) {
  router.push({ name: 'admin-order-detail', params: { id: row.id } })
}

// Handle actions
async function handleAction(command, row) {
  switch (command) {
    case 'view':
      router.push({ name: 'admin-order-detail', params: { id: row.id } })
      break
    case 'edit':
      selectedOrder.value = row
      selectedStatus.value = row.status
      statusModalVisible.value = true
      break
    case 'print':
      ElMessage.info('Impression - À venir')
      break
    case 'delete':
      try {
        await ElMessageBox.confirm(
          'Êtes-vous sûr de vouloir supprimer cette commande ?',
          'Confirmation',
          {
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            type: 'warning'
          }
        )
        ElMessage.success('Commande supprimée')
        fetchOrders()
      } catch {
        // User cancelled
      }
      break
  }
}

// Update order status
async function updateOrderStatus() {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))

    if (selectedOrder.value) {
      selectedOrder.value.status = selectedStatus.value
    }

    ElMessage.success('Statut mis à jour avec succès')
    statusModalVisible.value = false
    fetchOrders()
  } catch (error) {
    ElMessage.error('Erreur lors de la mise à jour du statut')
  }
}

// Show new order modal
function showNewOrderModal() {
  ElMessage.info('Nouvelle commande - À venir')
}

// Lifecycle
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f9fafb;
}
</style>
