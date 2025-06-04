// src/components/Common/Modal.jsx
import React, { useEffect } from "react";

function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        // ESC 키
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-out-expo"
      onClick={onClose} // 오버레이 클릭 시 모달 닫기
      style={{ opacity: isOpen ? 1 : 0 }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out-expo flex flex-col items-center p-6 sm:p-8 text-center" // 콘텐츠 중앙 정렬 및 패딩 적용
        onClick={(e) => e.stopPropagation()} // 모달 콘텐츠 클릭 시 이벤트 전파 중지
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0.95)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
