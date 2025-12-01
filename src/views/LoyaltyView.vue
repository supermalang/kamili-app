<template>
  <div>
    <AppTopbar />
    <AppHeader />

    <!-- Hero Section -->
    <section class="relative bg-gray-900 text-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Fidélité</h1>
          <p class="text-xl opacity-90">Rejoignez notre programme de fidélité</p>
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
          <svg class="w-32 h-32 mx-auto mb-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
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
