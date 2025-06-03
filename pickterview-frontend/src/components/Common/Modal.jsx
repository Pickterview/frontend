// src/components/Common/Modal.jsx
import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        // ESC 키
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden"; // 모달 열릴 때 배경 스크롤 방지
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-out-expo"
      onClick={onClose} // 오버레이 클릭 시 닫기
      style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div
        className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out-expo"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 중지
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0.95)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
