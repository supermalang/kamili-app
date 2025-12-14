import { ref, computed } from 'vue'
import deliveryService from '@/services/delivery'

export function useDelivery() {
  const cities = ref([])
  const departments = ref([])
  const districts = ref([])
  const deliveryOptions = ref([])
  const userAddresses = ref([])

  const loading = ref(false)
  const error = ref(null)

  // Fetch cities
  const fetchCities = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await deliveryService.cities.find({
        ...params,
        filters: { isActive: { $eq: true } },
        sort: ['name:asc']
      })
      cities.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch cities:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch departments by city
  const fetchDepartmentsByCity = async (cityId, params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await deliveryService.departments.findByCity(cityId, {
        ...params,
        filters: { isActive: { $eq: true } },
        sort: ['name:asc']
      })
      departments.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch departments:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch districts by department
  const fetchDistrictsByDepartment = async (departmentId, params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await deliveryService.districts.findByDepartment(departmentId, {
        ...params,
        filters: { isActive: { $eq: true } },
        sort: ['name:asc']
      })
      districts.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch districts:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch delivery options
  const fetchDeliveryOptions = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await deliveryService.options.find({
        ...params,
        populate: ['icon'],
        sort: ['sortOrder:asc', 'name:asc']
      })
      deliveryOptions.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch delivery options:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch user addresses
  const fetchUserAddresses = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await deliveryService.addresses.find({
        ...params,
        populate: ['city', 'department', 'district'],
        filters: { isActive: { $eq: true } },
        sort: ['isDefault:desc', 'createdAt:desc']
      })
      userAddresses.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch user addresses:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Calculate delivery price
  const calculateDeliveryPrice = async (locationData, deliveryOptionId, subtotal) => {
    try {
      const result = await deliveryService.pricing.calculate(
        locationData,
        deliveryOptionId,
        subtotal
      )
      return result
    } catch (err) {
      console.error('Failed to calculate delivery price:', err)
      return { price: 1000, appliedPromotion: null }
    }
  }

  // Create address
  const createAddress = async (addressData) => {
    loading.value = true
    error.value = null
    try {
      const response = await deliveryService.addresses.create(addressData)
      await fetchUserAddresses()
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to create address:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update address
  const updateAddress = async (id, addressData) => {
    loading.value = true
    error.value = null
    try {
      const response = await deliveryService.addresses.update(id, addressData)
      await fetchUserAddresses()
      return response
    } catch (err) {
      error.value = err.message
      console.error('Failed to update address:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete address
  const deleteAddress = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deliveryService.addresses.delete(id)
      await fetchUserAddresses()
    } catch (err) {
      error.value = err.message
      console.error('Failed to delete address:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Set default address
  const setDefaultAddress = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deliveryService.addresses.setDefault(id)
      await fetchUserAddresses()
    } catch (err) {
      error.value = err.message
      console.error('Failed to set default address:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Default address
  const defaultAddress = computed(() => {
    return userAddresses.value.find(addr => addr.attributes.isDefault)
  })

  return {
    // State
    cities,
    departments,
    districts,
    deliveryOptions,
    userAddresses,
    loading,
    error,

    // Computed
    defaultAddress,

    // Methods
    fetchCities,
    fetchDepartmentsByCity,
    fetchDistrictsByDepartment,
    fetchDeliveryOptions,
    fetchUserAddresses,
    calculateDeliveryPrice,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  }
}

export default useDelivery
