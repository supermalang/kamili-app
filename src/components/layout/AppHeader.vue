<template>
  <header class="bg-white shadow-sm sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Menu Icon (Mobile) -->
      <button
        @click="toggleDrawer"
        class="p-2 hover:bg-gray-100 rounded-lg md:hidden"
        aria-label="Open menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2">
        <img :src="logo" alt="Kamili Food Logo" class="h-8 md:h-10" />
      </RouterLink>

      <!-- Horizontal Navigation (Desktop) -->
      <AppNavigation variant="horizontal" />

      <!-- Cart Icon -->
      <button
        @click="toggleCartDrawer"
        class="p-2 hover:bg-gray-100 rounded-lg relative"
        aria-label="Ouvrir le panier"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <span
          v-if="itemCount > 0"
          class="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >{{ itemCount }}</span
        >
      </button>
    </div>

    <!-- Mobile Navigation Drawer -->
    <MobileDrawer :isOpen="isDrawerOpen" @close="closeDrawer">
      <AppNavigation variant="vertical" @linkClick="closeDrawer" />
    </MobileDrawer>

    <!-- Cart Drawer -->
    <CartDrawer :isOpen="isCartOpen" @close="closeCartDrawer" />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppNavigation from './AppNavigation.vue'
import MobileDrawer from './MobileDrawer.vue'
import CartDrawer from '@/components/features/cart/CartDrawer.vue'
import { useCart } from '@/composables/useCart'
import logo from '@/assets/images/logo-horizontal-compose-kamili.png'

const isDrawerOpen = ref(false)

const { isCartOpen, itemCount, openCart, closeCart } = useCart()

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const toggleCartDrawer = () => {
  if (isCartOpen.value) {
    closeCart()
  } else {
    openCart()
  }
}

const closeCartDrawer = () => {
  closeCart()
}
</script>

<style scoped></style>
