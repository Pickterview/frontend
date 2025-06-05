import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios import 추가

function SignUpForm() {
  const [name, setName] = useState(""); // 이름 상태 추가
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    // async 키워드 추가
    e.preventDefault();
    setError(""); // 이전 에러 메시지 초기화
    setLoading(true); // 로딩 시작

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    // MemberSignupRequestDto에 맞게 요청 데이터 구성
    const signupData = {
      name: name, // 이름 필드 추가
      email: email,
      password: password,
    };

    try {
      // 백엔드 API URL (실제 환경에 맞게 수정 필요)
      // 이전 대화에서 /api/v1/auth/signup 으로 AuthController를 만들었으므로 해당 경로 사용
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        signupData
      );

      console.log("회원가입 성공:", response.data); // 성공 응답 로깅
      alert("회원가입 성공! 로그인 페이지로 이동합니다."); // 사용자 알림
      navigate("/login"); // 로그인 페이지로 이동
    } catch (err) {
      console.error(
        "회원가입 실패:",
        err.response ? err.response.data : err.message
      );
      if (err.response && err.response.data && err.response.data.message) {
        // 백엔드에서 구체적인 에러 메시지를 보냈을 경우
        setError(err.response.data.message);
      } else if (err.message.includes("Network Error")) {
        setError("서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // Tailwind CSS 클래스들은 기존과 동일하게 사용
  const inputBaseClasses =
    "w-full py-3 px-4 rounded-lg transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none";
  const lightInputClasses =
    "bg-gray-50 border border-light-border text-light-text-primary focus:ring-2 focus:ring-accent-main focus:border-transparent dark:focus:ring-offset-dark-bg-secondary";
  const darkInputClasses =
    "dark:bg-dark-bg-primary dark:border-dark-border dark:text-dark-text-primary dark:focus:ring-2 dark:focus:ring-accent-main dark:focus:border-transparent";

  return (
    <form className="space-y-6" onSubmit={handleSignUp}>
      {/* 이름 입력 필드 추가 */}
      <div>
        <label
          htmlFor="name-signup"
          className="block text-sm font-medium mb-1 text-light-text-secondary dark:text-dark-text-secondary"
        >
          이름
        </label>
        <input
          id="name-signup"
          type="text"
          className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          required
          disabled={loading} // 로딩 중 비활성화
        />
      </div>
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
          disabled={loading}
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
          placeholder="비밀번호 (영문, 숫자, 특수문자 포함 8~20자)" // 비밀번호 정책 안내
          required
          disabled={loading}
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
          disabled={loading}
        />
      </div>

      {/* 에러 메시지 표시 */}
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
                   ${loading ? "opacity-50 cursor-not-allowed" : ""}`} // 로딩 중 스타일 변경
        disabled={loading} // 로딩 중 비활성화
      >
        {loading ? "가입 처리 중..." : "회원가입"}
      </button>
    </form>
  );
}

export default SignUpForm;
