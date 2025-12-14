<template>
  <div>
    <AppTopbar />
    <AppHeader />

    <!-- Product Detail Section -->
    <main class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Back Button -->
        <button
          @click="$router.back()"
          class="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Retour
        </button>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p class="mt-4 text-gray-600">Chargement...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-600 text-xl">{{ error }}</p>
        </div>

        <!-- Product Content -->
        <div v-else-if="product" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Product Image -->
            <div class="p-8">
              <img
                v-if="productImage"
                :src="productImage"
                :alt="product.attributes.name"
                class="w-full h-96 object-cover rounded-lg"
              />
              <div v-else class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- Product Info & Options -->
            <div class="p-8">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.attributes.name }}</h1>

              <!-- Categories -->
              <div v-if="product.attributes.categories?.data?.length" class="flex gap-2 mb-4">
                <span
                  v-for="category in product.attributes.categories.data"
                  :key="category.id"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {{ category.attributes.name }}
                </span>
              </div>

              <p class="text-gray-600 mb-6">{{ product.attributes.description }}</p>

              <div class="text-3xl font-bold text-red-600 mb-8">
                {{ totalPrice.toLocaleString() }} FCFA
              </div>

              <!-- Option Groups -->
              <div v-if="product.attributes.optionGroups?.length" class="space-y-6 mb-8">
                <div
                  v-for="(group, groupIndex) in product.attributes.optionGroups"
                  :key="groupIndex"
                  class="border-t pt-6"
                >
                  <h3 class="text-lg font-semibold mb-3">
                    {{ group.name }}
                    <span v-if="group.isRequired" class="text-red-600 text-sm">*</span>
                    <span v-if="group.maxSelections === 1" class="text-gray-500 text-sm font-normal ml-2">
                      (Choisissez-en un)
                    </span>
                    <span v-else-if="group.maxSelections > 0" class="text-gray-500 text-sm font-normal ml-2">
                      (Max {{ group.maxSelections }})
                    </span>
                  </h3>

                  <div class="space-y-2">
                    <label
                      v-for="(option, optionIndex) in (group.options || []).filter(opt => opt.isAvailable)"
                      :key="optionIndex"
                      class="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      :class="{
                        'border-red-600 bg-red-50': isOptionSelected(groupIndex, optionIndex),
                        'opacity-50 cursor-not-allowed': !canSelectOption(groupIndex)
                      }"
                    >
                      <div class="flex items-center flex-1">
                        <input
                          v-if="group.maxSelections === 1"
                          type="radio"
                          :name="`group-${groupIndex}`"
                          :value="optionIndex"
                          v-model="selectedOptions[groupIndex]"
                          class="mr-3 text-red-600 focus:ring-red-600"
                          :disabled="!canSelectOption(groupIndex)"
                        />
                        <input
                          v-else
                          type="checkbox"
                          :checked="isOptionSelected(groupIndex, optionIndex)"
                          @change="toggleOption(groupIndex, optionIndex)"
                          class="mr-3 text-red-600 focus:ring-red-600 rounded"
                          :disabled="!canSelectOption(groupIndex) && !isOptionSelected(groupIndex, optionIndex)"
                        />
                        <span class="text-gray-900">{{ option.name }}</span>
                      </div>
                      <span v-if="option.price > 0" class="text-gray-600 font-medium">
                        +{{ option.price.toLocaleString() }} FCFA
                      </span>
                      <span v-else class="text-green-600 text-sm">Gratuit</span>
                    </label>
                  </div>

                  <!-- Validation Error -->
                  <p v-if="validationErrors[groupIndex]" class="text-red-600 text-sm mt-2">
                    {{ validationErrors[groupIndex] }}
                  </p>
                </div>
              </div>

              <!-- Quantity Selector -->
              <div class="flex items-center gap-4 mb-8">
                <label class="text-gray-700 font-medium">Quantité:</label>
                <div class="flex items-center border rounded-lg">
                  <button
                    @click="decrementQuantity"
                    class="px-4 py-2 hover:bg-gray-100 transition-colors"
                    :disabled="quantity <= 1"
                  >
                    -
                  </button>
                  <span class="px-6 py-2 border-x">{{ quantity }}</span>
                  <button
                    @click="incrementQuantity"
                    class="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Add to Cart Button -->
              <button
                @click="addToCart"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Ajouter au panier - {{ totalPrice.toLocaleString() }} FCFA
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import strapiService from '@/services/strapi'
import { getEnv } from '@/utils/env'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const error = ref(null)
const quantity = ref(1)
const selectedOptions = ref([])
const validationErrors = ref([])

