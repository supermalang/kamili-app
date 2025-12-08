# Kamili Admin Platform - Hybrid Architecture

## Overview

A hybrid admin platform combining Strapi CMS content management with a custom Vue 3 dashboard for advanced order processing, analytics, and business operations.

---

## Architecture Strategy

### **What Strapi Handles:**
- ✅ Content Management (Products, Categories via Strapi Admin)
- ✅ Data Storage & API endpoints
- ✅ File uploads & media library
- ✅ User authentication & authorization
- ✅ API documentation
- ✅ Basic CRUD operations

### **What Custom Admin Handles:**
- ✅ Real-time order processing dashboard
- ✅ Advanced analytics & reporting
- ✅ Delivery management & tracking
- ✅ Customer relationship management
- ✅ Staff performance monitoring
- ✅ Business intelligence dashboards

---

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CUSTOMER LAYER                         │
├──────────────────────────────────────────────────────────┤
│  Kamili App (Vue 3)                                       │
│  - Public menu browsing                                   │
│  - Shopping cart                                          │
│  - Order placement                                        │
└─────────────────────┬────────────────────────────────────┘
                      │
                      │ REST API
                      ▼
┌──────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                          │
├──────────────────────────────────────────────────────────┤
│  Strapi CMS (Node.js)                                     │
│  - PostgreSQL/SQLite Database                             │
│  - RESTful API                                            │
│  - Authentication (JWT)                                   │
│  - File Storage                                           │
│  - Webhooks                                               │
└─────────────────────┬────────────────────────────────────┘
                      │
                      │ REST API
                      ▼
┌──────────────────────────────────────────────────────────┐
│                    ADMIN LAYER                            │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌──────────────────────────┐    │
│  │  Strapi Admin UI   │  │  Kamili Admin (Vue 3)    │    │
│  │  (Built-in)        │  │  (Custom Dashboard)      │    │
│  ├────────────────────┤  ├──────────────────────────┤    │
│  │ • Products         │  │ • Live Orders Dashboard  │    │
│  │ • Categories       │  │ • Analytics & Reports    │    │
│  │ • Settings         │  │ • Delivery Management    │    │
│  │ • Media Library    │  │ • Customer Insights      │    │
│  │ • Users & Roles    │  │ • Staff Management       │    │
│  │ • API Tokens       │  │ • Loyalty Program        │    │
│  └────────────────────┘  └──────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### **Custom Admin Dashboard**
- **Framework:** Vue 3 (Composition API)
- **State Management:** Pinia
- **Routing:** Vue Router 4
- **UI Library:** Element Plus (comprehensive component library)
- **Charts:** Apache ECharts
- **HTTP Client:** Axios
- **Real-time:** WebSocket / Polling
- **Date Utils:** date-fns
- **Build Tool:** Vite

### **Backend (Existing)**
- **CMS:** Strapi 4+
- **Database:** PostgreSQL / SQLite
- **Authentication:** JWT tokens
- **API:** RESTful

---

## Project Structure

