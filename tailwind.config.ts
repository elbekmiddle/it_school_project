import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#2563eb", 
        secondary: "#1e293b",
        accent: "#f59e0b", 
        background: "#f9fafb",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.1)",
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'watch': '200px',
    },
  },
  plugins: [],
};
export default config;
