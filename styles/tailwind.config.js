// styles/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",  // Scan all files in app/ folder (Next.js 13+)
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}", // If you have a pages folder
  ],
  darkMode: "class", // Enable dark mode using a 'class' strategy (you toggle 'dark' class on html/body)
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Tailwind blue-600
          light: "#3b82f6",
          dark: "#1e40af",
        },
        secondary: {
          DEFAULT: "#fbbf24", // Tailwind yellow-400
          light: "#fcd34d",
          dark: "#b45309",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