```
kamili-admin/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                     # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── main.css
│   │
│   ├── components/                 # Shared components
│   │   ├── common/
│   │   │   ├── AppButton.vue
│   │   │   ├── AppModal.vue
│   │   │   ├── AppTable.vue
│   │   │   ├── EmptyState.vue
│   │   │   └── LoadingSpinner.vue
│   │   ├── charts/
│   │   │   ├── LineChart.vue
│   │   │   ├── BarChart.vue
│   │   │   ├── PieChart.vue
│   │   │   └── RevenueChart.vue
│   │   └── forms/
│   │       ├── ProductForm.vue
│   │       ├── CategoryForm.vue
│   │       └── SettingsForm.vue
│   │
│   ├── composables/                # Reusable logic
│   │   ├── useAuth.js             # Authentication
│   │   ├── useProducts.js         # Product operations
│   │   ├── useOrders.js           # Order operations
│   │   ├── useCategories.js       # Category operations
│   │   ├── useCustomers.js        # Customer operations
│   │   ├── useAnalytics.js        # Analytics data
│   │   ├── useNotifications.js    # Notifications
│   │   └── useRealtime.js         # WebSocket/polling
│   │
│   ├── layouts/                    # Layout components
│   │   ├── AdminLayout.vue        # Main admin layout
│   │   ├── AuthLayout.vue         # Login/auth layout
│   │   └── components/
│   │       ├── Sidebar.vue
│   │       ├── Header.vue
│   │       ├── Breadcrumbs.vue
│   │       └── UserMenu.vue
│   │
│   ├── modules/                    # Feature modules
│   │   ├── dashboard/
│   │   │   ├── views/
│   │   │   │   └── DashboardView.vue
│   │   │   └── components/
│   │   │       ├── StatsCards.vue
│   │   │       ├── RecentOrders.vue
│   │   │       ├── RevenueChart.vue
│   │   │       └── PopularProducts.vue
│   │   │
│   │   ├── orders/
│   │   │   ├── views/
│   │   │   │   ├── OrdersListView.vue
│   │   │   │   └── OrderDetailView.vue
│   │   │   └── components/
│   │   │       ├── OrderCard.vue
│   │   │       ├── OrderStatusBadge.vue
│   │   │       ├── OrderTimeline.vue
│   │   │       └── OrderFilters.vue
│   │   │
│   │   ├── products/
│   │   │   ├── views/
│   │   │   │   ├── ProductsListView.vue
│   │   │   │   ├── ProductCreateView.vue
│   │   │   │   └── ProductEditView.vue
│   │   │   └── components/
│   │   │       ├── ProductTable.vue
│   │   │       └── ProductForm.vue
│   │   │
│   │   ├── categories/
│   │   │   ├── views/
│   │   │   │   └── CategoriesView.vue
│   │   │   └── components/
│   │   │       └── CategoryForm.vue
│   │   │
│   │   ├── deliveries/
│   │   │   ├── views/
│   │   │   │   └── DeliveriesView.vue
│   │   │   └── components/
│   │   │       ├── DeliveryMap.vue
│   │   │       └── DeliveryAssignment.vue
│   │   │
│   │   ├── customers/
│   │   │   ├── views/
│   │   │   │   ├── CustomersListView.vue
│   │   │   │   └── CustomerDetailView.vue
│   │   │   └── components/
│   │   │       └── CustomerCard.vue
│   │   │
│   │   ├── loyalty/
│   │   │   ├── views/
│   │   │   │   └── LoyaltyView.vue
│   │   │   └── components/
│   │   │       └── LoyaltyTiers.vue
│   │   │
│   │   ├── reports/
│   │   │   ├── views/
│   │   │   │   ├── SalesReportView.vue
│   │   │   │   └── AnalyticsView.vue
│   │   │   └── components/
│   │   │       └── ReportFilters.vue
│   │   │
│   │   ├── settings/
│   │   │   ├── views/
│   │   │   │   └── SettingsView.vue
│   │   │   └── components/
│   │   │       └── SettingsTabs.vue
│   │   │
│   │   └── auth/
│   │       └── views/
│   │           ├── LoginView.vue
│   │           └── ForgotPasswordView.vue
│   │
│   ├── router/
│   │   └── index.js               # Route definitions
│   │
│   ├── services/
│   │   ├── api.js                 # Axios instance
│   │   ├── strapi.js              # Strapi API service
│   │   └── websocket.js           # WebSocket service
│   │
│   ├── stores/                     # Pinia stores
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── settings.js
│   │   └── notifications.js
│   │
│   ├── utils/
│   │   ├── formatters.js          # Format currency, dates
│   │   ├── validators.js          # Form validation
│   │   ├── constants.js           # App constants
│   │   └── helpers.js             # Utility functions
│   │
│   ├── App.vue
│   └── main.js
│
├── .env.example
├── .env.development
├── .env.production
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Module Breakdown

### **1. Dashboard Module**
**Purpose:** Real-time overview of business operations

**Features:**
- KPI cards (today's revenue, total orders, pending orders, active deliveries)
- Revenue chart (daily/weekly/monthly)
- Recent orders feed (live updates)
- Popular products widget
- Order status distribution (pie chart)
- Quick actions (new order, view menu)

**API Endpoints Used:**
- `GET /api/orders?filters[createdAt][$gte]=today`
- `GET /api/orders?filters[status]=pending`
- `GET /api/products?sort=orderCount:desc&pagination[limit]=5`

---

### **2. Orders Module**
**Purpose:** Complete order lifecycle management

**Features:**
- Order list with filters (status, date range, order type)
- Real-time order notifications
- Order detail view with customer info
- Status update workflow
- Print receipt/invoice
- Customer communication (call, SMS, email buttons)
- Refund processing
- Delivery assignment
- Order timeline/history

**Order Status Flow:**
```
pending → confirmed → preparing → ready → delivering → delivered
                              ↓
                          cancelled
