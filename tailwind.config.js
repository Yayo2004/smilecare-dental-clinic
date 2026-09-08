/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Myriam Lahlou palette: warm gold / amber primary, soft cream accents, deep brown-navy text
        primary: {
          DEFAULT: '#B8860B',
          light: '#D4A017',
          dark: '#8A6508',
        },
        accent: {
          DEFAULT: '#F2D27F',
          light: '#FAEBC4',
        },
        mint: {
          DEFAULT: '#FDF6E3',
          light: '#FEFBF0',
        },
        navy: {
          DEFAULT: '#3B2A20',
          light: '#5A4636',
        },
        cream: '#FDF9EE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(59, 42, 32, 0.08)',
        card: '0 4px 24px rgba(184, 134, 11, 0.15)',
        glow: '0 0 0 6px rgba(184, 134, 11, 0.18)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
