<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="closeDrawer"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 md:hidden overflow-y-auto"
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <div class="flex items-center gap-2">
          <img :src="logo" alt="Kamili Food Logo" class="h-8" />
        </div>
        <button
          @click="closeDrawer"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Drawer Content -->
      <div class="p-4">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'
import logo from '@/assets/images/logo-horizontal-compose-kamili.png'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const closeDrawer = () => {
  emit('close')
}

// Prevent body scroll when drawer is open
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
