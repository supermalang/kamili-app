<template>
  <div class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Livraison (Delivery) -->
        <button
          @click="openDeliveryModal"
          class="bg-teal-500 hover:bg-teal-600 text-white p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square service-grid-item cursor-pointer"
        >
          <img :src="livraisonIcon" alt="Livraison" class="w-16 h-16 md:w-20 md:h-20 object-contain" />
          <span class="service-grid-text">Livraison</span>
        </button>

        <!-- A emporter (Takeout) -->
        <button
          @click="openTakeawayModal"
          class="bg-yellow-400 hover:bg-yellow-500 text-white p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square service-grid-item cursor-pointer"
        >
          <img :src="aEmporterIcon" alt="A emporter" class="w-16 h-16 md:w-20 md:h-20 object-contain" />
          <span class="service-grid-text">A emporter</span>
        </button>

        <!-- Boutique (Shop) -->
        <RouterLink
          to="/boutique"
          class="text-white p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square service-grid-item"
          style="background-color: #3C3C3C;"
          @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#2C2C2C'"
          @mouseleave="(e) => e.currentTarget.style.backgroundColor = '#3C3C3C'"
        >
          <img :src="boutiqueIcon" alt="Boutique" class="w-16 h-16 md:w-20 md:h-20 object-contain" />
          <span class="service-grid-text">Boutique</span>
        </RouterLink>

        <!-- Fidélité (Loyalty) -->
        <RouterLink
          to="/fidelite"
          class="bg-red-600 hover:bg-red-700 text-white p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square service-grid-item"
        >
          <img :src="fideliteIcon" alt="Fidélité" class="w-16 h-16 md:w-20 md:h-20 object-contain" />
          <span class="service-grid-text">Fidélité</span>
        </RouterLink>
      </div>
    </div>

    <!-- Delivery Modal -->
    <DeliveryModal
      :is-open="isDeliveryModalOpen"
      :cart-item-count="cartItemCount"
      @close="closeDeliveryModal"
      @submit="handleDeliverySubmit"
    />

    <!-- Takeaway Modal -->
    <TakeawayModal
      :is-open="isTakeawayModalOpen"
      :cart-item-count="cartItemCount"
      @close="closeTakeawayModal"
      @submit="handleTakeawaySubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import DeliveryModal from '@/components/common/DeliveryModal.vue'
import TakeawayModal from '@/components/common/TakeawayModal.vue'
import { useCartStore } from '@/stores/cart'
import livraisonIcon from '@/assets/images/icons/livraison.png'
import aEmporterIcon from '@/assets/images/icons/a_emporter.png'
import boutiqueIcon from '@/assets/images/icons/boutique.png'
import fideliteIcon from '@/assets/images/icons/fidelite.png'

// Get cart store
const cartStore = useCartStore()
const cartItemCount = computed(() => cartStore.itemCount)

// Delivery Modal State
const isDeliveryModalOpen = ref(false)

const openDeliveryModal = () => {
  isDeliveryModalOpen.value = true
}

const closeDeliveryModal = () => {
  isDeliveryModalOpen.value = false
}

const handleDeliverySubmit = (formData) => {
  console.log('Delivery form submitted:', formData)
  // Store delivery type and info in cart
  cartStore.setDeliveryType('delivery')
  cartStore.setDeliveryInfo(formData)
  // Form submission logic is handled in DeliveryModal
  // It will navigate to cart page automatically
  closeDeliveryModal()
}

// Takeaway Modal State
const isTakeawayModalOpen = ref(false)

const openTakeawayModal = () => {
  isTakeawayModalOpen.value = true
}

const closeTakeawayModal = () => {
  isTakeawayModalOpen.value = false
}

const handleTakeawaySubmit = (formData) => {
  console.log('Takeaway form submitted:', formData)
  // Store takeaway type and info in cart
  cartStore.setDeliveryType('takeaway')
  cartStore.setDeliveryInfo(formData)
  closeTakeawayModal()
}
</script>

<style scoped>
.service-grid-item {
  border-radius: 16px;
}

.service-grid-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-style: bold;
  line-height: 100%;
  letter-spacing: 0;
  font-size: 1.125rem; /* 18px - text-lg */
}
</style>
