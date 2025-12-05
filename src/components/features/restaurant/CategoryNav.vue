<template>
  <div class="py-6" style="background-color: #ECECEC;">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-center uppercase mb-8" style="font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 20px; line-height: 54px; letter-spacing: 0;">
        Commandez Maintenant
      </h2>

      <div
        ref="carouselContainer"
        class="overflow-hidden"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      >
        <div
          ref="carouselTrack"
          class="flex gap-4 ease-in-out"
          :class="{ 'transition-transform duration-500': !isResetting }"
          :style="{ transform: `translateX(-${currentOffset}px)` }"
        >
          <RouterLink
            v-for="(category, index) in displayCategories"
            :key="`${category.slug}-${index}`"
            :to="{ path: '/menu', query: { category: category.slug } }"
            class="flex flex-col items-center gap-2 flex-shrink-0 group category-item"
          >
            <div class="flex items-center justify-center category-image-container">
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-contain"
              />
            </div>
            <span class="text-xs md:text-sm font-semibold uppercase text-center category-label">{{ category.name }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import pizzasImg from '@/assets/images/menu-categories/pizzas.png'
import baguettesImg from '@/assets/images/menu-categories/baguettes.png'
import sandwichVegetarienImg from '@/assets/images/menu-categories/sandwich_vegetarien.png'
import snacksImg from '@/assets/images/menu-categories/snacks.png'
import tacosImg from '@/assets/images/menu-categories/tacos.png'

const categories = [
  { name: 'Pizzas', slug: 'pizzas', image: pizzasImg },
  { name: 'Baguettes', slug: 'baguettes', image: baguettesImg },
  { name: 'Sandwich Végétarien', slug: 'sandwich-vegetarien', image: sandwichVegetarienImg },
  { name: 'Snacks', slug: 'snacks', image: snacksImg },
  { name: 'Tacos', slug: 'tacos', image: tacosImg }
]

// Create infinite loop by tripling the categories
const displayCategories = computed(() => {
  return [...categories, ...categories, ...categories]
})

const carouselContainer = ref(null)
const carouselTrack = ref(null)
const currentIndex = ref(categories.length) // Start at the middle set
const currentOffset = ref(0)
const isResetting = ref(false)
let autoSlideInterval = null

// Touch/drag handling
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const dragOffset = ref(0)

// Calculate item width based on screen size
const getItemWidth = () => {
  if (typeof window === 'undefined') return 100
  const isLarge = window.innerWidth >= 1024
  const isMedium = window.innerWidth >= 768

  // Base image sizes
  if (isLarge) {
    return 140 // Large screens: 140px images
  } else if (isMedium) {
    return 120 // Medium screens: 120px images
  } else {
    return 80 // Small screens: 80px images
  }
}

const slideToIndex = (index, immediate = false) => {
  const itemWidth = getItemWidth()
  const gap = 16

  if (immediate) {
    isResetting.value = true
  }

  currentIndex.value = index
  currentOffset.value = index * (itemWidth + gap)

  if (immediate) {
    setTimeout(() => {
      isResetting.value = false
    }, 50)
  }
}

const slideNext = () => {
  const nextIndex = currentIndex.value + 1
  slideToIndex(nextIndex)

  // Check if we need to reset to create infinite loop
  // If we've moved past the second set, instantly reset to the first set
  setTimeout(() => {
    if (currentIndex.value >= categories.length * 2) {
      const equivalentIndex = currentIndex.value - categories.length
      slideToIndex(equivalentIndex, true)
    }
  }, 500) // Wait for transition to complete
}

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    if (!isDragging.value) {
      slideNext()
    }
  }, 10000) // 10 seconds
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

// Touch handlers
const handleTouchStart = (e) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX
  stopAutoSlide()
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  currentX.value = e.touches[0].clientX
  dragOffset.value = startX.value - currentX.value
  currentOffset.value = Math.max(0, currentOffset.value + dragOffset.value * 0.05)
}

const handleTouchEnd = () => {
  if (!isDragging.value) return

  const threshold = 50

  if (Math.abs(dragOffset.value) > threshold) {
    if (dragOffset.value > 0) {
      // Swipe left - go to next
      slideNext()
    } else {
      // Swipe right - go to previous
      const prevIndex = currentIndex.value - 1
      slideToIndex(prevIndex)

      // Check if we need to reset for infinite loop going backwards
      setTimeout(() => {
        if (currentIndex.value < categories.length) {
          const equivalentIndex = currentIndex.value + categories.length
          slideToIndex(equivalentIndex, true)
        }
      }, 500)
    }
  } else {
    // Snap back to current
    slideToIndex(currentIndex.value)
  }

  isDragging.value = false
  dragOffset.value = 0
  startAutoSlide()
}

// Mouse handlers (for desktop drag)
const handleMouseDown = (e) => {
  isDragging.value = true
  startX.value = e.clientX
  stopAutoSlide()
  e.preventDefault()
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  currentX.value = e.clientX
  dragOffset.value = startX.value - currentX.value
  currentOffset.value = Math.max(0, currentOffset.value + dragOffset.value * 0.05)
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  handleTouchEnd()
}

// Resize handler
let resizeTimeout = null
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    slideToIndex(currentIndex.value)
  }, 100)
}

onMounted(() => {
  // Initialize position to middle set
  slideToIndex(categories.length, true)
  startAutoSlide()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stopAutoSlide()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.category-item {
  cursor: grab;
}

.category-item:active {
  cursor: grabbing;
}

.category-image-container {
  width: 80px;
  height: 80px;
}

@media (min-width: 768px) {
  .category-image-container {
    width: 120px;
    height: 120px;
  }
}

@media (min-width: 1024px) {
  .category-image-container {
    width: 140px;
    height: 140px;
  }
}

.category-label {
  max-width: 100px;
}

@media (min-width: 768px) {
  .category-label {
    max-width: 140px;
  }
}
</style>
