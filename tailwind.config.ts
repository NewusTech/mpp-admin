import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "primary-50": "#FCFDFE",
        "primary-100": "#F2F5FB",
        "primary-200": "#E2EAF7",
        "primary-300": "#CBD9F1",
        "primary-400": "#CBE4CA",
        "primary-500": "#8AA9DF",
        "primary-600": "#608AD3",
        "primary-700": "#3568C0",
        "primary-800": "#1D3A6C",
        "primary-900": "#101F39",
        "secondary-50": "#FFFDFC",
        "secondary-100": "#FFF9F3",
        "secondary-200": "#FFF0E4",
        "secondary-300": "#FFE5D0",
        "secondary-400": "#FFD6B5",
        "secondary-500": "#FFC595",
        "secondary-600": "#FFB06F",
        "secondary-700": "#FF9742",
        "secondary-800": "#AB4D00",
        "secondary-900": "#512400",
        "neutral-50": "#FEFEFE",
        "neutral-100": "#FBFBFB",
        "neutral-200": "#F7F7F7",
        "neutral-300": "#F0F0F0",
        "neutral-400": "#E8E8E8",
        "neutral-500": "#DEDEDE",
        "neutral-600": "#D2D2D2",
        "neutral-700": "#C4C4C4",
        "neutral-800": "#656565",
        "neutral-900": "#2C2C2C",
        "success-50": "#FBFEFD",
        "success-100": "#F1FCF7",
        "success-200": "#DFF8EE",
        "success-300": "#C6F3E0",
        "success-400": "#A6EDCF",
        "success-500": "#7EE5BA",
        "success-600": "#50DBA1",
        "success-700": "#28C382",
        "success-800": "#176E4A",
        "success-900": "#0C3B28",
        "warning-50": "#FFFDFC",
        "warning-100": "#FEF9F4",
        "warning-200": "#FDF1E6",
        "warning-300": "#FCE6D2",
        "warning-400": "#FAD8B8",
        "warning-500": "#F8C799",
        "warning-600": "#F5B374",
        "warning-700": "#F29B4A",
        "warning-800": "#9E520B",
        "warning-900": "#4B2705",
        "error-50": "#FFFCFD",
        "error-100": "#FEF3F5",
        "error-200": "#FDE4E9",
        "error-300": "#FBCFD8",
        "error-400": "#F8B4C2",
        "error-500": "#F693A7",
        "error-600": "#F26C87",
        "error-700": "#EE3F62",
        "error-800": "#950D28",
        "error-900": "#480614",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        inter: ["var(--font-inter)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
