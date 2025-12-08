# 🚀 Kamili Admin Platform - Quick Start Guide

## What's Been Built

Your Kamili app now has a complete admin panel integrated! Staff can manage orders, products, customers, and more from `/admin`.

---

## 🎯 Access the Admin Panel

### URLs
- **Customer Site**: `http://localhost:5173/`
- **Admin Login**: `http://localhost:5173/admin/login`
- **Admin Dashboard**: `http://localhost:5173/admin`

---

## 🔐 Setup Authentication

### Step 1: Start Strapi (if not running)
```bash
# Navigate to your Strapi directory
cd /path/to/your/strapi
npm run develop
```

### Step 2: Create Admin User in Strapi
1. Go to `http://localhost:1337/admin`
2. Create a new user:
   - Go to **Content Manager** → **User**
   - Click **Create new entry**
   - Fill in:
     - Username: `admin` (or any name)
     - Email: `admin@kamili.com` (or any email)
     - Password: `admin123` (or any password)
     - Role: `Authenticated` or `Admin`
   - Click **Save**

### Step 3: Update Environment Variables
Create/update `.env` in kamili-app root:
```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=
VITE_APP_NAME=Kamili App
VITE_APP_URL=http://localhost:5173
```

---

## ⚡ Start the App

```bash
cd /workspace/workspace/kamili-app
npm run dev
```

Visit `http://localhost:5173/admin/login` and login with your Strapi credentials!

---

## 📱 What's Available

### ✅ Fully Functional Pages
1. **Login** (`/admin/login`)
   - Email/username authentication
   - Password with show/hide
   - Error handling
   - Auto-redirect to dashboard

2. **Dashboard** (`/admin`)
   - 4 KPI cards (revenue, orders, deliveries, customers)
   - Revenue bar chart (7 days)
   - Order distribution pie chart
   - Recent orders list
   - Popular products list
   - Real-time updates (mock data for now)

3. **Order Management** (`/admin/orders`)
   - Filterable orders table
   - Filter by status, type, date range
   - Search by order number or customer
   - Click rows to view details
   - Status badges with color coding
   - Actions menu (view, edit, print, delete)
   - Pagination
   - Status update modal

### ⏳ Placeholder Pages (Ready to Implement)
- Products Management (`/admin/products`)
- Categories (`/admin/categories`)
- Deliveries (`/admin/deliveries`)
- Customers (`/admin/customers`)
- Loyalty Program (`/admin/loyalty`)
- Reports & Analytics (`/admin/reports`)
- Settings (`/admin/settings`)

---

## 🎨 Features

### Authentication
- JWT token-based auth
- Persistent sessions (localStorage)
- Auto-logout on token expiration
- Protected routes with guards
- Role-based access control

### UI Components
- **Element Plus** - Professional UI library
- Sidebar navigation with icons
- Collapsible sidebar
- Notification badges
- User dropdown menu
- Breadcrumb navigation
- Data tables with sorting & pagination
- Charts (Apache ECharts)
- Modals & dialogs
- Form validation

### Utilities
- Currency formatting (FCFA)
- Date/time formatting (French locale)
- Relative time ("il y a 2 heures")
- Phone number formatting
- Status labels & colors
- Constants for all enums

---

## 🛠 Next Steps

### Priority 1: Connect Real Data
Replace mock data with Strapi API calls:

1. **Update Dashboard** ([DashboardView.vue](src/views/admin/DashboardView.vue))
   ```javascript
   // Replace mock stats with real API calls
   const { data } = await axios.get('/api/orders/stats')
   stats.value = data
   ```

2. **Update Orders List** ([OrdersListView.vue](src/views/admin/orders/OrdersListView.vue))
   ```javascript
   // Fetch real orders
   const { data } = await strapiService.orders.find({
     filters: filters,
     pagination: {
       page: pagination.page,
       pageSize: pagination.pageSize
     },
     populate: ['customer', 'items']
   })
   orders.value = data.data
   ```

### Priority 2: Implement Order Detail View
Create a comprehensive order detail page:
- Full order information
- Customer details
- Items list with quantities
- Status timeline
- Status update buttons
- Print invoice button
- Communication buttons (call, SMS, email)

### Priority 3: Build Remaining Views
- Product management (list, edit availability, pricing)
- Customer database
- Settings page (restaurant info, delivery zones)
- Reports with date range filters

