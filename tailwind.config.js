/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // if using Vite and it's in the root (if not, you can remove or adjust)
    "./src/**/*.{js,ts,jsx,tsx}", // This line is crucial for scanning your React components
  ],
  theme: {
    extend: {}, // You'll add customizations here later
  },
  plugins: [require("@tailwindcss/typography")],
};
