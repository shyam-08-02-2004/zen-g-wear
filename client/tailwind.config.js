/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#222222', // near black
          900: '#111111', // true dark
          DEFAULT: '#111111',
        },
        accent: {
          50: '#fbf9f1',
          100: '#f6f0dd',
          200: '#eedfbc',
          300: '#e2c892',
          400: '#d4af62',
          500: '#c59539', // Gold Accent
          600: '#ab772d',
          700: '#885827',
          800: '#714825',
          900: '#5c3d21',
          DEFAULT: '#c59539',
        },
        ink: {
          DEFAULT: '#000000',
          soft: '#4b5563', // text-gray-600
        },
        cloud: '#f9fafb', // text-gray-50
        mist: {
          DEFAULT: '#e5e7eb', // text-gray-200
          dark: '#9ca3af', // text-gray-400
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(11,18,32,0.08), 0 1px 2px rgba(11,18,32,0.04)',
        'soft-lg': '0 12px 32px -8px rgba(11,18,32,0.16), 0 4px 8px -2px rgba(11,18,32,0.06)',
      },
      keyframes: {
        'orbit-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'scale-in': {
          from: { opacity: 0, transform: 'scale(0.96)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { opacity: 0, transform: 'translateX(12px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'orbit-spin': 'orbit-spin 1.1s linear infinite',
        'fade-in': 'fade-in 0.15s ease-out',
        'scale-in': 'scale-in 0.15s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};
