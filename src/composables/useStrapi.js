import { ref } from 'vue'
import strapiService from '@/services/strapi'

/**
 * Composable for using Strapi API
 * Provides reactive state and methods for fetching data from Strapi
 */
export function useStrapi() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Execute an API call with loading and error handling
   * @param {Function} apiCall - The API function to execute
   * @returns {Promise} The API response data
   */
  const execute = async (apiCall) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiCall()
      return response.data
    } catch (err) {
      error.value = err.message || 'An error occurred'
      console.error('Strapi API Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    execute,
    strapi: strapiService,
  }
}

/**
 * Composable for fetching products
 */
export function useProducts() {
  const { loading, error, execute, strapi } = useStrapi()
  const products = ref([])
  const product = ref(null)

  /**
   * Fetch all products
   * @param {Object} params - Query parameters
   */
  const fetchProducts = async (params = {}) => {
    const data = await execute(() =>
      strapi.products.find({
        populate: ['categories', 'image'],
        sort: ['createdAt:desc'],
        ...params,
      }),
    )
    products.value = data
    return data
  }

  /**
   * Fetch a single product
   * @param {String|Number} id - Product ID
   */
  const fetchProduct = async (id) => {
    const data = await execute(() =>
      strapi.products.findOne(id, {
        populate: ['categories', 'image'],
      }),
    )
    product.value = data
    return data
  }

  /**
   * Fetch products by category
   * @param {String|Number} categoryId - Category ID
   */
  const fetchProductsByCategory = async (categoryId) => {
    const data = await execute(() =>
      strapi.products.findByCategory(categoryId, {
        populate: ['image'],
      }),
    )
    products.value = data
    return data
  }

  /**
   * Fetch products by type
   * @param {String} type - Product type
   */
  const fetchProductsByType = async (type) => {
    const data = await execute(() =>
      strapi.products.findByType(type, {
        populate: ['categories', 'image'],
      }),
    )
    products.value = data
    return data
  }

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    fetchProductsByCategory,
    fetchProductsByType,
  }
}

/**
 * Composable for fetching categories
 */
export function useCategories() {
  const { loading, error, execute, strapi } = useStrapi()
  const categories = ref([])
  const category = ref(null)

  /**
   * Fetch all categories
   */
  const fetchCategories = async (params = {}) => {
    const data = await execute(() =>
      strapi.categories.find({
        populate: ['products'],
        ...params,
      }),
    )
    categories.value = data
    return data
  }

  /**
   * Fetch a single category
   * @param {String|Number} id - Category ID
   */
  const fetchCategory = async (id) => {
    const data = await execute(() =>
      strapi.categories.findOne(id, {
        populate: ['products'],
      }),
    )
    category.value = data
    return data
  }

  return {
    categories,
    category,
    loading,
    error,
    fetchCategories,
    fetchCategory,
  }
}

/**
 * Composable for managing orders
 */
export function useOrders() {
  const { loading, error, execute, strapi } = useStrapi()
  const orders = ref([])
  const order = ref(null)

  /**
   * Create a new order
   * @param {Object} orderData - Order data
   */
  const createOrder = async (orderData) => {
    const data = await execute(() => strapi.orders.create(orderData))
    order.value = data
    return data
  }

  /**
   * Fetch user orders
   */
  const fetchOrders = async (params = {}) => {
    const data = await execute(() =>
      strapi.orders.find({
        populate: ['items', 'items.product'],
        sort: ['createdAt:desc'],
        ...params,
      }),
    )
    orders.value = data
    return data
  }

  /**
   * Fetch a single order
   * @param {String|Number} id - Order ID
   */
  const fetchOrder = async (id) => {
    const data = await execute(() =>
      strapi.orders.findOne(id, {
        populate: ['items', 'items.product', 'customer'],
      }),
    )
    order.value = data
    return data
  }

  return {
    orders,
    order,
    loading,
    error,
    createOrder,
    fetchOrders,
    fetchOrder,
  }
}

/**
 * Composable for fetching restaurant settings
 */
export function useRestaurantSettings() {
  const { loading, error, execute, strapi } = useStrapi()
  const settings = ref(null)

  /**
   * Fetch restaurant settings
   */
  const fetchSettings = async () => {
    const data = await execute(() =>
      strapi.settings.get({
        populate: ['heroImage', 'heroBackgroundImage', 'address'],
      }),
    )
    settings.value = data
    return data
  }

  return {
    settings,
    loading,
    error,
    fetchSettings,
  }
}

/**
 * Composable for fetching payment methods
 */
export function usePaymentMethods() {
  const { loading, error, execute, strapi } = useStrapi()
  const paymentMethods = ref([])

  /**
   * Fetch payment methods
   */
  const fetchPaymentMethods = async () => {
    const data = await execute(() =>
      strapi.paymentMethods.find({
        populate: ['logo'],
      }),
    )
    paymentMethods.value = data
    return data
  }

  return {
    paymentMethods,
    loading,
    error,
    fetchPaymentMethods,
  }
}
