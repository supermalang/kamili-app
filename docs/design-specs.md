# Design Specifications

## Design System

### Color Palette

#### Primary Colors
- **Red**: `#DC2626` (red-600) - Primary brand color, CTAs, active states
- **Dark Red**: `#991B1B` (red-800) - Hover states, emphasis
- **Light Red**: `#FEE2E2` (red-50) - Backgrounds, subtle highlights

#### Neutral Colors
- **White**: `#FFFFFF` - Backgrounds, cards
- **Gray 50**: `#F9FAFB` - Subtle backgrounds
- **Gray 100**: `#F3F4F6` - Hover states, borders
- **Gray 700**: `#374151` - Body text
- **Gray 900**: `#111827` - Headings
- **Black**: `#000000` - Maximum contrast text

#### Semantic Colors
- **Success**: `#10B981` (green-500)
- **Warning**: `#F59E0B` (amber-500)
- **Error**: `#EF4444` (red-500)
- **Info**: `#3B82F6` (blue-500)

### Typography

#### Font Family
- **Primary**: System fonts (Tailwind's default sans stack)
  ```css
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
  ```

#### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px) - Body text
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px) - Section headings
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px) - Page headings
- **4xl**: 2.25rem (36px) - Hero headings

#### Font Weights
- **Normal**: 400 - Body text
- **Medium**: 500 - Emphasis
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings, buttons

### Spacing Scale
Following Tailwind's default spacing scale:
- 1 = 0.25rem (4px)
- 2 = 0.5rem (8px)
- 4 = 1rem (16px)
- 8 = 2rem (32px)
- 16 = 4rem (64px)

### Border Radius
- **sm**: 0.125rem (2px)
- **base**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px) - Cards, buttons
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **full**: 9999px - Circular elements

### Shadows
- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)` - Subtle depth
- **base**: `0 1px 3px 0 rgb(0 0 0 / 0.1)` - Cards
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1)` - Elevated cards
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1)` - Modals, dropdowns

## Component Specifications

### Buttons

#### Primary Button
```vue
<button class="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
  Button Text
</button>
```
- Background: Red-600
- Text: White
- Padding: 1.5rem (y) × 0.75rem (x)
- Border radius: 0.5rem (lg)
- Hover: Red-700

#### Secondary Button
```vue
<button class="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors">
  Button Text
</button>
```

#### Ghost Button
```vue
<button class="text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
  Button Text
</button>
```

### Cards

#### Product Card
```vue
<div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
  <img src="..." class="w-full h-48 object-cover" />
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-900">Product Name</h3>
    <p class="text-gray-600 text-sm mt-1">Description</p>
    <p class="text-red-600 font-bold text-xl mt-2">$12.99</p>
  </div>
</div>
```

### Navigation

#### Header
- Height: Auto (padding-based)
- Background: White
- Shadow: sm
- Sticky positioning
- Max width: 1280px (7xl)

#### Mobile Drawer
- Width: 320px (80rem)
- Background: White
- Slide-in animation: 300ms ease
- Overlay: Black with 50% opacity

### Forms

#### Input Fields
```vue
<input class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent" />
```

#### Labels
```vue
<label class="block text-sm font-medium text-gray-700 mb-1">Label Text</label>
```

### Responsive Breakpoints
- **sm**: 640px
- **md**: 768px - Tablet (menu switches to horizontal)
- **lg**: 1024px - Desktop
- **xl**: 1280px
- **2xl**: 1536px

## Layout Guidelines

### Container
- Max width: 1280px (max-w-7xl)
- Padding: 1rem (px-4) on mobile, 1.5rem (px-6) on desktop
- Centered: mx-auto

### Grid System
- Use Tailwind's grid utilities
- Gap: 1rem (gap-4) for dense layouts, 2rem (gap-8) for spacious layouts

### Product Grid
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3-4 columns

## Animations & Transitions

### Standard Transitions
- Duration: 300ms
- Easing: ease-in-out
- Properties: colors, transform, opacity, shadow

### Hover States
- Buttons: Background color change + slight shadow increase
- Cards: Shadow increase (sm → md)
- Links: Color change

### Loading States
- Skeleton screens for content loading
- Spinner for actions (button clicks, form submissions)

## Accessibility

### Color Contrast
- Text on backgrounds must meet WCAG AA standards (4.5:1 for normal text)
- Interactive elements must have visible focus states

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2
```

### Interactive Element Sizes
- Minimum touch target: 44px × 44px (mobile)
- Minimum click target: 24px × 24px (desktop)

## Icons
- Icon library: Heroicons (SVG)
- Default size: 24px (w-6 h-6)
- Small: 16px (w-4 h-4)
- Large: 32px (w-8 h-8)

## Image Guidelines
- Format: WebP with JPEG fallback
- Product images: 1:1 aspect ratio (square)
- Hero images: 16:9 aspect ratio
- Max file size: 200KB
- Lazy loading for below-the-fold images