const productImage = computed(() => {
  if (!product.value) return null
  const imageData = product.value.attributes.image?.data
  if (!imageData) return null

  const image = Array.isArray(imageData) ? imageData[0] : imageData
  if (image && image.attributes && image.attributes.url) {
    const imageUrl = image.attributes.url
    const strapiUrl = getEnv('VITE_STRAPI_URL', 'http://localhost:1337').replace(/\/$/, '')
    return imageUrl.startsWith('http') ? imageUrl : `${strapiUrl}${imageUrl}`
  }
  return null
})

const totalPrice = computed(() => {
  if (!product.value) return 0

  let price = product.value.attributes.price

  // Add option prices
  if (product.value.attributes.optionGroups) {
    product.value.attributes.optionGroups.forEach((group, groupIndex) => {
      const selected = selectedOptions.value[groupIndex]

      if (group.maxSelections === 1 && selected !== undefined) {
        // Single selection (radio)
        const option = group.options?.[selected]
        if (option) {
          price += option.price || 0
        }
      } else if (Array.isArray(selected)) {
        // Multiple selections (checkbox)
        selected.forEach(optionIndex => {
          const option = group.options?.[optionIndex]
          if (option) {
            price += option.price || 0
          }
        })
      }
    })
  }

  return price * quantity.value
})

const isOptionSelected = (groupIndex, optionIndex) => {
  const selected = selectedOptions.value[groupIndex]
  if (Array.isArray(selected)) {
    return selected.includes(optionIndex)
  }
  return selected === optionIndex
}

const canSelectOption = (groupIndex) => {
  const group = product.value.attributes.optionGroups[groupIndex]
  if (group.maxSelections === 0 || group.maxSelections === 1) return true

  const selected = selectedOptions.value[groupIndex]
  if (!Array.isArray(selected)) return true

  return selected.length < group.maxSelections
}

const toggleOption = (groupIndex, optionIndex) => {
  if (!Array.isArray(selectedOptions.value[groupIndex])) {
    selectedOptions.value[groupIndex] = []
  }

  const index = selectedOptions.value[groupIndex].indexOf(optionIndex)
  if (index > -1) {
    selectedOptions.value[groupIndex].splice(index, 1)
  } else {
    if (canSelectOption(groupIndex)) {
      selectedOptions.value[groupIndex].push(optionIndex)
    }
  }
}

const validateOptions = () => {
  validationErrors.value = []
  let isValid = true

  if (!product.value.attributes.optionGroups) return true

  product.value.attributes.optionGroups.forEach((group, groupIndex) => {
    const selected = selectedOptions.value[groupIndex]
    const selectedCount = Array.isArray(selected) ? selected.length : (selected !== undefined ? 1 : 0)

    if (group.isRequired && selectedCount === 0) {
      validationErrors.value[groupIndex] = 'Cette option est requise'
      isValid = false
    } else if (group.minSelections > 0 && selectedCount < group.minSelections) {
      validationErrors.value[groupIndex] = `Veuillez sélectionner au moins ${group.minSelections} option(s)`
      isValid = false
    } else {
      validationErrors.value[groupIndex] = null
    }
  })

  return isValid
}

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  // Pass the full product to the cart store
  cartStore.addItem({
    id: product.value.id,
    name: product.value.attributes.name,
    price: product.value.attributes.price,
    image: productImage.value,
    optionGroups: product.value.attributes.optionGroups || []
  })
}

const fetchProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await strapiService.products.findOne(route.params.id, {
      populate: {
        image: true,
        categories: true,
        optionGroups: {
          populate: ['options']
        }
      }
    })

    product.value = response.data

    // Initialize selectedOptions array
    if (product.value.attributes.optionGroups) {
      selectedOptions.value = product.value.attributes.optionGroups.map(group =>
        group.maxSelections === 1 ? undefined : []
      )
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement du produit'
    console.error('Failed to fetch product:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>
