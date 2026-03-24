/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f0',
          100: '#ffe0e0',
          200: '#ffc7c7',
          300: '#ffa3a3',
          400: '#FF8E8E',
          500: '#FF6B6B',
          600: '#e85d5d',
          700: '#d14f4f',
          800: '#b94242',
          900: '#a13636',
        },
        secondary: {
          50: '#f7f8fa',
          100: '#ebedf2',
          200: '#d4d8e1',
          300: '#a8b0c0',
          400: '#7a849b',
          500: '#4a5568',
          600: '#3d4659',
          700: '#2D3748',
          800: '#222a38',
          900: '#1a202c',
        },
        accent: {
          50: '#e8faf8',
          100: '#c5f2ec',
          200: '#9ae8de',
          300: '#6dddd0',
          400: '#4ECDC4',
          500: '#38b2a8',
          600: '#2d9a91',
          700: '#257f78',
          800: '#1e6560',
          900: '#174d49',
        },
        success: '#7BC67E',
        warning: '#FFB347',
        surface: '#FFF9F5',
      },
      fontFamily: {
        sans: ['var(--font-heebo)', 'Heebo', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'confetti': 'confetti-fall 2.5s ease-in forwards',
      },
    },
  },
  plugins: [],
};
