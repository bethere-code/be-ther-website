/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Ink — deep navy (backgrounds, nav, footers)
        ink: {
          50: '#edf0f7',
          100: '#d4daea',
          200: '#a9b5d4',
          300: '#7e90be',
          400: '#536ca8',
          500: '#374f85',
          600: '#2b3f6b',
          700: '#1f2f53',
          800: '#1b2840', // nav/card surfaces
          900: '#161f32', // main bg sections
          950: '#0f1623', // deepest bg
        },
        // Coral — brand primary (logo, CTAs, headings accent, buttons)
        coral: {
          50: '#fef3ee',
          100: '#fde3d5',
          200: '#fbc3a8',
          300: '#f79b70',
          400: '#f27040',
          500: '#d4633a', // main brand coral (matches logo)
          600: '#c05530',
          700: '#a04428',
          800: '#833825',
          900: '#6b3022',
          950: '#3a160d',
        },
        // Cream — warm off-white (card surfaces, form backgrounds)
        cream: {
          50: '#fdfaf6',
          100: '#f8f3ec',
          200: '#f0e9db',
          300: '#e6dccc',
          400: '#d9cdb9',
          500: '#c8b99f',
          600: '#b09e83',
          700: '#8e7c61',
          800: '#6e5f49',
          900: '#4e4334',
          950: '#2e261d',
        },
        // Amber — secondary accent (badges, highlights)
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#e8a020',
          600: '#c47e0e',
          700: '#a0620a',
          800: '#7e4d0a',
          900: '#5f3a0b',
          950: '#3b2005',
        },
        success: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
        warning: { 400: '#fbbf24', 500: '#f59e0b' },
        error: { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(15, 22, 35, 0.18), 0 4px 24px -4px rgba(15, 22, 35, 0.12)',
        float: '0 12px 40px -8px rgba(15, 22, 35, 0.45), 0 4px 16px -4px rgba(15, 22, 35, 0.25)',
        glow: '0 0 0 1px rgba(212, 99, 58, 0.25), 0 8px 32px -8px rgba(212, 99, 58, 0.5)',
        'glow-sm': '0 0 0 1px rgba(212, 99, 58, 0.2), 0 4px 16px -4px rgba(212, 99, 58, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.6' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.8s ease both',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};
