<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <!-- Product Image -->
    <div class="aspect-square bg-gray-100 flex items-center justify-center p-4">
      <img
        v-if="image"
        :src="image"
        :alt="name"
        class="w-full h-full object-cover"
      />
      <slot v-else name="image">
        <div class="w-full h-full flex items-center justify-center text-gray-400">
          <svg v-if="type === 'pizza'" class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="8" cy="9" r="1.5"/>
            <circle cx="16" cy="9" r="1.5"/>
            <circle cx="9" cy="15" r="1.5"/>
            <circle cx="15" cy="15" r="1.5"/>
          </svg>
          <svg v-else class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 8 L18 8 L16 16 L8 16 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
      </slot>
    </div>

    <!-- Product Info -->
    <div class="p-4 text-center">
      <h3 class="text-gray-900 mb-2" style="font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 16px;">{{ name }}</h3>
      <p class="text-gray-900 mb-3" style="font-family: 'Oswald', sans-serif; font-weight: 300; font-size: 20px;">{{ formatPrice(price) }}</p>
      <button
        @click="handleAddToCart"
        class="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded text-sm transition-colors flex items-center gap-1 w-full justify-center"
      >
        <span>+</span>
        <span>Ajouter</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '@/composables/useCart'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'pizza'
  },
  image: {
    type: String,
    default: null
  }
})

const { addToCart, formatPrice } = useCart()

const handleAddToCart = () => {
  addToCart({
    id: props.id,
    name: props.name,
    price: props.price,
    type: props.type,
    image: props.image
  })
}
</script>

<style scoped>
</style>
