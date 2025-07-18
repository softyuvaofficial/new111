// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8",   // Blue-700 (Brand primary color)
        secondary: "#9333EA", // Purple-600 (Secondary action)
        success: "#10B981",   // Green-500
        danger: "#EF4444",    // Red-500
        warning: "#F59E0B",   // Amber-500
        darkBg: "#0F172A",    // Slate-900 (Dark Mode Background)
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      boxShadow: {
        soft: "0 4px 14px rgba(0,0,0,0.08)"
      }
    },
  },
  darkMode: "class", // Use 'class' based dark mode (e.g., <html class="dark">)
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
