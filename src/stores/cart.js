import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const isDrawerOpen = ref(false)
  const pendingProduct = ref(null) // Product being configured with options

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => {
      // Calculate item total including options
      let itemTotal = item.price * item.quantity

      if (item.options) {
        Object.values(item.options).forEach(optionList => {
          optionList.forEach(option => {
            itemTotal += (option.price || 0) * item.quantity
          })
        })
      }

      return sum + itemTotal
    }, 0)
  })

  const deliveryFee = computed(() => {
    return subtotal.value >= 10000 ? 0 : 1000
  })

  const total = computed(() => {
    return subtotal.value + deliveryFee.value
  })

  // Actions
  const startAddingProduct = (product) => {
    // Set the product as pending for option selection
    pendingProduct.value = {
      ...product,
      selectedOptions: product.optionGroups ? product.optionGroups.map(group =>
        group.maxSelections === 1 ? undefined : []
      ) : [],
      quantity: 1
    }

    // Open drawer
    isDrawerOpen.value = true
  }

  const confirmPendingProduct = () => {
    if (!pendingProduct.value) return

    const product = pendingProduct.value

    // Check if the same product with same options already exists
    const existingItemIndex = items.value.findIndex(item => {
      if (item.id !== product.id) return false

      // If both have no options, they're the same
      if (!item.options && !product.options) return true
      if (!item.options || !product.options) return false

      // Compare options
      return JSON.stringify(item.options) === JSON.stringify(product.options)
    })

    if (existingItemIndex !== -1) {
      // Update quantity
      items.value[existingItemIndex].quantity += product.quantity || 1
    } else {
      // Add new item
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1,
        options: product.options || null
      })
    }

    // Clear pending product
    pendingProduct.value = null
  }

  const cancelPendingProduct = () => {
    pendingProduct.value = null
  }

  const addItem = (product) => {
    // Legacy method - check if product has options
    if (product.optionGroups && product.optionGroups.length > 0) {
      // Use new flow for products with options
      startAddingProduct(product)
    } else {
      // Directly add products without options
      const existingItemIndex = items.value.findIndex(item =>
        item.id === product.id && !item.options
      )

      if (existingItemIndex !== -1) {
        items.value[existingItemIndex].quantity += product.quantity || 1
      } else {
        items.value.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: product.quantity || 1,
          options: null
        })
      }

      isDrawerOpen.value = true
    }
  }

  const removeItem = (index) => {
    items.value.splice(index, 1)
  }

  const updateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeItem(index)
    } else {
      items.value[index].quantity = quantity
    }
  }

  const incrementQuantity = (index) => {
    items.value[index].quantity++
  }

  const decrementQuantity = (index) => {
    if (items.value[index].quantity > 1) {
      items.value[index].quantity--
    } else {
      removeItem(index)
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const openDrawer = () => {
    isDrawerOpen.value = true
  }

  const closeDrawer = () => {
    isDrawerOpen.value = false
  }

  const getItemTotal = (item) => {
    let total = item.price * item.quantity

    if (item.options) {
      Object.values(item.options).forEach(optionList => {
        optionList.forEach(option => {
          total += (option.price || 0) * item.quantity
        })
      })
    }

    return total
  }

  return {
    // State
    items,
    isDrawerOpen,
    pendingProduct,

    // Getters
    itemCount,
    subtotal,
    deliveryFee,
    total,

    // Actions
    addItem,
    startAddingProduct,
    confirmPendingProduct,
    cancelPendingProduct,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    openDrawer,
    closeDrawer,
    getItemTotal
  }
})
