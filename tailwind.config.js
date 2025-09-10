/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-orange": "#FF5436",
        "primary-black": "#151718",
        "secondary-black": "#2A2A2A",
        "fill-black": "#121212",
        "grey-outline": "#E8E8E9",
        "grey-fill": "#F6F6F6",
        "primary-grey": "#757575",
        "primary-red": "#FF0000",
        "primary-green": "#23D60C",
        "secondary-green": "#0C9100",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};
