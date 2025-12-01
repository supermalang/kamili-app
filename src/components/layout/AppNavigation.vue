<template>
  <nav :class="navClass">
    <ul :class="ulClass">
      <li v-for="item in menuItems" :key="item.path">
        <RouterLink
          :to="item.path"
          :class="linkClass"
          activeClass="text-red-600 font-semibold"
          @click="handleLinkClick"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  variant: {
    type: String,
    default: 'horizontal', // 'horizontal' or 'vertical'
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

const emit = defineEmits(['linkClick'])

const menuItems = [
  { path: '/', label: 'Accueil' },
  { path: '/menu', label: 'Menu' },
  { path: '/boutique', label: 'Boutique' },
  { path: '/fidelite', label: 'Fidélité' },
  { path: '/livraison', label: 'Livraison' },
  { path: '/about', label: 'À propos' },
  { path: '/contact', label: 'Contact' }
]

const navClass = props.variant === 'horizontal'
  ? 'hidden md:block'
  : 'w-full'

const ulClass = props.variant === 'horizontal'
  ? 'flex items-center gap-8'
  : 'flex flex-col space-y-1'

const linkClass = props.variant === 'horizontal'
  ? 'text-gray-700 hover:text-red-600 transition-colors font-medium'
  : 'block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors'

const handleLinkClick = () => {
  emit('linkClick')
}
</script>

<style scoped>
</style>
