<template>
  <div class="py-12" style="background-color: #3C3C3C;">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-center text-white uppercase mb-8" style="font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 20px; line-height: 54px; letter-spacing: 0;">
        Nos Best-Sellers
      </h2>

      <!-- Product Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ProductCard
          id="1"
          name="L'Americain Beef"
          :price="1500"
          type="burger"
          :image="baguettesImg"
        />
        <ProductCard
          id="2"
          name="Pizza Reine"
          :price="1500"
          type="pizza"
          :image="pizzasImg"
        />
        <ProductCard
          id="3"
          name="L'Americain Beef"
          :price="1500"
          type="burger"
          :image="tacosImg"
        />
        <ProductCard
          id="4"
          name="Pizza Reine"
          :price="1500"
          type="pizza"
          :image="snacksImg"
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
import pizzasImg from '@/assets/images/menu-categories/pizzas.png'
import baguettesImg from '@/assets/images/menu-categories/baguettes.png'
import snacksImg from '@/assets/images/menu-categories/snacks.png'
import tacosImg from '@/assets/images/menu-categories/tacos.png'
</script>

<style scoped>
</style>