```

**API Endpoints:**
- `GET /api/orders?populate=*`
- `PUT /api/orders/:id`
- `POST /api/orders/:id/status`
- `POST /api/orders/:id/assign-delivery`

---

### **3. Products Module**
**Purpose:** Quick product management (complementing Strapi)

**Features:**
- Product list with search/filter
- Quick availability toggle
- Price editing
- Stock management
- Product analytics (views, orders)
- Link to Strapi admin for full editing

**Note:** Complex product editing (images, descriptions) done in Strapi Admin

---

### **4. Categories Module**
**Purpose:** Category management

**Features:**
- Category list
- Reorder categories (drag & drop)
- Visibility toggle
- Link to Strapi admin for editing

---

### **5. Deliveries Module**
**Purpose:** Delivery operations management

**Features:**
- Active deliveries list
- Delivery map view
- Driver assignment
- Route optimization suggestions
- Delivery zones configuration
- Performance metrics (avg time, success rate)

---

### **6. Customers Module**
**Purpose:** Customer relationship management

**Features:**
- Customer database
- Order history per customer
- Loyalty points display
- Contact information
- Customer segments (VIP, regular, new)
- Communication history

---

### **7. Loyalty Program Module**
**Purpose:** Manage customer rewards

**Features:**
- Loyalty tiers overview
- Points rules configuration
- Manual points adjustment
- Rewards catalog
- Top customers leaderboard

---

### **8. Reports Module**
**Purpose:** Business intelligence & analytics

**Features:**
- Sales reports (daily, weekly, monthly)
- Product performance analysis
- Customer acquisition metrics
- Revenue trends
- Peak hours analysis
- Export to PDF/Excel

---

### **9. Settings Module**
**Purpose:** Application configuration

**Features:**
- Restaurant info (hours, contact, address)
- Delivery settings (zones, fees, minimum order)
- Payment methods configuration
- Tax settings
- Notification preferences
- Email/SMS templates
- Staff management
- Role permissions

---

## Authentication & Authorization

### **Roles:**
1. **Super Admin** - Full access
2. **Manager** - All except sensitive settings
3. **Staff** - Orders, products view only
4. **Chef** - Kitchen orders only
5. **Delivery** - Delivery orders only

### **Permission Matrix:**

| Module | Super Admin | Manager | Staff | Chef | Delivery |
|--------|-------------|---------|-------|------|----------|
| Dashboard | ✅ Full | ✅ Full | ✅ View | ✅ Kitchen | ✅ Delivery |
| Orders | ✅ Full | ✅ Full | ✅ View | ✅ Kitchen | ✅ Assigned |
| Products | ✅ Full | ✅ Full | ❌ | ❌ | ❌ |
| Customers | ✅ Full | ✅ Full | ✅ View | ❌ | ❌ |
| Deliveries | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Own |
| Reports | ✅ Full | ✅ Full | ❌ | ❌ | ❌ |
| Settings | ✅ Full | ⚠️ Limited | ❌ | ❌ | ❌ |

---

## Real-Time Updates Strategy

### **Approach: Hybrid Polling + WebSocket**

**For Order Updates:**
```javascript
// Polling for new orders (every 10 seconds)
setInterval(() => {
  fetchPendingOrders()
}, 10000)

// WebSocket for order status changes (if available)
socket.on('order:updated', (order) => {
  updateOrderInList(order)
  showNotification(`Order #${order.orderNumber} status changed`)
})
```

**Notification System:**
- Browser notifications for new orders
- Sound alerts
- Badge counts on sidebar menu items

---

## Development Phases

### **Phase 1: Foundation (Week 1)**
- ✅ Project setup
- ✅ Authentication system
- ✅ Layout & navigation
- ✅ API integration
- ✅ Routing

### **Phase 2: Core Features (Week 2-3)**
- ✅ Dashboard with analytics
- ✅ Order management (list, detail, status updates)
- ✅ Real-time order notifications
- ✅ Product quick management
- ✅ Settings module

### **Phase 3: Advanced Features (Week 4)**
- ✅ Customer management
- ✅ Delivery tracking
- ✅ Reports & analytics
- ✅ Loyalty program

### **Phase 4: Polish & Deploy (Week 5)**
- ✅ Performance optimization
- ✅ Mobile responsive design
- ✅ Testing
- ✅ Documentation
- ✅ Deployment

---

## Deployment

### **Production Setup:**

```
# Admin dashboard
admin.kamili-app.com (Vue 3 app on Nginx/Vercel)

# Strapi CMS
api.kamili-app.com (Node.js on port 1337)

# Strapi Admin (optional separate subdomain)
cms.kamili-app.com (Strapi built-in admin)
```

### **Docker Compose Example:**

```yaml
version: '3.8'

services:
  # Strapi Backend
  strapi:
    image: strapi/strapi
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: kamili
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "1337:1337"
    volumes:
      - ./strapi-data:/srv/app
    depends_on:
      - postgres

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: kamili
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Kamili Admin Dashboard
  admin:
    build: ./kamili-admin
    ports:
      - "3000:80"
    environment:
      VITE_STRAPI_URL: http://strapi:1337
      VITE_WS_URL: ws://strapi:1337

volumes:
  postgres-data:
```

---

## Next Steps

1. **Scaffold the Vue 3 admin app**
2. **Set up authentication & API integration**
3. **Build admin layout with sidebar navigation**
4. **Implement dashboard with real-time orders**
5. **Create order management module**
6. **Add product & category quick management**
7. **Build settings module**
8. **Implement reports & analytics**

---

## Benefits of Hybrid Approach

✅ **Fast Development** - Use Strapi for CRUD, custom UI for complex workflows
✅ **Separation of Concerns** - Content management vs. business operations
✅ **Flexibility** - Can customize admin UI without Strapi limitations
✅ **Scalability** - Each component can scale independently
✅ **User Experience** - Tailored UI for staff workflows
✅ **Cost Effective** - Leverage existing Strapi investment

---

## Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Vue 3 Documentation](https://vuejs.org)
- [Element Plus](https://element-plus.org)
- [Apache ECharts](https://echarts.apache.org)
- [Pinia State Management](https://pinia.vuejs.org)
