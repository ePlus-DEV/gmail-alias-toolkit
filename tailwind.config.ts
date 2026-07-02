import type { Config } from "tailwindcss";

export default {
  content: ["./entrypoints/**/*.{html,tsx,ts}", "./src/**/*.{tsx,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        soft: "0 14px 35px -22px rgb(15 23 42 / 0.45)",
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
