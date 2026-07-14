/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../src/components/motion/theme-toggle.tsx",
    "../src/components/motion/action-swap.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(37, 99, 235, 0.22)",
      },
    },
  },
  plugins: [],
};
