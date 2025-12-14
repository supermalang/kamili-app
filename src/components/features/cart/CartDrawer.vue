<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cartStore.isDrawerOpen"
      class="fixed inset-0 backdrop-blur-sm z-40"
      style="background-color: rgba(255, 255, 255, 0.3);"
      @click="closeDrawer"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide-right">
    <div
      v-if="cartStore.isDrawerOpen"
      class="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 flex flex-col"
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-bold text-gray-900">Mon Panier</h2>
        <button
          @click="closeDrawer"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Fermer le panier"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Pending Product Configuration -->
      <div v-if="cartStore.pendingProduct" class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div class="bg-white rounded-lg p-4 mb-4">
          <div class="flex gap-3 mb-4">
            <img
              v-if="cartStore.pendingProduct.image"
              :src="cartStore.pendingProduct.image"
              :alt="cartStore.pendingProduct.name"
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h3 class="font-bold text-lg">{{ cartStore.pendingProduct.name }}</h3>
              <p class="text-red-600 font-semibold">{{ cartStore.pendingProduct.price.toLocaleString() }} FCFA</p>
            </div>
          </div>

          <!-- Option Groups -->
          <div v-if="cartStore.pendingProduct.optionGroups?.length" class="space-y-4 mb-4">
            <div
              v-for="(group, groupIndex) in cartStore.pendingProduct.optionGroups"
              :key="groupIndex"
              class="border-t pt-4"
            >
              <h4 class="font-semibold mb-2">
                {{ group.name }}
                <span v-if="group.isRequired" class="text-red-600 text-sm">*</span>
                <span v-if="group.maxSelections === 1" class="text-gray-500 text-xs font-normal ml-2">
                  (Choisissez-en un)
                </span>
                <span v-else-if="group.maxSelections > 0" class="text-gray-500 text-xs font-normal ml-2">
                  (Max {{ group.maxSelections }})
                </span>
              </h4>

              <div class="space-y-2">
                <label
                  v-for="(option, optionIndex) in (group.options || []).filter(opt => opt.isAvailable)"
                  :key="optionIndex"
                  class="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50"
                  :class="{
                    'border-red-600 bg-red-50': isOptionSelected(groupIndex, optionIndex),
                    'opacity-50 cursor-not-allowed': !canSelectOption(groupIndex)
                  }"
                >
                  <div class="flex items-center flex-1">
                    <input
                      v-if="group.maxSelections === 1"
                      type="radio"
                      :name="`group-${groupIndex}`"
                      :value="optionIndex"
                      v-model="cartStore.pendingProduct.selectedOptions[groupIndex]"
                      class="mr-2 text-red-600 focus:ring-red-600"
                      :disabled="!canSelectOption(groupIndex)"
                    />
                    <input
                      v-else
                      type="checkbox"
                      :checked="isOptionSelected(groupIndex, optionIndex)"
                      @change="toggleOption(groupIndex, optionIndex)"
                      class="mr-2 text-red-600 focus:ring-red-600 rounded"
                      :disabled="!canSelectOption(groupIndex) && !isOptionSelected(groupIndex, optionIndex)"
                    />
                    <span class="text-sm">{{ option.name }}</span>
                  </div>
                  <span v-if="option.price > 0" class="text-sm text-gray-600">
                    +{{ option.price.toLocaleString() }} FCFA
                  </span>
                  <span v-else class="text-xs text-green-600">Gratuit</span>
                </label>
              </div>

              <!-- Validation Error -->
              <p v-if="validationErrors[groupIndex]" class="text-red-600 text-xs mt-1">
                {{ validationErrors[groupIndex] }}
              </p>
            </div>
          </div>

          <!-- Quantity -->
          <div class="flex items-center gap-4 mb-4">
            <label class="text-sm font-medium">Quantité:</label>
            <div class="flex items-center border rounded">
              <button
                @click="decrementPendingQuantity"
                class="px-3 py-1 hover:bg-gray-100"
                :disabled="cartStore.pendingProduct.quantity <= 1"
              >
                -
              </button>
              <span class="px-4 py-1 border-x">{{ cartStore.pendingProduct.quantity }}</span>
              <button
                @click="incrementPendingQuantity"
                class="px-3 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <!-- Total Price for Pending Product -->
          <div class="text-lg font-bold text-red-600 mb-4">
            Total: {{ getPendingProductTotal().toLocaleString() }} FCFA
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              @click="cancelPending"
              class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              @click="confirmPending"
              class="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      <!-- Cart Items -->
      <div v-else class="flex-1 overflow-y-auto p-4">
        <div v-if="cartStore.items.length > 0" class="space-y-4">
          <div
            v-for="(item, index) in cartStore.items"
            :key="index"
            class="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
          >
            <!-- Product Image -->
            <div class="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0 pr-2">
                  <h3 class="font-semibold text-gray-900 text-sm truncate">{{ item.name }}</h3>

                  <!-- Display selected options -->
                  <div v-if="item.options" class="mt-1 space-y-0.5">
                    <div
                      v-for="(optionList, groupName) in item.options"
                      :key="groupName"
                      class="text-xs text-gray-600"
                    >
                      <span class="font-medium">{{ groupName }}:</span>
                      <span class="ml-1">
                        {{ optionList.map(opt => opt.name + (opt.price > 0 ? ' (+' + opt.price + ' FCFA)' : '')).join(', ') }}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  @click="removeItem(index)"
                  class="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                  aria-label="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div class="flex items-center justify-between mt-2">
                <!-- Quantity Controls -->
                <div class="flex items-center gap-2">
                  <button
                    @click="cartStore.decrementQuantity(index)"
                    class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                  </button>
                  <span class="text-sm font-medium w-6 text-center">{{ item.quantity }}</span>
                  <button
                    @click="cartStore.incrementQuantity(index)"
                    class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>

                <!-- Price -->
                <span class="text-red-600 font-semibold text-sm">{{ formatPrice(cartStore.getItemTotal(item)) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center h-full text-center py-12">
          <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <p class="text-gray-600 mb-4">Votre panier est vide</p>
          <button
            @click="closeDrawer"
            class="text-red-600 font-medium hover:underline"
          >
            Découvrir le menu
          </button>
        </div>
      </div>

      <!-- Footer with Summary and Checkout -->
      <div v-if="cartStore.items.length > 0 && !cartStore.pendingProduct" class="border-t p-4 space-y-4 bg-gray-50">
        <!-- Delivery Type Badge -->
        <div v-if="cartStore.deliveryType" class="flex items-center gap-2 text-sm">
          <span class="px-3 py-1 rounded-full text-white font-medium"
            :class="cartStore.deliveryType === 'delivery' ? 'bg-teal-500' : 'bg-yellow-500'">
            {{ cartStore.deliveryType === 'delivery' ? '🚚 Livraison' : '🛍️ À emporter' }}
          </span>
        </div>

        <!-- Summary -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-700">
            <span>Sous-total</span>
            <span>{{ formatPrice(cartStore.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>{{ cartStore.deliveryType === 'takeaway' ? 'Frais' : 'Livraison' }}</span>
            <span>{{ cartStore.deliveryFee === 0 ? 'Gratuit' : formatPrice(cartStore.deliveryFee) }}</span>
          </div>
          <div class="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t">
            <span>Total</span>
            <span class="text-red-600">{{ formatPrice(cartStore.total) }}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <RouterLink
          to="/cart"
          @click="closeDrawer"
          class="block w-full bg-red-600 text-white py-3 rounded-lg font-medium text-center hover:bg-red-700 transition-colors"
        >
          Commander
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'

const cartStore = useCartStore()
const validationErrors = ref([])

const closeDrawer = () => {
  if (cartStore.pendingProduct) {
    cartStore.cancelPendingProduct()
  }
  cartStore.closeDrawer()
}

const removeItem = (index) => {
  cartStore.removeItem(index)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' FCFA'
}

// Pending product option selection
const isOptionSelected = (groupIndex, optionIndex) => {
  const selected = cartStore.pendingProduct.selectedOptions[groupIndex]
  if (Array.isArray(selected)) {
    return selected.includes(optionIndex)
  }
  return selected === optionIndex
}

const canSelectOption = (groupIndex) => {
  const group = cartStore.pendingProduct.optionGroups[groupIndex]
  if (group.maxSelections === 0 || group.maxSelections === 1) return true

  const selected = cartStore.pendingProduct.selectedOptions[groupIndex]
  if (!Array.isArray(selected)) return true

  return selected.length < group.maxSelections
}

const toggleOption = (groupIndex, optionIndex) => {
  if (!Array.isArray(cartStore.pendingProduct.selectedOptions[groupIndex])) {
    cartStore.pendingProduct.selectedOptions[groupIndex] = []
  }

  const index = cartStore.pendingProduct.selectedOptions[groupIndex].indexOf(optionIndex)
  if (index > -1) {
    cartStore.pendingProduct.selectedOptions[groupIndex].splice(index, 1)
  } else {
    if (canSelectOption(groupIndex)) {
      cartStore.pendingProduct.selectedOptions[groupIndex].push(optionIndex)
    }
  }
}

const incrementPendingQuantity = () => {
  cartStore.pendingProduct.quantity++
}

const decrementPendingQuantity = () => {
  if (cartStore.pendingProduct.quantity > 1) {
    cartStore.pendingProduct.quantity--
  }
}

const getPendingProductTotal = () => {
  if (!cartStore.pendingProduct) return 0

  let price = cartStore.pendingProduct.price

  // Add option prices
  if (cartStore.pendingProduct.optionGroups) {
    cartStore.pendingProduct.optionGroups.forEach((group, groupIndex) => {
      const selected = cartStore.pendingProduct.selectedOptions[groupIndex]

      if (group.maxSelections === 1 && selected !== undefined) {
        const option = group.options?.[selected]
        if (option) {
          price += option.price || 0
        }
      } else if (Array.isArray(selected)) {
        selected.forEach(optionIndex => {
          const option = group.options?.[optionIndex]
          if (option) {
            price += option.price || 0
          }
        })
      }
    })
  }

  return price * cartStore.pendingProduct.quantity
}

const validatePendingOptions = () => {
  validationErrors.value = []
  let isValid = true

  if (!cartStore.pendingProduct.optionGroups) return true

  cartStore.pendingProduct.optionGroups.forEach((group, groupIndex) => {
    const selected = cartStore.pendingProduct.selectedOptions[groupIndex]
    const selectedCount = Array.isArray(selected) ? selected.length : (selected !== undefined ? 1 : 0)

    if (group.isRequired && selectedCount === 0) {
      validationErrors.value[groupIndex] = 'Cette option est requise'
      isValid = false
    } else if (group.minSelections > 0 && selectedCount < group.minSelections) {
      validationErrors.value[groupIndex] = `Veuillez sélectionner au moins ${group.minSelections} option(s)`
      isValid = false
    } else {
      validationErrors.value[groupIndex] = null
    }
  })

  return isValid
}

const confirmPending = () => {
  if (!validatePendingOptions()) {
    ElMessage.error('Veuillez sélectionner toutes les options requises')
    return
  }

  // Build selected options object
  const options = {}
  if (cartStore.pendingProduct.optionGroups && cartStore.pendingProduct.optionGroups.length > 0) {
    cartStore.pendingProduct.optionGroups.forEach((group, groupIndex) => {
      const selected = cartStore.pendingProduct.selectedOptions[groupIndex]

      if (group.maxSelections === 1 && selected !== undefined) {
        const option = group.options?.[selected]
        if (option) {
          options[group.name] = [{
            name: option.name,
            price: option.price || 0
          }]
        }
      } else if (Array.isArray(selected) && selected.length > 0) {
        options[group.name] = selected.map(optionIndex => {
          const option = group.options?.[optionIndex]
          return {
            name: option.name,
            price: option.price || 0
          }
        }).filter(opt => opt.name)
      }
    })
  }

  // Update pending product with selected options
  cartStore.pendingProduct.options = Object.keys(options).length > 0 ? options : null

  // Confirm the pending product
  cartStore.confirmPendingProduct()
  ElMessage.success('Produit ajouté au panier')
}

const cancelPending = () => {
  cartStore.cancelPendingProduct()
}

// Prevent body scroll when drawer is open
watch(() => cartStore.isDrawerOpen, (newValue) => {
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

/* Slide transition for drawer from right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
