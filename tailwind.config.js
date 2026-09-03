/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wedding-red': {
          DEFAULT: '#8B0000',
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#e02424',
          600: '#c81e1e',
          700: '#9b1c1c',
          800: '#771d1d',
          900: '#580c10',
          deep: '#420609',
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
        'red': '0 10px 25px -3px rgba(139, 0, 0, 0.4)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
