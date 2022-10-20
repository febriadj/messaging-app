/** @type {import('tailwindcss').Config} */
const { colors: defaultColors } = require('tailwindcss/defaultTheme');
const scrollbar = require('tailwind-scrollbar');

module.exports = {
  content: ['./client/**/*.{js,jsx,tsx}'],
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
          100: '#EEF0F1',
          200: '#E1E3E5',
          300: '#D0D4D7',
          400: '#ACB3B9',
          500: '#7D858C',
          600: '#475057',
          700: '#31393F',
          800: '#1F272E',
          900: '#151C21',
        },
      },
    },
  },
  plugins: [scrollbar],
};
