/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "accent-main": "#213e66",
        "accent-hover": "#1a3252",
        "dark-bg-primary": "#1a1d24",
        "dark-bg-secondary": "#252a33",
        "dark-text-primary": "#e5e7eb",
        "dark-text-secondary": "#9ca3af",
        "dark-border": "#374151",
        "light-bg-primary": "#f4f7fc",
        "light-bg-secondary": "#ffffff",
        "light-text-primary": "#1f2937",
        "light-text-secondary": "#4b5563",
        "light-border": "#d1d5db",

        // 티어 색상 (업데이트)
        "tier-bronze": "#8b6259",
        "tier-silver": "#969fab",
        "tier-gold": "#ec9a01",
        "tier-platinum": "#49b2d4",
        "tier-diamond": "#476ac2",

        "google-red": "#DB4437",
        "google-red-hover": "#c33b2e",
        "kakao-yellow": "#FEE500",
        "kakao-yellow-hover": "#e6cf00",
        "kakao-text": "#3C1E1E",
      },
      fontFamily: {
        sans: [
          "Pretendard-Regular",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
      boxShadow: {
        "input-focus-light": "0 0 0 3px rgba(33, 62, 102, 0.2)",
        "input-focus-dark": "0 0 0 3px rgba(33, 62, 102, 0.4)",
        "card-hover-light":
          "0 10px 25px -5px rgba(33, 62, 102, 0.2), 0 8px 10px -6px rgba(33, 62, 102, 0.2)",
        "card-hover-dark":
          "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
        "button-active-light": "inset 0 2px 4px 0 rgba(0,0,0,0.08)",
        "button-active-dark": "inset 0 2px 4px 0 rgba(0,0,0,0.3)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fillDiagonal: {
          "0%": { transform: "scale(0) rotate(-45deg)", opacity: "0.5" },
          "100%": { transform: "scale(1.5) rotate(-45deg)", opacity: "1" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
        fillDiagonal: "fillDiagonal 0.4s ease-out forwards",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".fill-before::before": {
          content: '""',
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex: "0",
          transformOrigin: "top left",
        },
      };
      addUtilities(newUtilities, ["before"]);
    },
  ],
};
