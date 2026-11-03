import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic color system for CrashLens (Light, Medium/Comfort, Dark)
        brand: {
          amber: "#f59e0b",
          "amber-dark": "#d97706",
          orange: "#ea580c",
          "orange-dark": "#c2410c",
          danger: "#ef4444",
          "danger-dark": "#dc2626",
          success: "#10b981",
          warning: "#f59e0b",
          info: "#0ea5e9",
        },
        surface: {
          light: "#faf9f6", // warm off-white
          "light-card": "#ffffff",
          "light-border": "#e5e3dd",
          medium: "#f0ede6", // concrete / stone comfort
          "medium-card": "#f8f6f0",
          "medium-border": "#dedbd2",
          dark: "#0f1115", // deep graphite
          "dark-card": "#181b20",
          "dark-border": "#272a30",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "radar-sweep": "radarSweep 4s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-slow": "ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
