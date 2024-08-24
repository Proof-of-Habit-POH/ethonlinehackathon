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
        primary: "#F55951",
        secondary: "#371D32",
        tertiary: "#EED2CB",
        whitebg: "#FFFFFF",
        lightgraybg: "#F1E8E6",
        blacktext: "#1D1D1D",
        graytext: "#8D8D8D",
        grayicon: "#CCCCCC",
      },
    },
  },
  plugins: [],
};
export default config;
