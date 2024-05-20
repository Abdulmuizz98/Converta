import tailwindFormsPlugin from "@tailwindcss/forms";
import prelinePlugin from "preline/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "node_modules/preline/dist/*.js",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "380px",
      sm: "530px",
      md: "768px",
      lg: "976px",
      xl: "1400px",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
      mono: ["Fira Code", "monospace"],
    },
    extend: {},
  },
  plugins: [tailwindFormsPlugin, prelinePlugin],
};
