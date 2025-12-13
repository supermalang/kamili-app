<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Produits</h1>
        <p class="text-gray-600 mt-1">Gérer les produits de votre restaurant</p>
      </div>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon class="mr-2"><Plus /></el-icon>
        Nouveau produit
      </el-button>
    </div>

    <el-card>
      <!-- Filters and Search -->
      <div class="mb-4 flex gap-4">
        <el-input
          v-model="searchQuery"
          placeholder="Rechercher un produit..."
          clearable
          class="w-64"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="Catégorie" clearable class="w-48">
          <el-option label="Toutes les catégories" value="" />
          <el-option
            v-for="cat in availableCategories"
            :key="cat.id"
            :label="cat.attributes.name"
            :value="cat.id"
          />
        </el-select>
      </div>

      <!-- Products Table -->
      <el-table
        :data="filteredProducts"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column label="Image" width="100">
          <template #default="{ row }">
            <el-image
              v-if="getProductImage(row)"
              :src="getProductImage(row)"
              :preview-src-list="[getProductImage(row)]"
              fit="cover"
              class="w-16 h-16 rounded cursor-pointer"
              preview-teleported
            />
            <div v-else class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="attributes.name" label="Nom" sortable />

        <el-table-column label="Prix" width="120" sortable>
          <template #default="{ row }">
            {{ row.attributes.price }} FCFA
          </template>
        </el-table-column>

        <el-table-column label="Catégorie" width="150">
          <template #default="{ row }">
            <span v-if="row.attributes.categories?.data?.length">
              {{ row.attributes.categories.data.map(c => c.attributes.name).join(', ') }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>

        <el-table-column label="Best Seller" width="120">
          <template #default="{ row }">
            <el-tag :type="row.attributes.isBestSeller ? 'success' : 'info'" size="small">
              {{ row.attributes.isBestSeller ? 'Oui' : 'Non' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Disponible" width="120">
          <template #default="{ row }">
            <el-tag :type="row.attributes.isAvailable !== false ? 'success' : 'danger'" size="small">
              {{ row.attributes.isAvailable !== false ? 'Oui' : 'Non' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="openEditDialog(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalProducts"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? 'Modifier le produit' : 'Nouveau produit'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="Nom" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="Prix (FCFA)" prop="price">
          <el-input-number v-model="formData.price" :min="0" :step="100" />
        </el-form-item>

        <el-form-item label="Catégorie" prop="categories">
          <el-select
            v-model="formData.categories"
            placeholder="Sélectionner une ou plusieurs catégories"
            multiple
            class="w-full"
          >
            <el-option
              v-for="cat in availableCategories"
              :key="cat.id"
              :label="cat.attributes.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Best Seller">
          <el-switch v-model="formData.isBestSeller" />
        </el-form-item>

        <el-form-item label="Disponible">
          <el-switch v-model="formData.isAvailable" />
        </el-form-item>

        <el-form-item label="Image">
          <div class="flex gap-2">
            <el-upload
              class="image-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              :data="{ ref: 'api::product.product', field: 'image' }"
              name="files"
              accept="image/*"
            >
              <el-image
                v-if="formData.imagePreview"
                :src="formData.imagePreview"
                :preview-src-list="[formData.imagePreview]"
                fit="cover"
                class="w-32 h-32 rounded border cursor-pointer"
                preview-teleported
              />
              <div v-else class="upload-placeholder">
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                <div class="text-sm text-gray-500 mt-2">Upload</div>
              </div>
            </el-upload>
            <div class="flex flex-col gap-2">
              <el-button @click="openMediaLibrary" size="small">
                <el-icon class="mr-1"><Picture /></el-icon>
                Sélectionner depuis la bibliothèque
              </el-button>
              <div class="text-xs text-gray-500">
                JPG, PNG ou GIF (MAX. 5MB)
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="saving">
          {{ isEditing ? 'Modifier' : 'Créer' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Media Library Dialog -->
    <el-dialog
      v-model="mediaLibraryVisible"
      title="Bibliothèque de médias"
      width="800px"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Bibliothèque de médias</span>
          <el-button @click="fetchMediaLibrary" :icon="RefreshRight" circle size="small" :loading="mediaLibraryLoading" />
        </div>
      </template>
      <div v-loading="mediaLibraryLoading">
        <div class="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          <div
            v-for="media in mediaFiles"
            :key="media.id"
            class="relative cursor-pointer border-2 rounded hover:border-blue-500"
            :class="{ 'border-blue-500': selectedMediaId === media.id }"
            @click="selectedMediaId = media.id"
          >
            <el-image
              :src="getMediaThumbnail(media)"
              fit="cover"
              class="w-full h-32"
              :preview-src-list="[getMediaFullUrl(media)]"
              preview-teleported
            />
            <div class="absolute top-1 right-1" v-if="selectedMediaId === media.id">
              <el-icon class="text-blue-500 bg-white rounded-full"><Check /></el-icon>
            </div>
            <div class="text-xs p-1 truncate">{{ media.name || 'Image' }}</div>
          </div>
        </div>
        <el-empty v-if="!mediaLibraryLoading && mediaFiles.length === 0" description="Aucune image disponible" />
      </div>
      <template #footer>
        <el-button @click="mediaLibraryVisible = false">Annuler</el-button>
        <el-button type="primary" @click="selectMediaFromLibrary" :disabled="!selectedMediaId">
          Sélectionner
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Edit, Delete, Picture, Check, RefreshRight } from '@element-plus/icons-vue'
import strapiService from '@/services/strapi'
import { useCategories } from '@/composables/useStrapi'
import { getEnv } from '@/utils/env'

const loading = ref(false)
const saving = ref(false)
const products = ref([])
const searchQuery = ref('')
const filterCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalProducts = ref(0)
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)
const mediaLibraryVisible = ref(false)
const mediaLibraryLoading = ref(false)
const mediaFiles = ref([])
const selectedMediaId = ref(null)

const { categories: availableCategories, fetchCategories } = useCategories()

const formData = ref({
  name: '',
  description: '',
  price: 0,
  categories: [],
  isBestSeller: false,
  isAvailable: true,
  imageId: null,
  imagePreview: null
})

const strapiUrl = getEnv('VITE_STRAPI_URL', 'http://localhost:1337').replace(/\/$/, '')
const uploadUrl = `${strapiUrl}/api/upload`
const uploadHeaders = {
  Authorization: `Bearer ${getEnv('VITE_STRAPI_API_TOKEN', '')}`
}

const formRules = {
  name: [{ required: true, message: 'Le nom est requis', trigger: 'blur' }],
  price: [{ required: true, message: 'Le prix est requis', trigger: 'blur' }],
  categories: [{ required: true, message: 'Au moins une catégorie est requise', trigger: 'change' }]
}

const filteredProducts = computed(() => {
  let result = products.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.attributes.name.toLowerCase().includes(query) ||
      p.attributes.description?.toLowerCase().includes(query)
    )
  }

  if (filterCategory.value) {
    result = result.filter(p => {
      const productCategories = p.attributes.categories?.data || []
      return productCategories.some(c => c.id === filterCategory.value)
    })
  }

  return result
})

const getProductImage = (product) => {
  const imageData = product.attributes?.image?.data
  if (!imageData) return null

  // Handle both single object and array responses
  const image = Array.isArray(imageData) ? imageData[0] : imageData

  if (image && image.attributes && image.attributes.url) {
    // Use thumbnail format if available, otherwise use original
    const formats = image.attributes.formats
    const thumbnailUrl = formats?.thumbnail?.url || formats?.small?.url || image.attributes.url
    const strapiUrl = getEnv('VITE_STRAPI_URL', 'http://localhost:1337').replace(/\/$/, '')
    return thumbnailUrl.startsWith('http') ? thumbnailUrl : `${strapiUrl}${thumbnailUrl}`
  }
  return null
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await strapiService.products.find({
      populate: ['image', 'categories'],
      sort: ['createdAt:desc'],
      pagination: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    products.value = response.data || []
    totalProducts.value = response.meta?.pagination?.total || 0
  } catch (error) {
    ElMessage.error('Erreur lors du chargement des produits')
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    description: '',
    price: 0,
    categories: [],
    isBestSeller: false,
    isAvailable: true,
    imageId: null,
    imagePreview: null
  }
  dialogVisible.value = true
}

const openEditDialog = (product) => {
  isEditing.value = true
  editingId.value = product.id

  const imageData = product.attributes.image?.data
  const imagePreview = imageData ? getProductImage(product) : null
  const productCategories = product.attributes.categories?.data?.map(c => c.id) || []

  formData.value = {
    name: product.attributes.name,
    description: product.attributes.description || '',
    price: product.attributes.price,
    categories: productCategories,
    isBestSeller: product.attributes.isBestSeller || false,
    isAvailable: product.attributes.isAvailable !== false,
    imageId: imageData?.id || null,
    imagePreview: imagePreview
  }
  dialogVisible.value = true
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('Le fichier doit être une image!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('La taille de l\'image doit être inférieure à 5MB!')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  if (response && response[0]) {
    formData.value.imageId = response[0].id
    formData.value.imagePreview = `${strapiUrl}${response[0].url}`
    ElMessage.success('Image uploadée avec succès')
  }
}

const handleUploadError = () => {
  ElMessage.error('Erreur lors de l\'upload de l\'image')
}

// Media Library functions
const openMediaLibrary = async () => {
  mediaLibraryVisible.value = true
  selectedMediaId.value = formData.value.imageId
  await fetchMediaLibrary()
}

const fetchMediaLibrary = async () => {
  mediaLibraryLoading.value = true
  try {
    // Try to fetch directly from Strapi upload API first
    try {
      const files = await strapiService.upload.getFiles({
        filters: {
          mime: {
            $startsWith: 'image'
          }
        },
        pagination: {
          pageSize: 100
        },
        sort: ['createdAt:desc']
      })

      // Strapi v4 returns files directly in an array
      mediaFiles.value = Array.isArray(files) ? files : []
    } catch (uploadError) {
      // If upload API fails (403 Forbidden), fallback to extracting images from products
      console.warn('Upload API not accessible, using products as fallback:', uploadError)

      const response = await strapiService.products.find({
        populate: ['image'],
        pagination: {
          pageSize: 100
        }
      })

      // Extract unique images from products
      const imageMap = new Map()
      response.data?.forEach(product => {
        const imageData = product.attributes?.image?.data
        if (imageData) {
          // Handle both array and single object responses
          const image = Array.isArray(imageData) ? imageData[0] : imageData
          if (image && image.id) {
            imageMap.set(image.id, image)
          }
        }
      })

      mediaFiles.value = Array.from(imageMap.values())
    }

    // If no images found, show a message
    if (mediaFiles.value.length === 0) {
      ElMessage.info('Aucune image trouvée. Uploadez une image d\'abord.')
    }
  } catch (error) {
    ElMessage.error('Erreur lors du chargement de la bibliothèque')
    console.error('Failed to fetch media library:', error)
  } finally {
    mediaLibraryLoading.value = false
  }
}

const getMediaThumbnail = (media) => {
  if (!media) return ''
  // Handle both Strapi v4 upload API format and nested data format
  const formats = media.formats || media.attributes?.formats
  const url = formats?.thumbnail?.url || formats?.small?.url || media.url || media.attributes?.url
  return url ? `${strapiUrl}${url}` : ''
}

const getMediaFullUrl = (media) => {
  if (!media) return ''
  // Handle both Strapi v4 upload API format and nested data format
  const url = media.url || media.attributes?.url
  return url ? `${strapiUrl}${url}` : ''
}

const selectMediaFromLibrary = () => {
  const selectedMedia = mediaFiles.value.find(m => m.id === selectedMediaId.value)
  if (selectedMedia) {
    formData.value.imageId = selectedMedia.id
    formData.value.imagePreview = getMediaFullUrl(selectedMedia)
    ElMessage.success('Image sélectionnée')
  }
  mediaLibraryVisible.value = false
}

// Generate slug from name with timestamp suffix
const generateSlug = (name) => {
  const timestamp = Date.now()
  const baseSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  return `${baseSlug}-${timestamp}`
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    saving.value = true
    try {
      const productData = {
        name: formData.value.name,
        description: formData.value.description,
        price: formData.value.price,
        categories: formData.value.categories,
        isBestSeller: formData.value.isBestSeller,
        isAvailable: formData.value.isAvailable,
        slug: generateSlug(formData.value.name)
      }

      // Add image if uploaded
      if (formData.value.imageId) {
        productData.image = formData.value.imageId
      }

      if (isEditing.value) {
        await strapiService.products.update(editingId.value, productData)
        ElMessage.success('Produit modifié avec succès')
      } else {
        await strapiService.products.create(productData)
        ElMessage.success('Produit créé avec succès')
      }
      dialogVisible.value = false
      await fetchProducts()
    } catch (error) {
      ElMessage.error(isEditing.value ? 'Erreur lors de la modification' : 'Erreur lors de la création')
      console.error('Failed to save product:', error)
    } finally {
      saving.value = false
    }
  })
}

const handleDelete = async (product) => {
  try {
    await ElMessageBox.confirm(
      `Voulez-vous vraiment supprimer "${product.attributes.name}" ?`,
      'Confirmation',
      {
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    )

    await strapiService.products.delete(product.id)
    ElMessage.success('Produit supprimé avec succès')
    await fetchProducts()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Erreur lors de la suppression')
      console.error('Failed to delete product:', error)
    }
  }
}

const handleSizeChange = () => {
  fetchProducts()
}

const handleCurrentChange = () => {
  fetchProducts()
}

onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchCategories()
  ])
})
</script>

<style scoped>
.upload-placeholder {
  width: 128px;
  height: 128px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-placeholder:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

:deep(.image-uploader .el-upload) {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

:deep(.image-uploader .el-upload:hover) {
  opacity: 0.8;
}
</style>
