<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
      <p class="text-gray-600 mt-1">Suivre et gérer toutes les commandes avec livraison</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <el-select v-model="filters.status" placeholder="Statut" clearable @change="fetchOrders">
          <el-option label="En attente" value="pending" />
          <el-option label="Confirmée" value="confirmed" />
          <el-option label="En préparation" value="preparing" />
          <el-option label="Prête" value="ready" />
          <el-option label="En livraison" value="out_for_delivery" />
          <el-option label="Livrée" value="delivered" />
          <el-option label="Annulée" value="cancelled" />
        </el-select>

        <el-select v-model="filters.deliveryType" placeholder="Type" clearable @change="fetchOrders">
          <el-option label="Livraison" value="delivery" />
          <el-option label="À emporter" value="takeaway" />
        </el-select>

        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="à"
          start-placeholder="Date début"
          end-placeholder="Date fin"
          format="DD/MM/YYYY"
          @change="fetchOrders"
        />

        <el-input
          v-model="filters.search"
          placeholder="Rechercher (ID, client, téléphone)"
          clearable
          @input="debouncedSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">En attente</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
          </div>
          <el-icon :size="40" class="text-yellow-600"><Clock /></el-icon>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">En préparation</p>
            <p class="text-2xl font-bold text-blue-600">{{ stats.preparing }}</p>
          </div>
          <el-icon :size="40" class="text-blue-600"><Timer /></el-icon>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">En livraison</p>
            <p class="text-2xl font-bold text-orange-600">{{ stats.delivering }}</p>
          </div>
          <el-icon :size="40" class="text-orange-600"><Van /></el-icon>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Livrées aujourd'hui</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.delivered }}</p>
          </div>
          <el-icon :size="40" class="text-green-600"><SuccessFilled /></el-icon>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <el-table :data="orders" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />

      <el-table-column label="Client" width="200">
        <template #default="{ row }">
          <div>
            <div class="font-semibold">{{ row.attributes.customerName }}</div>
            <div class="text-xs text-gray-500">{{ row.attributes.customerPhone }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Type" width="120">
        <template #default="{ row }">
          <el-tag :type="row.attributes.deliveryType === 'delivery' ? 'primary' : 'warning'">
            {{ row.attributes.deliveryType === 'delivery' ? 'Livraison' : 'À emporter' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Adresse" width="250">
        <template #default="{ row }">
          <div v-if="row.attributes.deliveryType === 'delivery'" class="text-sm">
            <div>{{ row.attributes.deliveryAddress }}</div>
            <div class="text-xs text-gray-500">
              {{ row.attributes.district?.data?.attributes?.name }},
              {{ row.attributes.department?.data?.attributes?.name }}
            </div>
          </div>
          <span v-else class="text-gray-400">-</span>
        </template>
      </el-table-column>

      <el-table-column label="Montant" width="150">
        <template #default="{ row }">
          <div class="text-right">
            <div class="font-semibold text-green-600">{{ formatPrice(row.attributes.totalAmount) }}</div>
            <div class="text-xs text-gray-500">
              Livraison: {{ formatPrice(row.attributes.deliveryFee) }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Statut" width="150">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.attributes.status)">
            {{ getStatusLabel(row.attributes.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Date" width="160">
        <template #default="{ row }">
          <div class="text-sm">
            {{ formatDateTime(row.attributes.createdAt) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="250" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewOrder(row)">
            <el-icon><View /></el-icon>
            Détails
          </el-button>
          <el-dropdown trigger="click" @command="(cmd) => handleStatusChange(row, cmd)">
            <el-button size="small" type="primary">
              Statut <el-icon class="ml-1"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="confirmed" :disabled="row.attributes.status !== 'pending'">
                  Confirmer
                </el-dropdown-item>
                <el-dropdown-item command="preparing" :disabled="row.attributes.status === 'pending'">
                  En préparation
                </el-dropdown-item>
                <el-dropdown-item command="ready">
                  Prête
                </el-dropdown-item>
                <el-dropdown-item command="out_for_delivery" :disabled="row.attributes.deliveryType !== 'delivery'">
                  En livraison
                </el-dropdown-item>
                <el-dropdown-item command="delivered">
                  Livrée
                </el-dropdown-item>
                <el-dropdown-item command="cancelled" divided>
                  Annuler
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 25, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchOrders"
        @current-change="fetchOrders"
      />
    </div>

    <!-- Order Detail Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="Détails de la commande"
      width="800px"
    >
      <div v-if="selectedOrder">
        <!-- Customer Info -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <el-icon><User /></el-icon>
            Informations client
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600">Nom</label>
              <p class="font-semibold">{{ selectedOrder.attributes.customerName }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Téléphone</label>
              <p class="font-semibold">{{ selectedOrder.attributes.customerPhone }}</p>
            </div>
            <div v-if="selectedOrder.attributes.customerEmail">
              <label class="text-sm text-gray-600">Email</label>
              <p class="font-semibold">{{ selectedOrder.attributes.customerEmail }}</p>
            </div>
          </div>
        </div>

        <!-- Delivery Info -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <el-icon><Van /></el-icon>
            Informations livraison
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600">Type</label>
              <p>
                <el-tag :type="selectedOrder.attributes.deliveryType === 'delivery' ? 'primary' : 'warning'">
                  {{ selectedOrder.attributes.deliveryType === 'delivery' ? 'Livraison' : 'À emporter' }}
                </el-tag>
              </p>
            </div>
            <div v-if="selectedOrder.attributes.deliveryOption?.data">
              <label class="text-sm text-gray-600">Option</label>
              <p class="font-semibold">{{ selectedOrder.attributes.deliveryOption.data.attributes.name }}</p>
            </div>
            <div v-if="selectedOrder.attributes.deliveryType === 'delivery'" class="col-span-2">
              <label class="text-sm text-gray-600">Adresse</label>
              <p class="font-semibold">{{ selectedOrder.attributes.deliveryAddress }}</p>
              <p class="text-sm text-gray-500">
                {{ selectedOrder.attributes.district?.data?.attributes?.name }},
                {{ selectedOrder.attributes.department?.data?.attributes?.name }},
                {{ selectedOrder.attributes.city?.data?.attributes?.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <el-icon><ShoppingBag /></el-icon>
            Articles commandés
          </h3>
          <div class="space-y-2">
            <div
              v-for="item in selectedOrder.attributes.items"
              :key="item.id"
              class="flex justify-between items-start p-3 bg-gray-50 rounded"
            >
              <div class="flex-1">
                <p class="font-semibold">{{ item.productName }} × {{ item.quantity }}</p>
                <div v-if="item.selectedOptions && item.selectedOptions.length" class="text-sm text-gray-600 mt-1">
                  <span v-for="opt in item.selectedOptions" :key="opt" class="mr-2">
                    • {{ opt }}
                  </span>
                </div>
                <p v-if="item.specialInstructions" class="text-sm text-gray-500 italic mt-1">
                  Note: {{ item.specialInstructions }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">{{ formatPrice(item.totalPrice) }}</p>
                <p class="text-xs text-gray-500">{{ formatPrice(item.unitPrice) }} / unité</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Summary -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <el-icon><Money /></el-icon>
            Récapitulatif
          </h3>
          <div class="bg-gray-50 p-4 rounded space-y-2">
            <div class="flex justify-between">
              <span>Sous-total</span>
              <span class="font-semibold">{{ formatPrice(selectedOrder.attributes.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Frais de livraison</span>
              <span class="font-semibold">{{ formatPrice(selectedOrder.attributes.deliveryFee) }}</span>
            </div>
            <div v-if="selectedOrder.attributes.discountAmount > 0" class="flex justify-between text-green-600">
              <span>Réduction</span>
              <span class="font-semibold">- {{ formatPrice(selectedOrder.attributes.discountAmount) }}</span>
            </div>
            <el-divider class="my-2" />
            <div class="flex justify-between text-lg">
              <span class="font-bold">Total</span>
              <span class="font-bold text-green-600">{{ formatPrice(selectedOrder.attributes.totalAmount) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Mode de paiement</span>
              <el-tag size="small">{{ selectedOrder.attributes.paymentMethod === 'cash' ? 'Espèces' : 'Carte' }}</el-tag>
            </div>
            <div class="flex justify-between text-sm">
              <span>Statut paiement</span>
              <el-tag :type="selectedOrder.attributes.paymentStatus === 'paid' ? 'success' : 'warning'" size="small">
                {{ selectedOrder.attributes.paymentStatus === 'paid' ? 'Payé' : 'En attente' }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- Status History -->
        <div>
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <el-icon><Clock /></el-icon>
            Historique des statuts
          </h3>
          <el-timeline>
            <el-timeline-item
              v-for="(history, index) in selectedOrder.attributes.statusHistory"
              :key="index"
              :timestamp="formatDateTime(history.timestamp)"
              :type="getStatusType(history.status)"
            >
              <div>
                <p class="font-semibold">{{ getStatusLabel(history.status) }}</p>
                <p v-if="history.note" class="text-sm text-gray-600">{{ history.note }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">Fermer</el-button>
        <el-button type="primary" @click="printOrder">
          <el-icon><Printer /></el-icon>
          Imprimer
        </el-button>
      </template>
    </el-dialog>

    <!-- Status Change Dialog -->
    <el-dialog
      v-model="statusDialogVisible"
      title="Changer le statut"
      width="500px"
    >
      <el-form :model="statusForm" label-width="120px">
        <el-form-item label="Nouveau statut">
          <el-tag :type="getStatusType(statusForm.newStatus)">
            {{ getStatusLabel(statusForm.newStatus) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="Note (optionnel)">
          <el-input
            v-model="statusForm.note"
            type="textarea"
            :rows="3"
            placeholder="Ajouter une note..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="statusDialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="confirmStatusChange" :loading="updating">
          Confirmer
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search,
  Clock,
  Timer,
  Van,
  SuccessFilled,
  View,
  ArrowDown,
  User,
  ShoppingBag,
  Money,
  Printer
} from '@element-plus/icons-vue'
import deliveryService from '@/services/delivery'

const orders = ref([])
const loading = ref(false)
const detailDialogVisible = ref(false)
const statusDialogVisible = ref(false)
const selectedOrder = ref(null)
const updating = ref(false)

const filters = ref({
  status: null,
  deliveryType: null,
  dateRange: null,
  search: ''
})

const pagination = ref({
  page: 1,
  pageSize: 25,
  total: 0
})

const stats = ref({
  pending: 0,
  preparing: 0,
  delivering: 0,
  delivered: 0
})

const statusForm = ref({
  orderId: null,
  newStatus: '',
  note: ''
})

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchOrders()
  }, 500)
}

onMounted(async () => {
  await Promise.all([
    fetchOrders(),
    fetchStats()
  ])
})

const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {
      populate: {
        city: true,
        department: true,
        district: true,
        deliveryOption: true,
        user: true
      },
      sort: ['createdAt:desc'],
      pagination: {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize
      }
    }

    // Apply filters
    const queryFilters = {}
    if (filters.value.status) {
      queryFilters.status = { $eq: filters.value.status }
    }
    if (filters.value.deliveryType) {
      queryFilters.deliveryType = { $eq: filters.value.deliveryType }
    }
    if (filters.value.search) {
      queryFilters.$or = [
        { customerName: { $containsi: filters.value.search } },
        { customerPhone: { $containsi: filters.value.search } },
        { id: { $eq: parseInt(filters.value.search) || 0 } }
      ]
    }
    if (filters.value.dateRange && filters.value.dateRange.length === 2) {
      queryFilters.createdAt = {
        $gte: filters.value.dateRange[0],
        $lte: filters.value.dateRange[1]
      }
    }

    if (Object.keys(queryFilters).length > 0) {
      params.filters = queryFilters
    }

    const response = await deliveryService.orders.find(params)
    orders.value = response.data.data
    pagination.value.total = response.data.meta.pagination.total
  } catch (error) {
    ElMessage.error('Erreur lors du chargement des commandes')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [pendingRes, preparingRes, deliveringRes, deliveredRes] = await Promise.all([
      deliveryService.orders.find({ filters: { status: { $eq: 'pending' } }, pagination: { pageSize: 1 } }),
      deliveryService.orders.find({ filters: { status: { $in: ['confirmed', 'preparing'] } }, pagination: { pageSize: 1 } }),
      deliveryService.orders.find({ filters: { status: { $eq: 'out_for_delivery' } }, pagination: { pageSize: 1 } }),
      deliveryService.orders.find({
        filters: {
          status: { $eq: 'delivered' },
          createdAt: { $gte: today.toISOString() }
        },
        pagination: { pageSize: 1 }
      })
    ])

    stats.value = {
      pending: pendingRes.data.meta.pagination.total,
      preparing: preparingRes.data.meta.pagination.total,
      delivering: deliveringRes.data.meta.pagination.total,
      delivered: deliveredRes.data.meta.pagination.total
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

const viewOrder = (order) => {
  selectedOrder.value = order
  detailDialogVisible.value = true
}

const handleStatusChange = (order, newStatus) => {
  statusForm.value = {
    orderId: order.id,
    newStatus,
    note: ''
  }
  statusDialogVisible.value = true
}

const confirmStatusChange = async () => {
  updating.value = true
  try {
    await deliveryService.orders.updateStatus(
      statusForm.value.orderId,
      statusForm.value.newStatus,
      statusForm.value.note
    )
    ElMessage.success('Statut mis à jour avec succès')
    statusDialogVisible.value = false
    await Promise.all([fetchOrders(), fetchStats()])
  } catch (error) {
    ElMessage.error('Erreur lors de la mise à jour du statut')
    console.error(error)
  } finally {
    updating.value = false
  }
}

const printOrder = () => {
  window.print()
}

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'primary',
    ready: 'success',
    out_for_delivery: '',
    delivered: 'success',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    ready: 'Prête',
    out_for_delivery: 'En livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(price) + ' FCFA'
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
