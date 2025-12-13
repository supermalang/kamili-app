<template>
  <main>
    <HeroSection />
    <CategoryNav />
    <BestSellers />
    <ServiceGrid />
    <LoyaltyBanner />
  </main>
</template>

<script setup>
import HeroSection from '@/components/features/restaurant/HeroSection.vue'
import CategoryNav from '@/components/features/restaurant/CategoryNav.vue'
import BestSellers from '@/components/features/product/BestSellers.vue'
import ServiceGrid from '@/components/features/restaurant/ServiceGrid.vue'
import LoyaltyBanner from '@/components/features/restaurant/LoyaltyBanner.vue'
</script>

<style scoped></style>
