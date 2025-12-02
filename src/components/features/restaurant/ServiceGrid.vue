<template>
  <div class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        <!-- Livraison (Delivery) -->
        <RouterLink
          to="/livraison"
          class="bg-teal-500 hover:bg-teal-600 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square"
        >
          <img :src="livraisonIcon" alt="Livraison" class="w-16 h-16 object-contain" />
          <span class="text-lg font-bold">Livraison</span>
        </RouterLink>

        <!-- A emporter (Takeout) -->
        <RouterLink
          to="/a-emporter"
          class="bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square"
        >
          <img :src="aEmporterIcon" alt="A emporter" class="w-16 h-16 object-contain" />
          <span class="text-lg font-bold">A emporter</span>
        </RouterLink>

        <!-- Boutique (Shop) -->
        <RouterLink
          to="/boutique"
          class="bg-gray-800 hover:bg-gray-900 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square"
        >
          <img :src="boutiqueIcon" alt="Boutique" class="w-16 h-16 object-contain" />
          <span class="text-lg font-bold">Boutique</span>
        </RouterLink>

        <!-- Fidélité (Loyalty) -->
        <RouterLink
          to="/fidelite"
          class="bg-red-600 hover:bg-red-700 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square"
        >
          <img :src="fideliteIcon" alt="Fidélité" class="w-16 h-16 object-contain" />
          <span class="text-lg font-bold">Fidélité</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import livraisonIcon from '@/assets/images/icons/livraison.png'
import aEmporterIcon from '@/assets/images/icons/a_emporter.png'
import boutiqueIcon from '@/assets/images/icons/boutique.png'
import fideliteIcon from '@/assets/images/icons/fidelite.png'
</script>

<style scoped>
</style>
