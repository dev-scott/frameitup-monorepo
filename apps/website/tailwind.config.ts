import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
        },
        frame: {
          dark: '#1C1917',
          charcoal: '#292524',
          warm: '#78716C',
          cream: '#FAFAF9',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-in-left': 'slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-in-right': 'slideInRight 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.24,0,0.38,1) infinite',
        'border-pulse': 'borderPulse 2s ease-in-out infinite',
        'tilt-in': 'tiltIn 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(0.5deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-0.5deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        rotateSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(217,141,46,0.3)' },
          '50%': { borderColor: 'rgba(217,141,46,0.8)' },
        },
        tiltIn: {
          from: { opacity: '0', transform: 'perspective(800px) rotateX(20deg) scale(0.95)' },
          to: { opacity: '1', transform: 'perspective(800px) rotateX(0deg) scale(1)' },
        },
      },
      boxShadow: {
        'brand': '0 8px 32px rgba(217,141,46,0.3)',
        'brand-lg': '0 16px 64px rgba(217,141,46,0.4)',
        'frame': '0 20px 60px rgba(28,25,23,0.15)',
        'frame-lg': '0 40px 100px rgba(28,25,23,0.2)',
        'glass': '0 8px 32px rgba(28,25,23,0.08), inset 0 1px 0 rgba(255,255,255,0.2)',
        'inset-brand': 'inset 0 0 0 1px rgba(217,141,46,0.4)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'brand-gradient': 'linear-gradient(135deg, #e4a44a 0%, #d98d2e 50%, #a35a1c 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 60% 0%, rgba(217,141,46,0.15) 0%, transparent 70%)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
