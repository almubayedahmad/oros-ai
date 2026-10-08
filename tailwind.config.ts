import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 30px rgba(59,130,246,0.25)"
      },
      colors: {
        slate: {
          950: "#050b17"
        }
      }
    }
  },
  plugins: []
};

export default config;
