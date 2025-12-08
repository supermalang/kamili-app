# Admin Integration Plan - Single App Approach

## Overview

Instead of a separate admin app, we'll integrate admin functionality directly into the existing Kamili Vue 3 app. This provides a unified deployment with role-based access control.

---

## Architecture

```
Kamili App (Single Vue 3 Application)
│
├── Public Routes (Customer-facing)
│   ├── / (Home)
│   ├── /menu
│   ├── /product/:id
│   ├── /cart
│   ├── /livraison
│   └── /a-emporter
│
└── Protected Routes (Staff-only, requires authentication)
    ├── /admin (Dashboard)
    ├── /admin/orders
    ├── /admin/orders/:id
    ├── /admin/products
    ├── /admin/categories
    ├── /admin/deliveries
    ├── /admin/customers
    ├── /admin/loyalty
    ├── /admin/reports
    └── /admin/settings
```

---

## Key Features

### **1. Dual Layout System**
- **Customer Layout** - Current layout (AppHeader, AppFooter, etc.)
- **Admin Layout** - New admin layout (AdminSidebar, AdminHeader, etc.)

### **2. Role-Based Access**
- Guest users → Public pages only
- Authenticated staff → Admin pages
- Route guards prevent unauthorized access

### **3. Shared Services**
- Same Strapi backend
- Shared composables for data fetching
- Single build & deployment

---

## Project Structure (Updated)

```
src/
├── components/
│   ├── admin/                     # NEW: Admin-specific components
│   │   ├── layout/
│   │   │   ├── AdminSidebar.vue
│   │   │   ├── AdminHeader.vue
│   │   │   ├── AdminBreadcrumbs.vue
│   │   │   └── UserMenu.vue
│   │   ├── dashboard/
│   │   │   ├── StatsCard.vue
│   │   │   ├── RecentOrders.vue
│   │   │   ├── RevenueChart.vue
│   │   │   └── PopularProducts.vue
│   │   ├── orders/
│   │   │   ├── OrderCard.vue
│   │   │   ├── OrderStatusBadge.vue
│   │   │   ├── OrderTimeline.vue
│   │   │   ├── OrderFilters.vue
│   │   │   └── StatusUpdateModal.vue
│   │   ├── products/
│   │   │   ├── ProductTable.vue
│   │   │   ├── QuickEditModal.vue
│   │   │   └── StockBadge.vue
│   │   ├── customers/
│   │   │   ├── CustomerCard.vue
│   │   │   └── OrderHistory.vue
│   │   └── charts/
│   │       ├── LineChart.vue
│   │       ├── BarChart.vue
│   │       └── PieChart.vue
│   │
│   ├── common/                    # Shared by customer & admin
│   ├── features/                  # Customer-facing features
│   └── layout/                    # Customer layout
│
├── composables/
│   ├── useAuth.js                 # NEW: Authentication logic
│   ├── useOrders.js               # Enhanced with admin operations
│   ├── useProducts.js             # Enhanced with CRUD
│   ├── useAnalytics.js            # NEW: Analytics data
│   ├── useNotifications.js        # NEW: Real-time notifications
│   ├── useCart.js                 # Existing
│   └── useStrapi.js               # Existing
│
├── layouts/
│   ├── CustomerLayout.vue         # Existing layout (renamed)
│   └── AdminLayout.vue            # NEW: Admin layout
│
├── middleware/
│   └── auth.js                    # NEW: Route guard middleware
│
├── stores/                        # Pinia stores
│   ├── auth.js                    # NEW: Auth state
│   ├── admin.js                   # NEW: Admin-specific state
│   ├── orders.js                  # NEW: Order management
│   └── notifications.js           # NEW: Notification state
│
├── views/
│   ├── admin/                     # NEW: Admin views
│   │   ├── DashboardView.vue
│   │   ├── LoginView.vue
│   │   ├── orders/
│   │   │   ├── OrdersListView.vue
│   │   │   └── OrderDetailView.vue
│   │   ├── products/
│   │   │   └── ProductsListView.vue
│   │   ├── categories/
│   │   │   └── CategoriesView.vue
│   │   ├── deliveries/
│   │   │   └── DeliveriesView.vue
│   │   ├── customers/
│   │   │   ├── CustomersListView.vue
│   │   │   └── CustomerDetailView.vue
│   │   ├── loyalty/
│   │   │   └── LoyaltyView.vue
│   │   ├── reports/
│   │   │   └── ReportsView.vue
│   │   └── settings/
│   │       └── SettingsView.vue
│   │
│   └── [existing customer views]
│
├── router/
│   └── index.js                   # Updated with admin routes
│
└── utils/
    ├── formatters.js              # NEW: Format currency, dates
    ├── validators.js              # NEW: Form validation
    └── constants.js               # NEW: App constants
```

---

## Implementation Steps

### **Step 1: Install Dependencies**
```bash
npm install pinia                          # State management
npm install element-plus @element-plus/icons-vue  # UI components
npm install echarts vue-echarts            # Charts
npm install date-fns                       # Date utilities
npm install @vueuse/core                   # Vue utilities
```

### **Step 2: Create Admin Routes**
Add protected routes with authentication guards

### **Step 3: Build Authentication System**
- Login page at `/admin/login`
- JWT token storage
- Auth composable
- Pinia auth store
- Route guards

### **Step 4: Create Admin Layout**
- Sidebar navigation
- Top header with user menu
- Breadcrumbs
- Main content area

### **Step 5: Build Core Modules**
1. Dashboard (analytics overview)
2. Orders (real-time management)
3. Products (quick management)
4. Settings

---

## Authentication Flow

```
┌─────────────────────────────────────────┐
│  User visits /admin/*                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Route Guard checks authentication      │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    Authenticated   Not Authenticated
        │             │
        │             ▼
        │      Redirect to /admin/login
        │
        ▼
   Show Admin Page
```

---

## URL Structure

### **Customer URLs (Public)**
- `https://kamili-app.com/` → Home
- `https://kamili-app.com/menu` → Menu
- `https://kamili-app.com/cart` → Shopping Cart

### **Admin URLs (Protected)**
- `https://kamili-app.com/admin/login` → Admin Login
- `https://kamili-app.com/admin` → Dashboard
- `https://kamili-app.com/admin/orders` → Order Management
- `https://kamili-app.com/admin/products` → Product Management

---

## Benefits of Single App Approach

✅ **Single Deployment** - One build, one server
✅ **Shared Code** - Reuse composables, services, utilities
✅ **Consistent Branding** - Same design system
✅ **Simplified Maintenance** - One codebase to update
✅ **Cost Effective** - Single hosting/domain
✅ **SEO Friendly** - Admin pages can be noindex
✅ **Easier Development** - No API CORS issues

---

## Security Considerations

1. **Authentication Required** - All `/admin/*` routes protected
2. **Role-Based Access** - Different permissions per role
3. **JWT Tokens** - Secure, short-lived tokens
4. **HTTPS Only** - Force SSL in production
5. **Rate Limiting** - Prevent brute force attacks
6. **Audit Logs** - Track admin actions
7. **Session Timeout** - Auto-logout after inactivity

---

## Next Steps

1. Install required dependencies
2. Set up Pinia store
3. Create authentication system
4. Build admin layout
5. Implement dashboard
6. Add order management
7. Create product management
8. Build settings page

Ready to start building! 🚀
