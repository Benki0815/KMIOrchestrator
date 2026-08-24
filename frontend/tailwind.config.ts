import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d1321",
        surface: "#0d1321",
        "surface-dim": "#0d1321",
        "surface-bright": "#333949",
        "surface-container-lowest": "#080e1c",
        "surface-container-low": "#161b2a",
        "surface-container": "#1a1f2e",
        "surface-container-high": "#242a39",
        "surface-container-highest": "#2f3444",
        "on-surface": "#dde2f6",
        "on-surface-variant": "#b9cacb",
        outline: "#849495",
        "outline-variant": "#3a494b",
        "primary-fixed": "#74f5ff",
        "primary-fixed-dim": "#00dbe7",
        "primary-container": "#00f2ff",
        "on-primary-container": "#006a71",
        secondary: "#d1bcff",
        "secondary-container": "#7000ff",
        "on-secondary-container": "#ddcdff",
        "tertiary-fixed-dim": "#ffb2ba",
        error: "#ffb4ab",
        "brand-pink": "#e8143c",
        "brand-pink-dim": "#ff4d6d",
        "brand-amber": "#f5c542",
      },
      fontFamily: {
        display: ["var(--font-geist)", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      maxWidth: {
        "container-max": "1440px",
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "40px",
      },
      boxShadow: {
        cyan: "0 0 20px rgba(0, 219, 231, 0.15)",
        "cyan-strong": "0 0 15px rgba(0, 219, 231, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
