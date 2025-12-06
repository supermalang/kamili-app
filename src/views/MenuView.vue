<template>
  <div>
    <AppTopbar />
    <AppHeader />

    <!-- Hero Section -->
    <section class="relative bg-gray-900 text-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Notre Menu</h1>
          <p class="text-xl opacity-90">Découvrez nos délicieux plats</p>
        </div>
      </div>
      <!-- Decorative elements -->
      <div class="absolute top-10 right-10 w-24 h-24 bg-red-600 rounded-full opacity-20"></div>
      <div class="absolute bottom-10 left-10 w-32 h-32 bg-red-600 rounded-full opacity-20"></div>
    </section>

    <!-- Categories Grid -->
    <main class="bg-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p class="mt-4 text-gray-600">Chargement du menu...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-600 text-xl">{{ error }}</p>
        </div>

        <!-- Categories Grid -->
        <div v-else>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <RouterLink
              v-for="category in paginatedCategories"
              :key="category.id"
              :to="`/articles?category=${category.id}`"
              class="category-card bg-white border-2 border-dashed border-gray-300 hover:border-red-600 rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-300 aspect-square"
            >
              <div class="category-image-container mb-4">
                <img
                  v-if="getCategoryImage(category)"
                  :src="getCategoryImage(category)"
                  :alt="category.attributes.name"
                  class="w-full h-full object-contain"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-20 h-20 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
              </div>
              <h3 class="category-title text-center">{{ category.attributes.name }}</h3>
            </RouterLink>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-4 py-2 rounded border',
                currentPage === page
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useCategories } from '@/composables/useStrapi'

const { categories, loading, error, fetchCategories } = useCategories()

const strapiUrl = import.meta.env.VITE_STRAPI_URL
const currentPage = ref(1)
const itemsPerPage = 8

onMounted(async () => {
  await fetchCategories({
    populate: ['image']
  })
})

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(categories.value.length / itemsPerPage)
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return categories.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getCategoryImage = (category) => {
  const image = category.attributes?.image
  if (!image?.data) return null

  const imageUrl = image.data.attributes.url
  // Check if URL is already absolute
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  // Otherwise, prepend Strapi URL
  return `${strapiUrl}${imageUrl}`
}
</script>

<style scoped>
.category-card {
  cursor: pointer;
  text-decoration: none;
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.category-image-container {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.category-title {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

@media (min-width: 768px) {
  .category-image-container {
    width: 150px;
    height: 150px;
  }

  .category-title {
    font-size: 1.75rem;
  }
}

/* Hover effects */
.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.category-card:hover .category-title {
  color: #dc2626;
}

.category-card:hover .category-image-container {
  transform: scale(1.05);
}
</style>
