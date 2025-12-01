import { ref, computed } from 'vue'

// Global cart state
const cartItems = ref([])
const isCartOpen = ref(false)

export function useCart() {
  const addToCart = (product) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image || null,
        type: product.type || null,
        specialInstructions: product.specialInstructions || null
      })
    }

    // Open cart drawer when item is added
    isCartOpen.value = true
  }

  const removeFromCart = (itemId) => {
    const index = cartItems.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const incrementQuantity = (itemId) => {
    const item = cartItems.value.find(i => i.id === itemId)
    if (item) {
      item.quantity++
    }
  }

  const decrementQuantity = (itemId) => {
    const item = cartItems.value.find(i => i.id === itemId)
    if (item && item.quantity > 1) {
      item.quantity--
    } else if (item && item.quantity === 1) {
      removeFromCart(itemId)
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const deliveryFee = computed(() => {
    return subtotal.value >= 10000 ? 0 : 1000
  })

  const total = computed(() => {
    return subtotal.value + deliveryFee.value
  })

  const itemCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' FCFA'
  }

  return {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    openCart,
    closeCart,
    subtotal,
    deliveryFee,
    total,
    itemCount,
    formatPrice
  }
}
