/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
fontFamily: {
  inter: ['"Inter-Regular"', "Helvetica", "sans-serif"],
  zen: ['"Zen Kaku Gothic Antique"', "sans-serif"],
},
    },
  },
  plugins: [],
};
