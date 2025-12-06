import axios from 'axios'
import qs from 'qs'

/**
 * Strapi API Configuration
 */
const config = {
  url: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
  apiToken: import.meta.env.VITE_STRAPI_API_TOKEN || ''
}

/**
 * Create axios instance for Strapi API
 */
const api = axios.create({
  baseURL: `${config.url}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(config.apiToken && { Authorization: `Bearer ${config.apiToken}` })
  }
})

/**
 * Build query string from parameters
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return ''

  return `?${qs.stringify(params, { encodeValuesOnly: true })}`
}

/**
 * Strapi API Service
 * Provides methods to interact with Strapi backend
 */
export const strapiService = {
  /**
   * Get configuration
   * @returns {Object} Configuration object
   */
  getConfig() {
    return config
  },

  // Products API
  products: {
    /**
     * Get all products
     * @param {Object} params - Query parameters (filters, sort, pagination, populate)
     * @returns {Promise} Products data
     */
    async find(params = {}) {
      const queryString = buildQueryString(params)
      const response = await api.get(`/products${queryString}`)
      return response.data
    },

    /**
     * Get a single product by ID
     * @param {String|Number} id - Product ID
     * @param {Object} params - Query parameters (populate)
     * @returns {Promise} Product data
     */
    async findOne(id, params = {}) {
      const queryString = buildQueryString(params)
      const response = await api.get(`/products/${id}${queryString}`)
      return response.data
    },

    /**
     * Get products by category
     * @param {String|Number} categoryId - Category ID
     * @param {Object} params - Additional query parameters
     * @returns {Promise} Products data
     */
    async findByCategory(categoryId, params = {}) {
      const mergedParams = {
        filters: {
          categories: {
            id: {
              $eq: categoryId
            }
          }
        },
        ...params
      }
      return this.find(mergedParams)
    },

    /**
     * Get products by type
     * @param {String} type - Product type (pizza, drink, dessert, side)
     * @param {Object} params - Additional query parameters
     * @returns {Promise} Products data
     */
    async findByType(type, params = {}) {
      const mergedParams = {
        filters: {
          type: {
            $eq: type
          }
        },
        ...params
      }
      return this.find(mergedParams)
    }
  },

  // Categories API
  categories: {
    /**
     * Get all categories
     * @param {Object} params - Query parameters
     * @returns {Promise} Categories data
     */
    async find(params = {}) {
      const queryString = buildQueryString(params)
      const response = await api.get(`/categories${queryString}`)
      return response.data
    },

    /**
     * Get a single category by ID
     * @param {String|Number} id - Category ID
     * @param {Object} params - Query parameters
     * @returns {Promise} Category data
     */
    async findOne(id, params = {}) {
      const queryString = buildQueryString(params)
      const response = await api.get(`/categories/${id}${queryString}`)
      return response.data
    }
  },

  // Orders API
  orders: {
    /**
     * Create a new order
     * @param {Object} data - Order data
     * @returns {Promise} Created order
     */
    async create(data) {
      const response = await api.post('/orders', { data })
      return response.data
    },

    /**
     * Get user orders
     * @param {Object} params - Query parameters
     * @returns {Promise} Orders data
     */
    async find(params = {}) {
      const queryString = buildQueryString(params)
      const response = await api.get(`/orders${queryString}`)
      return response.data
    },

    /**
     * Get a single order by ID
     * @param {String|Number} id - Order ID
     * @param {Object} params - Query parameters
     * @returns {Promise} Order data
     */
    async findOne(id, params = {}) {
      const queryString = buildQueryString(params)
      const response = await api.get(`/orders/${id}${queryString}`)
      return response.data
    }
  },

  // Payment Methods API
  paymentMethods: {
    /**
     * Get all payment methods
     * @param {Object} params - Query parameters
     * @returns {Promise} Payment methods data
     */
    async find(params = {}) {
      const mergedParams = {
        filters: {
          isEnabled: {
            $eq: true
          }
        },
        sort: ['order:asc'],
        ...params
      }
      const queryString = buildQueryString(mergedParams)
      const response = await api.get(`/payment-methods${queryString}`)
      return response.data
    }
  },

  // Restaurant Settings API
  settings: {
    /**
     * Get restaurant settings
     * @param {Object} params - Query parameters
     * @returns {Promise} Settings data
     */
    async get(params = {}) {
      const queryString = buildQueryString(params)
      const response = await api.get(`/restaurant-settings${queryString}`)
      return response.data
    }
  },

  // Loyalty Program API
  loyalty: {
    /**
     * Get user loyalty program data
     * @param {String|Number} userId - User ID
     * @param {Object} params - Query parameters
     * @returns {Promise} Loyalty program data
     */
    async get(userId, params = {}) {
      const mergedParams = {
        filters: {
          user: {
            id: {
              $eq: userId
            }
          }
        },
        ...params
      }
      const queryString = buildQueryString(mergedParams)
      const response = await api.get(`/loyalty-programs${queryString}`)
      return response.data
    }
  }
}

export default strapiService
