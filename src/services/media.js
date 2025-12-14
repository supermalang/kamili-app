import axios from 'axios'
import { getEnv } from '@/utils/env'

// Create axios instance for media uploads
const api = axios.create({
  baseURL: `${getEnv('VITE_STRAPI_URL', 'http://localhost:1337').replace(/\/$/, '')}/api`,
  headers: {
    'Content-Type': 'multipart/form-data'
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

export const mediaService = {
  // Upload file(s)
  upload: async (files) => {
    const formData = new FormData()

    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append('files', file)
      })
    } else {
      formData.append('files', files)
    }

    try {
      const response = await api.post('/upload', formData)
      return response.data
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  },

  // Delete file
  delete: async (id) => {
    try {
      const response = await api.delete(`/upload/files/${id}`)
      return response.data
    } catch (error) {
      console.error('Delete failed:', error)
      throw error
    }
  },

  // Get file info
  findOne: async (id) => {
    try {
      const response = await api.get(`/upload/files/${id}`)
      return response.data
    } catch (error) {
      console.error('Fetch failed:', error)
      throw error
    }
  },

  // Get all files
  find: async (params = {}) => {
    try {
      const response = await api.get('/upload/files', { params })
      return response.data
    } catch (error) {
      console.error('Fetch failed:', error)
      throw error
    }
  }
}

export default mediaService
