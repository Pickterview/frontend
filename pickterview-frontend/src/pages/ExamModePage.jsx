// src/pages/ExamModePage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Common/Modal";
import ThemeToggle from "../components/ThemeToggle";
import {
  ArrowUturnLeftIcon,
  VideoCameraIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  SpeakerWaveIcon,
  CameraIcon,
  ExclamationCircleIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ShieldCheckIcon as PageIcon,
} from "@heroicons/react/24/solid";

const MOCK_QUESTIONS = [
  "자기소개를 1분 동안 해보세요.",
  "우리 회사에 지원하신 특별한 동기가 있나요?",
  "본인의 가장 큰 강점과 그것을 뒷받침할 경험을 말씀해주세요.",
  "입사 후 이루고 싶은 단기적 및 장기적 목표는 무엇인가요?",
  "스트레스 상황에 어떻게 대처하는 편인가요?",
  "다른 지원자와 차별화되는 본인만의 경쟁력은 무엇이라고 생각하십니까?",
  "팀 프로젝트에서 갈등이 발생했을 때 어떻게 해결하시겠습니까?",
  "실패했던 경험과 그 경험을 통해 무엇을 배웠는지 말씀해주십시오.",
  "본인이 생각하는 직업윤리는 무엇이며, 왜 중요하다고 생각하나요?",
  "마지막으로 하고 싶은 말이 있다면 자유롭게 해주세요.",
];
const PREPARATION_TIME = 30;
const ANSWER_TIME = 90;
const TOTAL_EXAM_QUESTIONS = 3;
const TIMER_STATE = {
  IDLE: "idle",
  PREPARING: "preparing",
  RECORDING: "recording",
};
const SUBMISSION_STATE = {
  NONE: "none",
  SUBMITTING: "submitting",
  SUBMITTED: "submitted",
};

