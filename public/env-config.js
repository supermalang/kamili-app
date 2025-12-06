// Default runtime environment configuration for development
// This file is overwritten by Docker at container startup in production
window.ENV = window.ENV || {
  VITE_STRAPI_URL: '',
  VITE_STRAPI_API_TOKEN: '',
  VITE_APP_NAME: '',
  VITE_APP_URL: ''
}
