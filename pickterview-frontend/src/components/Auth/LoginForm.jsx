import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 백엔드 로그인 API 경로 (사용자님이 '/api/auth/signin'이 맞다고 하셨습니다)
      const response = await axios.post(
        "http://localhost:8080/api/auth/signin",
        {
          email: email,
          password: password,
        }
      );

      if (response.data && response.data.accessToken) {
        const { accessToken, refreshToken } = response.data; // grantType, accessTokenExpiresIn 등도 받을 수 있음

        // 1. 토큰 저장 (localStorage는 간단한 예시)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 2. 로그인 상태 플래그 저장
        localStorage.setItem("isLoggedIn", "true");

        // (선택) 실제 사용자 정보는 로그인 후 별도 API로 가져오는 것이 좋음
        // 예를 들어, navigate 전에 사용자 정보를 가져와서 상태 관리 시스템에 저장
        // 지금은 바로 홈으로 이동
        navigate("/");
      } else {
        setError(
          "로그인에 실패했습니다. 서버로부터 유효한 응답을 받지 못했습니다."
        );
      }
    } catch (err) {
      console.error(
        "로그인 실패:",
        err.response ? err.response.data : err.message
      );
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          // 401 Unauthorized 또는 403 Forbidden
          setError(
            err.response.data?.message ||
              err.response.data ||
              "이메일 또는 비밀번호가 올바르지 않습니다."
          );
        } else {
          setError(
            `로그인 중 오류가 발생했습니다. (상태 코드: ${err.response.status})`
          );
        }
      } else if (err.request) {
        // 요청은 만들어졌으나 응답을 받지 못한 경우 (네트워크 오류 등)
        setError("서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        // 요청 설정 중에 문제가 발생한 경우
        setError("로그인 요청 중 문제가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClasses =
    "w-full py-3 px-4 rounded-lg transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none";
  const lightInputClasses =
    "bg-gray-50 border border-light-border text-light-text-primary focus:ring-2 focus:ring-accent-main focus:border-transparent dark:focus:ring-offset-dark-bg-secondary";
  const darkInputClasses =
    "dark:bg-dark-bg-primary dark:border-dark-border dark:text-dark-text-primary dark:focus:ring-2 dark:focus:ring-accent-main dark:focus:border-transparent";

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <label
          htmlFor="email-login"
          className="block text-sm font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          이메일
        </label>
        <input
          id="email-login"
          type="email"
          autoComplete="email"
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label
          htmlFor="password-login"
          className="block text-sm font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          비밀번호
        </label>
        <input
          id="password-login"
          type="password"
          autoComplete="current-password"
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
          disabled={loading}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200
                   bg-accent-main hover:bg-accent-hover
                   focus:outline-none focus:ring-2 focus:ring-accent-main focus:ring-opacity-75 focus:ring-offset-2
                   dark:focus:ring-offset-dark-bg-secondary
                   ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>

      <div className="relative flex pt-2 pb-0 items-center">
        <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
        <span className="flex-shrink mx-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
          OR
        </span>
        <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          // onClick={() => handleSocialLogin('Google')}
          disabled // 소셜 로그인은 아직 구현 안됨
          className="w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2
                     bg-google-red hover:bg-google-red-hover text-white font-semibold shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-google-red focus:ring-opacity-75 focus:ring-offset-2
                     dark:focus:ring-offset-dark-bg-secondary opacity-50 cursor-not-allowed"
        >
          <FontAwesomeIcon icon={faGoogle} className="text-lg" />
          <span>Google 로그인</span>
        </button>
        <button
          type="button"
          // onClick={() => handleSocialLogin('Kakao')}
          disabled // 소셜 로그인은 아직 구현 안됨
          className="w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2
                     bg-kakao-yellow hover:bg-kakao-yellow-hover text-kakao-text font-semibold shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 focus:ring-offset-2
                     dark:focus:ring-offset-dark-bg-secondary opacity-50 cursor-not-allowed"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.79 0 3.48-.46 4.97-1.29-.14-.7-.19-1.4-.19-2.09 0-2.89 1.89-5.37 4.43-6.14-.39-.07-.78-.13-1.18-.18C18.18 6.01 15.32 3.91 12 3.91c-1.62 0-3.1.56-4.27 1.52L6.36 4.06C7.91 2.82 9.84 2 12 2zm8.98 15.21c-.08.34-.18.66-.29.98-.87 2.36-2.96 4.02-5.47 4.48-.3.05-.6.08-.91.08-4.41 0-8-3.59-8-8s3.59-8 8-8c.26 0 .52.01.77.04.24.03.47.07.7.11.19.03.37.07.55.1.22.04.44.09.65.14.2.05.4.1.6.16.23.07.45.15.67.23.21.08.42.17.62.26.2.09.39.19.58.29.18.1.36.2.53.31.14.09.28.18.41.28.17.12.33.25.49.38.08.06.15.13.22.19.13.11.25.23.37.35.15.15.29.3.42.46.12.14.23.29.34.44.05.07.1.13.14.2.09.13.18.26.26.39.08.13.15.26.22.39.06.11.12.22.17.33.07.14.14.28.2.42.05.11.1.22.14.33.05.13.1.27.14.4.03.1.06.2.09.3.03.1.05.2.07.3.01.07.02.13.03.2.01.05.02.1.02.15v.02c.02.18.02.36.02.54 0 .61-.07 1.21-.21 1.79z" />
          </svg>
          <span>카카오 로그인</span>
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
