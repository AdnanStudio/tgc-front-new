/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a6b3c',
          50: '#f0faf4',
          100: '#dcf5e8',
          200: '#bbead1',
          300: '#87d8b0',
          400: '#4dbe87',
          500: '#28a265',
          600: '#1a6b3c',
          700: '#165630',
          800: '#144428',
          900: '#0f3420',
        },
        secondary: {
          DEFAULT: '#c41e3a',
          light: '#e8294d',
          dark: '#8b1429',
        },
        accent: {
          gold: '#f5a623',
          blue: '#0066cc',
          green: '#2d7a2d',
        },
        dark: '#1a1a2e',
        light: '#f8f9fa',
      },
      fontFamily: {
        bangla: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
        english: ['Poppins', 'sans-serif'],
        sans: ['Hind Siliguri', 'Poppins', 'sans-serif'],
      },
      animation: {
        'scroll-left': 'scrollLeft 30s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scrollLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card': '0 2px 15px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.15)',
        'header': '0 2px 20px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
