import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: "#F6F4F1",
          100: "#EDEAE4",
          200: "#DEDAD2",
          300: "#C7C1B6",
          400: "#A8A093",
          500: "#8A8175",
          600: "#6B6459",
          700: "#4E4941",
          800: "#332F2A",
          900: "#1C1A17",
          950: "#0F0E0C",
        },
        clay: {
          400: "#B99276",
          500: "#A67A5B",
          600: "#8B5F42",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
