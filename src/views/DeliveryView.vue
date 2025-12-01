<template>
  <div>
    <AppTopbar />
    <AppHeader />

    <!-- Hero Section -->
    <section class="relative bg-gray-900 text-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Livraison</h1>
          <p class="text-xl opacity-90">Recevez vos plats à domicile</p>
        </div>
      </div>
      <!-- Decorative elements -->
      <div class="absolute top-10 right-10 w-24 h-24 bg-red-600 rounded-full opacity-20"></div>
      <div class="absolute bottom-10 left-10 w-32 h-32 bg-red-600 rounded-full opacity-20"></div>
    </section>

    <!-- Placeholder Content -->
    <main class="bg-white">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="text-center text-gray-500 py-20">
          <svg class="w-32 h-32 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
          </svg>
          <p class="text-2xl font-semibold mb-2">Contenu à venir</p>
          <p>Le contenu de cette page sera ajouté prochainement</p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>
