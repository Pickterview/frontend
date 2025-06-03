import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import SignUpForm from "../components/Auth/SignUpForm";
import ThemeToggle from "../components/ThemeToggle";

function AuthPage({ showLogin = true }) {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8
                    bg-light-bg-primary text-light-text-primary
                    dark:bg-dark-bg-primary dark:text-dark-text-primary
                    overflow-y-auto"
    >
      {" "}
      {/* 화면 잘림 방지 */}
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-10">
          {" "}
          {/* 타이틀과 폼 간격 조정 */}
          <h1
            className="font-heading text-5xl font-bold 
                         text-transparent bg-clip-text bg-gradient-to-r from-accent-main to-blue-500 dark:to-blue-400
                         mb-3"
          >
            {" "}
            {/* 로고 텍스트 스타일 변경 */}
            Pickterview
          </h1>
          <div className="text-lg font-extrabold text-light-text-secondary dark:text-dark-text-secondary">
            AI 역량 검사 준비, Pickterview와 함께하세요.
          </div>
        </div>

        <div
          className="bg-light-bg-secondary dark:bg-dark-bg-secondary
                    shadow-xl rounded-xl p-8 sm:p-10"
        >
          {" "}
          {/* 패딩 및 라운딩 조정 */}
          {showLogin ? <LoginForm /> : <SignUpForm />}
          <div className="mt-8 text-center">
            {showLogin ? (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                계정이 없으신가요?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-accent-main hover:text-accent-hover hover:underline"
                >
                  회원가입
                </Link>
              </p>
            ) : (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                이미 계정이 있으신가요?{" "}
                <Link
                  to="/login"
                  className="font-medium text-accent-main hover:text-accent-hover hover:underline"
                >
                  로그인
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}

export default AuthPage;
