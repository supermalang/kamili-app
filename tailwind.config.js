/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EF4444', // red-600
          dark: '#DC2626', // red-700
        },
        secondary: {
          teal: '#14B8A6', // teal-500
          yellow: '#FACC15', // yellow-400
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
}