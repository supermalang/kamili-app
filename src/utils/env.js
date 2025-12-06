/**
 * Runtime Environment Configuration
 *
 * This utility provides access to environment variables that can be set at runtime
 * (via Docker container env vars) or at build time (via Vite's import.meta.env).
 *
 * Priority:
 * 1. Runtime env (window.ENV from env-config.js loaded by Docker)
 * 2. Build-time env (import.meta.env from Vite)
 */

/**
 * Get environment variable value
 * @param {string} key - Environment variable key (e.g., 'VITE_STRAPI_URL')
 * @param {string} defaultValue - Default value if not found
 * @returns {string} Environment variable value
 */
export function getEnv(key, defaultValue = '') {
  // First, try runtime env (set by Docker container)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key]
  }

  // Fallback to build-time env (set during Vite build)
  if (import.meta.env[key]) {
    return import.meta.env[key]
  }

  // Return default value
  return defaultValue
}

/**
 * Get all environment variables
 * @returns {Object} All environment variables
 */
export function getAllEnv() {
  return {
    VITE_STRAPI_URL: getEnv('VITE_STRAPI_URL', 'http://localhost:1337'),
    VITE_STRAPI_API_TOKEN: getEnv('VITE_STRAPI_API_TOKEN', ''),
    VITE_APP_NAME: getEnv('VITE_APP_NAME', 'Kamili App'),
    VITE_APP_URL: getEnv('VITE_APP_URL', '')
  }
}

/**
 * Get Strapi base URL
 * @returns {string} Strapi base URL
 */
export function getStrapiUrl() {
  return getEnv('VITE_STRAPI_URL', 'http://localhost:1337')
}

/**
 * Build full URL for Strapi assets (images, files, etc.)
 * Handles both relative paths (starting with /) and absolute URLs
 * @param {string} path - The path to the asset (e.g., '/uploads/image.jpg' or 'https://cdn.example.com/image.jpg')
 * @returns {string} Full URL to the asset
 */
export function getStrapiAssetUrl(path) {
  if (!path) return null

  // If it's already a full URL (starts with http:// or https://), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // Otherwise, prepend the Strapi base URL
  const baseUrl = getStrapiUrl()
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`
}

export default {
  getEnv,
  getAllEnv,
  getStrapiUrl,
  getStrapiAssetUrl
}
