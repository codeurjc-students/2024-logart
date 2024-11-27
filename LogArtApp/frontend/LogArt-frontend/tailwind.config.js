/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        'primary': 'hsl(309, 50%, 90%)',
        'secondary': 'hsl(309, 50%, 10%)',
        'tertiary': 'hsl(9, 80%, 20%)',
        'accent': 'hsl(249, 80%, 20%)',
              },
    },
  },
  plugins: [],
}