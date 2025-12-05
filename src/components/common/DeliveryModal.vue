<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Backdrop -->
          <div
            :class="getBackdropClasses()"
            :style="getBackdropStyles()"
            @click="closeModal"
          ></div>

          <!-- Modal Container -->
          <div :class="getModalClasses()">
            <!-- Close Button -->
            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
              aria-label="Fermer"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Title -->
            <div class="px-6 py-4" :style="getModalTitleStyle()">
              <h2 class="text-white">
                Détails de livraison
              </h2>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
              <!-- Informations personnelles Section -->
              <div>
                <h3 class="font-bold text-gray-800 mb-3">Informations personnelles</h3>

                <!-- Phone Number -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <vue-tel-input
                    v-model="formData.phone"
                    v-bind="telInputOptions"
                    @validate="onPhoneValidate"
                    @country-changed="onCountryChanged"
                    class="tel-input"
                    :input-options="telInputInputOptions"
                    :dropdown-options="telDropdownOptions"
                  />
                  <p v-if="phoneError" class="mt-1 text-sm text-red-600">
                    {{ phoneError }}
                  </p>
                </div>

                <!-- Name -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    placeholder="Nom"
                    maxlength="25"
                    class="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    :style="getFormInputBorderStyle()"
                    required
                  />
                  <p class="mt-1 text-xs text-gray-500 text-right">
                    {{ formData.name.length }}/25
                  </p>
                </div>

                <!-- First Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    v-model="formData.firstName"
                    type="text"
                    placeholder="Prénom"
                    maxlength="25"
                    class="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    :style="getFormInputBorderStyle()"
                    required
                  />
                  <p class="mt-1 text-xs text-gray-500 text-right">
                    {{ formData.firstName.length }}/25
                  </p>
                </div>
              </div>

              <!-- Address Choice Section -->
              <div>
                <h3 class="font-bold text-gray-800 mb-3">Choix d'adresse</h3>
                <div class="grid grid-cols-2 gap-3">
                  <!-- Bureau Option -->
                  <label
                    class="relative flex items-start p-4 rounded-lg cursor-pointer transition-all"
                    :class="formData.addressType === 'bureau' ? 'bg-white ring-2 ring-red-600' : 'bg-white'"
                    :style="getFormInputBorderStyle()"
                  >
                    <input
                      type="radio"
                      v-model="formData.addressType"
                      value="bureau"
                      class="mt-1"
                    />
                    <div class="ml-3 flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span class="font-medium">Bureau</span>
                      </div>
                      <textarea
                        v-if="formData.addressType === 'bureau'"
                        v-model="formData.bureauAddress"
                        placeholder="Adresse du bureau"
                        rows="3"
                        class="w-full mt-2 px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      ></textarea>
                    </div>
                  </label>

                  <!-- Maison Option -->
                  <label
                    class="relative flex items-start p-4 rounded-lg cursor-pointer transition-all"
                    :class="formData.addressType === 'maison' ? 'bg-white ring-2 ring-red-600' : 'bg-white'"
                    :style="getFormInputBorderStyle()"
                  >
                    <input
                      type="radio"
                      v-model="formData.addressType"
                      value="maison"
                      class="mt-1"
                    />
                    <div class="ml-3 flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        <span class="font-medium">Maison</span>
                      </div>
                      <textarea
                        v-if="formData.addressType === 'maison'"
                        v-model="formData.maisonAddress"
                        placeholder="Adresse de la maison"
                        rows="3"
                        class="w-full mt-2 px-3 py-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      ></textarea>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Delivery Options Section -->
              <div>
                <h3 class="font-bold text-gray-800 mb-3">Options de livraison</h3>
                <div class="space-y-3">
                  <!-- Fast Delivery Option -->
                  <label
                    class="flex items-center p-4 rounded-lg cursor-pointer transition-all"
                    :class="formData.deliveryOption === 'fast' ? 'bg-white ring-2 ring-red-600' : 'bg-white'"
                    :style="getFormInputBorderStyle()"
                  >
                    <input
                      type="radio"
                      v-model="formData.deliveryOption"
                      value="fast"
                      class="w-5 h-5"
                    />
                    <div class="ml-3 flex items-center gap-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      <span class="font-medium">Au plus vite (30 - 45 mins)</span>
                    </div>
                  </label>

                  <!-- Scheduled Delivery Option -->
                  <label
                    class="flex items-center p-4 rounded-lg cursor-pointer transition-all"
                    :class="formData.deliveryOption === 'scheduled' ? 'bg-white ring-2 ring-red-600' : 'bg-white'"
                    :style="getFormInputBorderStyle()"
                  >
                    <input
                      type="radio"
                      v-model="formData.deliveryOption"
                      value="scheduled"
                      class="w-5 h-5"
                    />
                    <div class="ml-3 flex items-center gap-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="font-medium">Définir une heure</span>
                    </div>
                  </label>

                  <!-- Time Input (shown when scheduled is selected) -->
                  <div v-if="formData.deliveryOption === 'scheduled'" class="ml-8 relative">
                    <input
                      v-model="formData.scheduledTime"
                      type="time"
                      class="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      :style="getFormInputBorderStyle()"
                      required
                    />
                    <label
                      v-if="!formData.scheduledTime"
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    >
                      Choisir l'heure
                    </label>
                  </div>
                </div>
              </div>

              <!-- Empty Cart Warning -->
              <div v-if="cartItemCount === 0" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm font-medium">
                  Veuillez ajouter des articles à votre panier avant de continuer.
                </p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="!isFormValid"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Valider
              </button>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import {
  getBackdropStyles,
  getBackdropClasses,
  getModalClasses,
  getFormInputBorderStyle,
  getModalTitleStyle
} from '@/config/modalStyles'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cartItemCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'submit'])
const router = useRouter()

