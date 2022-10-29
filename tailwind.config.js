/** @type {import('tailwindcss').Config} */
const { colors: defaultColors } = require('tailwindcss/defaultTheme');
const scrollbar = require('tailwind-scrollbar');

module.exports = {
  content: ['./client/**/*.{js,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: 'Lobster Two',
      },
      colors: {
        ...defaultColors,
        spill: {
          DEFAULT: '#151C21',
          50: '#F6F8F9',
          100: '#F1F2F3',
          200: '#E9EBEC',
          300: '#DBDEE1',
          400: '#BDC2C7',
          500: '#4B5B68',
          600: '#404E59',
          700: '#36414A',
          800: '#2A343C',
          900: '#1F272E',
          950: '#161C20',
        },
      },
    },
  },
  plugins: [scrollbar],
};
