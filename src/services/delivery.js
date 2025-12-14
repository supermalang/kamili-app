import axios from 'axios'
import { getEnv } from '@/utils/env'

// Create axios instance for delivery API
const api = axios.create({
  baseURL: `${getEnv('VITE_STRAPI_URL', 'http://localhost:1337').replace(/\/$/, '')}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const deliveryService = {
  // Location services
  cities: {
    find: (params = {}) => api.get('/cities', { params }),
    findOne: (id, params = {}) => api.get(`/cities/${id}`, { params }),
    create: (data) => api.post('/cities', { data }),
    update: (id, data) => api.put(`/cities/${id}`, { data }),
    delete: (id) => api.delete(`/cities/${id}`)
  },

  departments: {
    find: (params = {}) => api.get('/departments', { params }),
    findOne: (id, params = {}) => api.get(`/departments/${id}`, { params }),
    findByCity: (cityId, params = {}) =>
      api.get('/departments', {
        params: {
          ...params,
          filters: { city: { id: { $eq: cityId } } }
        }
      }),
    create: (data) => api.post('/departments', { data }),
    update: (id, data) => api.put(`/departments/${id}`, { data }),
    delete: (id) => api.delete(`/departments/${id}`)
  },

  districts: {
    find: (params = {}) => api.get('/districts', { params }),
    findOne: (id, params = {}) => api.get(`/districts/${id}`, { params }),
    findByDepartment: (departmentId, params = {}) =>
      api.get('/districts', {
        params: {
          ...params,
          filters: { department: { id: { $eq: departmentId } } }
        }
      }),
    create: (data) => api.post('/districts', { data }),
    update: (id, data) => api.put(`/districts/${id}`, { data }),
    delete: (id) => api.delete(`/districts/${id}`)
  },

  // Delivery options
  options: {
    find: (params = {}) => api.get('/delivery-options', { params }),
    findOne: (id, params = {}) => api.get(`/delivery-options/${id}`, { params }),
    create: (data) => api.post('/delivery-options', { data }),
    update: (id, data) => api.put(`/delivery-options/${id}`, { data }),
    delete: (id) => api.delete(`/delivery-options/${id}`)
  },

  // Pricing
  pricing: {
    find: (params = {}) => api.get('/delivery-pricings', { params }),
    findOne: (id, params = {}) => api.get(`/delivery-pricings/${id}`, { params }),
    create: (data) => api.post('/delivery-pricings', { data }),
    update: (id, data) => api.put(`/delivery-pricings/${id}`, { data }),
    delete: (id) => api.delete(`/delivery-pricings/${id}`),
    calculate: async (locationData, deliveryOptionId, subtotal) => {
      // Calculate delivery price based on location and option
      try {
        const response = await api.post('/delivery-pricings/calculate', {
          cityId: locationData.cityId,
          departmentId: locationData.departmentId,
          districtId: locationData.districtId,
          deliveryOptionId,
          subtotal
        })
        return response.data
      } catch (error) {
        console.error('Failed to calculate delivery price:', error)
        return { price: 1000, appliedPromotion: null }
      }
    }
  },

  // Promotions
  promotions: {
    find: (params = {}) => api.get('/delivery-promotions', { params }),
    findOne: (id, params = {}) => api.get(`/delivery-promotions/${id}`, { params }),
    create: (data) => api.post('/delivery-promotions', { data }),
    update: (id, data) => api.put(`/delivery-promotions/${id}`, { data }),
    delete: (id) => api.delete(`/delivery-promotions/${id}`),
    findActive: async (locationData, deliveryOptionId, subtotal) => {
      try {
        const response = await api.post('/delivery-promotions/check', {
          cityId: locationData.cityId,
          departmentId: locationData.departmentId,
          districtId: locationData.districtId,
          deliveryOptionId,
          subtotal
        })
        return response.data
      } catch (error) {
        console.error('Failed to check promotions:', error)
        return null
      }
    }
  },

  // User addresses
  addresses: {
    find: (params = {}) => api.get('/user-addresses', { params }),
    findOne: (id, params = {}) => api.get(`/user-addresses/${id}`, { params }),
    create: (data) => api.post('/user-addresses', { data }),
    update: (id, data) => api.put(`/user-addresses/${id}`, { data }),
    delete: (id) => api.delete(`/user-addresses/${id}`),
    setDefault: async (id) => {
      try {
        const response = await api.put(`/user-addresses/${id}/set-default`)
        return response.data
      } catch (error) {
        console.error('Failed to set default address:', error)
        throw error
      }
    }
  },

  // Orders
  orders: {
    find: (params = {}) => api.get('/orders', { params }),
    findOne: (id, params = {}) => api.get(`/orders/${id}`, { params }),
    create: (data) => api.post('/orders', { data }),
    updateStatus: (id, status, note = '') =>
      api.put(`/orders/${id}/status`, { status, note }),
    addFeedback: (id, feedback, rating) =>
      api.put(`/orders/${id}/feedback`, { feedback, rating })
  }
}

export default deliveryService
