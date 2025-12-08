import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { getEnv } from '@/utils/env'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('admin_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role?.type === 'admin' || user.value?.role?.type === 'authenticated')
  const userName = computed(() => {
    if (!user.value) return ''
    return user.value.username || user.value.email || 'User'
  })

  // Actions
  async function login(identifier, password) {
    loading.value = true
    error.value = null

    try {
      // Get Strapi URL and remove trailing slash if present
      let strapiUrl = getEnv('VITE_STRAPI_URL') || 'http://localhost:1337'
      strapiUrl = strapiUrl.replace(/\/$/, '')

      console.log('Login attempt to:', `${strapiUrl}/api/auth/local`)
      console.log('Credentials:', { identifier, passwordLength: password.length })

      const response = await axios.post(`${strapiUrl}/api/auth/local`, {
        identifier,
        password
      })

      console.log('Login response:', response.data)

      const { jwt, user: userData } = response.data

      // Set token first for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

      // Fetch user with role information
      let userWithRole = userData
      try {
        const userResponse = await axios.get(`${strapiUrl}/api/users/me`, {
          params: { populate: 'role' }
        })
        userWithRole = userResponse.data
        console.log('User data with role:', userWithRole)
      } catch (roleErr) {
        console.warn('Could not fetch role, using basic user data:', roleErr)
      }

      // Log user role for debugging
      console.log('User role:', userWithRole.role)

      // Check if user has appropriate role
      if (userWithRole.role) {
        const roleType = userWithRole.role.type || userWithRole.role.name?.toLowerCase()
        console.log('Role type:', roleType)

        if (roleType !== 'admin' && roleType !== 'authenticated') {
          throw new Error('Accès refusé. Vous devez avoir des privilèges administrateur.')
        }
      } else {
        // No role information - allow by default (for development)
        console.warn('No role information available, allowing access')
      }

      // Store token and user
      token.value = jwt
      user.value = userWithRole
      localStorage.setItem('admin_token', jwt)

      return { success: true }
    } catch (err) {
      console.error('Login error:', err)
      console.error('Error response:', err.response?.data)

      // Better error messages
      let errorMessage = 'Erreur de connexion'

      if (err.response?.data?.error) {
        const strapiError = err.response.data.error
        if (strapiError.message) {
          errorMessage = strapiError.message
        }
        // Check for specific error types
        if (strapiError.message?.includes('Invalid identifier or password')) {
          errorMessage = 'Email/nom d\'utilisateur ou mot de passe incorrect'
        }
      } else if (err.message) {
        errorMessage = err.message
      }

      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('admin_token')
    delete axios.defaults.headers.common['Authorization']
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem('admin_token')
    if (!storedToken) {
      return false
    }

    try {
      // Get Strapi URL and remove trailing slash if present
      let strapiUrl = getEnv('VITE_STRAPI_URL') || 'http://localhost:1337'
      strapiUrl = strapiUrl.replace(/\/$/, '')

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`

      const response = await axios.get(`${strapiUrl}/api/users/me`, {
        params: {
          populate: 'role'
        }
      })

      user.value = response.data
      token.value = storedToken

      return true
    } catch (err) {
      console.error('Auth check failed:', err)
      await logout()
      return false
    }
  }

  // Initialize auth on store creation
  async function initialize() {
    const storedToken = localStorage.getItem('admin_token')
    if (storedToken) {
      await checkAuth()
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    userName,

    // Actions
    login,
    logout,
    checkAuth,
    initialize
  }
})
