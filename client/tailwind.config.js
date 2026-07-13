/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1D2A78',
        slate: '#4C5B72',
        'light-blue': '#8DA3B8',
        'lighter-blue': '#B7C9D9',
        'dark-gray': '#1F1F1F',
      },
    },
  },
  plugins: [],
}