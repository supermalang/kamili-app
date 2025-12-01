<template>
  <div class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        <!-- Livraison (Delivery) -->
        <button class="bg-teal-500 hover:bg-teal-600 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            <circle cx="9" cy="18" r="2"/>
            <circle cx="15" cy="18" r="2"/>
          </svg>
          <span class="text-lg font-bold">Livraison</span>
        </button>

        <!-- A emporter (Takeout) -->
        <button class="bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 10l3-6h12l3 6M3 10v8a2 2 0 002 2h14a2 2 0 002-2v-8M9 14h6"/>
          </svg>
          <span class="text-lg font-bold">A emporter</span>
        </button>

        <!-- Boutique (Shop) -->
        <button class="bg-gray-800 hover:bg-gray-900 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 22V12h6v10"/>
          </svg>
          <span class="text-lg font-bold">Boutique</span>
        </button>

        <!-- Fidélité (Loyalty) -->
        <button class="bg-red-600 hover:bg-red-700 text-white rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors aspect-square">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
          </svg>
          <span class="text-lg font-bold">Fidélité</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
