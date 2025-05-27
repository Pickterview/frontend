import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // localStorage에서 테마를 읽어옴
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      // localStorage에 저장된 테마가 있다면 사용
      return savedTheme;
    } else {
      // localStorage에 테마가 없다면, 시스템 설정을 따름
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // <html> 태그에서 'dark' 클래스를 토글합니다.
    // 'dark' 테마일 때는 'dark' 클래스를 추가하고, 아니면 제거합니다.
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // `localStorage`에 현재 선택된 테마를 저장합니다.
    localStorage.setItem("theme", theme);

    // 시스템 테마 변경 감지 (옵션: 사용자가 브라우저/OS 테마를 변경했을 때 반영)
    // 이 부분은 명시적으로 테마를 선택한 경우(localStorage.theme가 존재하는 경우)에는 동작하지 않도록 할 수 있음
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // localStorage에 사용자가 명시적으로 선택한 테마가 없을 때만 시스템 설정을 따름
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]); // theme 상태가 변경될 때마다 이펙트 실행

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      // 토글 시, `localStorage`에 새로운 테마를 저장하여 명시적으로 선택된 것으로 처리
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
