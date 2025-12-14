<template>
  <div class="address-selector">
    <!-- Saved Addresses (for logged-in users) -->
    <div v-if="isAuthenticated && savedAddresses.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Adresses enregistrées</h3>
      <div class="space-y-2">
        <div
          v-for="address in savedAddresses"
          :key="address.id"
          @click="selectSavedAddress(address)"
          class="border rounded-lg p-4 cursor-pointer transition-all"
          :class="{
            'border-red-600 bg-red-50': selectedAddressId === address.id,
            'border-gray-300 hover:border-gray-400': selectedAddressId !== address.id
          }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold">{{ address.attributes.label || 'Adresse' }}</span>
                <span
                  v-if="address.attributes.isDefault"
                  class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  Par défaut
                </span>
              </div>
              <p class="text-sm text-gray-600">
                {{ address.attributes.city?.data?.attributes?.name }},
                {{ address.attributes.department?.data?.attributes?.name }},
                {{ address.attributes.district?.data?.attributes?.name }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                {{ address.attributes.detailedAddress }}
              </p>
              <p v-if="address.attributes.phoneNumber" class="text-sm text-gray-500">
                {{ address.attributes.phoneNumber }}
              </p>
            </div>
            <div class="flex items-center">
              <input
                type="radio"
                :checked="selectedAddressId === address.id"
                class="w-5 h-5 text-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        @click="showNewAddressForm = true"
        class="mt-3 text-red-600 font-medium hover:underline flex items-center gap-1"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Ajouter une nouvelle adresse
      </button>
    </div>

    <!-- New Address Form -->
    <div v-if="!isAuthenticated || savedAddresses.length === 0 || showNewAddressForm">
      <h3 v-if="isAuthenticated" class="text-lg font-semibold mb-3">
        {{ showNewAddressForm ? 'Nouvelle adresse' : 'Adresse de livraison' }}
      </h3>
      <h3 v-else class="text-lg font-semibold mb-3">Adresse de livraison</h3>

      <div class="space-y-4">
        <!-- Label (only for authenticated users) -->
        <div v-if="isAuthenticated">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Libellé (optionnel)
          </label>
          <input
            v-model="newAddress.label"
            type="text"
            placeholder="Ex: Maison, Bureau, Parents"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <!-- City -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Ville <span class="text-red-600">*</span>
          </label>
          <select
            v-model="newAddress.cityId"
            @change="onCityChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          >
            <option value="">Sélectionnez une ville</option>
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.attributes.name }}
            </option>
          </select>
        </div>

        <!-- Department -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Département <span class="text-red-600">*</span>
          </label>
          <select
            v-model="newAddress.departmentId"
            @change="onDepartmentChange"
            :disabled="!newAddress.cityId || departments.length === 0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
            required
          >
            <option value="">Sélectionnez un département</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.attributes.name }}
            </option>
          </select>
        </div>

        <!-- District -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Quartier <span class="text-red-600">*</span>
          </label>
          <select
            v-model="newAddress.districtId"
            :disabled="!newAddress.departmentId || districts.length === 0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
            required
          >
            <option value="">Sélectionnez un quartier</option>
            <option v-for="district in districts" :key="district.id" :value="district.id">
              {{ district.attributes.name }}
            </option>
          </select>
        </div>

        <!-- Detailed Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Adresse détaillée <span class="text-red-600">*</span>
          </label>
          <textarea
            v-model="newAddress.detailedAddress"
            rows="3"
            placeholder="Précisez l'adresse exacte, points de repère, etc."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          ></textarea>
        </div>

        <!-- Phone Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            v-model="newAddress.phoneNumber"
            type="tel"
            placeholder="77 123 45 67"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <!-- Save Address Checkbox (for authenticated users) -->
        <div v-if="isAuthenticated">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="newAddress.saveAddress"
              type="checkbox"
              class="w-4 h-4 text-red-600 rounded"
            />
            <span class="text-sm text-gray-700">Enregistrer cette adresse</span>
          </label>
        </div>

        <!-- Set as Default (if saving) -->
        <div v-if="isAuthenticated && newAddress.saveAddress">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="newAddress.isDefault"
              type="checkbox"
              class="w-4 h-4 text-red-600 rounded"
            />
            <span class="text-sm text-gray-700">Définir comme adresse par défaut</span>
          </label>
        </div>

        <!-- Cancel button if showing new address form -->
        <button
          v-if="showNewAddressForm && savedAddresses.length > 0"
          @click="cancelNewAddress"
          class="w-full py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useDelivery } from '@/composables/useDelivery'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['addressSelected', 'addressChange'])

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const {
  cities,
  departments,
  districts,
  userAddresses,
  fetchCities,
  fetchDepartmentsByCity,
  fetchDistrictsByDepartment,
  fetchUserAddresses
} = useDelivery()

