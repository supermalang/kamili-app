<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des Zones de Livraison</h1>
      <p class="text-gray-600 mt-1">
        Gérer les villes, départements et quartiers pour la livraison
      </p>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- Cities Tab -->
      <el-tab-pane label="Villes" name="cities">
        <div class="mb-4">
          <el-button type="primary" @click="openCityDialog()">
            <el-icon class="mr-1"><Plus /></el-icon>
            Ajouter une ville
          </el-button>
        </div>

        <el-table :data="cities" border style="width: 100%" v-loading="loadingCities">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="attributes.name" label="Nom" />
          <el-table-column label="Statut" width="120">
            <template #default="{ row }">
              <el-tag :type="row.attributes.isActive ? 'success' : 'danger'">
                {{ row.attributes.isActive ? 'Actif' : 'Inactif' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="openCityDialog(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                :type="row.attributes.isActive ? 'warning' : 'success'"
                @click="toggleCityStatus(row)"
              >
                {{ row.attributes.isActive ? 'Désactiver' : 'Activer' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- Departments Tab -->
      <el-tab-pane label="Départements" name="departments">
        <div class="mb-4">
          <el-button type="primary" @click="openDepartmentDialog()">
            <el-icon class="mr-1"><Plus /></el-icon>
            Ajouter un département
          </el-button>
        </div>

        <el-table :data="departments" border style="width: 100%" v-loading="loadingDepartments">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="attributes.name" label="Nom" />
          <el-table-column label="Ville" width="200">
            <template #default="{ row }">
              {{ row.attributes.city?.data?.attributes?.name || 'N/A' }}
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
              <el-button size="small" @click="openDepartmentDialog(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                :type="row.attributes.isActive ? 'warning' : 'success'"
                @click="toggleDepartmentStatus(row)"
              >
                {{ row.attributes.isActive ? 'Désactiver' : 'Activer' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- Districts Tab -->
      <el-tab-pane label="Quartiers" name="districts">
        <div class="mb-4">
          <el-button type="primary" @click="openDistrictDialog()">
            <el-icon class="mr-1"><Plus /></el-icon>
            Ajouter un quartier
          </el-button>
        </div>

        <el-table :data="districts" border style="width: 100%" v-loading="loadingDistricts">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="attributes.name" label="Nom" />
          <el-table-column label="Département" width="200">
            <template #default="{ row }">
              {{ row.attributes.department?.data?.attributes?.name || 'N/A' }}
            </template>
          </el-table-column>
          <el-table-column label="Ville" width="200">
            <template #default="{ row }">
              {{
                row.attributes.department?.data?.attributes?.city?.data?.attributes?.name || 'N/A'
              }}
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
              <el-button size="small" @click="openDistrictDialog(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                :type="row.attributes.isActive ? 'warning' : 'success'"
                @click="toggleDistrictStatus(row)"
              >
                {{ row.attributes.isActive ? 'Désactiver' : 'Activer' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- City Dialog -->
    <el-dialog
      v-model="cityDialogVisible"
      :title="editingCity ? 'Modifier la ville' : 'Ajouter une ville'"
      width="500px"
    >
      <el-form :model="cityForm" label-width="120px">
        <el-form-item label="Nom">
          <el-input v-model="cityForm.name" placeholder="Ex: Dakar" />
        </el-form-item>
        <el-form-item label="Actif">
          <el-switch v-model="cityForm.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cityDialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="saveCity">Enregistrer</el-button>
      </template>
    </el-dialog>

    <!-- Department Dialog -->
    <el-dialog
      v-model="departmentDialogVisible"
      :title="editingDepartment ? 'Modifier le département' : 'Ajouter un département'"
      width="500px"
    >
      <el-form :model="departmentForm" label-width="120px">
        <el-form-item label="Ville">
          <el-select v-model="departmentForm.cityId" placeholder="Sélectionner une ville">
            <el-option
              v-for="city in activeCities"
              :key="city.id"
              :label="city.attributes.name"
              :value="city.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Nom">
          <el-input v-model="departmentForm.name" placeholder="Ex: Plateau" />
        </el-form-item>
        <el-form-item label="Actif">
          <el-switch v-model="departmentForm.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="departmentDialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="saveDepartment">Enregistrer</el-button>
      </template>
    </el-dialog>

    <!-- District Dialog -->
    <el-dialog
      v-model="districtDialogVisible"
      :title="editingDistrict ? 'Modifier le quartier' : 'Ajouter un quartier'"
      width="500px"
    >
      <el-form :model="districtForm" label-width="120px">
        <el-form-item label="Département">
          <el-select v-model="districtForm.departmentId" placeholder="Sélectionner un département">
            <el-option
              v-for="dept in activeDepartments"
              :key="dept.id"
              :label="`${dept.attributes.name} (${dept.attributes.city?.data?.attributes?.name})`"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Nom">
          <el-input v-model="districtForm.name" placeholder="Ex: Point E" />
        </el-form-item>
        <el-form-item label="Actif">
          <el-switch v-model="districtForm.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="districtDialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="saveDistrict">Enregistrer</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import deliveryService from '@/services/delivery'

const activeTab = ref('cities')

// Cities
const cities = ref([])
const loadingCities = ref(false)
const cityDialogVisible = ref(false)
const editingCity = ref(null)
const cityForm = ref({ name: '', isActive: true })

// Departments
const departments = ref([])
const loadingDepartments = ref(false)
const departmentDialogVisible = ref(false)
const editingDepartment = ref(null)
const departmentForm = ref({ name: '', cityId: null, isActive: true })

// Districts
const districts = ref([])
const loadingDistricts = ref(false)
const districtDialogVisible = ref(false)
const editingDistrict = ref(null)
const districtForm = ref({ name: '', departmentId: null, isActive: true })

// Computed
const activeCities = computed(() => cities.value.filter((c) => c.attributes.isActive))
const activeDepartments = computed(() => departments.value.filter((d) => d.attributes.isActive))

onMounted(async () => {
  await Promise.all([fetchCities(), fetchDepartments(), fetchDistricts()])
})

// Cities CRUD
const fetchCities = async () => {
  loadingCities.value = true
  try {
    const response = await deliveryService.cities.find({ sort: ['name:asc'] })
    cities.value = response.data.data
  } catch (error) {
    ElMessage.error('Erreur lors du chargement des villes')
    console.error(error)
  } finally {
    loadingCities.value = false
  }
}

const openCityDialog = (city = null) => {
  if (city) {
    editingCity.value = city
    cityForm.value = {
      name: city.attributes.name,
      isActive: city.attributes.isActive,
    }
  } else {
    editingCity.value = null
    cityForm.value = { name: '', isActive: true }
  }
  cityDialogVisible.value = true
}

const saveCity = async () => {
  try {
    if (editingCity.value) {
      await deliveryService.cities.update(editingCity.value.id, cityForm.value)
      ElMessage.success('Ville modifiée avec succès')
    } else {
      await deliveryService.cities.create(cityForm.value)
      ElMessage.success('Ville créée avec succès')
    }
    cityDialogVisible.value = false
    await fetchCities()
  } catch (error) {
    ElMessage.error("Erreur lors de l'enregistrement")
    console.error(error)
  }
}

const toggleCityStatus = async (city) => {
  try {
    await ElMessageBox.confirm(
      `Voulez-vous ${city.attributes.isActive ? 'désactiver' : 'activer'} cette ville?`,
      'Confirmation',
      { type: 'warning' },
    )
    await deliveryService.cities.update(city.id, { isActive: !city.attributes.isActive })
    ElMessage.success('Statut mis à jour')
    await fetchCities()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Erreur lors de la mise à jour')
      console.error(error)
    }
  }
}

// Departments CRUD
const fetchDepartments = async () => {
  loadingDepartments.value = true
  try {
    const response = await deliveryService.departments.find({
      populate: ['city'],
      sort: ['name:asc'],
    })
    departments.value = response.data.data
  } catch (error) {
    ElMessage.error('Erreur lors du chargement des départements')
    console.error(error)
  } finally {
    loadingDepartments.value = false
  }
}

const openDepartmentDialog = (department = null) => {
  if (department) {
    editingDepartment.value = department
    departmentForm.value = {
      name: department.attributes.name,
      cityId: department.attributes.city?.data?.id,
      isActive: department.attributes.isActive,
    }
  } else {
    editingDepartment.value = null
    departmentForm.value = { name: '', cityId: null, isActive: true }
  }
  departmentDialogVisible.value = true
}

const saveDepartment = async () => {
  try {
    const data = {
      name: departmentForm.value.name,
      city: departmentForm.value.cityId,
      isActive: departmentForm.value.isActive,
    }
    if (editingDepartment.value) {
      await deliveryService.departments.update(editingDepartment.value.id, data)
      ElMessage.success('Département modifié avec succès')
    } else {
      await deliveryService.departments.create(data)
      ElMessage.success('Département créé avec succès')
    }
    departmentDialogVisible.value = false
    await fetchDepartments()
  } catch (error) {
    ElMessage.error("Erreur lors de l'enregistrement")
    console.error(error)
  }
}

const toggleDepartmentStatus = async (department) => {
  try {
    await ElMessageBox.confirm(
      `Voulez-vous ${department.attributes.isActive ? 'désactiver' : 'activer'} ce département?`,
      'Confirmation',
      { type: 'warning' },
    )
    await deliveryService.departments.update(department.id, {
      isActive: !department.attributes.isActive,
    })
    ElMessage.success('Statut mis à jour')
    await fetchDepartments()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Erreur lors de la mise à jour')
      console.error(error)
    }
  }
}

// Districts CRUD
const fetchDistricts = async () => {
  loadingDistricts.value = true
  try {
    const response = await deliveryService.districts.find({
      populate: {
        department: {
          populate: ['city'],
        },
      },
      sort: ['name:asc'],
    })
    districts.value = response.data.data
  } catch (error) {
    ElMessage.error('Erreur lors du chargement des quartiers')
    console.error(error)
  } finally {
    loadingDistricts.value = false
  }
}

const openDistrictDialog = (district = null) => {
  if (district) {
    editingDistrict.value = district
    districtForm.value = {
      name: district.attributes.name,
      departmentId: district.attributes.department?.data?.id,
      isActive: district.attributes.isActive,
    }
  } else {
    editingDistrict.value = null
    districtForm.value = { name: '', departmentId: null, isActive: true }
  }
  districtDialogVisible.value = true
}

const saveDistrict = async () => {
  try {
    const data = {
      name: districtForm.value.name,
      department: districtForm.value.departmentId,
      isActive: districtForm.value.isActive,
    }
    if (editingDistrict.value) {
      await deliveryService.districts.update(editingDistrict.value.id, data)
      ElMessage.success('Quartier modifié avec succès')
    } else {
      await deliveryService.districts.create(data)
      ElMessage.success('Quartier créé avec succès')
    }
    districtDialogVisible.value = false
    await fetchDistricts()
  } catch (error) {
    ElMessage.error("Erreur lors de l'enregistrement")
    console.error(error)
  }
}

const toggleDistrictStatus = async (district) => {
  try {
    await ElMessageBox.confirm(
      `Voulez-vous ${district.attributes.isActive ? 'désactiver' : 'activer'} ce quartier?`,
      'Confirmation',
      { type: 'warning' },
    )
    await deliveryService.districts.update(district.id, { isActive: !district.attributes.isActive })
    ElMessage.success('Statut mis à jour')
    await fetchDistricts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Erreur lors de la mise à jour')
      console.error(error)
    }
  }
}
</script>
