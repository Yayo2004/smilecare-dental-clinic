/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette: soft teal / blue primary, mint accents, dark navy text
        primary: {
          DEFAULT: '#2A9D8F',
          light: '#4FB3BF',
          dark: '#21867A',
        },
        accent: {
          DEFAULT: '#BDE0DF',
          light: '#D7ECEB',
        },
        mint: {
          DEFAULT: '#E8F5F4',
          light: '#F4FBFB',
        },
        navy: {
          DEFAULT: '#1B2A4A',
          light: '#2C3E63',
        },
        cream: '#FAFCFB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(27, 42, 74, 0.08)',
        card: '0 4px 24px rgba(42, 157, 143, 0.12)',
        glow: '0 0 0 6px rgba(42, 157, 143, 0.15)',
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
