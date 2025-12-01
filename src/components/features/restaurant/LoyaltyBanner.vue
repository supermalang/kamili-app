<template>
  <div class="bg-red-600 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <!-- Content -->
        <div class="flex-1 text-white text-center md:text-left">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">
            Chaque commande = des points !
          </h2>
          <p class="text-base md:text-lg mb-6 opacity-95">
            En commandant tu cumules des points de fidélité, qui te donnent droit à des produits gratuits !
          </p>
          <button class="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded transition-colors">
            En savoir plus
          </button>
        </div>

        <!-- Illustration -->
        <div class="flex-shrink-0">
          <div class="w-48 h-48 md:w-64 md:h-64 relative">
            <!-- Placeholder for delivery person illustration -->
            <div class="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center">
              <svg class="w-32 h-32 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <!-- Decorative badge -->
            <div class="absolute top-0 right-0 bg-white text-red-600 rounded-full w-16 h-16 flex items-center justify-center font-bold shadow-lg">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15 9L22 10L17 15L18 22L12 18L6 22L7 15L2 10L9 9Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
