import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        appear: "appear 1s ease-in-out",
        dissapear: "dissapear 1s ease-in-out forwards",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "custom-green-50": "#041D20",
        "custom-green-100": "#052529",
        "custom-green-150": "#064851",
      },
      keyframes: {
        appear: {
          "0%": {
            opacity: "0",
            transform: "translateX(-100%)",
          },
          "100%": { opacity: "1", transform: "translateX(0%)" },
        },
        dissapear: {
          "0%": { opacity: "1", transform: "translateX(0%)" },
          "99%": {
            opacity: "0",
            transform: "translateX(-100%)",
          },
          "100%": {
            opacity: "0",
            transform: "translateX(-100%)",
            display: "none",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
