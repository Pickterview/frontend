// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ... other imports
import CoverLetterSubmitModal from "../components/Practice/CoverLetterSubmitModal";
// ...

// (Previous imports and constants like TOTAL_EXAM_QUESTIONS remain)
// src/pages/HomePage.jsx
// ... (other imports from your HomePage.jsx)
import UserInfoCard from "../components/MainPage/UserInfoCard";
import MenuButton from "../components/MainPage/MenuButton";
import ThemeToggle from "../components/ThemeToggle";
import MyPageContent from "../components/MainPage/MyPageContent";
import Modal from "../components/Common/Modal"; // Already there
import AccountSettingsForm from "../components/MainPage/AccountSettingsForm";
import MyPageDetailModalContent from "../components/MainPage/MyPageDetailModalContent";

import {
  CogIcon,
  ShieldCheckIcon as SolidShieldCheckIcon,
} from "@heroicons/react/24/solid";
import {
  AcademicCapIcon,
  DocumentTextIcon, // Used for 자소서 모드 MenuButton
  ShieldCheckIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon as SolidArrowRightIcon,
} from "@heroicons/react/24/outline";

import {
  getPracticeAttemptStatus,
  recordPracticeAttempt,
} from "../services/practiceAttemptService";

const TOTAL_EXAM_QUESTIONS = 3;