---

## 📁 Key Files to Know

### Layouts
- [AdminLayout.vue](src/layouts/AdminLayout.vue) - Main admin layout with sidebar

### Stores
- [auth.js](src/stores/auth.js) - Authentication state management

### Views
- [LoginView.vue](src/views/admin/LoginView.vue) - Login page
- [DashboardView.vue](src/views/admin/DashboardView.vue) - Analytics dashboard
- [OrdersListView.vue](src/views/admin/orders/OrdersListView.vue) - Order management

### Utilities
- [formatters.js](src/utils/formatters.js) - Formatting functions
- [constants.js](src/utils/constants.js) - App constants

### Router
- [router/index.js](src/router/index.js) - Routes with auth guards

---

## 🎨 Customization

### Change Primary Color
Edit the red color theme in:
- [AdminLayout.vue](src/layouts/AdminLayout.vue) - Line with `bg-red-600`
- [LoginView.vue](src/views/admin/LoginView.vue) - Button styles
- Global: Update `#dc2626` to your brand color

### Add Menu Items
Edit [AdminLayout.vue](src/layouts/AdminLayout.vue):
```javascript
const menuItems = [
  {
    name: 'my-feature',
    label: 'My Feature',
    icon: MyIcon,
    route: { name: 'admin-my-feature' }
  },
  // ... existing items
]
```

### Add New Routes
Edit [router/index.js](src/router/index.js):
```javascript
{
  path: 'my-feature',
  name: 'admin-my-feature',
  component: () => import('@/views/admin/MyFeatureView.vue')
}
```

---

## 🐛 Troubleshooting

### Can't Login
**Check:**
1. Strapi is running at `http://localhost:1337`
2. User exists in Strapi with correct role
3. Environment variable `VITE_STRAPI_URL` is set
4. Browser console for error messages

**Solution:**
```bash
# Restart Strapi
cd /path/to/strapi
npm run develop

# Restart Kamili app
cd /workspace/workspace/kamili-app
npm run dev
```

### Charts Not Showing
**Check:**
1. `echarts` package is installed
2. Chart container has width/height
3. Data is being loaded

**Solution:**
```bash
npm install echarts vue-echarts
```

### Build Errors
**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Data Structure

### Order Object
```javascript
{
  id: 1,
  orderNumber: "2024-001",
  status: "pending", // pending, confirmed, preparing, ready, delivering, delivered, cancelled
  orderType: "delivery", // delivery, takeaway
  paymentStatus: "paid", // pending, paid, failed, refunded
  paymentMethod: "wave", // wave, maxit, djamo, card, cash
  customer: {
    firstName: "Jean",
    lastName: "Dupont",
    phone: "+221771234567",
    email: "jean@example.com"
  },
  items: [
    {
      product: { name: "Pizza Margherita" },
      quantity: 2,
      unitPrice: 3000,
      subtotal: 6000
    }
  ],
  subtotal: 6000,
  deliveryFee: 1000,
  totalAmount: 7000,
  deliveryAddress: {
    street: "123 Rue Example",
    city: "Dakar",
    neighborhood: "Plateau"
  },
  notes: "Sans oignons",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:35:00Z"
}
```

---

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy
The `dist/` folder contains your production build. Deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **Nginx**: Copy `dist/` to server
- **Docker**: Already configured in [Dockerfile](Dockerfile)

### Environment Variables (Production)
```env
VITE_STRAPI_URL=https://api.kamili.com
VITE_APP_URL=https://kamili.com
```

---

## 📚 Documentation

- **Architecture**: [docs/admin-platform-architecture.md](docs/admin-platform-architecture.md)
- **Integration Plan**: [docs/admin-integration-plan.md](docs/admin-integration-plan.md)
- **Implementation Summary**: [docs/admin-implementation-summary.md](docs/admin-implementation-summary.md)
- **Strapi Data Model**: [docs/strapi-data-model.md](docs/strapi-data-model.md)

---

## 🎉 You're All Set!

Your Kamili admin panel is ready to use. Start by:
1. Creating a user in Strapi
2. Logging into `/admin/login`
3. Exploring the dashboard
4. Connecting real data from your Strapi API

Need help? Check the documentation files in the `docs/` folder!

**Happy managing! 🍕📦**
