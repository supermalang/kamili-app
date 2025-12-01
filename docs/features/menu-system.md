# Menu System Feature

## Overview
The menu system allows customers to browse available food items, filter by category, and view detailed information about each item.

## User Stories

### As a Customer
- I want to see all available menu items so I can choose what to order
- I want to filter items by category (entrées, plats, desserts, boissons) so I can find what I'm looking for quickly
- I want to see item details (name, description, price, image) so I can make informed decisions
- I want to see if items contain allergens so I can avoid foods I'm allergic to
- I want to know preparation time so I can set expectations

## Components

### MenuView.vue
**Location**: `src/views/MenuView.vue`
**Purpose**: Main menu page displaying all items with filtering

**Features**:
- Category filter tabs/buttons
- Grid layout of menu items
- Loading states
- Empty states

### ProductCard.vue
**Location**: `src/components/features/product/ProductCard.vue`
**Purpose**: Display individual menu item in grid

**Props**:
```javascript
{
  item: {
    id: String,
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    available: Boolean,
    spicyLevel: Number,
    allergens: Array
  }
}
```

**Features**:
- Item image with fallback
- Name and description
- Price display
- Availability indicator
- Hover effects
- Click to view details or add to cart

### ProductDetail.vue
**Location**: `src/components/features/product/ProductDetail.vue`
**Purpose**: Detailed view of menu item (modal or dedicated page)

**Features**:
- Large image
- Full description
- Allergen information
- Spicy level indicator
- Quantity selector
- Add to cart button
- Special instructions input

## State Management

### menuStore (Pinia)
```javascript
{
  state: {
    items: [],           // All menu items
    categories: [],      // Available categories
    selectedCategory: null,
    loading: false,
    error: null
  },

  getters: {
    filteredItems,      // Items filtered by selected category
    availableItems,     // Only available items
    itemsByCategory     // Items grouped by category
  },

  actions: {
    fetchMenuItems(),
    fetchCategories(),
    setCategory(category),
    getItemById(id)
  }
}
```

## API Integration

### Endpoints Used
- `GET /menu/items` - Fetch all menu items
- `GET /menu/items?category={category}` - Filter by category
- `GET /menu/items/{id}` - Get single item details
- `GET /menu/categories` - Get all categories

## UI Specifications

### Layout
- **Mobile**: 1 column grid
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns

### Product Card
- **Dimensions**: Equal height cards
- **Image**: 1:1 aspect ratio, 300x300px minimum
- **Spacing**: 1rem gap between cards

### Category Filter
- Horizontal scroll on mobile
- Fixed row on desktop
- Active category highlighted in red
- Smooth scroll to results

## Implementation Details

### Filtering Logic
```javascript
const filteredItems = computed(() => {
  if (!selectedCategory.value) return items.value
  return items.value.filter(item => item.category === selectedCategory.value)
})
```

### Image Lazy Loading
```vue
<img
  :src="item.image"
  :alt="item.name"
  loading="lazy"
  class="w-full h-48 object-cover"
/>
```

### Availability Badge
```vue
<div v-if="!item.available" class="absolute top-2 right-2">
  <span class="bg-gray-900 text-white text-xs px-2 py-1 rounded">
    Indisponible
  </span>
</div>
```

## Accessibility

- Semantic HTML (`<article>` for cards)
- Alt text for all images
- Keyboard navigation support
- Focus indicators
- Screen reader announcements for filter changes

## Future Enhancements

- [ ] Search functionality
- [ ] Sort options (price, popularity, name)
- [ ] Dietary filters (vegetarian, vegan, gluten-free)
- [ ] Favorites/save for later
- [ ] Item recommendations
- [ ] Nutritional information
- [ ] Reviews and ratings