const formData = ref({
  phone: '',
  name: '',
  firstName: '',
  addressType: 'bureau',
  bureauAddress: '',
  maisonAddress: '',
  deliveryOption: 'fast',
  scheduledTime: ''
})

const isPhoneValid = ref(false)
const phoneError = ref('')

// vue-tel-input configuration
const telInputOptions = {
  mode: 'international',
  defaultCountry: 'SN',
  preferredCountries: ['SN', 'FR', 'MA', 'CI'],
  validCharactersOnly: true,
  autoFormat: true,
  styleClasses: 'tel-input-field'
}

const telInputInputOptions = {
  placeholder: 'Téléphone',
  required: true,
  styleClasses: 'w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
}

const telDropdownOptions = {
  showDialCodeInSelection: true,
  showFlags: true,
  showSearchBox: true
}

// Phone validation handler
const onPhoneValidate = (phoneObject) => {
  isPhoneValid.value = phoneObject.valid

  if (formData.value.phone && !phoneObject.valid) {
    phoneError.value = 'Le numéro de téléphone n\'est pas valide'
  } else {
    phoneError.value = ''
  }
}

// Country changed handler
const onCountryChanged = (country) => {
  console.log('Country changed to:', country)
}

// Form validation
const isFormValid = computed(() => {
  const hasValidPhone = isPhoneValid.value
  const hasName = formData.value.name.trim().length > 0
  const hasFirstName = formData.value.firstName.trim().length > 0
  const hasAddress = formData.value.addressType === 'bureau'
    ? formData.value.bureauAddress.trim().length > 0
    : formData.value.maisonAddress.trim().length > 0
  const hasDeliveryOption = formData.value.deliveryOption !== ''
  const hasScheduledTime = formData.value.deliveryOption === 'scheduled'
    ? formData.value.scheduledTime !== ''
    : true
  const hasCartItems = props.cartItemCount > 0

  return hasValidPhone && hasName && hasFirstName && hasAddress && hasDeliveryOption && hasScheduledTime && hasCartItems
})

// Reset form when modal closes
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    // Reset form
    formData.value = {
      phone: '',
      name: '',
      firstName: '',
      addressType: 'bureau',
      bureauAddress: '',
      maisonAddress: '',
      deliveryOption: 'fast',
      scheduledTime: ''
    }
    isPhoneValid.value = false
    phoneError.value = ''
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    if (props.cartItemCount === 0) {
      return
    }
    if (!isPhoneValid.value) {
      phoneError.value = 'Le numéro de téléphone n\'est pas valide'
    }
    return
  }

  // Emit the form data to parent component
  emit('submit', { ...formData.value })

  // Navigate to cart page
  router.push('/cart')

  // Close modal
  closeModal()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}

/* Custom styles for vue-tel-input */
:deep(.vue-tel-input) {
  border-radius: 0.5rem;
  border: 1px solid #908686;
  background-color: white;
}

:deep(.vue-tel-input:focus-within) {
  outline: none;
  box-shadow: 0 0 0 2px #ef4444;
  border-color: transparent;
}

:deep(.vti__dropdown) {
  border-radius: 0.5rem 0 0 0.5rem;
  background-color: white;
}

:deep(.vti__input) {
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background-color: white;
  border: none;
}

:deep(.vti__dropdown-list) {
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.vti__flag) {
  margin-right: 0.5rem;
}
</style>
