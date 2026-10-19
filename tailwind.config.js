/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          950: '#08090e',
          900: '#0b0d14',
          850: '#0f111b',
          800: '#14161f',
          750: '#181b26',
          700: '#1d2130',
          600: '#282d3f',
          500: '#363b52',
          400: '#4a4f6b',
          300: '#6b7194',
          200: '#9398b8',
          100: '#c2c5dc',
        },
        primary: {
          50: '#ecfdf8',
          100: '#d1faec',
          200: '#a7f3da',
          300: '#6ee7c0',
          400: '#34d3a0',
          500: '#10b882',
          600: '#079b6a',
          700: '#077857',
          800: '#085e46',
          900: '#074d3b',
        },
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
