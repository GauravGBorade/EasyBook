/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { right: "-5rem" },
          "100%": { right: "1rem" },
        },
      },
      animation: {
        slideIn: `slideIn 0.4s ease-in`,
      },
    },
    container: {
      padding: { md: "10rem" },
    },
  },

  plugins: [],
};
