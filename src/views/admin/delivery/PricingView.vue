<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tarification Livraison</h1>
        <p class="text-gray-600 mt-1">Définir les prix de livraison par zone et option</p>
      </div>
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr-1"><Plus /></el-icon>
        Ajouter un tarif
      </el-button>
    </div>

    <!-- Pricing Table -->
    <el-table :data="pricings" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />

      <el-table-column label="Ville" width="150">
        <template #default="{ row }">
          {{ row.attributes.city?.data?.attributes?.name || 'Toutes' }}
        </template>
      </el-table-column>

      <el-table-column label="Département" width="150">
        <template #default="{ row }">
          {{ row.attributes.department?.data?.attributes?.name || 'Tous' }}
        </template>
      </el-table-column>

      <el-table-column label="Quartier" width="150">
        <template #default="{ row }">
          {{ row.attributes.district?.data?.attributes?.name || 'Tous' }}
        </template>
      </el-table-column>

      <el-table-column label="Option de livraison" width="150">
        <template #default="{ row }">
          {{ row.attributes.deliveryOption?.data?.attributes?.name || 'N/A' }}
        </template>
      </el-table-column>

      <el-table-column label="Prix" width="120">
        <template #default="{ row }">
          <span class="font-semibold text-green-600">
            {{ formatPrice(row.attributes.basePrice) }}
          </span>
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
            type="danger"
            @click="deletePricing(row)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="editing ? 'Modifier le tarif' : 'Ajouter un tarif'"
      width="600px"
    >
      <el-form :model="form" label-width="180px">
        <el-alert
          type="info"
          :closable="false"
          class="mb-4"
        >
          <template #title>
            <div class="text-sm">
              Plus la zone est précise, plus elle est prioritaire.<br/>
              <strong>Quartier > Département > Ville</strong>
            </div>
          </template>
        </el-alert>

        <el-form-item label="Option de livraison" required>
          <el-select v-model="form.deliveryOptionId" placeholder="Sélectionner">
            <el-option
              v-for="option in deliveryOptions"
              :key="option.id"
              :label="option.attributes.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">Zone de livraison</el-divider>

        <el-form-item label="Ville">
          <el-select
            v-model="form.cityId"
            placeholder="Sélectionner (optionnel)"
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
            placeholder="Sélectionner (optionnel)"
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
            placeholder="Sélectionner (optionnel)"
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

        <el-divider />

        <el-form-item label="Prix de base (FCFA)" required>
          <el-input-number
            v-model="form.basePrice"
            :min="0"
            :step="100"
            style="width: 200px"
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import deliveryService from '@/services/delivery'

const pricings = ref([])
const cities = ref([])
const departments = ref([])
const districts = ref([])
const deliveryOptions = ref([])

const loading = ref(false)
const dialogVisible = ref(false)
const editing = ref(null)
const saving = ref(false)

const form = ref({
  cityId: null,
  departmentId: null,
  districtId: null,
  deliveryOptionId: null,
  basePrice: 1000,
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
    fetchPricings(),
    fetchCities(),
    fetchDepartments(),
    fetchDistricts(),
    fetchDeliveryOptions()
  ])
})

const fetchPricings = async () => {
  loading.value = true
  try {
    const response = await deliveryService.pricing.find({
      populate: ['city', 'department', 'district', 'deliveryOption'],
      sort: ['id:desc']
    })
    pricings.value = response.data.data
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

const openDialog = (pricing = null) => {
  if (pricing) {
    editing.value = pricing
    form.value = {
      cityId: pricing.attributes.city?.data?.id || null,
      departmentId: pricing.attributes.department?.data?.id || null,
      districtId: pricing.attributes.district?.data?.id || null,
      deliveryOptionId: pricing.attributes.deliveryOption?.data?.id || null,
      basePrice: pricing.attributes.basePrice || 1000,
      isActive: pricing.attributes.isActive
    }
  } else {
    editing.value = null
    form.value = {
      cityId: null,
      departmentId: null,
      districtId: null,
      deliveryOptionId: null,
      basePrice: 1000,
      isActive: true
    }
  }
  dialogVisible.value = true
}

const save = async () => {
  if (!form.value.deliveryOptionId) {
    ElMessage.warning('Veuillez sélectionner une option de livraison')
    return
  }

  saving.value = true
  try {
    const data = {
      city: form.value.cityId || null,
      department: form.value.departmentId || null,
      district: form.value.districtId || null,
      deliveryOption: form.value.deliveryOptionId,
      basePrice: form.value.basePrice,
      isActive: form.value.isActive
    }

    if (editing.value) {
      await deliveryService.pricing.update(editing.value.id, data)
      ElMessage.success('Tarif modifié avec succès')
    } else {
      await deliveryService.pricing.create(data)
      ElMessage.success('Tarif créé avec succès')
    }

    dialogVisible.value = false
    await fetchPricings()
  } catch (error) {
    ElMessage.error('Erreur lors de l\'enregistrement')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const deletePricing = async (pricing) => {
  try {
    await ElMessageBox.confirm(
      'Êtes-vous sûr de vouloir supprimer ce tarif?',
      'Confirmation',
      { type: 'warning' }
    )
    await deliveryService.pricing.delete(pricing.id)
    ElMessage.success('Tarif supprimé')
    await fetchPricings()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Erreur lors de la suppression')
      console.error(error)
    }
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(price) + ' FCFA'
}
</script>
