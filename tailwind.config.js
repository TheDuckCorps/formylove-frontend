/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C62A87',
          dark: '#A01E6E',
          light: '#E91E8C',
          50: '#FFF0F7',
          100: '#FFD6EC',
          200: '#FFB3DA',
          300: '#FF80C3',
          400: '#E91E8C',
          500: '#C62A87',
          600: '#A01E6E',
          700: '#7A1554',
        },
        surface: '#FAFAFA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #C62A87 0%, #E91E8C 100%)',
        'brand-gradient-r': 'linear-gradient(to right, #C62A87, #E91E8C)',
        'page-gradient': 'linear-gradient(180deg, #ffffff 60%, #FCE4F3 100%)',
      },
      boxShadow: {
        card: '0 2px 16px rgba(198, 42, 135, 0.10)',
        modal: '0 8px 40px rgba(0,0,0,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-in',
        blink: 'blink 1s step-end infinite',
        'finger-tap': 'fingerTap 1.6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        fingerTap: {
          '0%, 15%': { transform: 'translateY(0) scale(1)' },
          '35%': { transform: 'translateY(12px) scale(0.88)' },
          '50%, 100%': { transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
