# Strapi Integration Guide

This guide explains how to use the Strapi SDK integration in the Kamili App Vue.js frontend.

## Table of Contents
- [Setup](#setup)
- [Configuration](#configuration)
- [Strapi Service](#strapi-service)
- [Composables](#composables)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)

---

## Setup

### 1. Install Dependencies

The required packages are already installed in the project:

```bash
npm install axios qs
```

We use `axios` for HTTP requests and `qs` for building Strapi-compatible query strings.

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure your Strapi instance:

```env
# Strapi API Configuration
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your_api_token_here

# Application Configuration
VITE_APP_NAME=Kamili App
VITE_APP_URL=http://localhost:5173
```

**Important:**
- Never commit `.env` to git (it's in `.gitignore`)
- Update `.env.example` when adding new environment variables
- For production, set these in your deployment environment

---

## Configuration

### Strapi Service

The Strapi service is located at `src/services/strapi.js`. It provides a centralized API client with organized methods for each collection type.

**Key Features:**
- Automatic configuration from environment variables
- Organized API methods by collection type
- Built-in error handling
- Support for Strapi query parameters (filters, sort, pagination, populate)

---

## Composables

Vue composables are provided in `src/composables/useStrapi.js` to make it easier to use Strapi data in components with reactive state.

### Available Composables:

1. **`useStrapi()`** - Base composable for custom API calls
2. **`useProducts()`** - Fetch products
3. **`useCategories()`** - Fetch categories
4. **`useOrders()`** - Create and fetch orders
5. **`useRestaurantSettings()`** - Fetch restaurant settings
6. **`usePaymentMethods()`** - Fetch payment methods

---

## Usage Examples

### Example 1: Fetching Products in a Component

```vue
<template>
  <div>
    <div v-if="loading">Loading products...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :id="product.id"
        :name="product.attributes.name"
        :price="product.attributes.price"
        :image="getImageUrl(product.attributes.image)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useStrapi'
import ProductCard from '@/components/features/product/ProductCard.vue'

const { products, loading, error, fetchProducts } = useProducts()

onMounted(async () => {
  await fetchProducts()
})

const getImageUrl = (image) => {
  if (!image?.data) return null
  const baseUrl = import.meta.env.VITE_STRAPI_URL
  return `${baseUrl}${image.data.attributes.url}`
}
</script>
```

### Example 2: Fetching Products by Category

```vue
<script setup>
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useStrapi'

const { products, loading, fetchProductsByCategory } = useProducts()

onMounted(async () => {
  // Fetch all pizzas (assuming category ID 1 is pizzas)
  await fetchProductsByCategory(1)
})
</script>
```

### Example 3: Fetching Products by Type

```vue
<script setup>
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useStrapi'

const { products, loading, fetchProductsByType } = useProducts()

onMounted(async () => {
  // Fetch all drinks
  await fetchProductsByType('drink')
})
</script>
```

### Example 4: Creating an Order

```vue
<script setup>
import { ref } from 'vue'
import { useOrders } from '@/composables/useStrapi'
import { useCart } from '@/composables/useCart'

const { createOrder, loading, error } = useOrders()
const { items, total } = useCart()

const submitOrder = async (customerInfo, deliveryInfo) => {
  const orderData = {
    customer: {
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      phone: customerInfo.phone,
      email: customerInfo.email
    },
    items: items.value.map(item => ({
      product: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity
    })),
    totalAmount: total.value,
    orderType: 'delivery',
    deliveryAddress: deliveryInfo,
    paymentMethod: 'cash',
    status: 'pending',
    paymentStatus: 'pending'
  }

  try {
    const order = await createOrder(orderData)
    console.log('Order created:', order)
    // Navigate to confirmation page or show success message
  } catch (err) {
    console.error('Order creation failed:', err)
  }
}
</script>
```

### Example 5: Fetching Restaurant Settings

```vue
<script setup>
import { onMounted } from 'vue'
import { useRestaurantSettings } from '@/composables/useStrapi'

const { settings, loading, fetchSettings } = useRestaurantSettings()

onMounted(async () => {
  await fetchSettings()
})

// Access settings
const restaurantName = computed(() => settings.value?.attributes?.restaurantName)
const deliveryFee = computed(() => settings.value?.attributes?.deliveryFee)
</script>
```

### Example 6: Using Direct Strapi Service

For custom queries not covered by composables:

```vue
<script setup>
import { ref, onMounted } from 'vue'
import strapiService from '@/services/strapi'

const data = ref(null)

onMounted(async () => {
  try {
    // Custom query with advanced filters
    const response = await strapiService.products.find({
      filters: {
        price: {
          $gte: 5000,
          $lte: 10000
        },
        isAvailable: {
          $eq: true
        }
      },
      sort: ['price:asc'],
      pagination: {
        page: 1,
        pageSize: 10
      },
      populate: ['category', 'image']
    })

    data.value = response.data
  } catch (error) {
    console.error('Error:', error)
  }
})
</script>
```

---

## API Reference

### Strapi Service Methods

#### Products

```javascript
import strapiService from '@/services/strapi'

// Get all products
await strapiService.products.find(params)

// Get single product
await strapiService.products.findOne(id, params)

// Get products by category
await strapiService.products.findByCategory(categoryId, params)

// Get products by type
await strapiService.products.findByType(type, params)
```

#### Categories

```javascript
// Get all categories
await strapiService.categories.find(params)

// Get single category
await strapiService.categories.findOne(id, params)
```

#### Orders

```javascript
// Create order
await strapiService.orders.create(data)

// Get orders
await strapiService.orders.find(params)

// Get single order
await strapiService.orders.findOne(id, params)
```

#### Payment Methods

```javascript
// Get payment methods (only enabled ones)
await strapiService.paymentMethods.find(params)
```

#### Restaurant Settings

```javascript
// Get restaurant settings
await strapiService.settings.get(params)
```

### Query Parameters

Strapi supports various query parameters:

#### Filters

```javascript
{
  filters: {
    name: {
      $contains: 'Pizza'
    },
    price: {
      $gte: 3000,
      $lte: 8000
    },
    isAvailable: {
      $eq: true
    }
  }
}
```

**Available operators:**
- `$eq` - Equal
- `$ne` - Not equal
- `$lt` - Less than
- `$lte` - Less than or equal
- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$in` - In array
- `$notIn` - Not in array
- `$contains` - Contains (case-sensitive)
- `$notContains` - Does not contain
- `$containsi` - Contains (case-insensitive)
- `$notContainsi` - Does not contain (case-insensitive)
- `$null` - Is null
- `$notNull` - Is not null

#### Sort

```javascript
{
  sort: ['price:asc', 'name:desc']
}
```

#### Pagination

```javascript
{
  pagination: {
    page: 1,
    pageSize: 25
  }
}
```

#### Populate

```javascript
{
  populate: ['category', 'image', 'items.product']
}
```

Or use `populate: '*'` to populate all relations.

---

## Image Handling

Strapi returns images in the following structure:

```javascript
{
  data: {
    id: 1,
    attributes: {
      name: "image.png",
      url: "/uploads/image.png",
      formats: {
        thumbnail: { url: "/uploads/thumbnail_image.png" },
        small: { url: "/uploads/small_image.png" },
        medium: { url: "/uploads/medium_image.png" }
      }
    }
  }
}
```

To display an image:

```vue
<script setup>
const baseUrl = import.meta.env.VITE_STRAPI_URL

const getImageUrl = (image) => {
  if (!image?.data) return null
  return `${baseUrl}${image.data.attributes.url}`
}

// Get specific format
const getThumbnail = (image) => {
  if (!image?.data?.attributes?.formats?.thumbnail) return null
  return `${baseUrl}${image.data.attributes.formats.thumbnail.url}`
}
</script>

<template>
  <img :src="getImageUrl(product.attributes.image)" alt="Product" />
</template>
```

---

## Error Handling

All composables include error handling:

```vue
<script setup>
const { products, loading, error, fetchProducts } = useProducts()

onMounted(async () => {
  try {
    await fetchProducts()
  } catch (err) {
    // Error is already captured in error ref
    console.error('Failed to fetch products:', err)
  }
})
</script>

<template>
  <div v-if="error" class="error-message">
    {{ error }}
  </div>
</template>
```

---

## Best Practices

1. **Use Composables**: Prefer composables over direct service calls for better reactivity
2. **Error Handling**: Always handle errors in production
3. **Loading States**: Show loading indicators for better UX
4. **Image Optimization**: Use appropriate image formats from Strapi
5. **Pagination**: Implement pagination for large datasets
6. **Caching**: Consider implementing client-side caching for frequently accessed data
7. **Environment Variables**: Keep sensitive data in environment variables
8. **Type Safety**: Consider adding TypeScript for better type safety

---

## Troubleshooting

### CORS Issues

If you encounter CORS errors, configure Strapi's middleware in `config/middlewares.js`:

```javascript
module.exports = [
  // ...
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173', 'https://your-production-domain.com'],
      credentials: true
    }
  }
]
```

### Authentication

For authenticated requests, set the API token in `.env`:

```env
VITE_STRAPI_API_TOKEN=your_token_here
```

Generate API tokens in Strapi Admin Panel:
Settings → API Tokens → Create new API Token

---

**Last Updated:** 2025-12-06
**Version:** 1.0
