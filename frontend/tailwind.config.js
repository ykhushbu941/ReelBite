/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   "#FC8019", // Swiggy Orange
          secondary: "#E23744", // Zomato Red
          dark:      "#1C1C1C", // Deep charcoal (not harsh black)
          gray:      "#2C2C2C", // Card surface
          muted:     "#3A3A3A", // Subtle border / divider
          green:     "#3D9970", // Veg green
        }
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      animation: {
        'like-pump':  'pump 0.4s ease-in-out',
        'fade-in':    'fade 0.3s ease-in-out',
        'slide-up':   'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)',
        'slide-down': 'slideDown 0.3s ease-in',
        'spin-slow':  'spin 1.5s linear infinite',
      },
      keyframes: {
        pump: {
          '0%':   { transform: 'scale(1) translate(-50%,-50%)',   opacity: 0 },
          '50%':  { transform: 'scale(1.5) translate(-50%,-50%)', opacity: 1 },
          '100%': { transform: 'scale(1) translate(-50%,-50%)',   opacity: 0 },
        },
        fade: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)',    opacity: 1 },
        },
        slideDown: {
          '0%':   { transform: 'translateY(0)',    opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 },
        },
      }
    },
  },
  plugins: [],
}