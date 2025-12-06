<template>
  <div class="bg-white py-8 pb-12 payment-methods-section">
    <div class="max-w-7xl mx-auto px-4 payment-content">
      <h3 class="text-center footer-text mb-6">
        PAYEZ EN TOUTE SÉCURITÉ, COMME VOUS VOULEZ
      </h3>

      <!-- Payment Icons -->
      <div class="flex flex-nowrap justify-center items-center gap-6">
        <!-- Wave -->
        <div class="payment-method">
          <div class="payment-icon">
            <img :src="waveLogo" alt="Wave" class="w-full h-full object-contain" />
          </div>
          <p class="payment-label">WAVE</p>
        </div>

        <!-- Max it -->
        <div class="payment-method">
          <div class="payment-icon">
            <img :src="maxitLogo" alt="Max it" class="w-full h-full object-contain" />
          </div>
          <p class="payment-label">MAX IT</p>
        </div>

        <!-- Djamo -->
        <div class="payment-method">
          <div class="payment-icon">
            <img :src="djamoLogo" alt="Djamo" class="w-full h-full object-contain" />
          </div>
          <p class="payment-label">DJAMO</p>
        </div>

        <!-- CB (Credit Card) -->
        <div class="payment-method">
          <div class="payment-icon">
            <img :src="cbLogo" alt="CB" class="w-full h-full object-contain" />
          </div>
          <p class="payment-label">CARTE</p>
        </div>

        <!-- Cash -->
        <div class="payment-method">
          <div class="payment-icon">
            <img :src="cashLogo" alt="Cash" class="w-full h-full object-contain" />
          </div>
          <p class="payment-label">CASH</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import waveLogo from '@/assets/images/footer/wave.png'
import maxitLogo from '@/assets/images/footer/maxit.png'
import djamoLogo from '@/assets/images/footer/djamo.png'
import cbLogo from '@/assets/images/footer/cb.png'
import cashLogo from '@/assets/images/footer/cash.png'
</script>

<style scoped>
.footer-text {
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

.payment-method {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.payment-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.payment-label {
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: #1f2937;
}

@media (min-width: 768px) {
  .payment-content {
    padding-left: 10%;
    padding-right: 10%;
  }

  .payment-icon {
    width: 80px;
    height: 80px;
  }

  .payment-label {
    font-size: 14px;
  }
}
</style>
