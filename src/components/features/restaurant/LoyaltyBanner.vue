<template>
  <div class="loyalty-banner" style="background-color: #242424;">
    <div class="max-w-7xl mx-auto px-4 banner-content">
      <div class="flex flex-col content-wrapper">
        <!-- Title on its own line -->
        <h2 class="text-white text-left mb-2" style="font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 20px; line-height: 1.2; letter-spacing: 0;">
          Chaque commande = des points !
        </h2>

        <!-- Text and Image on the same line -->
        <div class="flex flex-row items-center justify-between">
          <!-- Text Content (50%) -->
          <div class="text-white text-left" style="flex: 0 0 50%;">
            <p class="text-base md:text-lg mb-6 opacity-95" style="font-family: 'Outfit', sans-serif;">
              En commandant tu cumules des points de fidélité, qui te donnent droit à des produits gratuits !
            </p>
            <button class="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded transition-colors" style="font-family: 'Outfit', sans-serif;">
              En savoir plus
            </button>
          </div>

          <!-- Delivery Man Image (50%) -->
          <div class="flex items-center justify-center delivery-image-container" style="flex: 0 0 50%;">
            <img
              :src="deliveryManImage"
              alt="Delivery man with pizza boxes"
              class="delivery-image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import deliveryManImage from '@/assets/images/homepage/black-delivery-man-holding-pizza-boxes.png'
</script>

<style scoped>
.loyalty-banner {
  padding: 3rem 0;
}

.banner-content {
  height: 100%;
}

.content-wrapper {
  height: 100%;
}

@media (min-width: 768px) {
  .loyalty-banner {
    max-height: 450px;
    padding: 2rem 0;
  }

  .banner-content {
    padding-left: 10%;
    padding-right: 10%;
  }

  .delivery-image-container {
    height: 300px;
  }

  .delivery-image {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
}

@media (max-width: 767px) {
  .delivery-image {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
}
</style>
