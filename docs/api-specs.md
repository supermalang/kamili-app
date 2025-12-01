# API Specifications

## Overview
This document outlines the API endpoints and data models for the Kamili Food application.

**Base URL**: `https://api.kamilifood.com/v1` (to be configured)
**Authentication**: JWT Bearer tokens
**Content-Type**: `application/json`

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}

Response: 201 Created
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2025-12-01T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

## Menu Items

### Get All Menu Items
```http
GET /menu/items?category={category}&available=true
Authorization: Optional

Response: 200 OK
{
  "items": [
    {
      "id": "item_123",
      "name": "Poulet Grillé",
      "description": "Poulet mariné aux épices, grillé à la perfection",
      "price": 15.99,
      "category": "plats",
      "image": "https://cdn.kamilifood.com/images/poulet-grille.jpg",
      "available": true,
      "preparationTime": 20,
      "allergens": ["gluten"],
      "spicyLevel": 2,
      "createdAt": "2025-11-15T10:00:00Z",
      "updatedAt": "2025-12-01T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "perPage": 20,
    "totalPages": 3
  }
}
```

**Query Parameters**:
- `category`: Filter by category (entrees, plats, desserts, boissons)
- `available`: Boolean to filter available items
- `page`: Page number (default: 1)
- `perPage`: Items per page (default: 20)

### Get Single Menu Item
```http
GET /menu/items/{id}

Response: 200 OK
{
  "id": "item_123",
  "name": "Poulet Grillé",
  "description": "...",
  "price": 15.99,
  ...
}
```

### Create Menu Item (Admin)
```http
POST /menu/items
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Poulet Grillé",
  "description": "Poulet mariné aux épices, grillé à la perfection",
  "price": 15.99,
  "category": "plats",
  "image": "...",
  "available": true,
  "preparationTime": 20,
  "allergens": ["gluten"],
  "spicyLevel": 2
}

Response: 201 Created
```

### Update Menu Item (Admin)
```http
PATCH /menu/items/{id}
Authorization: Bearer {admin_token}

Response: 200 OK
```

### Delete Menu Item (Admin)
```http
DELETE /menu/items/{id}
Authorization: Bearer {admin_token}

Response: 204 No Content
```

## Categories

### Get All Categories
```http
GET /menu/categories

Response: 200 OK
{
  "categories": [
    {
      "id": "cat_1",
      "name": "Entrées",
      "slug": "entrees",
      "displayOrder": 1
    },
    {
      "id": "cat_2",
      "name": "Plats",
      "slug": "plats",
      "displayOrder": 2
    },
    {
      "id": "cat_3",
      "name": "Desserts",
      "slug": "desserts",
      "displayOrder": 3
    },
    {
      "id": "cat_4",
      "name": "Boissons",
      "slug": "boissons",
      "displayOrder": 4
    }
  ]
}
```

## Orders

### Create Order
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "menuItemId": "item_123",
      "quantity": 2,
      "specialInstructions": "Sans oignons"
    }
  ],
  "deliveryType": "delivery",
  "deliveryAddress": {
    "street": "123 Rue Example",
    "city": "Ville",
    "postalCode": "12345",
    "country": "France",
    "instructions": "2ème étage, porte gauche"
  },
  "paymentMethod": "card",
  "contactPhone": "+1234567890"
}

Response: 201 Created
{
  "order": {
    "id": "order_789",
    "orderNumber": "KF-20251201-001",
    "status": "pending",
    "items": [...],
    "subtotal": 31.98,
    "tax": 3.20,
    "deliveryFee": 2.99,
    "total": 38.17,
    "estimatedTime": 45,
    "createdAt": "2025-12-01T12:30:00Z"
  }
}
```

### Get User Orders
```http
GET /orders?status={status}
Authorization: Bearer {token}

Response: 200 OK
{
  "orders": [
    {
      "id": "order_789",
      "orderNumber": "KF-20251201-001",
      "status": "delivered",
      "total": 38.17,
      "createdAt": "2025-12-01T12:30:00Z",
      "deliveredAt": "2025-12-01T13:20:00Z"
    }
  ]
}
```

**Order Statuses**: `pending`, `confirmed`, `preparing`, `ready`, `out_for_delivery`, `delivered`, `cancelled`

### Get Order Details
```http
GET /orders/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "order_789",
  "orderNumber": "KF-20251201-001",
  "status": "delivered",
  "items": [...],
  "customer": {...},
  "deliveryAddress": {...},
  "timeline": [
    {
      "status": "pending",
      "timestamp": "2025-12-01T12:30:00Z"
    },
    {
      "status": "confirmed",
      "timestamp": "2025-12-01T12:32:00Z"
    }
  ]
}
```

### Update Order Status (Admin)
```http
PATCH /orders/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "preparing"
}

Response: 200 OK
```

### Cancel Order
```http
POST /orders/{id}/cancel
Authorization: Bearer {token}

Response: 200 OK
```

## Data Models

### User
```typescript
interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  createdAt: string
  updatedAt: string
}
```

### MenuItem
```typescript
interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  preparationTime: number // minutes
  allergens?: string[]
  spicyLevel?: number // 0-3
  createdAt: string
  updatedAt: string
}
```

### Order
```typescript
interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  status: OrderStatus
  deliveryType: 'delivery' | 'pickup'
  deliveryAddress?: Address
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  estimatedTime: number // minutes
  createdAt: string
  updatedAt: string
}

interface OrderItem {
  menuItemId: string
  quantity: number
  price: number
  specialInstructions?: string
}
```

### Address
```typescript
interface Address {
  street: string
  city: string
  postalCode: string
  country: string
  instructions?: string
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource
- `422 Unprocessable Entity`: Validation failed
- `500 Internal Server Error`: Server error

## Rate Limiting
- Rate limit: 100 requests per minute per IP
- Headers:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Webhooks (Future)
For real-time order updates, webhooks can be configured to notify external systems of order status changes.
