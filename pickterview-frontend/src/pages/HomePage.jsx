import React from "react";
import ThemeToggle from "../components/ThemeToggle";

function HomePage() {
  const userName = "테스트";

  return (
    <div
      className="min-h-screen flex justify-center items-center
                    bg-light-bg-main text-light-text-primary
                    dark:bg-dark-bg-main dark:text-dark-text-primary"
    >
      <div
        className="shadow-xl rounded-lg p-8
                    bg-light-bg-card dark:bg-dark-bg-card"
      >
        <h1
          className="text-2xl font-bold mb-4
                       text-light-text-primary dark:text-dark-text-primary"
        >
          {userName}님, 환영합니다!
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          AI 역량 검사 대비를 시작해보세요.
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
}

export default HomePage;
