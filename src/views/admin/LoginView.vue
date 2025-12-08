<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Kamili Admin</h1>
        <p class="text-gray-600">Connexion au panneau d'administration</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-lg shadow-xl p-8">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          @submit.prevent="handleLogin"
        >
          <!-- Email/Username Field -->
          <el-form-item label="Email ou nom d'utilisateur" prop="identifier">
            <el-input
              v-model="loginForm.identifier"
              placeholder="Entrez votre email ou nom d'utilisateur"
              size="large"
              :prefix-icon="User"
              :disabled="loading"
            />
          </el-form-item>

          <!-- Password Field -->
          <el-form-item label="Mot de passe" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="Entrez votre mot de passe"
              size="large"
              :prefix-icon="Lock"
              :disabled="loading"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- Error Message -->
          <el-alert
            v-if="error"
            :title="error"
            type="error"
            :closable="false"
            class="mb-4"
          />

          <!-- Submit Button -->
          <el-form-item class="mb-0">
            <el-button
              type="primary"
              size="large"
              class="w-full"
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- Additional Links -->
        <div class="mt-6 text-center">
          <el-link type="primary" :underline="false" href="/">
            ← Retour au site
          </el-link>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-gray-600">
        <p>&copy; 2024 Kamili App. Tous droits réservés.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const loginFormRef = ref(null)
const loginForm = reactive({
  identifier: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

// Validation rules
const rules = {
  identifier: [
    { required: true, message: 'Veuillez entrer votre email ou nom d\'utilisateur', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Veuillez entrer votre mot de passe', trigger: 'blur' },
    { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères', trigger: 'blur' }
  ]
}

// Handle login
async function handleLogin() {
  if (!loginFormRef.value) return

  try {
    // Validate form
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true
    error.value = ''

    // Attempt login
    const result = await authStore.login(loginForm.identifier, loginForm.password)

    if (result.success) {
      ElMessage({
        message: 'Connexion réussie !',
        type: 'success',
        duration: 2000
      })

      // Redirect to admin dashboard
      router.push({ name: 'admin-dashboard' })
    } else {
      error.value = result.error || 'Erreur de connexion. Veuillez vérifier vos identifiants.'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

:deep(.el-button--primary) {
  background-color: #dc2626;
  border-color: #dc2626;
}

:deep(.el-button--primary:hover) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e5e7eb inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #dc2626 inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #dc2626 inset;
}
</style>
