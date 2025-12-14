<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Options de Livraison</h1>
        <p class="text-gray-600 mt-1">Gérer les options de livraison (Standard, Express, etc.)</p>
      </div>
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr-1"><Plus /></el-icon>
        Ajouter une option
      </el-button>
    </div>

    <!-- Options Table -->
    <el-table :data="options" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />

      <el-table-column label="Icône" width="100">
        <template #default="{ row }">
          <img
            v-if="row.attributes.icon?.data"
            :src="getIconUrl(row.attributes.icon.data)"
            alt="Icon"
            class="w-12 h-12 object-contain"
          />
          <div v-else class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
            <el-icon class="text-gray-400"><Box /></el-icon>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="attributes.name" label="Nom" width="150" />

      <el-table-column label="Description">
        <template #default="{ row }">
          <span class="text-sm text-gray-600">{{ row.attributes.description || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="attributes.estimatedTime" label="Temps estimé" width="150" />

      <el-table-column prop="attributes.sortOrder" label="Ordre" width="100" />

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
      :title="editing ? 'Modifier l\'option' : 'Ajouter une option'"
      width="600px"
    >
      <el-form :model="form" label-width="150px">
        <el-form-item label="Nom">
          <el-input v-model="form.name" placeholder="Ex: Standard, Express" />
        </el-form-item>

        <el-form-item label="Description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Description de l'option de livraison"
          />
        </el-form-item>

        <el-form-item label="Temps estimé">
          <el-input v-model="form.estimatedTime" placeholder="Ex: 30-45 minutes, 2-3 heures" />
        </el-form-item>

        <el-form-item label="Ordre d'affichage">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>

        <el-form-item label="Icône">
          <div class="flex items-center gap-4">
            <div v-if="form.iconPreview" class="relative">
              <img :src="form.iconPreview" alt="Icon preview" class="w-20 h-20 object-contain border rounded p-2" />
              <el-button
                size="small"
                type="danger"
                circle
                class="absolute -top-2 -right-2"
                @click="removeIcon"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <el-upload
              class="upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleIconChange"
              accept="image/*"
            >
              <el-button type="primary">
                <el-icon class="mr-1"><Upload /></el-icon>
                {{ form.iconPreview ? 'Changer' : 'Télécharger' }}
              </el-button>
            </el-upload>
          </div>
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Upload, Close, Box } from '@element-plus/icons-vue'
import deliveryService from '@/services/delivery'
import { getStrapiAssetUrl } from '@/utils/env'
import mediaService from '@/services/media'

const options = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const editing = ref(null)
const saving = ref(false)

const form = ref({
  name: '',
  description: '',
  estimatedTime: '',
  sortOrder: 0,
  iconId: null,
  iconPreview: null,
  iconFile: null,
  isActive: true
})

onMounted(async () => {
  await fetchOptions()
})

const fetchOptions = async () => {
  loading.value = true
  try {
    const response = await deliveryService.options.find({
      populate: ['icon'],
      sort: ['sortOrder:asc', 'name:asc']
    })
    options.value = response.data.data
  } catch (error) {
    ElMessage.error('Erreur lors du chargement des options')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openDialog = (option = null) => {
  if (option) {
    editing.value = option
    form.value = {
      name: option.attributes.name,
      description: option.attributes.description || '',
      estimatedTime: option.attributes.estimatedTime || '',
      sortOrder: option.attributes.sortOrder || 0,
      iconId: option.attributes.icon?.data?.id || null,
      iconPreview: option.attributes.icon?.data ? getIconUrl(option.attributes.icon.data) : null,
      iconFile: null,
      isActive: option.attributes.isActive
    }
  } else {
    editing.value = null
    form.value = {
      name: '',
      description: '',
      estimatedTime: '',
      sortOrder: 0,
      iconId: null,
      iconPreview: null,
      iconFile: null,
      isActive: true
    }
  }
  dialogVisible.value = true
}

const handleIconChange = (file) => {
  if (file.raw) {
    form.value.iconFile = file.raw
    form.value.iconPreview = URL.createObjectURL(file.raw)
  }
}

const removeIcon = () => {
  form.value.iconFile = null
  form.value.iconPreview = null
  form.value.iconId = null
}

const save = async () => {
  saving.value = true
  try {
    let iconId = form.value.iconId

    // Upload new icon if selected
    if (form.value.iconFile) {
      const uploadResponse = await mediaService.upload(form.value.iconFile)
      iconId = uploadResponse[0].id
    }

    const data = {
      name: form.value.name,
      description: form.value.description,
      estimatedTime: form.value.estimatedTime,
      sortOrder: form.value.sortOrder,
      icon: iconId,
      isActive: form.value.isActive
    }

    if (editing.value) {
      await deliveryService.options.update(editing.value.id, data)
      ElMessage.success('Option modifiée avec succès')
    } else {
      await deliveryService.options.create(data)
      ElMessage.success('Option créée avec succès')
    }

    dialogVisible.value = false
    await fetchOptions()
  } catch (error) {
    ElMessage.error('Erreur lors de l\'enregistrement')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (option) => {
  try {
    await ElMessageBox.confirm(
      `Voulez-vous ${option.attributes.isActive ? 'désactiver' : 'activer'} cette option?`,
      'Confirmation',
      { type: 'warning' }
    )
    await deliveryService.options.update(option.id, { isActive: !option.attributes.isActive })
    ElMessage.success('Statut mis à jour')
    await fetchOptions()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Erreur lors de la mise à jour')
      console.error(error)
    }
  }
}

const getIconUrl = (iconData) => {
  if (!iconData?.attributes?.url) return null
  return getStrapiAssetUrl(iconData.attributes.url)
}
</script>
