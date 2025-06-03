// src/components/MainPage/AccountSettingsForm.jsx
import React, { useState, useEffect } from "react";

function AccountSettingsForm({ currentUser, onClose }) {
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  // 비밀번호 필드는 보통 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인으로 구성
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmNewPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    // TODO: API 호출하여 계정 정보 업데이트 로직 구현
    console.log("계정 정보 업데이트:", {
      name,
      email,
      currentPassword,
      newPassword,
    });
    alert("계정 정보가 (임시로) 수정되었습니다.");
    onClose(); // 모달 닫기
  };

  const inputBaseClasses =
    "w-full py-2.5 px-3 rounded-lg transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm";
  const lightInputClasses =
    "bg-gray-50 border border-light-border text-light-text-primary focus:ring-1 focus:ring-accent-main focus:border-transparent";
  const darkInputClasses =
    "dark:bg-dark-bg-primary dark:border-dark-border dark:text-dark-text-primary dark:focus:ring-1 dark:focus:ring-accent-main dark:focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          이름
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          이메일 (변경 불가)
        </label>
        <input
          type="email"
          id="email"
          value={email}
          readOnly // 이메일은 보통 변경 불가 처리
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`}
        />
      </div>
      <hr className="border-light-border dark:border-dark-border my-3" />
      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
        비밀번호 변경 (선택)
      </p>
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-xs font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          현재 비밀번호
        </label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          placeholder="현재 비밀번호 입력"
        />
      </div>
      <div>
        <label
          htmlFor="newPassword"
          className="block text-xs font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          새 비밀번호
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          placeholder="새 비밀번호 (8자 이상)"
        />
      </div>
      <div>
        <label
          htmlFor="confirmNewPassword"
          className="block text-xs font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          새 비밀번호 확인
        </label>
        <input
          type="password"
          id="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          placeholder="새 비밀번호 다시 입력"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="py-2 px-4 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-light-text-primary dark:text-dark-text-primary transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="py-2 px-4 rounded-lg text-sm font-medium bg-accent-main hover:bg-accent-hover text-white transition-colors"
        >
          변경사항 저장
        </button>
      </div>
    </form>
  );
}

export default AccountSettingsForm;
