import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-500": "#FF4F00",
        "primary-700": "#CC3F00",
        "base-100": "#FFFDF9",
        "base-200": "#F5F3EB",
        "secondary-500": "#695BE8",
        "secondary-700": "#503EBD",
        "modal-bg": "rgb(0, 0, 0, 0.2)",
        "link-bg": "#F7F6FD"
      },
      boxShadow: {
        "3xl": "0px 5px 10px 7px rgb(0, 0, 0, 0.1)"
      },
      backgroundImage: {
        "canvas" : "radial-gradient(black 1px, transparent 0)"
      },
    },
  },
  plugins: [],
} satisfies Config;
