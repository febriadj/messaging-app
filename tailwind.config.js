/** @type {import('tailwindcss').Config} */
const scrollbar = require('tailwind-scrollbar');

module.exports = {
  content: ['./client/**/*.{js,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: 'Lobster Two',
      },
    },
  },
  plugins: [scrollbar],
};
