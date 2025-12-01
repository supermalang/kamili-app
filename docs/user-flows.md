# User Flows

This document outlines the key user journeys and interaction flows for Kamili Food.

## 1. First-Time Visitor Flow

```mermaid
graph TD
    A[Land on Homepage] --> B[See Hero Section]
    B --> C[Browse Featured Items]
    C --> D{Action?}
    D -->|Click Menu| E[View Full Menu]
    D -->|Click Item| F[View Item Details]
    D -->|Scroll Down| G[View Categories]
    E --> H[Filter by Category]
    H --> I[Select Item]
    F --> J[Add to Cart]
    I --> J
    J --> K[Continue Shopping or Checkout]
```

**Steps**:
1. User arrives at homepage
2. Sees announcement banner "La commande est ouverte"
3. Views hero section with main CTA
4. Scrolls to browse menu categories or featured items
5. Clicks on item to view details
6. Adds item to cart
7. Can continue shopping or proceed to checkout

## 2. Browse & Order Flow

```mermaid
graph TD
    A[Homepage] --> B[Click Menu in Navigation]
    B --> C[View Menu Page]
    C --> D[Select Category Filter]
    D --> E[Browse Items in Category]
    E --> F[Click Item Card]
    F --> G[View Item Details Modal/Page]
    G --> H[Select Quantity]
    H --> I[Add to Cart]
    I --> J{Continue?}
    J -->|Yes| C
    J -->|No| K[View Cart]
    K --> L[Review Items]
    L --> M{Satisfied?}
    M -->|Yes| N[Proceed to Checkout]
    M -->|No| O[Adjust Quantities/Remove Items]
    O --> L
    N --> P[Enter Delivery Details]
    P --> Q[Choose Delivery/Pickup]
    Q --> R[Review Order]
    R --> S[Confirm & Pay]
    S --> T[Order Confirmation]
```

**Key Decision Points**:
- Category selection
- Add to cart vs. continue browsing
- Delivery vs. pickup
- Order confirmation

## 3. Cart Management Flow

```mermaid
graph TD
    A[Cart Icon Shows Count] --> B[Click Cart Icon]
    B --> C[Cart Sidebar/Page Opens]
    C --> D[View Items]
    D --> E{Action?}
    E -->|Update Quantity| F[Adjust Quantity]
    E -->|Remove Item| G[Remove from Cart]
    E -->|Add More| H[Return to Menu]
    E -->|Checkout| I[Proceed to Checkout]
    F --> D
    G --> D
    H --> J[Menu Page]
    I --> K[Checkout Flow]
```

**Cart Features**:
- Real-time total calculation
- Item quantity adjustment
- Remove items
- Visual feedback for changes
- Persistent across sessions (if logged in)

## 4. Checkout Flow

```mermaid
graph TD
    A[Cart Review] --> B[Click Checkout]
    B --> C{Logged In?}
    C -->|No| D[Login/Register or Guest Checkout]
    C -->|Yes| E[Delivery Information]
    D --> E
    E --> F[Choose Delivery Type]
    F --> G{Type?}
    G -->|Delivery| H[Enter Address]
    G -->|Pickup| I[Select Pickup Time]
    H --> J[Contact Information]
    I --> J
    J --> K[Order Summary]
    K --> L[Payment Method]
    L --> M[Enter Payment Details]
    M --> N[Review Final Order]
    N --> O[Confirm Order]
    O --> P{Success?}
    P -->|Yes| Q[Order Confirmation Page]
    P -->|No| R[Error Message]
    Q --> S[Email Confirmation]
    R --> N
```

**Checkout Steps**:
1. Authentication (optional for guest checkout)
2. Delivery type selection
3. Address/pickup details
4. Contact information
5. Payment
6. Confirmation

## 5. Registered User Flow

```mermaid
graph TD
    A[Login] --> B[Homepage]
    B --> C[Browse Menu]
    C --> D[Add to Cart]
    D --> E[Checkout]
    E --> F[Auto-fill Saved Address]
    F --> G[Review & Modify]
    G --> H[Confirm Order]
    H --> I[Order History Updated]
    I --> J[Track Order Status]
```

**Benefits for Registered Users**:
- Saved delivery addresses
- Order history
- Faster checkout
- Favorites/saved items (future)
- Loyalty points (future)

## 6. Order Tracking Flow

```mermaid
graph TD
    A[Order Placed] --> B[Confirmation Page]
    B --> C[Email with Order Number]
    C --> D[Click Track Order Link]
    D --> E[Order Status Page]
    E --> F{Status?}
    F -->|Pending| G[Waiting for Confirmation]
    F -->|Confirmed| H[Restaurant Preparing]
    F -->|Preparing| I[Being Prepared]
    F -->|Ready| J[Ready for Pickup/Delivery]
    F -->|Out for Delivery| K[On the Way]
    F -->|Delivered| L[Order Complete]
    K --> M[Live Updates]
    M --> L
```

**Order Statuses**:
1. Pending - Order received
2. Confirmed - Restaurant accepted
3. Preparing - Food being made
4. Ready - Ready for pickup
5. Out for Delivery - Driver en route
6. Delivered - Order complete

## 7. Admin Order Management Flow

```mermaid
graph TD
    A[Admin Login] --> B[Dashboard]
    B --> C[View Pending Orders]
    C --> D[Click Order]
    D --> E[View Order Details]
    E --> F{Action?}
    F -->|Accept| G[Update to Confirmed]
    F -->|Reject| H[Cancel Order]
    F -->|Update Status| I[Change Status]
    G --> J[Notify Customer]
    H --> J
    I --> J
    J --> K[Update Dashboard]
```

## 8. Menu Management Flow (Admin)

```mermaid
graph TD
    A[Admin Panel] --> B[Menu Management]
    B --> C{Action?}
    C -->|Add Item| D[Create New Item Form]
    C -->|Edit Item| E[Select Item to Edit]
    C -->|Delete Item| F[Confirm Delete]
    C -->|Update Availability| G[Toggle Available Status]
    D --> H[Enter Details]
    H --> I[Upload Image]
    I --> J[Set Price & Category]
    J --> K[Save Item]
    E --> L[Modify Details]
    L --> K
    K --> M[Update Menu]
```

## Navigation Patterns

### Desktop Navigation
- Horizontal menu in header
- Always visible (sticky header)
- Items: Accueil | Menu | À propos | Contact
- Cart icon with badge showing item count
- User account dropdown (when logged in)

### Mobile Navigation
- Hamburger menu icon
- Opens drawer from left
- Vertical menu items
- Same navigation items as desktop
- Close on item selection or outside click

## Error States & Edge Cases

### Empty Cart
- Display empty cart message
- CTA to "Browse Menu"
- Prevent checkout with empty cart

### Out of Stock Items
- Display "Indisponible" badge
- Disable "Add to Cart" button
- Show estimated availability (optional)

### Network Errors
- Show friendly error message
- Retry button
- Offline indicator

### Payment Failures
- Clear error messaging
- Option to retry or change payment method
- Don't lose cart contents

### Order Cancellation
- Allow cancellation within X minutes
- Confirmation dialog
- Update order status and notify restaurant

## Accessibility Considerations

- Keyboard navigation through all flows
- Screen reader announcements for cart updates
- Focus management in modals/drawers
- Clear error messages
- Sufficient color contrast
- Form validation with clear feedback
