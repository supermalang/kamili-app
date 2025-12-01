# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup
```sh
npm install
```

### Development Server
```sh
npm run dev
# Server runs on http://0.0.0.0:5173 by default (accessible from all network interfaces)
```

### Build
```sh
npm run build
# Production build output goes to dist/
```

### Preview Production Build
```sh
npm run preview
```

### Code Quality
```sh
npm run lint    # Run ESLint with auto-fix and caching
npm run format  # Format code with Prettier
```

## Tech Stack

- **Vue 3** with Composition API (`<script setup>`)
- **Vue Router 4** for client-side routing
- **Tailwind CSS v4** for styling
- **Vite** (using Rolldown variant) as build tool
- **ESLint 9** with Vue plugin and Prettier integration

## Architecture

### Project Structure

```
src/
├── assets/           # Static assets (CSS, images, etc.)
├── components/
│   ├── common/      # Reusable UI components
│   ├── features/    # Feature-specific components organized by domain
│   │   ├── product/ # Product-related components
│   │   └── user/    # User-related components
│   └── layout/      # Layout components (Header, Footer, etc.)
├── composables/     # Vue composables for shared logic
├── router/          # Vue Router configuration
├── stores/          # State management (e.g., Pinia stores when added)
├── views/           # Route-level page components
├── App.vue          # Root component (contains RouterView)
└── main.js          # Application entry point
```

### Component Organization

- **Layout Components** (src/components/layout/): AppTopbar, AppHeader, AppBody, AppFooter
- **Feature Components** (src/components/features/): Organized by domain/feature area
- **Common Components** (src/components/common/): Shared, reusable UI components
- **Views** (src/views/): Top-level route components that compose layout and feature components

### Routing

- Router configuration: `src/router/index.js`
- Uses `createWebHistory()` for clean URLs
- The router MUST be registered in `src/main.js` with `app.use(router)` - this is critical for routing to work
- Routes are defined in a `routes` array and mapped to view components
- Lazy loading example is commented out in router config

### Styling

- Tailwind CSS v4 is configured
- Main CSS entry: `src/assets/main.css` (imports Tailwind)
- Tailwind scans: `./index.html` and `./src/**/*.{vue,js,ts,jsx,tsx}`
- Use Tailwind utility classes in Vue component templates

### Path Aliases

- `@` maps to `src/` directory (configured in vite.config.js)
- Example: `import Foo from '@/components/common/Foo.vue'`

## Node.js Version Requirements

- Requires Node.js `^20.19.0` or `>=22.12.0`
- Check with: `node --version`

## Key Conventions

- Use Vue 3 Composition API with `<script setup>` syntax
- Component file names use PascalCase (e.g., `AppHeader.vue`)
- Feature-based organization: group related components under `src/components/features/[domain]/`
- ESLint and Prettier are configured - run linting before commits
