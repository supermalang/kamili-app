<template>
  <div class="py-12" style="background-color: #3C3C3C;">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-center text-white uppercase mb-8" style="font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 20px; line-height: 54px; letter-spacing: 0;">
        Nos Best-Sellers
      </h2>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-white py-8">
        Chargement...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-400 py-8">
        Erreur: {{ error }}
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ProductCard
          v-for="product in bestSellers"
          :key="product.id"
          :id="product.id"
          :name="product.attributes.name"
          :price="product.attributes.price"
          :type="product.attributes.type"
          :image="getProductImage(product)"
        />
      </div>

      <!-- View All Button -->
      <div class="text-center">
        <RouterLink
          to="/menu"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded inline-flex items-center gap-2 transition-colors"
        >
          <span>Voir toute la carte</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import ProductCard from './ProductCard.vue'
import { useProducts } from '@/composables/useStrapi'
import { getEnv } from '@/utils/env'

const { products, loading, error, fetchProducts } = useProducts()

const bestSellers = computed(() => {
  // Get the products array - handle both {data: [...]} and [...] structures
  const productsArray = Array.isArray(products.value) ? products.value : products.value?.data

  if (!productsArray) return []

  const filtered = productsArray.filter(product => product.attributes.isBestSeller)
  return filtered.slice(0, 4)
})

const getProductImage = (product) => {
  const imageData = product.attributes.image?.data
  if (!imageData) return null

  // Handle both single object and array responses
  const image = Array.isArray(imageData) ? imageData[0] : imageData

  if (image && image.attributes && image.attributes.url) {
    const imageUrl = image.attributes.url
    const strapiUrl = getEnv('VITE_STRAPI_URL', 'http://localhost:1337').replace(/\/$/, '')
    return imageUrl.startsWith('http') ? imageUrl : `${strapiUrl}${imageUrl}`
  }
  return null
}

onMounted(async () => {
  try {
    await fetchProducts({
      filters: {
        isBestSeller: {
          $eq: true
        }
      },
      pagination: {
        limit: 4
      }
    })
  } catch (err) {
    console.error('Failed to fetch best sellers:', err)
  }
})
</script>

<style scoped>
</style>
