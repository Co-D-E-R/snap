/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    './dist/**/*.html',
    './dist/**/*.js',
    './dist/**/*.css',
    './src/**/*.js',
    './static/**/*.html',
    './static/**/*.css'
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      padding: ['hover'],
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

