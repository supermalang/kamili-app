<template>
  <section class="relative text-white overflow-hidden hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <!-- Restaurant Info - Left Side (60% width) -->
        <div class="hero-text">
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight">
            CHICAGO<br />
            PIZZA KING
          </h2>
          <p class="text-sm md:text-base mb-6 opacity-90">à partir de 3000 FCFA</p>
          <div>
            <RouterLink
              to="/menu"
              class="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded transition-colors shadow-lg"
            >
              Voir le menu
            </RouterLink>
          </div>
        </div>

        <!-- Restaurant Image - Right Side (40% width) -->
        <div class="hero-image">
          <img
            :src="heroImage"
            alt="Chicago Pizza King"
            class="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import heroImage from '@/assets/images/homepage/hero-image.png'
</script>

<style scoped>
.hero-section {
  /* 4:3 aspect ratio */
  aspect-ratio: 4 / 3;
  min-height: 400px;
  background-image: url('@/assets/images/homepage/hero-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
}

/* Add overlay for better text readability */
.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px; /* max-w-7xl */
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;
}

/* Medium and large screens */
@media (min-width: 768px) {
  .hero-section {
    max-height: 500px;
    aspect-ratio: auto;
  }

  .hero-container {
    padding-left: 10%;
    padding-right: 10%;
  }
}

.hero-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: 2rem;
}

.hero-text {
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-image {
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem 0;
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .hero-text {
    flex: 0 0 55%;
  }

  .hero-image {
    flex: 0 0 45%;
  }
}

/* Small tablet and large mobile */
@media (max-width: 768px) {
  .hero-section {
    aspect-ratio: auto;
    min-height: 500px;
  }

  .hero-container {
    padding: 0 1.5rem;
  }

  .hero-content {
    flex-direction: column-reverse;
    gap: 2rem;
    justify-content: center;
  }

  .hero-text,
  .hero-image {
    flex: 0 0 auto;
    width: 100%;
  }

  .hero-text {
    text-align: center;
  }

  .hero-image {
    padding: 1rem 0;
    max-width: 300px;
    margin: 0 auto;
  }
}

/* Mobile devices */
@media (max-width: 640px) {
  .hero-section {
    min-height: 600px;
  }

  .hero-container {
    padding: 0 1rem;
  }

  .hero-content {
    gap: 1.5rem;
  }

  .hero-text h2 {
    font-size: 2rem !important;
  }

  .hero-image {
    max-width: 250px;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .hero-section {
    min-height: 550px;
  }

  .hero-text h2 {
    font-size: 1.75rem !important;
  }

  .hero-text p {
    font-size: 0.875rem !important;
  }

  .hero-image {
    max-width: 200px;
  }
}
</style>
