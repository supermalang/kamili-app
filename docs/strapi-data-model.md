# Strapi Data Model - Kamili App

This document outlines the complete data model structure for implementing the Kamili restaurant application backend in Strapi CMS.

## Table of Contents
- [Collection Types](#collection-types)
  - [Product](#1-product)
  - [Category](#2-category)
  - [Order](#3-order)
  - [Loyalty Program](#4-loyalty-program)
  - [Payment Method](#5-payment-method)
- [Components](#components)
  - [Order Item](#order-item)
  - [Customer Info](#customer-info)
  - [Address](#address)
  - [Loyalty Transaction](#loyalty-transaction)
- [Single Types](#single-types)
  - [Restaurant Settings](#restaurant-settings)
- [API Permissions](#api-permissions)

---

## Collection Types

### 1. Product
Main product model for pizzas, drinks, desserts, and other menu items.

**API ID:** `product`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `name` | Text | Required | Product name (e.g., "Margherita", "Coca-Cola") |
| `description` | Rich Text | Optional | Detailed product description |
| `price` | Number | Required, Decimal | Product price in FCFA |
| `type` | Enumeration | Required | Product category type |
| `image` | Media | Single image | Product image |
| `category` | Relation | Many-to-One (Category) | Product category |
| `isAvailable` | Boolean | Default: `true` | Product availability status |
| `slug` | UID | Auto-generated from name | URL-friendly identifier |

**Enumeration Values for `type`:**
- `pizza`
- `drink`
- `dessert`
- `side`

---

### 2. Category
Organize products into categories (e.g., "Pizzas Classiques", "Boissons Fraîches").

**API ID:** `category`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `name` | Text | Required | Category name |
| `description` | Text | Optional | Category description |
| `slug` | UID | Auto-generated from name | URL-friendly identifier |
| `products` | Relation | One-to-Many (Product) | Products in this category |
| `order` | Number | Integer | Display order for categories |

---

### 3. Order
Customer orders with delivery/takeaway information.

**API ID:** `order`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `orderNumber` | Text | Required, Unique | Auto-generated order number |
| `customer` | Component | Customer Info | Customer details |
| `items` | Component | Repeatable: Order Item | Order line items |
| `totalAmount` | Number | Required, Decimal | Total order amount |
| `deliveryFee` | Number | Decimal, Default: 0 | Delivery fee (if applicable) |
| `status` | Enumeration | Required, Default: `pending` | Order status |
| `orderType` | Enumeration | Required | Delivery or takeaway |
| `deliveryAddress` | Component | Address | Delivery address (conditional) |
| `pickupTime` | DateTime | Optional | Scheduled pickup time |
| `deliveryTime` | DateTime | Optional | Scheduled/estimated delivery time |
| `paymentMethod` | Enumeration | Required | Payment method selected |
| `paymentStatus` | Enumeration | Default: `pending` | Payment status |
| `notes` | Text | Optional | Special instructions |

**Enumeration Values for `status`:**
- `pending`
- `confirmed`
- `preparing`
- `ready`
- `delivering`
- `delivered`
- `cancelled`

**Enumeration Values for `orderType`:**
- `delivery`
- `takeaway`

**Enumeration Values for `paymentMethod`:**
- `wave`
- `maxit`
- `djamo`
- `card`
- `cash`

**Enumeration Values for `paymentStatus`:**
- `pending`
- `paid`
- `failed`

---

### 4. Loyalty Program
Track customer loyalty points and tier status.

**API ID:** `loyalty-program`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `user` | Relation | One-to-One (User) | Associated user account |
| `points` | Number | Integer, Default: 0 | Current loyalty points |
| `tier` | Enumeration | Default: `bronze` | Loyalty tier level |
| `transactions` | Component | Repeatable: Loyalty Transaction | Point history |

**Enumeration Values for `tier`:**
- `bronze`
- `silver`
- `gold`

---

### 5. Payment Method
Manage available payment methods and their display.

**API ID:** `payment-method`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `name` | Text | Required | Display name (e.g., "Wave", "Max it") |
| `code` | Text | Required, Unique | Unique identifier |
| `logo` | Media | Single image | Payment method logo |
| `isEnabled` | Boolean | Default: `true` | Enable/disable payment method |
| `order` | Number | Integer | Display order |

**Suggested `code` values:**
- `wave`
- `maxit`
- `djamo`
- `card`
- `cash`

---

## Components

### Order Item
Represents a single line item in an order.

**Component Name:** `order.order-item`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `product` | Relation | To Product | Referenced product |
| `quantity` | Number | Required, Integer, Min: 1 | Quantity ordered |
| `unitPrice` | Number | Required, Decimal | Price per unit |
| `subtotal` | Number | Required, Decimal | Line total (quantity × unitPrice) |

---

### Customer Info
Customer information for orders (used when user is not authenticated).

**Component Name:** `order.customer-info`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `firstName` | Text | Required | Customer first name |
| `lastName` | Text | Required | Customer last name |
| `phone` | Text | Required | Contact phone number |
| `email` | Email | Optional | Customer email |

---

### Address
Address information for delivery.

**Component Name:** `shared.address`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `street` | Text | Required | Street address |
| `city` | Text | Required | City |
| `neighborhood` | Text | Optional | Neighborhood/district |
| `landmark` | Text | Optional | Nearby landmark |
| `postalCode` | Text | Optional | Postal code |
| `instructions` | Text | Optional | Delivery instructions |

---

### Loyalty Transaction
Individual loyalty point transaction record.

**Component Name:** `loyalty.loyalty-transaction`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `amount` | Number | Required, Integer | Points earned/spent (+ or -) |
| `reason` | Text | Required | Transaction description |
| `order` | Relation | To Order, Optional | Related order (if applicable) |
| `date` | DateTime | Auto-generated | Transaction timestamp |

---

## Single Types

### Restaurant Settings
Global configuration for the restaurant.

**API ID:** `restaurant-settings`

| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| `restaurantName` | Text | Required | Restaurant name |
| `description` | Rich Text | Optional | Restaurant description |
| `phone` | Text | Required | Contact phone number |
| `email` | Email | Required | Contact email |
| `address` | Component | Address | Restaurant address |
| `openingHours` | JSON | Optional | Opening hours configuration |
| `deliveryFee` | Number | Decimal, Default: 0 | Standard delivery fee |
| `minimumOrderAmount` | Number | Decimal | Minimum order amount |
| `isDeliveryEnabled` | Boolean | Default: `true` | Enable/disable delivery |
| `isTakeawayEnabled` | Boolean | Default: `true` | Enable/disable takeaway |
| `heroImage` | Media | Single image | Homepage hero image |
| `heroBackgroundImage` | Media | Single image | Hero section background |
| `loyaltyPointsPerOrder` | Number | Integer, Default: 10 | Points earned per order |

**Example `openingHours` JSON structure:**
```json
{
  "monday": { "open": "11:00", "close": "22:00", "closed": false },
  "tuesday": { "open": "11:00", "close": "22:00", "closed": false },
  "wednesday": { "open": "11:00", "close": "22:00", "closed": false },
  "thursday": { "open": "11:00", "close": "22:00", "closed": false },
  "friday": { "open": "11:00", "close": "23:00", "closed": false },
  "saturday": { "open": "11:00", "close": "23:00", "closed": false },
  "sunday": { "open": "12:00", "close": "22:00", "closed": false }
}
```

---

## API Permissions

### Public Access (Unauthenticated)
Allow public users to browse products and view settings:

- **Product:** `find`, `findOne`
- **Category:** `find`, `findOne`
- **Restaurant Settings:** `find`
- **Payment Method:** `find`

### Authenticated Users
Logged-in users can create orders and view their own data:

- **Order:** `create`, `find` (own only), `findOne` (own only)
- **Loyalty Program:** `find` (own only), `findOne` (own only)

### Admin Only
Full control over all content:

- **Order:** `update`, `delete`
- **Product:** `create`, `update`, `delete`
- **Category:** `create`, `update`, `delete`
- **Payment Method:** `create`, `update`, `delete`
- **Loyalty Program:** `create`, `update`, `delete`
- **Restaurant Settings:** `update`

---

## Implementation Notes

1. **Order Number Generation**: Use a lifecycle hook to auto-generate order numbers in the format `ORD-YYYYMMDD-XXXX` where XXXX is a sequential number.

2. **Loyalty Points Calculation**: Implement a lifecycle hook on Order creation to automatically award loyalty points when payment status changes to `paid`.

3. **Image Uploads**: Configure responsive image formats for product images and logos:
   - Thumbnail: 150x150
   - Small: 300x300
   - Medium: 600x600
   - Large: 1000x1000

4. **Search Configuration**: Enable search on:
   - Product: `name`, `description`
   - Category: `name`
   - Order: `orderNumber`

5. **Filtering**: Configure filters for:
   - Product: `type`, `category`, `isAvailable`
   - Order: `status`, `orderType`, `paymentStatus`

6. **Population**: Default populate depth should include:
   - Order → items → product
   - Product → category
   - Loyalty Program → transactions

---

## Database Relationships Summary

```
Category (1) ──────< (∞) Product
User (1) ──────< (∞) Order
User (1) ────── (1) Loyalty Program
Order (1) ──────< (∞) Order Item Component
Product (1) ──────< (∞) Order Item Component
Order (1) ──────< (∞) Loyalty Transaction Component
```

---

## Next Steps

1. Install Strapi with the appropriate database (PostgreSQL recommended for production)
2. Create all collection types and components as outlined
3. Configure API permissions according to the table above
4. Set up lifecycle hooks for order number generation and loyalty points
5. Configure media upload settings and responsive image formats
6. Test API endpoints with the Vue.js frontend
7. Set up webhooks for order status notifications (optional)

---

**Last Updated:** 2025-12-06
**Version:** 1.0
