// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PracticeModePage from "./pages/PracticeModePage";
import ExamModePage from "./pages/ExamModePage";
import CoverLetterPracticePage from "./pages/CoverLetterPracticePage"; // New Import

const isAuthenticated = () => {
  /* ... same as before ... */
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

const ProtectedRoute = ({ children }) => {
  /* ... same as before ... */
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

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
            path="/practice/cover-letter" // New Route
            element={
              <ProtectedRoute>
                <CoverLetterPracticePage />
              </ProtectedRoute>
            }
          />

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
