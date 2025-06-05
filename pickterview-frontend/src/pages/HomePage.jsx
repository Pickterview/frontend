import React, { useState, useEffect, useCallback } from "react"; // useCallback 추가
import { useNavigate } from "react-router-dom";
import UserInfoCard from "../components/MainPage/UserInfoCard";
import MenuButton from "../components/MainPage/MenuButton";
import ThemeToggle from "../components/ThemeToggle";
import MyPageContent from "../components/MainPage/MyPageContent";
import Modal from "../components/Common/Modal";
import AccountSettingsForm from "../components/MainPage/AccountSettingsForm";
import MyPageDetailModalContent from "../components/MainPage/MyPageDetailModalContent";
import CoverLetterSubmitModal from "../components/Practice/CoverLetterSubmitModal";
import axios from "axios";

import {
  CogIcon,
  ShieldCheckIcon as SolidShieldCheckIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon as SolidArrowRightIcon,
} from "@heroicons/react/24/outline";

// 임시 함수 (실제로는 서비스 파일에서 가져와야 함)
const getPracticeAttemptStatus = () => ({ attemptsLeft: 3, canAttempt: true });
const recordPracticeAttempt = () => true;

const TOTAL_EXAM_QUESTIONS = 3;

function HomePage() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // 사용자 정보 로딩 상태

  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [modalContentType, setModalContentType] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isPracticeStartModalOpen, setIsPracticeStartModalOpen] =
    useState(false);
  const [practiceAttemptInfo, setPracticeAttemptInfo] = useState({
    attemptsLeft: 0,
    canAttempt: false,
  });
  const [isExamStartModalOpen, setIsExamStartModalOpen] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const navigate = useNavigate();

  // 로그아웃 함수
  const performClientLogout = useCallback(() => {
    console.log("클라이언트 측 로그아웃 처리 시작");
    setLogoutLoading(true);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");
    console.log(
      "localStorage 삭제 완료:",
      "accessToken:",
      localStorage.getItem("accessToken"),
      "isLoggedIn:",
      localStorage.getItem("isLoggedIn")
    );

    setCurrentUser(null);
    setIsUserLoggedIn(false);
    setIsMyPageOpen(false);
    setLogoutLoading(false);
    console.log(
      "React 상태 업데이트 완료: isUserLoggedIn=",
      false,
      "currentUser=",
      null
    );

    navigate("/login", { replace: true });
    console.log("로그인 페이지로 이동 완료");
  }, [navigate]); // navigate를 의존성 배열에 추가

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const isLoggedInFlag = localStorage.getItem("isLoggedIn");
    let isMounted = true;

    const fetchUserInfo = async (token) => {
      console.log("사용자 정보 로드 시도, 토큰:", token ? "있음" : "없음");
      setIsLoadingUser(true);
      try {
        // 실제 사용자 정보 API 엔드포인트로 변경! 예: /api/user/me
        const response = await axios.get("http://localhost:8080/api/auth/me", {
          // 백엔드 경로 확인!
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) {
          console.log("사용자 정보 로드 성공:", response.data);
          setCurrentUser(response.data); // 백엔드 MemberResponseDto 구조와 일치해야 함
          setIsUserLoggedIn(true);
        }
      } catch (error) {
        console.error(
          "사용자 정보 로드 실패:",
          error.response ? error.response.data : error.message
        );
        if (isMounted) {
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            console.log(
              "사용자 정보 로드 중 인증 오류, 클라이언트 로그아웃 실행"
            );
            performClientLogout();
          } else {
            alert(
              "사용자 정보를 불러오는 데 실패했습니다. 세션이 만료되었을 수 있습니다."
            );
            performClientLogout();
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    };

    if (isLoggedInFlag === "true" && accessToken) {
      fetchUserInfo(accessToken);
    } else {
      setIsUserLoggedIn(false);
      setCurrentUser(null);
      setIsLoadingUser(false);
      // ProtectedRoute에서 /login으로 보낼 것이므로 navigate 호출 불필요
    }

    setPracticeAttemptInfo(getPracticeAttemptStatus());

    return () => {
      isMounted = false;
    };
  }, [performClientLogout]); // performClientLogout을 의존성 배열에 추가

  const handleLogoutClick = async () => {
    setLogoutLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (accessToken) {
        const logoutPayload = refreshToken ? { refreshToken } : {};
        // 백엔드 로그아웃 API 호출 (선택적이지만 서버측 토큰 무효화를 위해 권장)
        // 사용하지 않기로 했으므로 이 부분은 주석 처리 또는 삭제
        // await axios.post("/api/auth/logout", logoutPayload, {
        //   headers: { Authorization: `Bearer ${accessToken}` },
        // });
        // console.log("서버 측 로그아웃 요청 성공 (또는 시도 안함)");
      }
    } catch (error) {
      console.error(
        "서버 측 로그아웃 요청 실패:",
        error.response ? error.response.data : error.message
      );
    } finally {
      // 클라이언트 측 로그아웃은 항상 수행
      performClientLogout();
    }
  };

  const handleToggleMyPage = () => setIsMyPageOpen(!isMyPageOpen);
  const openSettingsModal = () => {
    if (currentUser) {
      setIsSettingsModalOpen(true);
    } else {
      alert("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  const openDetailModal = (type, title) => {
    setModalContentType(type);
    setModalTitle(title);
    setDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setModalContentType(null);
    setModalTitle("");
  };

  const handleOpenPracticeStartModal = () => {
    const currentStatus = getPracticeAttemptStatus();
    setPracticeAttemptInfo(currentStatus);
    setIsPracticeStartModalOpen(true);
  };

  const handleClosePracticeStartModal = () => {
    setIsPracticeStartModalOpen(false);
  };

  const handleProceedToPractice = () => {
    if (practiceAttemptInfo.canAttempt || true) {
      if (recordPracticeAttempt()) {
        setPracticeAttemptInfo(getPracticeAttemptStatus());
        handleClosePracticeStartModal();
        navigate("/practice/general");
      } else {
        alert(
          "오류: 연습 횟수를 기록하는 데 문제가 발생했습니다. 다시 시도해주세요."
        );
      }
    } else {
      alert("오늘은 더 이상 일반 연습을 진행할 수 없습니다.");
    }
  };

  const handleOpenExamStartModal = () => setIsExamStartModalOpen(true);
  const handleCloseExamStartModal = () => setIsExamStartModalOpen(false);
  const handleProceedToExam = () => {
    handleCloseExamStartModal();
    navigate("/practice/exam");
  };

  const handleOpenCoverLetterModal = () => setIsCoverLetterModalOpen(true);
  const handleCloseCoverLetterModal = () => setIsCoverLetterModalOpen(false);
  const handleStartCoverLetterPractice = (coverLetterText) => {
    console.log(
      "Cover letter submitted:",
      coverLetterText.substring(0, 100) + "..."
    );
    handleCloseCoverLetterModal();
    navigate("/practice/cover-letter", {
      state: { coverLetter: coverLetterText },
    });
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
          사용자 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary">
        <header className="px-6 py-3 flex items-center justify-between border-b border-light-border dark:border-dark-border flex-shrink-0 sticky top-0 lg:static bg-light-bg-primary dark:bg-dark-bg-primary z-20">
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-main to-blue-500 dark:to-blue-400">
              Pickterview
            </h1>
            <span className="hidden md:block text-xs text-gray-500 dark:text-gray-400 mt-1">
              AI 역량 검사, 자신감을 가지고 준비하세요.
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {isUserLoggedIn && currentUser && (
              <>
                <button
                  onClick={openSettingsModal}
                  title="계정 설정"
                  className="p-1.5 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200/70 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <CogIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </button>
                <button
                  onClick={handleLogoutClick}
                  title="로그아웃"
                  disabled={logoutLoading}
                  className={`p-1.5 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200/70 dark:hover:bg-gray-700/50 transition-colors ${
                    logoutLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {logoutLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-accent-main"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  )}
                </button>
              </>
            )}
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 grid grid-cols-12 gap-6 p-6">
          <div className="col-span-12 lg:col-span-3 flex flex-col">
            {isUserLoggedIn && currentUser && (
              <UserInfoCard
                user={currentUser}
                onMyPageToggle={handleToggleMyPage}
                onLogoutRequest={handleLogoutClick} // UserInfoCard 내부 로그아웃 버튼용
              />
            )}
          </div>

          <div className="col-span-12 lg:col-span-9 flex flex-col">
            <div
              key={isMyPageOpen ? "myPage" : "mainContent"}
              className="animate-fadeInUp_normal flex-1 flex flex-col"
            >
              {isMyPageOpen && isUserLoggedIn && currentUser ? (
                <MyPageContent onOpenDetailModal={openDetailModal} />
              ) : (
                isUserLoggedIn &&
                currentUser && (
                  <div className="flex flex-col gap-6 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                      <MenuButton
                        title="연습 일반 모드"
                        description="다양한 유형으로 연습"
                        icon={AcademicCapIcon}
                        onClick={handleOpenPracticeStartModal}
                        bgColorClass="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700"
                        hoverFillColor="bg-white/10"
                        delay={100}
                      />
                      <MenuButton
                        title="연습 자소서 모드"
                        description="자소서 기반 질문 대비"
                        icon={DocumentTextIcon}
                        onClick={handleOpenCoverLetterModal}
                        bgColorClass="bg-gradient-to-br from-teal-500 to-green-600 dark:from-teal-600 dark:to-green-700"
                        hoverFillColor="bg-white/10"
                        delay={150}
                      />
                      <MenuButton
                        title="실전 모드"
                        description="실제 면접 최종 점검!"
                        icon={ShieldCheckIcon}
                        onClick={handleOpenExamStartModal}
                        bgColorClass="bg-gradient-to-br from-accent-main to-purple-700 dark:from-accent-main dark:to-purple-800"
                        hoverFillColor="bg-white/10"
                        delay={200}
                      />
                      <MenuButton
                        title="나의 학습 분석"
                        description="학습 성과 확인"
                        icon={PresentationChartLineIcon}
                        onClick={() => alert("학습 분석 준비 중입니다.")}
                        bgColorClass="bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700"
                        hoverFillColor="bg-white/10"
                        delay={250}
                      />
                    </div>
                    <div className="p-5 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-2xl shadow-lg relative flex flex-col max-h-[220px] sm:max-h-[240px]">
                      <div className="flex justify-between items-center mb-3 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center">
                          <ChatBubbleLeftRightIcon className="w-5 h-5 inline-block mr-2 text-accent-main" />{" "}
                          Pickterview 소식
                        </h3>
                        <button
                          onClick={() =>
                            openDetailModal("news", "Pickterview 전체 소식")
                          }
                          className="text-xs font-medium text-accent-main hover:underline flex items-center"
                        >
                          더보기{" "}
                          <SolidArrowRightIcon className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                      <ul className="space-y-2.5 text-xs sm:text-sm overflow-y-auto custom-scrollbar-thin flex-grow">
                        <li className="flex items-start">
                          <span className="text-accent-main font-semibold mr-1.5 mt-0.5">
                            &#8226;
                          </span>
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">
                            새로운 면접 질문 유형이 추가되었습니다! 지금 바로
                            확인해보세요.
                          </span>
                        </li>
                        {/* ... 다른 소식들 ... */}
                      </ul>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        title="계정 정보 수정"
      >
        {currentUser && (
          <AccountSettingsForm
            currentUser={currentUser}
            onClose={closeSettingsModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        title={modalTitle}
      >
        <MyPageDetailModalContent type={modalContentType} />
      </Modal>

      <Modal
        isOpen={isPracticeStartModalOpen}
        onClose={handleClosePracticeStartModal}
      >
        <div className="text-center">
          <AcademicCapIcon className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500 mx-auto mb-5" />
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
            연습 일반 모드 시작
          </h3>
          <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-xs">
            {practiceAttemptInfo.canAttempt || true
              ? "준비가 되셨다면 '진행' 버튼을 눌러주세요."
              : "오늘은 이미 연습을 진행하셨습니다."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
            <button
              onClick={handleClosePracticeStartModal}
              className="px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-light-text-primary dark:text-dark-text-primary transition-colors w-full sm:w-auto"
            >
              취소
            </button>
            <button
              onClick={handleProceedToPractice}
              disabled={!(practiceAttemptInfo.canAttempt || true)}
              className={`px-6 py-3 text-sm sm:text-base font-medium rounded-lg text-white transition-colors w-full sm:w-auto ${
                !(practiceAttemptInfo.canAttempt || true)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-accent-main hover:bg-accent-dark focus:ring-2 focus:ring-accent-main/50"
              }`}
            >
              진행
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isExamStartModalOpen}
        onClose={handleCloseExamStartModal}
        title="실전 모드 시작"
      >
        <div className="text-center">
          <SolidShieldCheckIcon className="w-16 h-16 text-accent-main mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">
            실전 모드를 시작할까요?
          </h3>
          <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary mb-6">
            실전 모드는 총 {TOTAL_EXAM_QUESTIONS}개의 질문으로 진행됩니다.
            <br />
            준비가 되셨다면 '진행' 버튼을 눌러주세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleCloseExamStartModal}
              className="px-6 py-2.5 text-sm sm:text-base font-medium rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-light-text-primary dark:text-dark-text-primary transition-colors w-full sm:w-auto"
            >
              취소
            </button>
            <button
              onClick={handleProceedToExam}
              className="px-6 py-2.5 text-sm sm:text-base font-medium rounded-lg text-white transition-colors bg-accent-main hover:bg-accent-dark focus:ring-2 focus:ring-accent-main/50 w-full sm:w-auto"
            >
              진행 ({TOTAL_EXAM_QUESTIONS}문제)
            </button>
          </div>
        </div>
      </Modal>

      <CoverLetterSubmitModal
        isOpen={isCoverLetterModalOpen}
        onClose={handleCloseCoverLetterModal}
        onStartPractice={handleStartCoverLetterPractice}
      />
    </>
  );
}

export default HomePage;
