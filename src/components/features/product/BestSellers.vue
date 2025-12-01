<template>
  <div class="bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-center text-white font-bold text-xl md:text-2xl uppercase tracking-wide mb-8">
        Nos Best-Sellers
      </h2>

      <!-- Product Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ProductCard
          id="1"
          name="L'Americain Beef"
          :price="1500"
          type="burger"
        />
        <ProductCard
          id="2"
          name="Pizza Reine"
          :price="1500"
          type="pizza"
        />
        <ProductCard
          id="3"
          name="L'Americain Beef"
          :price="1500"
          type="burger"
        />
        <ProductCard
          id="4"
          name="Pizza Reine"
          :price="1500"
          type="pizza"
        />
      </div>

      <!-- View All Button -->
      <div class="text-center">
        <RouterLink
          to="/menu"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded inline-flex items-center gap-2 transition-colors"
        >
          <span>Voir toute la carte</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from './ProductCard.vue'
</script>

<style scoped>
</style>
