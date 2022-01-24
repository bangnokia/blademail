module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{jsx,js,tsx,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
