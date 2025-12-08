# CLAUDE.md

This file provides guidance to Claude Code when working with the Kamili App codebase.

---

## Project Overview

**Kamili App** is a Vue 3 restaurant ordering platform with two main sections:
1. **Customer App** - Public-facing menu browsing and ordering
2. **Admin Platform** - Staff management interface for orders, products, customers, etc.

Both are integrated into a single application with shared backend (Strapi CMS).

---

## Development Commands

### Setup
```sh
npm install
```

### Development Server
```sh
npm run dev
# Runs on http://localhost:5173 (accessible from all network interfaces)
# Customer site: http://localhost:5173/
# Admin login: http://localhost:5173/admin/login
```

### Build
```sh
npm run build
# Production build output goes to dist/
```

### Preview Production Build
```sh
npm run preview
```

### Code Quality
```sh
npm run lint    # Run ESLint with auto-fix and caching
npm run format  # Format code with Prettier
```

---

## Tech Stack

### Frontend
- **Vue 3** with Composition API (`<script setup>`)
- **Vue Router 4** for client-side routing with authentication guards
- **Pinia** for state management
- **Tailwind CSS v4** for utility-first styling
- **Element Plus** for admin UI components
- **Apache ECharts** for dashboard analytics charts
- **Vite** (Rolldown variant) as build tool
- **Axios** for HTTP requests
- **date-fns** for date manipulation

### Backend Integration
- **Strapi CMS** (Headless CMS) at `VITE_STRAPI_URL`
- **JWT Authentication** for admin access
- **RESTful API** for all data operations

### Build & Quality
- **ESLint 9** with Vue plugin and Prettier integration
- **Prettier 3.6.2** for code formatting

---

## Architecture

### Dual Application Structure

```
Kamili App
│
├── Customer Routes (Public)
│   ├── / (Home)
│   ├── /menu
│   ├── /product/:id
│   ├── /cart
│   ├── /livraison
│   └── /a-emporter
│
└── Admin Routes (Protected - /admin/*)
    ├── /admin/login (No auth required)
    └── /admin/* (Requires authentication)
        ├── /admin (Dashboard)
        ├── /admin/orders
        ├── /admin/products
        ├── /admin/customers
        └── /admin/settings
```

### Project Structure

```
src/
├── assets/              # Static assets (CSS, images)
│
├── components/
│   ├── admin/          # Admin-specific components
│   │   ├── layout/     # AdminSidebar, AdminHeader
│   │   ├── dashboard/  # StatsCard, RevenueChart
│   │   ├── orders/     # OrderCard, OrderStatusBadge
│   │   └── charts/     # Chart components
│   ├── common/         # Shared UI components
│   ├── features/       # Customer-facing feature components
│   │   ├── cart/
│   │   ├── product/
│   │   └── restaurant/
│   └── layout/         # Customer layout components
│
├── composables/        # Vue composables for shared logic
│   ├── useAuth.js     # Authentication logic
│   ├── useCart.js     # Shopping cart state
│   ├── useStrapi.js   # API integration
│   └── useOrders.js   # Order operations
│
├── layouts/
│   ├── AdminLayout.vue    # Admin sidebar + header layout
│   └── (Customer layout in App.vue)
│
├── router/
│   └── index.js       # Routes with auth guards
│
├── services/
│   └── strapi.js      # Strapi API service
│
├── stores/            # Pinia stores
│   ├── auth.js       # Authentication state
│   ├── admin.js      # Admin-specific state
│   └── orders.js     # Order management
│
├── utils/
│   ├── env.js        # Environment variables
│   ├── formatters.js # Currency, date, phone formatting
│   └── constants.js  # App-wide constants
│
├── views/
│   ├── admin/        # Admin views
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── orders/
│   │   │   ├── OrdersListView.vue
│   │   │   └── OrderDetailView.vue
│   │   ├── products/
│   │   ├── customers/
│   │   └── settings/
│   │
│   └── [Customer views] # HomeView, MenuView, etc.
│
├── App.vue           # Root component
└── main.js          # App entry (Pinia, Router, Element Plus)
```

---

## Key Features

### Customer App
- Menu browsing with category filtering
- Product cards with add-to-cart
- Shopping cart with quantity management
- Delivery and takeaway options
- French localization
- FCFA currency formatting

