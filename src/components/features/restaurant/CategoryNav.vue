<template>
  <div class="bg-white py-6">
    <div class="max-w-7xl mx-auto px-4">
      <h3 class="text-center text-sm font-semibold mb-4 uppercase tracking-wide">
        Commandez Maintenant
      </h3>
      <div class="flex justify-center gap-6 overflow-x-auto">
        <!-- Pizzas -->
        <button class="flex flex-col items-center gap-2 min-w-[80px] group">
          <div class="w-16 h-16 flex items-center justify-center">
            <svg class="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="8" cy="9" r="1.5"/>
              <circle cx="16" cy="9" r="1.5"/>
              <circle cx="9" cy="15" r="1.5"/>
              <circle cx="15" cy="15" r="1.5"/>
            </svg>
          </div>
          <span class="text-xs font-semibold uppercase">Pizzas</span>
        </button>

        <!-- Baguettes -->
        <button class="flex flex-col items-center gap-2 min-w-[80px] group">
          <div class="w-16 h-16 flex items-center justify-center">
            <svg class="w-12 h-12 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 12 L20 12 M4 12 C4 10 5 8 7 8 L17 8 C19 8 20 10 20 12 M4 12 C4 14 5 16 7 16 L17 16 C19 16 20 14 20 12" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <span class="text-xs font-semibold uppercase">Baguettes</span>
        </button>

        <!-- Snaks -->
        <button class="flex flex-col items-center gap-2 min-w-[80px] group">
          <div class="w-16 h-16 flex items-center justify-center">
            <svg class="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 8 L18 8 L16 16 L8 16 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M9 8 L9 6 M12 8 L12 5 M15 8 L15 6" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="text-xs font-semibold uppercase">Snaks</span>
        </button>

        <!-- Tacos -->
        <button class="flex flex-col items-center gap-2 min-w-[80px] group">
          <div class="w-16 h-16 flex items-center justify-center">
            <svg class="w-12 h-12 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 12 Q12 18 20 12 L20 16 Q12 22 4 16 Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <span class="text-xs font-semibold uppercase">Tacos</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
