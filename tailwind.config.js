/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",   
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "grey-10": "var(--grey-10)",
        "sucess" : "var(--green-2010)"
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif', 'Manrope'],
        "h4-14-20": "var(--h4-14-20-font-family)",
        "h5r-12-18": "var(--h5r-12-18-font-family)",
        'manrope': ['Manrope', 'sans-serif'],
      },
      minHeight: {
        '128': '32rem',
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [require("tw-elements-react/dist/plugin.cjs",'@tailwindcss/line-clamp')],
  darkMode: "class"
};
