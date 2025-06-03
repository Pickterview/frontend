// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Navigate 추가
import { ThemeProvider } from "./contexts/ThemeContext"; // ThemeProvider 경로 확인
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PracticeModePage from "./pages/PracticeModePage";

// 로그인 상태를 확인하는 간단한 헬퍼 함수
// 실제 앱에서는 Context API, Redux, Zustand 등을 사용하여 전역적으로 관리하는 것이 좋습니다.
const isAuthenticated = () => {
  const userString = localStorage.getItem("pickterviewUser");
  if (userString) {
    try {
      const user = JSON.parse(userString);
      return user.isLoggedIn === true;
    } catch (e) {
      console.error("Error parsing user data from localStorage", e);
      return false;
    }
  }
  return false;
};

// 보호된 라우트를 위한 래퍼 컴포넌트 (HOC - Higher Order Component)
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // 사용자가 로그인하지 않았다면 로그인 페이지로 리다이렉트
    // 로그인 페이지 경로가 "/login"이라고 가정
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        {" "}
        {/* ThemeProvider가 Context API를 사용한다면, 내부에서 상태를 관리할 것입니다. */}
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* 로그인이 필요한 페이지들은 ProtectedRoute로 감싸줍니다. */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice/general"
            element={
              <ProtectedRoute>
                <PracticeModePage />
              </ProtectedRoute>
            }
          />

          {/* 일치하는 경로가 없을 때 처리 (예: 404 페이지 또는 홈으로 리다이렉트) */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated() ? "/" : "/login"} replace />
            }
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
