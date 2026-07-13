import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca SAMVERO
        navy: {
          DEFAULT: "#0D1B2A",
          50: "#F1F3F5",
          100: "#D9DEE4",
          800: "#122335",
          900: "#0D1B2A",
          950: "#08121D",
        },
        brand: {
          DEFAULT: "#FF6A00",
          50: "#FFF3EA",
          100: "#FFE1C7",
          200: "#FFC08A",
          400: "#FF8A33",
          500: "#FF6A00",
          600: "#E85F00",
          700: "#C24F00",
        },
        light: "#F2F2F2",
        slatebrand: "#64748B",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -6px rgba(13, 27, 42, 0.12)",
        cardHover: "0 12px 30px -8px rgba(13, 27, 42, 0.22)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "slide-in": "slide-in 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
