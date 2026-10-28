import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#1663F5', // Primary Blue
          600: '#114FCC',
          700: '#0E3FA8',
          800: '#0A2E7A',
          900: '#071F52',
          DEFAULT: '#1663F5',
        },
        accent: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF7A1A', // Secondary Orange
          600: '#E0620E',
          700: '#B84C07',
          800: '#8F3804',
          900: '#662402',
          DEFAULT: '#FF7A1A',
        },
        surface: {
          bg: '#F5F7FF',
          card: '#FFFFFF',
          dark: '#0F172A',
          muted: '#6B7280',
          border: '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        card: '0 4px 20px -2px rgba(22, 99, 245, 0.07), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        hover: '0 10px 30px -4px rgba(22, 99, 245, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
        highlight: '0 0 0 2px #1663F5',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        blob: 'blob 7s infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in-up-delay-1': 'fade-in-up 0.5s ease-out 0.1s forwards',
        'fade-in-up-delay-2': 'fade-in-up 0.5s ease-out 0.2s forwards',
        'fade-in-up-delay-3': 'fade-in-up 0.5s ease-out 0.3s forwards',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

export default config;
