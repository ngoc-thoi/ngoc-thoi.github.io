/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Disable automatic media query dark mode
  theme: {
    extend: {
      colors: {
        'wedding-red': {
          DEFAULT: '#C8102E', // Vibrant, festive celebratory red
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#c8102e', // Vietnamese wedding scarlet
          800: '#a30d25', // Bright celebratory crimson
          900: '#83081c', // Rich bright ruby red (not dark brown)
          950: '#5c0613',
          deep: '#6b0816',
        },
        'wedding-gold': {
          DEFAULT: '#D4AF37',
          light: '#F5DEB3',
          bright: '#FBBF24',
          dark: '#B8860B',
        },
        'wedding-cream': '#FFFDF9',
        'wedding-surface': '#FAEDEE',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'serif'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(212, 175, 55, 0.35)',
        'red': '0 10px 25px -3px rgba(200, 16, 46, 0.4)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
