# Architecture Documentation

## System Overview

Kamili Food is a modern single-page application (SPA) built with Vue 3, using a client-server architecture with a RESTful API backend.

## Technology Stack

### Frontend
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Router**: Vue Router 4
- **State Management**: Pinia (to be added)
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite (Rolldown variant)
- **Code Quality**: ESLint 9, Prettier

### Backend (To Be Implemented)
- **Runtime**: Node.js
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma or TypeORM
- **Authentication**: JWT
- **File Storage**: AWS S3 or Cloudinary (for images)

### Infrastructure
- **Hosting**: TBD (Vercel, Netlify, or custom)
- **CDN**: Cloudflare
- **CI/CD**: GitHub Actions
- **Monitoring**: TBD

## Frontend Architecture

### Directory Structure

```
src/
├── assets/              # Static assets (CSS, images)
│   └── main.css        # Tailwind imports
├── components/
│   ├── common/         # Reusable UI components
│   │   ├── BaseButton.vue
│   │   ├── BaseCard.vue
│   │   └── BaseModal.vue
│   ├── features/       # Feature-specific components
│   │   ├── product/    # Product-related components
│   │   ├── cart/       # Shopping cart components
│   │   ├── checkout/   # Checkout flow components
│   │   └── restaurant/ # Restaurant components
│   └── layout/         # Layout components
│       ├── AppTopbar.vue
│       ├── AppHeader.vue
│       ├── AppNavigation.vue
│       ├── MobileDrawer.vue
│       ├── AppBody.vue
│       └── AppFooter.vue
├── composables/        # Vue composables (shared logic)
│   ├── useCart.js
│   ├── useAuth.js
│   └── useApi.js
├── router/             # Vue Router configuration
│   └── index.js
├── stores/             # Pinia stores (state management)
│   ├── cart.js
│   ├── user.js
│   └── menu.js
├── views/              # Route-level page components
│   ├── HomeView.vue
│   ├── MenuView.vue
│   ├── CartView.vue
│   └── CheckoutView.vue
├── utils/              # Utility functions
│   ├── api.js
│   ├── validators.js
│   └── formatters.js
├── App.vue             # Root component
└── main.js             # Application entry point
```

### Component Architecture

#### Component Hierarchy
```
App.vue
└── RouterView
    └── Views (HomeView, MenuView, etc.)
        ├── Layout Components
        │   ├── AppTopbar
        │   ├── AppHeader
        │   │   ├── AppNavigation
        │   │   └── MobileDrawer
        │   └── AppFooter
        └── Feature Components
            ├── ProductGrid
            │   └── ProductCard
            ├── ShoppingCart
            │   └── CartItem
            └── CheckoutForm
```

#### Component Design Principles
1. **Single Responsibility**: Each component has one clear purpose
2. **Composition**: Build complex UIs from simple components
3. **Props Down, Events Up**: Data flows down via props, changes emit events
4. **Reusability**: Common components in `/common`, feature-specific in `/features`

### State Management

#### Local Component State
- Use `ref()` and `reactive()` for component-specific state
- Keep state close to where it's used

#### Shared State (Pinia Stores)
```javascript
// stores/cart.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    deliveryType: 'delivery'
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },

  actions: {
    addItem(item) { /* ... */ },
    removeItem(itemId) { /* ... */ },
    updateQuantity(itemId, quantity) { /* ... */ },
    clearCart() { /* ... */ }
  }
})
```

**Store Responsibilities**:
- `cart`: Shopping cart state and operations
- `user`: User authentication and profile
- `menu`: Menu items and categories cache
- `order`: Order history and tracking

### Routing Strategy

```javascript
// router/index.js
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('@/views/MenuView.vue') // Lazy loaded
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { requiresItems: true } // Redirect if cart empty
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { requiresAuth: false } // Guest checkout allowed
  },
  {
    path: '/orders/:id',
    name: 'order-details',
    component: () => import('@/views/OrderDetailsView.vue'),
    meta: { requiresAuth: true }
  }
]
```

**Route Guards**:
- Check authentication status
- Verify cart has items before checkout
- Redirect unauthenticated users from protected routes

### Data Flow

```
┌─────────────┐
│   API Call  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Composable │  (useApi, useCart)
│   or Store  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Component  │  (receives reactive data)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Template  │  (renders UI)
└─────────────┘
```

## API Integration

### API Client Setup

```javascript
// utils/api.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### Composables Pattern

```javascript
// composables/useMenu.js
import { ref, onMounted } from 'vue'
import apiClient from '@/utils/api'

export function useMenu() {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchMenuItems = async (category = null) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/menu/items', {
        params: { category }
      })
      items.value = response.data.items
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchMenuItems()
  })

  return {
    items,
    loading,
    error,
    fetchMenuItems
  }
}
```

## Performance Optimization

### Code Splitting
- Lazy load routes with dynamic imports
- Split large features into separate chunks
- Use Vite's automatic code splitting

### Image Optimization
- Use WebP format with JPEG fallback
- Implement lazy loading for images
- Use responsive images with `srcset`
- CDN for image delivery

### Caching Strategy
- Cache API responses in Pinia stores
- Use localStorage for cart persistence
- Service worker for offline support (future)

### Bundle Optimization
- Tree-shaking unused code
- Minimize third-party dependencies
- Use production builds

## Security Considerations

### Frontend Security
- XSS Prevention: Vue's template escaping
- CSRF Protection: Token validation
- Input Validation: Client-side + server-side
- Secure Storage: HttpOnly cookies for auth tokens (prefer over localStorage)

### Authentication Flow
1. User logs in → receives JWT
2. Store token in httpOnly cookie (or localStorage as fallback)
3. Include token in Authorization header
4. Verify token on each API request
5. Refresh token mechanism for long sessions

## Deployment Strategy

### Build Process
```bash
npm run build
# Outputs to dist/
```

### Environment Variables
```env
VITE_API_BASE_URL=https://api.kamilifood.com/v1
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_GOOGLE_MAPS_KEY=...
```

### CI/CD Pipeline
1. Push to GitHub
2. GitHub Actions trigger
3. Run linter and tests
4. Build production bundle
5. Deploy to hosting platform
6. Invalidate CDN cache

## Monitoring & Analytics

### Error Tracking
- Sentry for error monitoring
- Log frontend errors to backend

### Analytics
- Google Analytics or Plausible
- Track user flows and conversions
- Monitor performance metrics

### Performance Monitoring
- Web Vitals (LCP, FID, CLS)
- Lighthouse CI in pipeline
- Real User Monitoring (RUM)

## Future Enhancements

### Progressive Web App (PWA)
- Service worker for offline support
- Add to home screen capability
- Push notifications for order updates

### Real-time Features
- WebSocket connection for live order updates
- Real-time inventory updates
- Live chat support

### Internationalization (i18n)
- Multi-language support
- Currency conversion
- Localized content
