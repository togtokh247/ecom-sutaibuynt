import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#182230",
        brand: "#4f46e5",
        mint: "#059669",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(24,34,48,.06)",
      },
    },
  },
  plugins: [],
};

export default config;