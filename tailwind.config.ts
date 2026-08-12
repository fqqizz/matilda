import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        matilda: {
          dark: "#1A0205",
          burgundy: "#260407",
          rich: "#3A080C",
          accent: "#5A1118",
          ivory: "#FFFDF9",
          warm: "#FAF6F0",
          soft: "#F5EFE6",
          muted: "#EFE3D2",
          gold: "#C8A15A",
          champagne: "#E4C98A",
          bronze: "#9E7B3B",
          noir: "#191414",
          charcoal: "#383132",
          grey: "#7A7373",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      letterSpacing: {
        luxury: "0.22em",
        ultra: "0.35em",
        spaced: "0.45em",
      },
      boxShadow: {
        luxury: "0 10px 40px -10px rgba(38, 4, 7, 0.08)",
        card: "0 4px 20px -2px rgba(38, 4, 7, 0.04)",
        gold: "0 0 30px rgba(200, 161, 90, 0.15)",
        drawer: "-10px 0 40px rgba(26, 2, 5, 0.25)",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
        tactile: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
