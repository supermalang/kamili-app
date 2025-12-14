<template>
  <div class="delivery-options-selector">
    <h3 class="text-lg font-semibold mb-3">Options de livraison</h3>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      <p class="mt-2 text-gray-600">Chargement des options...</p>
    </div>

    <!-- Options Grid -->
    <div v-else-if="deliveryOptions.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="option in deliveryOptions"
        :key="option.id"
        @click="selectOption(option)"
        class="border rounded-lg p-4 cursor-pointer transition-all"
        :class="{
          'border-red-600 bg-red-50': selectedOptionId === option.id,
          'border-gray-300 hover:border-gray-400': selectedOptionId !== option.id
        }"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div v-if="option.attributes.icon?.data" class="flex-shrink-0">
            <img
              :src="getIconUrl(option.attributes.icon.data)"
              :alt="option.attributes.name"
              class="w-12 h-12 object-contain"
            />
          </div>
          <div v-else class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900">{{ option.attributes.name }}</h4>
            <p v-if="option.attributes.estimatedTime" class="text-sm text-gray-600 mt-1">
              ⏱️ {{ option.attributes.estimatedTime }}
            </p>
            <p v-if="option.attributes.description" class="text-sm text-gray-500 mt-1">
              {{ option.attributes.description }}
            </p>

            <!-- Price -->
            <div v-if="calculatedPrice !== null" class="mt-2">
              <span
                v-if="calculatedPrice.appliedPromotion"
                class="text-sm font-medium text-green-600"
              >
                {{ calculatedPrice.finalPrice === 0 ? 'Gratuit' : formatPrice(calculatedPrice.finalPrice) }}
                <span class="line-through text-gray-400 ml-1">{{ formatPrice(calculatedPrice.originalPrice) }}</span>
              </span>
              <span v-else class="text-sm font-medium text-gray-700">
                {{ calculatedPrice.finalPrice === 0 ? 'Gratuit' : formatPrice(calculatedPrice.finalPrice) }}
              </span>
            </div>
          </div>

          <!-- Radio Button -->
          <div class="flex items-center">
            <input
              type="radio"
              :checked="selectedOptionId === option.id"
              class="w-5 h-5 text-red-600"
            />
          </div>
        </div>

        <!-- Promotion Badge -->
        <div
          v-if="calculatedPrice?.appliedPromotion && selectedOptionId === option.id"
          class="mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
        >
          <p class="text-sm text-green-800 font-medium">
            🎉 {{ calculatedPrice.appliedPromotion.name }}
          </p>
          <p class="text-xs text-green-700 mt-1">
            {{ calculatedPrice.appliedPromotion.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600">Aucune option de livraison disponible pour cette zone.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useDelivery } from '@/composables/useDelivery'
import { getStrapiAssetUrl } from '@/utils/env'

const props = defineProps({
  locationData: {
    type: Object,
    default: null
  },
  subtotal: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['optionSelected'])

const {
  deliveryOptions,
  loading,
  fetchDeliveryOptions,
  calculateDeliveryPrice
} = useDelivery()

const selectedOptionId = ref(null)
const calculatedPrice = ref(null)

onMounted(async () => {
  await fetchDeliveryOptions()
})

// Watch for location changes to recalculate price
watch(() => props.locationData, async (newLocation) => {
  if (newLocation && selectedOptionId.value) {
    await updatePrice()
  }
}, { deep: true })

// Watch for subtotal changes
watch(() => props.subtotal, async () => {
  if (props.locationData && selectedOptionId.value) {
    await updatePrice()
  }
})

const selectOption = async (option) => {
  selectedOptionId.value = option.id

  if (props.locationData) {
    await updatePrice()
  }

  emit('optionSelected', {
    optionId: option.id,
    option: option,
    pricing: calculatedPrice.value
  })
}

const updatePrice = async () => {
  if (!props.locationData || !selectedOptionId.value) {
    calculatedPrice.value = null
    return
  }

  try {
    const result = await calculateDeliveryPrice(
      {
        cityId: props.locationData.cityId,
        departmentId: props.locationData.departmentId,
        districtId: props.locationData.districtId
      },
      selectedOptionId.value,
      props.subtotal
    )
    calculatedPrice.value = result
  } catch (error) {
    console.error('Failed to calculate price:', error)
    calculatedPrice.value = {
      originalPrice: 1000,
      finalPrice: 1000,
      appliedPromotion: null
    }
  }
}

const getIconUrl = (iconData) => {
  if (!iconData?.attributes?.url) return null
  return getStrapiAssetUrl(iconData.attributes.url)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' FCFA'
}

// Expose method for parent to get selected data
const getSelectedOption = () => {
  if (!selectedOptionId.value) return null

  const option = deliveryOptions.value.find(opt => opt.id === selectedOptionId.value)
  return {
    optionId: selectedOptionId.value,
    option: option,
    pricing: calculatedPrice.value
  }
}

defineExpose({ getSelectedOption })
</script>

<style scoped>
/* Add any custom styles here */
</style>
