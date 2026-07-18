import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        surface: "var(--surface)",
        border: "var(--border)",
        accent: "var(--accent)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        bengali: ["var(--font-noto-bengali)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
