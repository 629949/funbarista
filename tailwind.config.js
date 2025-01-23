/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
     "/src/**/*.js",
      "/src/**/*courses.html", 
      "/src/**/*Application.html",
      "/src/**/*.js",
      "/src/**/apply.js",
      "/home.css"
  ],
  theme: {
    extend: {},
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}

