<template>
  <section class="relative bg-gray-900 text-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Restaurant Info -->
        <div class="flex-1 z-10">
          <h2 class="text-4xl md:text-5xl font-bold mb-2 leading-tight">
            CHICAGO<br />
            PIZZA KING
          </h2>
          <p class="text-sm mb-6 opacity-90">à partir de 3000 f</p>
          <button class="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded transition-colors">
            Voir le menu
          </button>
        </div>

        <!-- Restaurant Image -->
        <div class="flex-1 relative">
          <div class="w-64 h-64 md:w-80 md:h-80 relative">
            <!-- Placeholder for pizza image -->
            <div class="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
              <svg class="w-32 h-32 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="8" cy="9" r="1.5"/>
                <circle cx="16" cy="9" r="1.5"/>
                <circle cx="9" cy="15" r="1.5"/>
                <circle cx="15" cy="15" r="1.5"/>
              </svg>
            </div>
            <!-- Decorative elements (tomatoes from design) -->
            <div class="absolute -bottom-2 -right-2 w-16 h-16 bg-red-500 rounded-full opacity-80"></div>
            <div class="absolute -top-2 -left-2 w-12 h-12 bg-green-500 rounded-full opacity-80"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
</style>
