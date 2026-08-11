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
        burgundy: {
          deep: "#3A080C",
          wine: "#5A1118",
          dark: "#260407",
          light: "#771B24",
          soft: "#4A0B10",
        },
        gold: {
          warm: "#C8A15A",
          champagne: "#E4C98A",
          muted: "#D8BA7B",
          light: "#F5E8C9",
          border: "#D6B472",
        },
        cream: {
          ivory: "#F7F1E8",
          warm: "#EFE3D2",
          soft: "#FFFDF9",
          subtle: "#F3ECE0",
          card: "#FAF6F0",
        },
        charcoal: {
          DEFAULT: "#191414",
          muted: "#4A4545",
          light: "#7A7373",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        script: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(58, 8, 12, 0.08)',
        'luxury-lg': '0 20px 40px -15px rgba(58, 8, 12, 0.14)',
        'gold-glow': '0 0 25px rgba(200, 161, 90, 0.25)',
        'burgundy-glow': '0 0 35px rgba(58, 8, 12, 0.35)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite',
        float: 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

export default config;