### Admin Platform ✨
- **Authentication**: JWT-based login with Strapi
- **Dashboard**: KPI cards, revenue charts, recent orders
- **Order Management**: Filters, status updates, detailed views
- **Product Management**: Quick edits, availability toggles
- **Customer Management**: Database, order history, loyalty points
- **Settings**: Restaurant config, delivery zones, payment methods
- **Real-time Ready**: Built for live updates

---

## Authentication & Security

### Admin Authentication
- Login at `/admin/login`
- JWT tokens stored in `localStorage`
- Protected routes with navigation guards
- Auto-redirect to login for unauthenticated users
- Role-based access control (admin, authenticated roles)

### Route Guards
```javascript
// In router/index.js
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ name: 'admin-login' })
    } else {
      next()
    }
  } else {
    next()
  }
})
```

---

## State Management

### Pinia Stores

**Auth Store** (`stores/auth.js`):
- User authentication state
- Login/logout actions
- Token management
- Role checking

**Admin Stores**:
- Orders state
- Notifications
- Settings

**Customer State**:
- Cart (currently using composables)
- User preferences

---

## API Integration

### Strapi Service (`services/strapi.js`)

```javascript
// Products
strapiService.products.find(params)
strapiService.products.findOne(id, params)

// Orders
strapiService.orders.create(data)
strapiService.orders.find(params)
strapiService.orders.findOne(id, params)

// Categories
strapiService.categories.find(params)

// Authentication
POST /api/auth/local
GET /api/users/me
```

### Environment Variables

Required in `.env`:
```
VITE_STRAPI_URL=https://your-strapi-url.com
VITE_STRAPI_API_TOKEN=your-token (optional)
VITE_APP_NAME=Kamili App
VITE_APP_URL=http://localhost:5173
```

---

## Styling

### Design System
- **Primary Color**: `#dc2626` (Red)
- **Font**: Inter (Google Fonts)
- **Currency**: FCFA
- **Locale**: French (fr-FR)

### Admin UI
- **Element Plus** components for tables, forms, modals
- **Tailwind CSS** for layout and spacing
- **Apache ECharts** for data visualization
- Responsive design (desktop, tablet, mobile)

### Color System
```javascript
// Order Status Colors
pending: 'warning' (yellow)
confirmed: 'info' (blue)
preparing: 'primary' (blue)
ready: 'success' (green)
delivering: 'primary' (purple)
delivered: 'success' (green)
cancelled: 'danger' (red)
```

---

## Utilities

### Formatters (`utils/formatters.js`)
```javascript
formatCurrency(15000)         // "15 000 FCFA"
formatDate(date)              // "15/01/2024 14:30"
formatRelativeTime(date)      // "il y a 2 heures"
formatPhone("+221771234567")  // "77 12 34 56 7"
```

### Constants (`utils/constants.js`)
- Order statuses and labels
- Payment methods
- Product types
- Loyalty tiers
- Pagination defaults

---

## Development Workflow

### Adding New Admin Features

1. **Create View Component** in `src/views/admin/`
2. **Add Route** in `src/router/index.js` with `meta: { requiresAuth: true }`
3. **Add Menu Item** in `src/layouts/AdminLayout.vue`
4. **Create Composable** if needed for data fetching
5. **Add to Pinia Store** for state management
6. **Update Strapi Permissions** for API access

### Adding New Customer Features

1. **Create View Component** in `src/views/`
2. **Add Route** in `src/router/index.js`
3. **Create Components** in `src/components/features/[domain]/`
4. **Add Composable** for logic
5. **Update Navigation** in layout components

---

## Common Tasks

### Creating a New Admin Page

```javascript
// 1. Create view: src/views/admin/MyFeatureView.vue
<template>
  <div>
    <h1>My Feature</h1>
    <el-card>
      <!-- Content -->
    </el-card>
  </div>
</template>

// 2. Add route: src/router/index.js
{
  path: 'my-feature',
  name: 'admin-my-feature',
  component: () => import('@/views/admin/MyFeatureView.vue')
}

// 3. Add menu item: src/layouts/AdminLayout.vue
{
  name: 'my-feature',
  label: 'My Feature',
  icon: MyIcon,
  route: { name: 'admin-my-feature' }
}
```

