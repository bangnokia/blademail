module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{jsx,js,tsx,ts}",
    "./node_modules/@vechaiui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("@tailwindcss/forms"),
    require("@vechaiui/core")({
      colors: ["red"],
    }),
  ],
}
