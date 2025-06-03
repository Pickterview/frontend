// src/components/MainPage/MenuButton.jsx
import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

function MenuButton({
  title,
  description,
  icon,
  bgColorClass = "bg-accent-main",
  hoverFillColor = "bg-white/10",
  delay = 0,
  onClick, //  <--- 1. onClick 프롭을 받도록 추가합니다.
}) {
  const IconComponent = icon;

  return (
    <button
      onClick={onClick} //  <--- 2. 전달받은 onClick 프롭을 실제 <button> 요소의 onClick 이벤트에 연결합니다.
      className={`
        w-full p-6 rounded-2xl text-white shadow-lg
        flex flex-col justify-between items-start
        relative overflow-hidden group
        transform transition-transform duration-300 ease-out-expo
        hover:-translate-y-1
        ${bgColorClass}
        animate-fadeInUp
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`
          absolute top-0 left-0 w-[200%] h-[200%]
          ${hoverFillColor}
          rounded-full
          transition-all duration-500 ease-out-expo
          transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100
          origin-top-left
          -z-10
        `}
      ></span>
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        <div>
          {IconComponent && (
            <IconComponent className="w-8 h-8 mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
          )}
          <h3 className="text-xl font-semibold mb-1 text-left">{title}</h3>
          {description && (
            <p className="text-sm opacity-80 text-left group-hover:opacity-90 transition-opacity duration-300">
              {description}
            </p>
          )}
        </div>
        <ArrowRightIcon className="w-6 h-6 mt-4 self-end opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 transform group-hover:rotate-[-45deg]" />
      </div>
    </button>
  );
}
export default MenuButton;
