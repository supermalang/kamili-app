# Kamili Food

A modern restaurant ordering platform built with Vue 3, enabling customers to browse menus, place orders, and track deliveries seamlessly.

## About

Kamili Food is a full-featured food delivery application that provides an intuitive interface for customers to discover menu items, manage their cart, and complete orders with ease. The platform supports both delivery and pickup options, with a responsive design that works perfectly on mobile, tablet, and desktop devices.

## Features

- **Responsive Navigation**: Horizontal menu on desktop, slide-out drawer on mobile
- **Menu Browsing**: Browse items by category with filtering options
- **Shopping Cart**: Add, remove, and manage items before checkout
- **Order Management**: Complete checkout flow with delivery/pickup options
- **Modern UI**: Built with Tailwind CSS v4 for a clean, responsive design

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vue Router 4** - Official router for Vue.js
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Next-generation frontend build tool (Rolldown variant)
- **ESLint 9 + Prettier** - Code quality and formatting

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Documentation Overview](./docs/README.md)
- [Product Requirements](./docs/product-requirements.md) - Features, user stories, and roadmap
- [Design Specifications](./docs/design-specs.md) - Design system, components, and UI guidelines
- [API Specifications](./docs/api-specs.md) - API endpoints and data models
- [User Flows](./docs/user-flows.md) - User journeys and interaction patterns
- [Architecture](./docs/architecture.md) - System architecture and technical decisions

### Feature Documentation
- [Menu System](./docs/features/menu-system.md)
- [Ordering System](./docs/features/ordering-system.md)
- [Authentication](./docs/features/authentication.md)

## Developer Guide

For detailed development instructions and conventions, see [CLAUDE.md](./CLAUDE.md).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Format Code with Prettier

```sh
npm run format
```

### Preview Production Build

```sh
npm run preview
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Project Structure

```
src/
├── assets/           # Static assets (CSS, images)
├── components/
│   ├── common/      # Reusable UI components
│   ├── features/    # Feature-specific components
│   └── layout/      # Layout components (Header, Footer, Navigation)
├── composables/     # Vue composables for shared logic
├── router/          # Vue Router configuration
├── stores/          # Pinia stores (state management)
├── views/           # Route-level page components
├── App.vue          # Root component
└── main.js          # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

end of file
