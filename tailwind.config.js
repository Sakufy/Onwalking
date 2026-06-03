/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#faf8f5",
        surface: "#ffffff",
        primary: "#2563eb",
        "primary-hover": "#1d4ed8",
        "text-primary": "#1a1a1a",
        "text-secondary": "#4a4a4a",
        "text-muted": "#6b6b6b",
        border: "#e5e5e5",
        "border-light": "#f0f0f0",
      },
    },
  },
  plugins: [],
}
