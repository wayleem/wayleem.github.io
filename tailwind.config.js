export default {
  plugins: [],
  theme: {
    extend: {

    },
    fontFamily: {
      'header': ['Quicksand', 'sans-serif'],
      'body': ['Montserrat', 'sans-serif'],
      'misc': ['Oswald', 'sans-serif'],
    }
  },
  purge: ["./index.html", './src/**/*.{js,jsx,ts,tsx}'], // for unused CSS
  variants: {
    extend: {},
  },
  darkMode: false, // or 'media' or 'class'
}