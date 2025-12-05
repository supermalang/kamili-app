<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Backdrop with 10px blur and 20% transparency -->
          <div
            :class="getBackdropClasses()"
            :style="getBackdropStyles()"
            @click="closeModal"
          ></div>

          <!-- Modal Container with 80px blur background -->
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

            <!-- Title with #3C3C3C background -->
            <div class="px-6 py-4" :style="getModalTitleStyle()">
              <h2 class="text-white">
                Tes coordonnées
              </h2>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <!-- Phone Number with vue-tel-input -->
              <div>
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

              <!-- Family Name -->
              <div>
                <input
                  v-model="formData.familyName"
                  type="text"
                  placeholder="Ton nom de famille"
                  maxlength="25"
                  class="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  :style="getFormInputBorderStyle()"
                  required
                />
                <p class="mt-1 text-xs text-gray-500 text-right">
                  {{ formData.familyName.length }}/25
                </p>
              </div>

              <!-- Pickup Time -->
              <div class="relative">
                <input
                  v-model="formData.pickupTime"
                  type="time"
                  class="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all time-input"
                  :style="getFormInputBorderStyle()"
                  required
                />
                <label
                  v-if="!formData.pickupTime"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                >
                  Heure de récupération
                </label>
              </div>

              <!-- Remember Me Checkbox -->
              <div class="flex items-center">
                <input
                  v-model="formData.rememberMe"
                  type="checkbox"
                  id="rememberMe"
                  class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                />
                <label for="rememberMe" class="ml-2 text-gray-700 select-none cursor-pointer">
                  Se souvenir de moi
                </label>
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
                :disabled="!isPhoneValid || !formData.familyName.trim() || cartItemCount === 0"
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
import { ref, watch } from 'vue'
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

const formData = ref({
  phone: '',
  familyName: '',
  pickupTime: '',
  rememberMe: false
})

const isPhoneValid = ref(false)
const phoneError = ref('')

// vue-tel-input configuration
const telInputOptions = {
  mode: 'international',
  defaultCountry: 'SN', // Senegal as default
  preferredCountries: ['SN', 'FR', 'MA', 'CI'],
  validCharactersOnly: true,
  autoFormat: true,
  styleClasses: 'tel-input-field'
}

const telInputInputOptions = {
  placeholder: 'Ton téléphone SN',
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

// Load saved data from localStorage if "Remember Me" was checked
const loadSavedData = () => {
  const savedData = localStorage.getItem('takeawayUserData')
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      formData.value.phone = parsed.phone || ''
      formData.value.familyName = parsed.familyName || ''
      formData.value.rememberMe = true
    } catch (e) {
      console.error('Error loading saved data:', e)
    }
  }
}

// Load saved data when modal opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadSavedData()
    // Reset phone validation state
    isPhoneValid.value = false
    phoneError.value = ''
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!isPhoneValid.value) {
    phoneError.value = 'Le numéro de téléphone n\'est pas valide'
    return
  }

  // Check if cart has items
  if (props.cartItemCount === 0) {
    return
  }

  // Save data to localStorage if "Remember Me" is checked
  if (formData.value.rememberMe) {
    localStorage.setItem('takeawayUserData', JSON.stringify({
      phone: formData.value.phone,
      familyName: formData.value.familyName
    }))
  } else {
    // Clear saved data if "Remember Me" is unchecked
    localStorage.removeItem('takeawayUserData')
  }

  // Emit the form data to parent component
  emit('submit', { ...formData.value })

  // Reset form if not remembering
  if (!formData.value.rememberMe) {
    formData.value = {
      phone: '',
      familyName: '',
      pickupTime: '',
      rememberMe: false
    }
    isPhoneValid.value = false
  } else {
    // Only reset pickup time
    formData.value.pickupTime = ''
  }

  phoneError.value = ''
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
