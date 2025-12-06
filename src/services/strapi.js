import { Strapi } from '@strapi/sdk-plugin'

/**
 * Strapi API Configuration
 */
const config = {
  url: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
  apiToken: import.meta.env.VITE_STRAPI_API_TOKEN || ''
}

/**
 * Initialize Strapi SDK instance
 */
const strapi = new Strapi({
  url: config.url,
  apiToken: config.apiToken,
  axios: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
})

/**
 * Strapi API Service
 * Provides methods to interact with Strapi backend
 */
export const strapiService = {
  /**
   * Get the Strapi instance
   * @returns {Strapi} Strapi instance
   */
  getInstance() {
    return strapi
  },

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
      return strapi.find('products', params)
    },

    /**
     * Get a single product by ID
     * @param {String|Number} id - Product ID
     * @param {Object} params - Query parameters (populate)
     * @returns {Promise} Product data
     */
    async findOne(id, params = {}) {
      return strapi.findOne('products', id, params)
    },

    /**
     * Get products by category
     * @param {String|Number} categoryId - Category ID
     * @param {Object} params - Additional query parameters
     * @returns {Promise} Products data
     */
    async findByCategory(categoryId, params = {}) {
      return strapi.find('products', {
        filters: {
          category: {
            id: {
              $eq: categoryId
            }
          }
        },
        ...params
      })
    },

    /**
     * Get products by type
     * @param {String} type - Product type (pizza, drink, dessert, side)
     * @param {Object} params - Additional query parameters
     * @returns {Promise} Products data
     */
    async findByType(type, params = {}) {
      return strapi.find('products', {
        filters: {
          type: {
            $eq: type
          }
        },
        ...params
      })
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
      return strapi.find('categories', params)
    },

    /**
     * Get a single category by ID
     * @param {String|Number} id - Category ID
     * @param {Object} params - Query parameters
     * @returns {Promise} Category data
     */
    async findOne(id, params = {}) {
      return strapi.findOne('categories', id, params)
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
      return strapi.create('orders', { data })
    },

    /**
     * Get user orders
     * @param {Object} params - Query parameters
     * @returns {Promise} Orders data
     */
    async find(params = {}) {
      return strapi.find('orders', params)
    },

    /**
     * Get a single order by ID
     * @param {String|Number} id - Order ID
     * @param {Object} params - Query parameters
     * @returns {Promise} Order data
     */
    async findOne(id, params = {}) {
      return strapi.findOne('orders', id, params)
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
      return strapi.find('payment-methods', {
        filters: {
          isEnabled: {
            $eq: true
          }
        },
        sort: ['order:asc'],
        ...params
      })
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
      return strapi.find('restaurant-settings', params)
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
      return strapi.find('loyalty-programs', {
        filters: {
          user: {
            id: {
              $eq: userId
            }
          }
        },
        ...params
      })
    }
  }
}

export default strapiService
