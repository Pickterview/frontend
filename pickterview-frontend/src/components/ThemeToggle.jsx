import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out
                 bg-accent-main text-white
                 hover:bg-accent-hover
                 flex items-center justify-center z-50
                 focus:outline-none focus:ring-2 focus:ring-accent-main focus:ring-opacity-50"
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        {" "}
        {/* 아이콘 크기 약간 줄임 */}
        <FontAwesomeIcon
          icon={faMoon}
          className={`absolute transition-transform duration-300 text-lg ${
            // 아이콘 크기 조정
            theme === "dark"
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        />
        <FontAwesomeIcon
          icon={faSun}
          className={`absolute transition-transform duration-300 text-lg ${
            // 아이콘 크기 조정
            theme === "light"
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        />
      </div>
    </button>
  );
}

export default ThemeToggle;