const savedAddresses = computed(() => userAddresses.value || [])
const selectedAddressId = ref(null)
const showNewAddressForm = ref(false)

const newAddress = ref({
  label: '',
  cityId: '',
  departmentId: '',
  districtId: '',
  detailedAddress: '',
  phoneNumber: '',
  saveAddress: false,
  isDefault: false
})

onMounted(async () => {
  await fetchCities()
  if (isAuthenticated.value) {
    await fetchUserAddresses()
    // Auto-select default address
    const defaultAddr = savedAddresses.value.find(addr => addr.attributes.isDefault)
    if (defaultAddr) {
      selectSavedAddress(defaultAddr)
    }
  }
})

const onCityChange = async () => {
  newAddress.value.departmentId = ''
  newAddress.value.districtId = ''
  districts.value = []

  if (newAddress.value.cityId) {
    await fetchDepartmentsByCity(newAddress.value.cityId)
  } else {
    departments.value = []
  }

  emitAddressChange()
}

const onDepartmentChange = async () => {
  newAddress.value.districtId = ''

  if (newAddress.value.departmentId) {
    await fetchDistrictsByDepartment(newAddress.value.departmentId)
  } else {
    districts.value = []
  }

  emitAddressChange()
}

watch(() => newAddress.value.districtId, () => {
  emitAddressChange()
})

watch(() => newAddress.value.detailedAddress, () => {
  emitAddressChange()
})

const selectSavedAddress = (address) => {
  selectedAddressId.value = address.id
  showNewAddressForm.value = false

  emit('addressSelected', {
    type: 'saved',
    addressId: address.id,
    cityId: address.attributes.city?.data?.id,
    departmentId: address.attributes.department?.data?.id,
    districtId: address.attributes.district?.data?.id,
    detailedAddress: address.attributes.detailedAddress,
    phoneNumber: address.attributes.phoneNumber
  })
}

const emitAddressChange = () => {
  if (newAddress.value.cityId && newAddress.value.departmentId && newAddress.value.districtId) {
    emit('addressChange', {
      type: 'new',
      ...newAddress.value
    })
  }
}

const cancelNewAddress = () => {
  showNewAddressForm.value = false
  newAddress.value = {
    label: '',
    cityId: '',
    departmentId: '',
    districtId: '',
    detailedAddress: '',
    phoneNumber: '',
    saveAddress: false,
    isDefault: false
  }

  // Re-select the previously selected address if any
  if (selectedAddressId.value) {
    const addr = savedAddresses.value.find(a => a.id === selectedAddressId.value)
    if (addr) {
      selectSavedAddress(addr)
    }
  }
}

// Expose method for parent to get address data
const getAddressData = () => {
  if (selectedAddressId.value) {
    const addr = savedAddresses.value.find(a => a.id === selectedAddressId.value)
    return {
      type: 'saved',
      addressId: addr.id,
      cityId: addr.attributes.city?.data?.id,
      departmentId: addr.attributes.department?.data?.id,
      districtId: addr.attributes.district?.data?.id,
      detailedAddress: addr.attributes.detailedAddress,
      phoneNumber: addr.attributes.phoneNumber
    }
  } else {
    return {
      type: 'new',
      ...newAddress.value
    }
  }
}

defineExpose({ getAddressData })
</script>

<style scoped>
/* Add any custom styles here */
</style>
