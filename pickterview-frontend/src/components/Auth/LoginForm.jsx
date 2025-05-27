import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// 카카오 아이콘은 SVG로 직접 사용하거나 텍스트로 대체합니다.
// import kakaoLogo from '../../assets/kakao_logo.svg'; // 예시: public/assets 폴더에 SVG 저장 시

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "test1" && password === "qazqa") {
      navigate("/");
    } else {
      alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인 준비 중...`);
    // TODO: 실제 소셜 로그인 로직 구현
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
          htmlFor="username"
          className="block text-sm font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          아이디
        </label>
        <input
          id="username"
          type="text"
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디를 입력하세요"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      <button
        type="submit"
        className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200
                   bg-accent-main hover:bg-accent-hover
                   focus:outline-none focus:ring-2 focus:ring-accent-main focus:ring-opacity-75 focus:ring-offset-2 
                   dark:focus:ring-offset-dark-bg-secondary"
      >
        로그인
      </button>

      <div className="relative flex pt-2 pb-0 items-center">
        {" "}
        {/* 간격 조정 */}
        <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
        <span className="flex-shrink mx-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
          OR
        </span>
        <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
      </div>

      <div className="space-y-3">
        {" "}
        {/* 소셜 버튼 간격 */}
        <button
          type="button"
          onClick={() => handleSocialLogin("Google")}
          className="w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2
                     bg-google-red hover:bg-google-red-hover text-white font-semibold shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-google-red focus:ring-opacity-75 focus:ring-offset-2
                     dark:focus:ring-offset-dark-bg-secondary"
        >
          <FontAwesomeIcon icon={faGoogle} className="text-lg" />
          <span>Google 로그인</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("Kakao")}
          className="w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2
                     bg-kakao-yellow hover:bg-kakao-yellow-hover text-kakao-text font-semibold shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 focus:ring-offset-2
                     dark:focus:ring-offset-dark-bg-secondary"
        >
          {/* 카카오 로고 SVG를 사용하거나 FontAwesome 대체 아이콘 사용 */}
          {/* <img src={kakaoLogo} alt="Kakao" className="h-5 w-5" /> */}
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
