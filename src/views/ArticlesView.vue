<template>
  <div>
    <AppTopbar />
    <AppHeader />

    <!-- Category Tabs -->
    <section class="bg-white border-b border-gray-200 sticky top-0 z-10 py-4">
      <div class="px-4 md:px-[10%]">
        <div class="flex gap-2 overflow-x-auto category-tabs md:justify-center">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectCategory(cat.id)"
            :class="[
              'category-tab px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap transition-all duration-300',
              selectedCategory === cat.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 shadow-sm hover:border-red-600 hover:shadow-md hover:-translate-y-0.5'
            ]"
          >
            <img
              v-if="getCategoryImage(cat)"
              :src="getCategoryImage(cat)"
              :alt="cat.attributes.name"
              class="w-5 h-5 md:w-6 md:h-6 object-contain"
            />
            <span class="font-medium text-sm md:text-base">{{ cat.attributes.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <main class="bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p class="mt-4 text-gray-600">Chargement des produits...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <p class="text-red-600 text-xl">{{ error }}</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="products.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <!-- Product Image -->
            <div class="relative aspect-square bg-gray-100">
              <img
                v-if="getProductImage(product)"
                :src="getProductImage(product)"
                :alt="product.attributes.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-20 h-20 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
                </svg>
              </div>

              <!-- Availability badge -->
              <div
                v-if="!product.attributes.is_enabled"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              >
                <span class="bg-white text-gray-800 px-4 py-2 rounded font-semibold">
                  Indisponible
                </span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <h3 class="product-name mb-2">{{ product.attributes.name }}</h3>
              <p class="product-description text-sm text-gray-600 mb-3 line-clamp-2">
                {{ product.attributes.description || 'Tomate, fromage, viande hachée' }}
              </p>
              <p class="product-price mb-4">{{ formatPrice(product.attributes.price) }}</p>

              <!-- Available product - show quantity controls or add button -->
              <div v-if="product.attributes.is_enabled">
                <!-- Show add button if not in cart -->
                <button
                  v-if="getProductQuantity(product.id) === 0"
                  @click="addToCart(product)"
                  class="add-to-cart-btn w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <span>+</span>
                  <span>Ajouter</span>
                </button>

                <!-- Show quantity controls if in cart -->
                <div
                  v-else
                  class="flex items-center justify-between w-full bg-red-600 text-white rounded overflow-hidden"
                >
                  <button
                    @click="decrementQuantity(product.id)"
                    class="px-4 py-2 hover:bg-red-700 transition-colors flex-shrink-0"
                  >
                    <span class="text-xl font-semibold">−</span>
                  </button>
                  <span class="px-4 py-2 font-semibold">{{ getProductQuantity(product.id) }}</span>
                  <button
                    @click="incrementQuantity(product.id)"
                    class="px-4 py-2 hover:bg-red-700 transition-colors flex-shrink-0"
                  >
                    <span class="text-xl font-semibold">+</span>
                  </button>
                </div>
              </div>

              <!-- Unavailable product -->
              <button
                v-else
                disabled
                class="w-full bg-gray-300 text-gray-500 font-semibold py-2 rounded cursor-not-allowed"
              >
                Indisponible
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <svg class="w-32 h-32 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="text-2xl font-semibold text-gray-600 mb-2">Aucun produit trouvé</p>
          <p class="text-gray-500">Essayez une autre catégorie</p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useCategories, useProducts } from '@/composables/useStrapi'
import { useCart } from '@/composables/useCart'
import { getStrapiAssetUrl } from '@/utils/env'

const route = useRoute()
const router = useRouter()

const { categories, loading: categoriesLoading, fetchCategories } = useCategories()
const { products, loading: productsLoading, fetchProductsByCategory, fetchProducts } = useProducts()
const { addToCart: addToCartComposable, incrementQuantity, decrementQuantity, cartItems, formatPrice } = useCart()

const selectedCategory = ref(null)
const loading = ref(false)
const error = ref(null)

// Get quantity of a product in cart
const getProductQuantity = (productId) => {
  const cartItem = cartItems.value.find(item => item.id === productId)
  return cartItem ? cartItem.quantity : 0
}

onMounted(async () => {
  // Fetch categories
  await fetchCategories({
    populate: ['image']
  })

  // Get category from URL or select first category
  const categoryParam = route.query.category
  if (categoryParam) {
    // Check if it's a number (ID) or a string (slug)
    if (isNaN(categoryParam)) {
      // It's a slug, find the category by slug
      const foundCategory = categories.value.find(cat =>
        cat.attributes.name.toLowerCase().replace(/\s+/g, '-') === categoryParam ||
        cat.attributes.slug === categoryParam
      )
      if (foundCategory) {
        selectedCategory.value = foundCategory.id
      }
    } else {
      selectedCategory.value = parseInt(categoryParam)
    }
  }

  if (!selectedCategory.value && categories.value.length > 0) {
    selectedCategory.value = categories.value[0].id
  }

  // Fetch products for selected category
  if (selectedCategory.value) {
    await loadProducts()
  }
})

// Watch for category changes
watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    // Check if it's a number (ID) or a string (slug)
    if (isNaN(newCategory)) {
      // It's a slug, find the category by slug
      const foundCategory = categories.value.find(cat =>
        cat.attributes.name.toLowerCase().replace(/\s+/g, '-') === newCategory ||
        cat.attributes.slug === newCategory
      )
      if (foundCategory) {
        selectedCategory.value = foundCategory.id
      }
    } else {
      selectedCategory.value = parseInt(newCategory)
    }
    loadProducts()
  }
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  router.push({ path: '/articles', query: { category: categoryId } })
}

const loadProducts = async () => {
  loading.value = true
  error.value = null

  try {
    if (selectedCategory.value) {
      await fetchProductsByCategory(selectedCategory.value, {
        populate: ['image', 'categories']
      })
    } else {
      await fetchProducts({
        populate: ['image', 'categories']
      })
    }
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des produits'
  } finally {
    loading.value = false
  }
}

const getCategoryImage = (category) => {
  const image = category.attributes?.image
  if (!image?.data) return null

  const imageUrl = image.data.attributes.url
  return getStrapiAssetUrl(imageUrl)
}

const getProductImage = (product) => {
  const image = product.attributes?.image
  if (!image?.data || image.data.length === 0) return null

  // Image data is an array, get the first image
  const imageUrl = image.data[0].attributes.url
  return getStrapiAssetUrl(imageUrl)
}

const addToCart = (product) => {
  addToCartComposable({
    id: product.id,
    name: product.attributes.name,
    price: product.attributes.price,
    type: product.attributes.type,
    image: getProductImage(product)
  })
}
</script>

<style scoped>
.category-tabs {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.category-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.category-tab {
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-name {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
}

.product-description {
  font-family: 'Outfit', sans-serif;
}

.product-price {
  font-family: 'Oswald', sans-serif;
  font-weight: 300;
  font-size: 1.25rem;
  color: #1f2937;
}

.add-to-cart-btn {
  font-family: 'Outfit', sans-serif;
  height: 40px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
