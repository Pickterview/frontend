import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 추가
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("회원가입 시도:", { email, password });
    alert("회원가입 성공! 로그인 페이지로 이동합니다."); // 임시 알림
    navigate("/login");
  };

  const inputBaseClasses =
    "w-full py-3 px-4 rounded-lg transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none";
  const lightInputClasses =
    "bg-gray-50 border border-light-border text-light-text-primary focus:ring-2 focus:ring-accent-main focus:border-transparent dark:focus:ring-offset-dark-bg-secondary";
  const darkInputClasses =
    "dark:bg-dark-bg-primary dark:border-dark-border dark:text-dark-text-primary dark:focus:ring-2 dark:focus:ring-accent-main dark:focus:border-transparent";

  return (
    <form className="space-y-6" onSubmit={handleSignUp}>
      <div>
        <label
          htmlFor="email-signup"
          className="block text-sm font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          이메일
        </label>
        <input
          id="email-signup"
          type="email"
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password-signup"
          className="block text-sm font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          비밀번호
        </label>
        <input
          id="password-signup"
          type="password"
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>
      <div>
        <label
          htmlFor="confirm-password-signup"
          className="block text-sm font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          비밀번호 확인
        </label>
        <input
          id="confirm-password-signup"
          type="password"
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200
                   bg-accent-main hover:bg-accent-hover
                   focus:outline-none focus:ring-2 focus:ring-accent-main focus:ring-opacity-75 focus:ring-offset-2
                   dark:focus:ring-offset-dark-bg-secondary"
      >
        회원가입
      </button>
    </form>
  );
}

export default SignUpForm;