function ExamModePage() {
  const navigate = useNavigate();
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [currentQuestionNumberInSequence, setCurrentQuestionNumberInSequence] =
    useState(1);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentExamQuestionIndex, setCurrentExamQuestionIndex] = useState(0);
  const [timerState, setTimerState] = useState(TIMER_STATE.IDLE);
  const [countdown, setCountdown] = useState(PREPARATION_TIME);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [audioStatus, setAudioStatus] = useState({
    ok: true,
    message: "음성 입력 양호",
  });
  const [videoStatus, setVideoStatus] = useState({
    ok: true,
    message: "카메라 화면 양호",
  });
  const [mediaError, setMediaError] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(
    SUBMISSION_STATE.NONE
  );
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaSetupRef = useRef(false);

  const stopMediaTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const setupMedia = useCallback(async () => {
    if (streamRef.current) stopMediaTracks();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setMediaError(null);
      setVideoStatus({ ok: true, message: "카메라 화면 양호" });
      setAudioStatus({ ok: true, message: "음성 입력 양호" });
      setTimerState(TIMER_STATE.PREPARING);
      setCountdown(PREPARATION_TIME);
      return true;
    } catch (err) {
      setMediaError(
        "웹캠/마이크 접근에 실패했습니다. 브라우저 설정을 확인하고 새로고침해주세요."
      );
      setVideoStatus({ ok: false, message: "카메라 접근 불가" });
      setAudioStatus({ ok: false, message: "마이크 접근 불가" });
      setTimerState(TIMER_STATE.IDLE);
      return false;
    }
  }, [stopMediaTracks]);

  const loadQuestionForExam = useCallback(() => {
    if (
      examQuestions.length > 0 &&
      currentExamQuestionIndex < TOTAL_EXAM_QUESTIONS
    ) {
      setCurrentQuestionText(examQuestions[currentExamQuestionIndex]);
      setCurrentQuestionNumberInSequence(currentExamQuestionIndex + 1);
      // Timer and submission states are reset when media is setup for the question
      // Or explicitly reset here if setupMedia is not guaranteed to run for every new question load.
      setTimerState(TIMER_STATE.PREPARING);
      setCountdown(PREPARATION_TIME);
      setSubmissionStatus(SUBMISSION_STATE.NONE);
      setSubmissionProgress(0);
    } else if (currentExamQuestionIndex >= TOTAL_EXAM_QUESTIONS) {
      navigate("/");
    }
  }, [examQuestions, currentExamQuestionIndex, navigate]);

  useEffect(() => {
    const shuffledQuestions = [...MOCK_QUESTIONS].sort(
      () => 0.5 - Math.random()
    );
    setExamQuestions(shuffledQuestions.slice(0, TOTAL_EXAM_QUESTIONS));
    // Initial media setup will be triggered by the next useEffect when examQuestions is set.
    if (!mediaSetupRef.current) mediaSetupRef.current = true; // Mark that initial setup sequence can begin
    return () => stopMediaTracks();
  }, [stopMediaTracks]); // Only stopMediaTracks as dependency for cleanup

  useEffect(() => {
    if (mediaSetupRef.current && examQuestions.length > 0) {
      if (currentExamQuestionIndex === 0 && !streamRef.current) {
        // Initial setup for the very first question
        setupMedia().then((success) => {
          if (success) loadQuestionForExam();
        });
      } else if (streamRef.current) {
        // For subsequent questions, if media stream already exists (or was just setup by handleNextQuestion)
        loadQuestionForExam();
      }
      // If streamRef.current is null for subsequent questions, handleNextQuestion should call setupMedia then load.
    }
  }, [
    examQuestions,
    currentExamQuestionIndex,
    setupMedia,
    loadQuestionForExam,
  ]);

  const startRecordingPhase = useCallback(() => {
    if (mediaError) {
      alert(mediaError);
      return;
    }
    setTimerState(TIMER_STATE.RECORDING);
    setCountdown(ANSWER_TIME);
  }, [mediaError]);

  const handleSubmit = useCallback(() => {
    if (
      submissionStatus === SUBMISSION_STATE.SUBMITTING ||
      submissionStatus === SUBMISSION_STATE.SUBMITTED
    )
      return;
    setTimerState(TIMER_STATE.IDLE);
    setIsSubmissionModalOpen(true);
    setSubmissionStatus(SUBMISSION_STATE.SUBMITTING);
    setSubmissionProgress(0);
    setTimeout(() => {
      setSubmissionStatus(SUBMISSION_STATE.SUBMITTED);
      stopMediaTracks();
      const isLastQuestionInExam =
        currentExamQuestionIndex >= TOTAL_EXAM_QUESTIONS - 1;
      if (isLastQuestionInExam) {
        setTimeout(() => {
          setIsSubmissionModalOpen(false);
          navigate("/");
        }, 2000);
      }
    }, 3000);
  }, [currentExamQuestionIndex, navigate, stopMediaTracks, submissionStatus]);

  useEffect(() => {
    if (mediaError && timerState !== TIMER_STATE.IDLE) {
      setTimerState(TIMER_STATE.IDLE);
      return;
    }
    if (
      timerState === TIMER_STATE.IDLE ||
      submissionStatus === SUBMISSION_STATE.SUBMITTING
    )
      return;
    let timerId;
    if (countdown > 0) {
      timerId = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      if (timerState === TIMER_STATE.PREPARING) startRecordingPhase();
      else if (timerState === TIMER_STATE.RECORDING) handleSubmit();
    }
    return () => clearInterval(timerId);
  }, [
    timerState,
    countdown,
    handleSubmit,
    mediaError,
    startRecordingPhase,
    submissionStatus,
  ]);
  useEffect(() => {
    let progressInterval;
    if (submissionStatus === SUBMISSION_STATE.SUBMITTING) {
      setSubmissionProgress(0);
      progressInterval = setInterval(() => {
        setSubmissionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 100 / (3000 / 100);
        });
      }, 100);
    }
    return () => clearInterval(progressInterval);
  }, [submissionStatus]);

  const handleNextQuestion = async () => {
    setIsSubmissionModalOpen(false); // Close current submission modal
    const nextIndex = currentExamQuestionIndex + 1;
    if (nextIndex < TOTAL_EXAM_QUESTIONS) {
      stopMediaTracks(); // Stop tracks for previous question
      const mediaReady = await setupMedia(); // Setup media for new question (this will set timer to PREPARING)
      if (mediaReady) {
        setCurrentExamQuestionIndex(nextIndex); // This will trigger useEffect to load the question text via loadQuestionForExam
      } else {
        console.error("Exam Mode: Media setup failed for next question.");
        // Handle error, maybe navigate away or show persistent error
      }
    } else {
      navigate("/"); // Should not be reached if button is hidden correctly
    }
  };

  const openExitModal = () => setIsExitModalOpen(true);
  const closeExitModal = () => setIsExitModalOpen(false);
  const handleConfirmExit = () => {
    closeExitModal();
    stopMediaTracks();
    navigate("/");
  };
  const handleForceStartRecording = () => {
    if (mediaError) {
      alert(mediaError);
      return;
    }
    startRecordingPhase();
  };
  const handleRetryMediaSetup = async () => {
    // This might need to also re-trigger question loading if called during an error state
    await setupMedia();
    if (!mediaError && examQuestions.length > 0) {
      // if setup is successful
      loadQuestionForExam();
    }
  };
  const handleReRecordCurrentExamQuestion = async () => {
    if (mediaError) {
      alert(mediaError);
      return;
    }
    stopMediaTracks();
    const mediaReady = await setupMedia();
    if (mediaReady) {
      loadQuestionForExam(); // Reloads current question state (text, timer)
      alert("현재 질문에 대해 다시 녹화를 시작합니다.");
    } else {
      alert("미디어 장치를 재설정하는데 실패했습니다.");
    }
  };

  const currentMaxTime =
    timerState === TIMER_STATE.PREPARING ? PREPARATION_TIME : ANSWER_TIME;
  const progressPercentage =
    countdown > 0 && currentMaxTime > 0 ? countdown / currentMaxTime : 0;
  const getTimerColor = () => {
    if (timerState === TIMER_STATE.PREPARING)
      return "text-yellow-500 dark:text-yellow-400";
    if (timerState === TIMER_STATE.RECORDING)
      return "text-accent-main dark:text-sky-400";
    return "text-gray-500 dark:text-gray-400";
  };
  const getTimerTrackColor = () => {
    if (timerState === TIMER_STATE.PREPARING)
      return "text-yellow-200 dark:text-yellow-700/50";
    return "text-gray-200 dark:text-gray-700/50";
  };
  const pageTitleDisplay = `실전 모드 Q ${currentQuestionNumberInSequence} / ${TOTAL_EXAM_QUESTIONS}`;

  return (
    // 페이지 전체 레이아웃은 기존 중앙 집중형 스타일 유지
    <div className="min-h-screen flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary relative px-4 py-6 md:p-8 items-center justify-center">
      <button
        onClick={openExitModal}
        title="나가기"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 p-2.5 rounded-full hover:bg-light-bg-secondary/80 dark:hover:bg-dark-bg-secondary/80 active:bg-light-border dark:active:bg-dark-border transition-colors"
      >
        {" "}
        <ArrowUturnLeftIcon className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />{" "}
      </button>
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {" "}
        <ThemeToggle />{" "}
      </div>
      <div className="w-full max-w-6xl flex flex-col items-center">
        <div className="flex items-center mt-8 mb-2 md:mb-3">
          <PageIcon className="w-8 h-8 md:w-9 md:h-9 text-accent-main dark:text-accent-light mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-main to-purple-600 dark:from-accent-main dark:to-purple-500">
            {pageTitleDisplay}
          </h1>
        </div>
        <p className="text-lg md:text-xl lg:text-2xl font-semibold leading-relaxed text-center mb-6 md:mb-8 px-4 text-light-text-primary dark:text-dark-text-primary">
          {mediaError
            ? "미디어 장치 오류 발생"
            : currentQuestionText || "질문을 로딩 중입니다..."}
        </p>
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10 lg:gap-12">
          <div className="w-full md:w-3/5 lg:w-7/12 xl:w-3/5 flex flex-col items-center">
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 dark:from-black dark:to-dark-bg-secondary rounded-xl shadow-2xl overflow-hidden flex items-center justify-center group">
              {mediaError ? (
                <div className="flex flex-col items-center text-center text-gray-400 dark:text-gray-500 p-4">
                  {" "}
                  <NoSymbolIcon className="w-20 h-20 sm:w-24 sm:h-24 mb-3 text-red-500/70" />{" "}
                  <p className="text-sm sm:text-base font-medium">
                    {mediaError}
                  </p>{" "}
                  <button
                    onClick={handleRetryMediaSetup}
                    className="mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-accent-main hover:bg-accent-dark text-white transition-colors"
                  >
                    {" "}
                    카메라/마이크 재시도{" "}
                  </button>{" "}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                ></video>
              )}
              {timerState === TIMER_STATE.RECORDING && !mediaError && (
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                  {" "}
                  <span className="w-3 h-3 bg-white rounded-full animate-ping-slow opacity-75"></span>{" "}
                  <span className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-[13px] transform -translate-y-1/2"></span>{" "}
                  <span>REC</span>{" "}
                </div>
              )}
            </div>
            <div className="w-full flex justify-center items-center space-x-3 sm:space-x-4 text-xs sm:text-sm mt-4 px-2">
              {[videoStatus, audioStatus].map((status, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg shadow-sm ${
                    status.ok
                      ? "bg-green-500/10 dark:bg-green-600/20 text-green-700 dark:text-green-300"
                      : "bg-red-500/10 dark:bg-red-600/20 text-red-700 dark:text-red-300"
                  }`}
                >
                  {" "}
                  {status.ok ? (
                    idx === 0 ? (
                      <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )
                  ) : (
                    <ExclamationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}{" "}
                  <span className="font-medium">{status.message}</span>{" "}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-2/5 lg:w-5/12 xl:w-2/5 flex flex-col items-center justify-center space-y-6 md:space-y-8 mt-4 md:mt-0">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center mt-6 md:mt-10 lg:mt-12">
              {" "}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                {" "}
                <circle
                  className={getTimerTrackColor()}
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />{" "}
                <circle
                  className={getTimerColor()}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - progressPercentage)}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  style={{
                    transition:
                      "stroke-dashoffset 0.5s linear, color 0.5s linear",
                  }}
                />{" "}
              </svg>{" "}
              <div className="relative text-center">
                {" "}
                <span
                  className={`block text-5xl sm:text-6xl font-bold ${getTimerColor()}`}
                >
                  {countdown}
                </span>{" "}
                <span className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 tracking-wider">
                  {" "}
                  {timerState === TIMER_STATE.PREPARING
                    ? "준비 시간"
                    : timerState === TIMER_STATE.RECORDING
                    ? "답변 시간"
                    : mediaError
                    ? "오류"
                    : "대기 중"}{" "}
                </span>{" "}
              </div>{" "}
            </div>
            <div className="w-full max-w-xs flex flex-col space-y-3">
              {timerState === TIMER_STATE.PREPARING && !mediaError && (
                <>
                  {" "}
                  <button
                    onClick={handleForceStartRecording}
                    className="w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl text-white transition-all duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500/50"
                  >
                    {" "}
                    <VideoCameraIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />{" "}
                    녹화 바로 시작{" "}
                  </button>{" "}
                  <p className="text-center text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 p-2 rounded-md bg-yellow-500/10 dark:bg-yellow-500/20">
                    {" "}
                    {countdown}초 후 자동으로 녹화가 시작됩니다.{" "}
                  </p>{" "}
                </>
              )}
              {timerState === TIMER_STATE.RECORDING && !mediaError && (
                <>
                  {" "}
                  <button
                    onClick={handleSubmit}
                    disabled={
                      submissionStatus === SUBMISSION_STATE.SUBMITTING ||
                      submissionStatus === SUBMISSION_STATE.SUBMITTED
                    }
                    className={`w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl text-white transition-all duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${
                      submissionStatus === SUBMISSION_STATE.SUBMITTING ||
                      submissionStatus === SUBMISSION_STATE.SUBMITTED
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500/50"
                    }`}
                  >
                    {" "}
                    <PaperAirplaneIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 -rotate-12" />{" "}
                    답변 제출하기{" "}
                  </button>{" "}
                  <button
                    onClick={handleReRecordCurrentExamQuestion}
                    disabled={
                      submissionStatus === SUBMISSION_STATE.SUBMITTING ||
                      submissionStatus === SUBMISSION_STATE.SUBMITTED
                    }
                    className={`w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl text-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${
                      submissionStatus === SUBMISSION_STATE.SUBMITTING ||
                      submissionStatus === SUBMISSION_STATE.SUBMITTED
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500/50"
                    }`}
                  >
                    {" "}
                    <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />{" "}
                    현재 질문 다시 녹화{" "}
                  </button>{" "}
                </>
              )}
              {timerState === TIMER_STATE.IDLE &&
                !mediaError &&
                submissionStatus !== SUBMISSION_STATE.SUBMITTING &&
                submissionStatus !== SUBMISSION_STATE.SUBMITTED && (
                  <button
                    onClick={handleReRecordCurrentExamQuestion}
                    className="w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                  >
                    {" "}
                    <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />{" "}
                    현재 질문 다시 시도{" "}
                  </button>
                )}
              {mediaError && timerState === TIMER_STATE.IDLE && (
                <button
                  onClick={handleRetryMediaSetup}
                  className="w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
                >
                  {" "}
                  <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />{" "}
                  카메라/마이크 권한 재시도{" "}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isExitModalOpen} onClose={closeExitModal}>
        <ExclamationTriangleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-500 mb-5" />
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
          실전 모드 종료
        </h3>
        <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-xs">
          지금 나가시면 현재 진행 중인 실전 모드는 저장되지 않습니다.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
          <button
            onClick={closeExitModal}
            className="px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-light-text-primary dark:text-dark-text-primary transition-colors w-full sm:w-auto"
          >
            취소
          </button>
          <button
            onClick={handleConfirmExit}
            className="px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors w-full sm:w-auto shadow-md hover:shadow-lg"
          >
            확인 (나가기)
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isSubmissionModalOpen}
        onClose={() => {
          /* Controlled by logic, especially "Next Question" */
        }}
      >
        {submissionStatus === SUBMISSION_STATE.SUBMITTING && (
          <>
            <div role="status" className="mb-5">
              {" "}
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 sm:w-12 sm:h-12 text-gray-200 animate-spin dark:text-gray-700 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {" "}
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />{" "}
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />{" "}
              </svg>{" "}
              <span className="sr-only">Loading...</span>{" "}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">
              답변 제출 중...
            </h3>
            <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-3.5 my-3">
              {" "}
              <div
                className="bg-blue-600 h-3 sm:h-3.5 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${submissionProgress}%` }}
              ></div>{" "}
            </div>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {Math.round(submissionProgress)}%
            </p>
          </>
        )}
        {submissionStatus === SUBMISSION_STATE.SUBMITTED && (
          <>
            <CheckCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mb-5" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
              제출 완료!
            </h3>
            {currentExamQuestionIndex < TOTAL_EXAM_QUESTIONS - 1 ? (
              <>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2 mb-6 max-w-xs">
                  다음 문제로 진행해주세요. (
                  {currentQuestionNumberInSequence + 1} / {TOTAL_EXAM_QUESTIONS}
                  )
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full max-w-xs flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-xl text-white transition-colors bg-accent-main hover:bg-accent-dark focus:ring-2 focus:ring-accent-main/50"
                >
                  {" "}
                  다음 문제 <ChevronRightIcon className="w-5 h-5" />{" "}
                </button>
              </>
            ) : (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2 max-w-xs">
                모든 문제를 완료했습니다. 잠시 후 메인 화면으로 이동합니다.
              </p>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
export default ExamModePage;
