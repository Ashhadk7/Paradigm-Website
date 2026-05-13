/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paradigm-dark-blue': '#34416D',
        'warm-gold': '#C4A25B',
        'blue-grey': '#637890',
        'warm-off-white': '#F5F3EF',
        'near-black': '#2C2C2C',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
