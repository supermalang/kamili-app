# Ordering System Feature

## Overview
The ordering system handles the complete flow from adding items to cart through checkout and order confirmation.

## User Stories

### As a Customer
- I want to add items to my cart so I can order multiple items at once
- I want to see my cart total in real-time so I know how much I'm spending
- I want to remove or adjust items in my cart before checkout
- I want to choose between delivery and pickup
- I want to enter my delivery address and contact information
- I want to receive order confirmation with an order number

## Components Flow

```
ProductCard → Add to Cart
    ↓
CartDrawer/CartView → Review & Edit
    ↓
CheckoutView → Enter Details
    ↓
OrderConfirmation → Success
```

## Components

### CartIcon.vue
**Location**: `src/components/features/cart/CartIcon.vue`
**Purpose**: Header cart icon with item count badge

**Features**:
- Item count badge
- Click to open cart drawer/page
- Pulse animation when items added

### CartDrawer.vue
**Location**: `src/components/features/cart/CartDrawer.vue`
**Purpose**: Slide-out cart for quick review

**Features**:
- List of cart items
- Quantity adjusters
- Remove item buttons
- Subtotal display
- Proceed to checkout button

### CartItem.vue
**Location**: `src/components/features/cart/CartItem.vue`
**Purpose**: Individual item in cart

**Props**:
```javascript
{
  item: {
    id: String,
    menuItemId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    specialInstructions: String
  }
}
```

### CheckoutView.vue
**Location**: `src/views/CheckoutView.vue`
**Purpose**: Multi-step checkout page

**Steps**:
1. Delivery type selection
2. Address/contact information
3. Order review
4. Payment
5. Confirmation

## State Management

### cartStore (Pinia)
```javascript
{
  state: {
    items: [],
    deliveryType: 'delivery', // 'delivery' | 'pickup'
    deliveryAddress: null,
    contactInfo: null
  },

  getters: {
    itemCount: (state) => state.items.reduce(...),
    subtotal: (state) => state.items.reduce(...),
    tax: (state) => subtotal * TAX_RATE,
    deliveryFee: (state) => deliveryType === 'delivery' ? 2.99 : 0,
    total: (state) => subtotal + tax + deliveryFee
  },

  actions: {
    addItem(item, quantity = 1),
    removeItem(itemId),
    updateQuantity(itemId, quantity),
    clearCart(),
    setDeliveryType(type),
    setDeliveryAddress(address),
    setContactInfo(info)
  }
}
```

### orderStore (Pinia)
```javascript
{
  state: {
    currentOrder: null,
    orderHistory: [],
    loading: false,
    error: null
  },

  actions: {
    async createOrder(orderData),
    async fetchOrderHistory(),
    async fetchOrderById(orderId),
    async cancelOrder(orderId)
  }
}
```

## Cart Persistence

### LocalStorage Strategy
```javascript
// Store cart in localStorage
watch(
  () => cartStore.items,
  (items) => {
    localStorage.setItem('cart', JSON.stringify(items))
  },
  { deep: true }
)

// Restore cart on app load
onMounted(() => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartStore.items = JSON.parse(savedCart)
  }
})
```

## Checkout Flow

### Step 1: Cart Review
- Display all cart items
- Allow quantity adjustments
- Show running total
- "Proceed to Checkout" button

### Step 2: Delivery Type
```vue
<div class="flex gap-4">
  <button
    @click="selectDeliveryType('delivery')"
    :class="{ 'active': deliveryType === 'delivery' }"
  >
    Livraison
  </button>
  <button
    @click="selectDeliveryType('pickup')"
    :class="{ 'active': deliveryType === 'pickup' }"
  >
    À emporter
  </button>
</div>
```

### Step 3: Information Form
**For Delivery**:
- Street address
- City
- Postal code
- Delivery instructions
- Contact phone

**For Pickup**:
- Pickup time selection
- Contact phone
- Name

### Step 4: Order Review
- Summary of all items
- Delivery/pickup details
- Cost breakdown:
  - Subtotal
  - Tax
  - Delivery fee (if applicable)
  - Total

### Step 5: Payment
- Payment method selection
- Payment form (Stripe integration)
- Terms acceptance checkbox

### Step 6: Confirmation
- Order number display
- Estimated delivery/pickup time
- Order summary
- Email confirmation sent
- "Track Order" button
- "Continue Shopping" button

## API Integration

### Create Order
```javascript
async function submitOrder() {
  const orderData = {
    items: cartStore.items.map(item => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions
    })),
    deliveryType: cartStore.deliveryType,
    deliveryAddress: cartStore.deliveryAddress,
    contactPhone: cartStore.contactInfo.phone,
    paymentMethod: 'card'
  }

  try {
    const response = await apiClient.post('/orders', orderData)
    const order = response.data.order

    // Clear cart and redirect
    cartStore.clearCart()
    router.push(`/orders/${order.id}`)
  } catch (error) {
    // Handle error
    showError('Order failed. Please try again.')
  }
}
```

## Validation

### Cart Validation
- Minimum order value (if required)
- Item availability check before checkout
- Quantity limits (max per item)

### Form Validation
```javascript
const validationRules = {
  street: { required: true, minLength: 5 },
  city: { required: true },
  postalCode: { required: true, pattern: /^\d{5}$/ },
  phone: { required: true, pattern: /^\+?\d{10,}$/ },
  email: { required: false, email: true }
}
```

## Error Handling

### Common Errors
- **Item out of stock**: Show message, remove from cart
- **Invalid address**: Highlight field, show error
- **Payment failed**: Show error, allow retry
- **Network error**: Show offline message, allow retry

## UI Specifications

### Cart Badge
- Position: Top-right of cart icon
- Color: Red-600 background, white text
- Size: 20px circle
- Shows count up to 99 (99+)

### Cart Drawer
- Width: 400px on desktop, full width on mobile
- Slide in from right
- Backdrop overlay (semi-transparent black)
- Smooth animation (300ms)

### Checkout Form
- Single column layout
- Clear section headings
- Inline validation
- Progress indicator (steps 1-5)

## Accessibility

- Form labels for all inputs
- Error messages announced to screen readers
- Keyboard navigation through checkout steps
- Focus management (move to next step)
- Clear success/error states

## Testing Checklist

- [ ] Add item to cart
- [ ] Update quantity in cart
- [ ] Remove item from cart
- [ ] Cart persists across page refresh
- [ ] Cart total calculates correctly
- [ ] Delivery type selection works
- [ ] Address form validates correctly
- [ ] Order submission succeeds
- [ ] Order confirmation displays correctly
- [ ] Cart clears after order
- [ ] Error handling works for failed orders

## Future Enhancements

- [ ] Guest checkout option
- [ ] Save multiple delivery addresses
- [ ] Scheduled delivery time selection
- [ ] Tip for delivery driver
- [ ] Promo code support
- [ ] Split payment methods
- [ ] Order editing after placement (limited time)
- [ ] Reorder from history
