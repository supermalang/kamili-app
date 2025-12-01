<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="closeDrawer"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide-right">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 flex flex-col"
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-bold text-gray-900">Mon Panier</h2>
        <button
          @click="closeDrawer"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Fermer le panier"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cartItems.length > 0" class="space-y-4">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
          >
            <!-- Product Image -->
            <div class="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-900 text-sm truncate pr-2">{{ item.name }}</h3>
                <button
                  @click="removeItem(item.id)"
                  class="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                  aria-label="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <p v-if="item.specialInstructions" class="text-gray-600 text-xs mb-2 truncate">
                {{ item.specialInstructions }}
              </p>

              <div class="flex items-center justify-between">
                <!-- Quantity Controls -->
                <div class="flex items-center gap-2">
                  <button
                    @click="decrementQuantity(item.id)"
                    class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                  </button>
                  <span class="text-sm font-medium w-6 text-center">{{ item.quantity }}</span>
                  <button
                    @click="incrementQuantity(item.id)"
                    class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>

                <!-- Price -->
                <span class="text-red-600 font-semibold text-sm">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center h-full text-center py-12">
          <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <p class="text-gray-600 mb-4">Votre panier est vide</p>
          <button
            @click="closeDrawer"
            class="text-red-600 font-medium hover:underline"
          >
            Découvrir le menu
          </button>
        </div>
      </div>

      <!-- Footer with Summary and Checkout -->
      <div v-if="cartItems.length > 0" class="border-t p-4 space-y-4 bg-gray-50">
        <!-- Summary -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-700">
            <span>Sous-total</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>Livraison</span>
            <span>{{ formatPrice(deliveryFee) }}</span>
          </div>
          <div class="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t">
            <span>Total</span>
            <span class="text-red-600">{{ formatPrice(total) }}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <RouterLink
          to="/cart"
          @click="closeDrawer"
          class="block w-full bg-red-600 text-white py-3 rounded-lg font-medium text-center hover:bg-red-700 transition-colors"
        >
          Commander
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useCart } from '@/composables/useCart'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const {
  cartItems,
  subtotal,
  deliveryFee,
  total,
  formatPrice,
  incrementQuantity,
  decrementQuantity,
  removeFromCart
} = useCart()

const closeDrawer = () => {
  emit('close')
}

const removeItem = (itemId) => {
  removeFromCart(itemId)
}

// Prevent body scroll when drawer is open
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for drawer from right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