function HomePage() {
  // ... (existing states: isUserLoggedIn, isMyPageOpen, etc.)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentUserForModal, setCurrentUserForModal] = useState(null);

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

  // New state for Cover Letter Modal
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("pickterviewUser");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.isLoggedIn) {
        setIsUserLoggedIn(true);
        setCurrentUserForModal(user);
      }
    }
    setPracticeAttemptInfo(getPracticeAttemptStatus());
  }, []);

  const handleToggleMyPage = () => setIsMyPageOpen(!isMyPageOpen);
  const openSettingsModal = () => setIsSettingsModalOpen(true);
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

  const handleOpenExamStartModal = () => {
    setIsExamStartModalOpen(true);
  };

  const handleCloseExamStartModal = () => {
    setIsExamStartModalOpen(false);
  };

  const handleProceedToExam = () => {
    handleCloseExamStartModal();
    navigate("/practice/exam");
  };

  // Handlers for Cover Letter Mode
  const handleOpenCoverLetterModal = () => {
    setIsCoverLetterModalOpen(true);
  };

  const handleCloseCoverLetterModal = () => {
    setIsCoverLetterModalOpen(false);
  };

  const handleStartCoverLetterPractice = (coverLetterText) => {
    console.log(
      "Cover letter submitted:",
      coverLetterText.substring(0, 100) + "..."
    ); // Log a snippet
    // Potentially save the cover letter or pass it to the practice page
    handleCloseCoverLetterModal();
    navigate("/practice/cover-letter", {
      state: { coverLetter: coverLetterText },
    });
  };

  if (!isUserLoggedIn && !localStorage.getItem("pickterviewUser")) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
          로그인 정보를 확인 중입니다...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary">
        {/* Header */}
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
            <button
              onClick={openSettingsModal}
              title="계정 설정"
              className="p-1.5 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200/70 dark:hover:bg-gray-700/50 transition-colors"
            >
              <CogIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-12 gap-6 p-6">
          <div className="col-span-12 lg:col-span-3 flex flex-col">
            <UserInfoCard onMyPageToggle={handleToggleMyPage} />
          </div>

          <div className="col-span-12 lg:col-span-9 flex flex-col">
            <div
              key={isMyPageOpen ? "myPage" : "mainContent"}
              className="animate-fadeInUp_normal flex-1 flex flex-col"
            >
              {isMyPageOpen ? (
                <MyPageContent onOpenDetailModal={openDetailModal} />
              ) : (
                <div className="flex flex-col gap-6 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                    <MenuButton
                      title="연습 일반 모드"
                      description="다양한 유형으로 연습"
                      icon={AcademicCapIcon}
                      onClick={handleOpenPracticeStartModal}
                      // ... other props
                      bgColorClass="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700"
                      hoverFillColor="bg-white/10"
                      delay={100}
                    />
                    <MenuButton
                      title="연습 자소서 모드" // Updated
                      description="자소서 기반 질문 대비"
                      icon={DocumentTextIcon}
                      onClick={handleOpenCoverLetterModal} // New handler
                      bgColorClass="bg-gradient-to-br from-teal-500 to-green-600 dark:from-teal-600 dark:to-green-700"
                      hoverFillColor="bg-white/10"
                      delay={150}
                    />
                    <MenuButton
                      title="실전 모드"
                      description="실제 면접 최종 점검!"
                      icon={ShieldCheckIcon}
                      onClick={handleOpenExamStartModal}
                      // ... other props
                      bgColorClass="bg-gradient-to-br from-accent-main to-purple-700 dark:from-accent-main dark:to-purple-800"
                      hoverFillColor="bg-white/10"
                      delay={200}
                    />
                    <MenuButton
                      title="나의 학습 분석"
                      description="학습 성과 확인"
                      icon={PresentationChartLineIcon}
                      onClick={() => alert("학습 분석 준비 중입니다.")}
                      // ... other props
                      bgColorClass="bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700"
                      hoverFillColor="bg-white/10"
                      delay={250}
                    />
                  </div>
                  {/* Pickterview 소식 */}
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
                        더보기 <SolidArrowRightIcon className="w-3 h-3 ml-1" />
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
                      <li className="flex items-start">
                        <span className="text-accent-main font-semibold mr-1.5 mt-0.5">
                          &#8226;
                        </span>
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">
                          서버 점검 안내: 매주 수요일 02:00 ~ 03:00 (1시간)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent-main font-semibold mr-1.5 mt-0.5">
                          &#8226;
                        </span>
                        <span className="text-light-text-secondary dark:text-dark-text-secondary">
                          면접 합격률 높이는 꿀팁 #3: STAR 기법 활용법 완벽 정리
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Account Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        title="계정 정보 수정"
      >
        {currentUserForModal && (
          <AccountSettingsForm
            currentUser={currentUserForModal}
            onClose={closeSettingsModal}
          />
        )}
      </Modal>

      {/* Detail Modal (for MyPage content) */}
      <Modal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        title={modalTitle}
      >
        <MyPageDetailModalContent type={modalContentType} />
      </Modal>

      {/* Practice Start Modal */}
      <Modal
        isOpen={isPracticeStartModalOpen}
        onClose={handleClosePracticeStartModal}
        // title="연습 일반 모드 시작" // This title is now part of the children
      >
        {/* Content is now fully responsible for its appearance */}
        <AcademicCapIcon className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500 mb-5" />{" "}
        {/* Larger icon, more margin */}
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
          연습 일반 모드 시작 {/* Title moved here */}
        </h3>
        <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-xs">
          {" "}
          {/* Increased bottom margin, max-width for better readability */}
          {practiceAttemptInfo.canAttempt || true
            ? "준비가 되셨다면 '진행' 버튼을 눌러주세요."
            : "오늘은 이미 연습을 진행하셨습니다."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
          {" "}
          {/* Ensure buttons take appropriate width */}
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
      </Modal>

      {/* Exam Start Modal */}
      <Modal
        isOpen={isExamStartModalOpen}
        onClose={handleCloseExamStartModal}
        title="실전 모드 시작"
      >
        {/* Content as before */}
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

      {/* Cover Letter Submit Modal (New) */}
      <CoverLetterSubmitModal
        isOpen={isCoverLetterModalOpen}
        onClose={handleCloseCoverLetterModal}
        onStartPractice={handleStartCoverLetterPractice}
      />
    </>
  );
}

export default HomePage;
