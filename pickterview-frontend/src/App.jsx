import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext"; // ThemeContext 경로 확인
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PracticeModePage from "./pages/PracticeModePage";
import ExamModePage from "./pages/ExamModePage";
import CoverLetterPracticePage from "./pages/CoverLetterPracticePage";

const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedInFlag = localStorage.getItem("isLoggedIn");
  // accessToken이 존재하고, isLoggedIn 플래그가 'true'이면 인증된 것으로 간주
  return isLoggedInFlag === "true" && !!accessToken;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // 사용자가 인증되지 않았으면 로그인 페이지로 리다이렉트
    // replace 옵션은 히스토리 스택에 현재 경로를 남기지 않음
    return <Navigate to="/login" replace />;
  }
  return children; // 인증되었으면 자식 컴포넌트 렌더링
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          {/* AuthPage는 showLogin prop에 따라 로그인 또는 회원가입 폼을 보여줍니다. */}
          {/* /login, /signup 경로로 직접 접근 시 해당 폼을 보여주는 페이지를 사용합니다. */}
          <Route path="/auth" element={<AuthPage showLogin={true} />} />{" "}
          {/* 기본은 로그인 */}
          <Route path="/login" element={<LoginPage />} />{" "}
          {/* LoginPage는 AuthPage를 showLogin={true}로 렌더링 */}
          <Route path="/signup" element={<SignUpPage />} />{" "}
          {/* SignUpPage는 AuthPage를 showLogin={false}로 렌더링 */}
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
          <Route
            path="/practice/exam"
            element={
              <ProtectedRoute>
                <ExamModePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice/cover-letter"
            element={
              <ProtectedRoute>
                <CoverLetterPracticePage />
              </ProtectedRoute>
            }
          />
          {/* 일치하는 경로가 없을 경우, 인증 상태에 따라 홈 또는 로그인 페이지로 리다이렉트 */}
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
