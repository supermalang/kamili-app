<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Promotions Livraison</h1>
        <p class="text-gray-600 mt-1">Gérer les promotions et réductions de livraison</p>
      </div>
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr-1"><Plus /></el-icon>
        Ajouter une promotion
      </el-button>
    </div>

    <!-- Promotions Table -->
    <el-table :data="promotions" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />

      <el-table-column label="Nom" width="200">
        <template #default="{ row }">
          <div>
            <div class="font-semibold">{{ row.attributes.name }}</div>
            <div class="text-xs text-gray-500">{{ row.attributes.code }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Description">
        <template #default="{ row }">
          <span class="text-sm text-gray-600">{{ row.attributes.description || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Réduction" width="150">
        <template #default="{ row }">
          <span class="font-semibold text-green-600">
            {{ formatDiscount(row.attributes) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Conditions" width="200">
        <template #default="{ row }">
          <div class="text-xs space-y-1">
            <div v-if="row.attributes.minOrderAmount">
              Min: {{ formatPrice(row.attributes.minOrderAmount) }}
            </div>
            <div v-if="row.attributes.maxDiscount">
              Max: {{ formatPrice(row.attributes.maxDiscount) }}
            </div>
            <div v-if="row.attributes.maxUsageCount">
              Usage: {{ row.attributes.currentUsageCount || 0 }}/{{ row.attributes.maxUsageCount }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Période" width="200">
        <template #default="{ row }">
          <div class="text-xs">
            <div>Du: {{ formatDate(row.attributes.validFrom) }}</div>
            <div>Au: {{ formatDate(row.attributes.validTo) }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Statut" width="120">
        <template #default="{ row }">
          <el-tag :type="row.attributes.isActive ? 'success' : 'danger'">
            {{ row.attributes.isActive ? 'Actif' : 'Inactif' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button
            size="small"
            :type="row.attributes.isActive ? 'warning' : 'success'"
            @click="toggleStatus(row)"
          >
            {{ row.attributes.isActive ? 'Désactiver' : 'Activer' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editing ? 'Modifier la promotion' : 'Ajouter une promotion'"
      width="700px"
    >
      <el-form :model="form" label-width="180px">
        <el-form-item label="Nom" required>
          <el-input v-model="form.name" placeholder="Ex: Livraison gratuite" />
        </el-form-item>

        <el-form-item label="Code" required>
          <el-input v-model="form.code" placeholder="Ex: FREELIVERY" />
        </el-form-item>

        <el-form-item label="Description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            placeholder="Description de la promotion"
          />
        </el-form-item>

        <el-divider content-position="left">Réduction</el-divider>

        <el-form-item label="Type de réduction" required>
          <el-radio-group v-model="form.discountType">
            <el-radio value="percentage">Pourcentage</el-radio>
            <el-radio value="fixed">Montant fixe</el-radio>
            <el-radio value="free">Livraison gratuite</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="form.discountType === 'percentage'"
          label="Pourcentage (%)"
          required
        >
          <el-input-number
            v-model="form.discountValue"
            :min="0"
            :max="100"
            :step="5"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item
          v-if="form.discountType === 'fixed'"
          label="Montant (FCFA)"
          required
        >
          <el-input-number
            v-model="form.discountValue"
            :min="0"
            :step="100"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item
          v-if="form.discountType === 'percentage'"
          label="Réduction max (FCFA)"
        >
          <el-input-number
            v-model="form.maxDiscount"
            :min="0"
            :step="100"
            style="width: 200px"
          />
        </el-form-item>

        <el-divider content-position="left">Conditions</el-divider>

        <el-form-item label="Commande min (FCFA)">
          <el-input-number
            v-model="form.minOrderAmount"
            :min="0"
            :step="1000"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="Usage max">
          <el-input-number
            v-model="form.maxUsageCount"
            :min="0"
            style="width: 200px"
          />
        </el-form-item>

        <el-divider content-position="left">Zone géographique (optionnel)</el-divider>

        <el-form-item label="Ville">
          <el-select
            v-model="form.cityId"
            placeholder="Toutes les villes"
            clearable
            @change="onCityChange"
          >
            <el-option
              v-for="city in cities"
              :key="city.id"
              :label="city.attributes.name"
              :value="city.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Département">
          <el-select
            v-model="form.departmentId"
            placeholder="Tous les départements"
            clearable
            :disabled="!form.cityId"
            @change="onDepartmentChange"
          >
            <el-option
              v-for="dept in filteredDepartments"
              :key="dept.id"
              :label="dept.attributes.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Quartier">
          <el-select
            v-model="form.districtId"
            placeholder="Tous les quartiers"
            clearable
            :disabled="!form.departmentId"
          >
            <el-option
              v-for="district in filteredDistricts"
              :key="district.id"
              :label="district.attributes.name"
              :value="district.id"
            />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">Option de livraison (optionnel)</el-divider>

        <el-form-item label="Option de livraison">
          <el-select
            v-model="form.deliveryOptionId"
            placeholder="Toutes les options"
            clearable
          >
            <el-option
              v-for="option in deliveryOptions"
              :key="option.id"
              :label="option.attributes.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">Période de validité</el-divider>

        <el-form-item label="Date de début" required>
          <el-date-picker
            v-model="form.validFrom"
            type="datetime"
            placeholder="Date de début"
            format="DD/MM/YYYY HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss.SSSZ"
          />
        </el-form-item>

        <el-form-item label="Date de fin" required>
          <el-date-picker
            v-model="form.validTo"
            type="datetime"
            placeholder="Date de fin"
            format="DD/MM/YYYY HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss.SSSZ"
          />
        </el-form-item>

        <el-form-item label="Actif">
          <el-switch v-model="form.isActive" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="save" :loading="saving">
          Enregistrer
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import deliveryService from '@/services/delivery'

const promotions = ref([])
const cities = ref([])
const departments = ref([])
const districts = ref([])
const deliveryOptions = ref([])

const loading = ref(false)
const dialogVisible = ref(false)
const editing = ref(null)
const saving = ref(false)

const form = ref({
  name: '',
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  maxDiscount: null,
  minOrderAmount: null,
  maxUsageCount: null,
  cityId: null,
  departmentId: null,
  districtId: null,
  deliveryOptionId: null,
  validFrom: null,
  validTo: null,
  isActive: true
})

const filteredDepartments = computed(() => {
  if (!form.value.cityId) return []
  return departments.value.filter(d => d.attributes.city?.data?.id === form.value.cityId)
})

const filteredDistricts = computed(() => {
  if (!form.value.departmentId) return []
  return districts.value.filter(d => d.attributes.department?.data?.id === form.value.departmentId)
})

onMounted(async () => {
  await Promise.all([
    fetchPromotions(),
    fetchCities(),
    fetchDepartments(),
    fetchDistricts(),
    fetchDeliveryOptions()
  ])
})

const fetchPromotions = async () => {
  loading.value = true
  try {
    const response = await deliveryService.promotions.find({
      populate: ['city', 'department', 'district', 'deliveryOption'],
      sort: ['id:desc']
    })
    promotions.value = response.data.data
  } catch (error) {
    ElMessage.error('Erreur lors du chargement')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const fetchCities = async () => {
  const response = await deliveryService.cities.find({ filters: { isActive: { $eq: true } } })
  cities.value = response.data.data
}

const fetchDepartments = async () => {
  const response = await deliveryService.departments.find({
    populate: ['city'],
    filters: { isActive: { $eq: true } }
  })
  departments.value = response.data.data
}

const fetchDistricts = async () => {
  const response = await deliveryService.districts.find({
    populate: ['department'],
    filters: { isActive: { $eq: true } }
  })
  districts.value = response.data.data
}

const fetchDeliveryOptions = async () => {
  const response = await deliveryService.options.find({ filters: { isActive: { $eq: true } } })
  deliveryOptions.value = response.data.data
}

const onCityChange = () => {
  form.value.departmentId = null
  form.value.districtId = null
}

const onDepartmentChange = () => {
  form.value.districtId = null
}

const openDialog = (promotion = null) => {
  if (promotion) {
    editing.value = promotion
    form.value = {
      name: promotion.attributes.name,
      code: promotion.attributes.code,
      description: promotion.attributes.description || '',
      discountType: promotion.attributes.discountType,
      discountValue: promotion.attributes.discountValue || 0,
      maxDiscount: promotion.attributes.maxDiscount || null,
      minOrderAmount: promotion.attributes.minOrderAmount || null,
      maxUsageCount: promotion.attributes.maxUsageCount || null,
      cityId: promotion.attributes.city?.data?.id || null,
      departmentId: promotion.attributes.department?.data?.id || null,
      districtId: promotion.attributes.district?.data?.id || null,
      deliveryOptionId: promotion.attributes.deliveryOption?.data?.id || null,
      validFrom: promotion.attributes.validFrom,
      validTo: promotion.attributes.validTo,
      isActive: promotion.attributes.isActive
    }
  } else {
    editing.value = null
    form.value = {
      name: '',
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscount: null,
      minOrderAmount: null,
      maxUsageCount: null,
      cityId: null,
      departmentId: null,
      districtId: null,
      deliveryOptionId: null,
      validFrom: null,
      validTo: null,
      isActive: true
    }
  }
  dialogVisible.value = true
}

const save = async () => {
  if (!form.value.name || !form.value.code) {
    ElMessage.warning('Veuillez remplir les champs obligatoires')
    return
  }

  if (form.value.discountType !== 'free' && !form.value.discountValue) {
    ElMessage.warning('Veuillez définir une valeur de réduction')
    return
  }

  if (!form.value.validFrom || !form.value.validTo) {
    ElMessage.warning('Veuillez définir la période de validité')
    return
  }

  saving.value = true
  try {
    const data = {
      name: form.value.name,
      code: form.value.code.toUpperCase(),
      description: form.value.description,
      discountType: form.value.discountType,
      discountValue: form.value.discountType === 'free' ? 0 : form.value.discountValue,
      maxDiscount: form.value.maxDiscount || null,
      minOrderAmount: form.value.minOrderAmount || null,
      maxUsageCount: form.value.maxUsageCount || null,
      city: form.value.cityId || null,
      department: form.value.departmentId || null,
      district: form.value.districtId || null,
      deliveryOption: form.value.deliveryOptionId || null,
      validFrom: form.value.validFrom,
      validTo: form.value.validTo,
      isActive: form.value.isActive
    }

    if (editing.value) {
      await deliveryService.promotions.update(editing.value.id, data)
      ElMessage.success('Promotion modifiée avec succès')
    } else {
      await deliveryService.promotions.create(data)
      ElMessage.success('Promotion créée avec succès')
    }

    dialogVisible.value = false
    await fetchPromotions()
  } catch (error) {
    ElMessage.error('Erreur lors de l\'enregistrement')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (promotion) => {
  try {
    await ElMessageBox.confirm(
      `Voulez-vous ${promotion.attributes.isActive ? 'désactiver' : 'activer'} cette promotion?`,
      'Confirmation',
      { type: 'warning' }
    )
    await deliveryService.promotions.update(promotion.id, { isActive: !promotion.attributes.isActive })
    ElMessage.success('Statut mis à jour')
    await fetchPromotions()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Erreur lors de la mise à jour')
      console.error(error)
    }
  }
}

const formatDiscount = (promo) => {
  if (promo.discountType === 'free') return 'Gratuit'
  if (promo.discountType === 'percentage') return `${promo.discountValue}%`
  if (promo.discountType === 'fixed') return `${promo.discountValue} FCFA`
  return '-'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(price) + ' FCFA'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