### Fetching Data from Strapi

```javascript
import { strapiService } from '@/services/strapi'

async function fetchOrders() {
  const { data } = await strapiService.orders.find({
    filters: { status: 'pending' },
    populate: ['customer', 'items'],
    pagination: { page: 1, pageSize: 25 }
  })
  orders.value = data.data
}
```

### Creating a New Composable

```javascript
// src/composables/useMyFeature.js
import { ref } from 'vue'
import { strapiService } from '@/services/strapi'

export function useMyFeature() {
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchData() {
    loading.value = true
    try {
      const response = await strapiService.myEndpoint.find()
      data.value = response.data.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData }
}
```

---

## Path Aliases

- `@` maps to `src/` directory
- Example: `import Foo from '@/components/admin/Foo.vue'`

---

## Node.js Version Requirements

- Requires Node.js `^20.19.0` or `>=22.12.0`
- Check with: `node --version`

---

## Key Conventions

### Vue 3
- Use Composition API with `<script setup>` syntax
- Component file names use PascalCase (e.g., `AppHeader.vue`)
- Props with `defineProps()`, emits with `defineEmits()`

### Organization
- Feature-based: group by domain (`features/cart/`, `features/product/`)
- Admin vs Customer: separate components clearly
- Composables for reusable logic
- Stores for shared state

### Naming
- Views: `*View.vue` (e.g., `DashboardView.vue`)
- Components: Descriptive names (e.g., `OrderStatusBadge.vue`)
- Composables: `use*` prefix (e.g., `useAuth.js`)
- Stores: Domain-based (e.g., `auth.js`, `orders.js`)

### Code Quality
- Run ESLint before commits: `npm run lint`
- Format with Prettier: `npm run format`
- Keep components small and focused
- Extract reusable logic to composables

---

## Important Notes

### Router
- The router MUST be registered in `main.js` with `app.use(router)`
- Navigation guards run on every route change
- Use `router.push()` for programmatic navigation

### Authentication
- Check `authStore.isAuthenticated` before protected actions
- Token stored in `localStorage` as `admin_token`
- Auto-logout on 401 responses

### API Calls
- Always handle loading states
- Show user-friendly error messages
- Use try-catch blocks
- Populate related data with `populate` parameter

### Strapi URL
- Environment variable: `VITE_STRAPI_URL`
- Trailing slash is automatically removed
- Defaults to `http://localhost:1337` if not set

---

## Troubleshooting

### Login Issues
- Check Strapi is running
- Verify user exists and is confirmed in Strapi
- Check user has `authenticated` or `admin` role
- Check browser console for detailed errors
- See `docs/ADMIN_QUICK_START.md` for full troubleshooting

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Verify all imports are correct

### Route Not Working
- Check route is defined in `router/index.js`
- Verify component path is correct
- Check for typos in route name
- Ensure view component exists

---

## Documentation

Full documentation is in the `docs/` folder:

**Quick Start:**
- `docs/ADMIN_QUICK_START.md` - Get admin panel running in 5 minutes

**Architecture:**
- `docs/admin-platform-architecture.md` - Complete system architecture
- `docs/admin-implementation-summary.md` - What's been built
- `docs/architecture.md` - Customer app architecture

**Integration:**
- `docs/strapi-integration.md` - Backend integration guide
- `docs/strapi-data-model.md` - Database schema

**Setup:**
- `docs/ENV_SETUP.md` - Environment configuration
- `docs/DOCKER.md` - Docker deployment

See `docs/README.md` for complete documentation index.

---

## Quick Reference

| Task | Command/File |
|------|-------------|
| Start dev server | `npm run dev` |
| Access admin | `http://localhost:5173/admin/login` |
| Add admin route | `src/router/index.js` |
| Add menu item | `src/layouts/AdminLayout.vue` |
| Format currency | `formatCurrency()` from `@/utils/formatters` |
| Fetch from Strapi | `strapiService` from `@/services/strapi` |
| Check auth | `useAuthStore()` from `@/stores/auth` |
| Admin components | `src/components/admin/` |
| Constants | `@/utils/constants` |

---

**Last Updated**: December 8, 2024
**Project Version**: 0.0.0
