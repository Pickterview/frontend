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
        "google-red": "#DB4437",
        "google-red-hover": "#c33b2e",
        "kakao-yellow": "#FEE500",
        "kakao-yellow-hover": "#e6cf00",
        "kakao-text": "#3C1E1E",
      },
      fontFamily: {
        // sans를 기본 Pretendard-Regular로 설정
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
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        // heading fontFamily는 제거하거나 sans와 동일하게 설정.
        // 이제 모든 텍스트는 기본적으로 font-sans를 따릅니다.
      },
      boxShadow: {
        "input-focus-light": "0 0 0 3px rgba(33, 62, 102, 0.2)",
        "input-focus-dark": "0 0 0 3px rgba(33, 62, 102, 0.4)",
      },
    },
  },
  plugins: [],
};
