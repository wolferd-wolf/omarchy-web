import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        omarchy: {
          950: "#090a0f",
          900: "#0d0f17",
          850: "#121520",
          800: "#181c2b",
          700: "#22273d",
          600: "#323957",
          500: "#4f5b87",
          accent: "#22c55e",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "SF Mono",
          "Cascadia Code",
          "Consolas",
          "monospace",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        "hyprland-active": "0 0 20px -3px rgba(34, 197, 94, 0.4), 0 0 8px -2px rgba(6, 182, 212, 0.3)",
        "hyprland-cyan": "0 0 20px -3px rgba(6, 182, 212, 0.4)",
        "hyprland-violet": "0 0 20px -3px rgba(139, 92, 246, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.15s ease-out forwards",
        "scale-in": "scaleIn 0.15s ease-out forwards",
        "hypr-pop": "hyprPop 0.22s cubic-bezier(0.05, 0.9, 0.1, 1.05) forwards",
        "slide-left": "slideLeft 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-right": "slideRight 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "toast-in": "toastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shutter-flash": "shutterFlash 0.35s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        hyprPop: {
          "0%": { opacity: "0", transform: "scale(0.93) translateY(8px)" },
          "70%": { transform: "scale(1.008)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        toastIn: {
          "0%": { opacity: "0", transform: "translateX(40px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        shutterFlash: {
          "0%": { opacity: "0.85" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
