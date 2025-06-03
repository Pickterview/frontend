// src/pages/PracticeModePage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Common/Modal";
import ThemeToggle from "../components/ThemeToggle";
import {
  ArrowUturnLeftIcon,
  VideoCameraIcon,
  PaperAirplaneIcon,
  ArrowPathIcon, // 다시 녹화 버튼용
  SpeakerWaveIcon,
  CameraIcon,
  ExclamationCircleIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const MOCK_QUESTIONS = [
  "자기소개를 1분 동안 해보세요.",
  "우리 회사에 지원하신 특별한 동기가 있나요?",
  "본인의 가장 큰 강점과 그것을 뒷받침할 경험을 말씀해주세요.",
  "입사 후 이루고 싶은 단기적 및 장기적 목표는 무엇인가요?",
  "스트레스 상황에 어떻게 대처하는 편인가요?",
];

const PREPARATION_TIME = 30;
const ANSWER_TIME = 90;

const TIMER_STATE = {
  IDLE: "idle",
  PREPARING: "preparing",
  RECORDING: "recording",
};

function PracticeModePage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timerState, setTimerState] = useState(TIMER_STATE.PREPARING);
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

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopMediaTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("Submitting answer...");
    setTimerState(TIMER_STATE.IDLE); // 제출 후 IDLE 상태로 변경
    stopMediaTracks(); // 스트림 정리
    // TODO: 실제 제출 로직 (녹화된 데이터 처리 등)
    setTimeout(() => {
      alert("답변이 성공적으로 제출되었습니다!");
      navigate("/"); // 홈으로 이동
    }, 500);
  }, [navigate, stopMediaTracks]);

  useEffect(() => {
    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
        setMediaError(null);
        setVideoStatus({ ok: true, message: "카메라 화면 양호" });
        setAudioStatus({ ok: true, message: "음성 입력 양호" });
        setTimerState(TIMER_STATE.PREPARING);
        setCountdown(PREPARATION_TIME);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setMediaError(
          "웹캠/마이크 접근에 실패했습니다. 브라우저 설정을 확인하고 새로고침해주세요."
        );
        setVideoStatus({ ok: false, message: "카메라 접근 불가" });
        setAudioStatus({ ok: false, message: "마이크 접근 불가" });
        setTimerState(TIMER_STATE.IDLE);
      }
    }
    setupMedia();
    return () => {
      stopMediaTracks();
    };
  }, [stopMediaTracks]);

  useEffect(() => {
    setCurrentQuestion(
      MOCK_QUESTIONS[Math.floor(Math.random() * MOCK_QUESTIONS.length)]
    );
  }, [questionNumber]);

  const startRecordingPhase = useCallback(() => {
    setTimerState(TIMER_STATE.RECORDING);
    setCountdown(ANSWER_TIME);
    console.log("Recording started...");
    // TODO: 실제 녹화 시작 API 호출
  }, []);

  useEffect(() => {
    if (mediaError || timerState === TIMER_STATE.IDLE) return;

    let timerId;
    if (countdown > 0) {
      timerId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      if (timerState === TIMER_STATE.PREPARING) {
        startRecordingPhase();
      } else if (timerState === TIMER_STATE.RECORDING) {
        handleSubmit();
      }
    }
    return () => clearInterval(timerId);
  }, [timerState, countdown, handleSubmit, mediaError, startRecordingPhase]);

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

  const handleRecordAgain = () => {
    if (mediaError) {
      alert(mediaError);
      return;
    }
    console.log("Recording again...");
    setCountdown(ANSWER_TIME); // 타이머 90초로 초기화
    // setTimerState(TIMER_STATE.RECORDING); // 이미 RECORDING 상태이므로 변경 불필요할 수 있으나, 명시적으로.
    // TODO: 기존 녹화 내용 폐기 및 새 녹화 시작 로직
    alert("현재 질문에 대해 다시 녹화를 시작합니다. (시뮬레이션)");
  };

  const currentMaxTime =
    timerState === TIMER_STATE.PREPARING ? PREPARATION_TIME : ANSWER_TIME;
  const progressPercentage =
    countdown > 0 && currentMaxTime > 0 ? countdown / currentMaxTime : 0;

  const getTimerColor = () => {
    if (timerState === TIMER_STATE.PREPARING)
      return "text-yellow-500 dark:text-yellow-400";
    // 다크모드 시 답변 타이머 색상 (더 밝게)
    if (timerState === TIMER_STATE.RECORDING)
      return "text-accent-main dark:text-sky-400";
    return "text-gray-500 dark:text-gray-400";
  };

  const getTimerTrackColor = () => {
    if (timerState === TIMER_STATE.PREPARING)
      return "text-yellow-200 dark:text-yellow-700/50";
    return "text-gray-200 dark:text-gray-700/50";
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary relative px-4 py-6 md:p-8 items-center justify-center">
      <button
        onClick={openExitModal}
        title="나가기"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 p-2.5 rounded-full hover:bg-light-bg-secondary/80 dark:hover:bg-dark-bg-secondary/80 active:bg-light-border dark:active:bg-dark-border transition-colors"
      >
        <ArrowUturnLeftIcon className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
      </button>

      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl flex flex-col items-center">
        {/* Question 번호 - 상단 마진 mt-10 -> mt-8 */}
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 mt-8 mb-2 md:mb-3">
          Question {questionNumber}
        </h1>

        {/* 질문 내용 - font-semibold로 두께 증가, 하단 마진 mb-6 md:mb-8 */}
        <p className="text-lg md:text-xl lg:text-2xl font-semibold leading-relaxed text-center mb-6 md:mb-8 px-4 text-light-text-primary dark:text-dark-text-primary">
          {currentQuestion || "질문을 로딩 중입니다..."}
        </p>

        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10 lg:gap-12">
          <div className="w-full md:w-3/5 lg:w-7/12 xl:w-3/5 flex flex-col items-center">
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 dark:from-black dark:to-dark-bg-secondary rounded-xl shadow-2xl overflow-hidden flex items-center justify-center group">
              {mediaError ? (
                <div className="flex flex-col items-center text-gray-400 dark:text-gray-500 p-4">
                  <NoSymbolIcon className="w-20 h-20 sm:w-24 sm:h-24 mb-3 text-red-500/70" />
                  <p className="text-center text-sm sm:text-base font-medium">
                    {mediaError}
                  </p>
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
                  <span className="w-3 h-3 bg-white rounded-full animate-ping-slow opacity-75"></span>
                  <span className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-[13px] transform -translate-y-1/2"></span>
                  <span>REC</span>
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
                  {status.ok ? (
                    idx === 0 ? (
                      <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )
                  ) : (
                    <ExclamationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  <span className="font-medium">{status.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 타이머 + 버튼 - 타이머 상단 마진 mt-10 md:mt-12 추가 */}
          <div className="w-full md:w-2/5 lg:w-5/12 xl:w-2/5 flex flex-col items-center justify-center space-y-6 md:space-y-8 mt-4 md:mt-0">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center mt-6 md:mt-10 lg:mt-12">
              {" "}
              {/* 타이머 상단 마진 증가 */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                <circle
                  className={getTimerTrackColor()}
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
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
                />
              </svg>
              <div className="relative text-center">
                <span
                  className={`block text-5xl sm:text-6xl font-bold ${getTimerColor()}`}
                >
                  {countdown}
                </span>
                <span className="block text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 tracking-wider">
                  {timerState === TIMER_STATE.PREPARING
                    ? "준비 시간"
                    : timerState === TIMER_STATE.RECORDING
                    ? "답변 시간"
                    : "대기 중"}
                </span>
              </div>
            </div>

            {/* 버튼 영역 - 버튼들을 flex-col space-y-3로 세로 배치 */}
            <div className="w-full max-w-xs flex flex-col space-y-3">
              {timerState === TIMER_STATE.PREPARING && (
                <>
                  <button
                    onClick={handleForceStartRecording}
                    disabled={!!mediaError}
                    className={`w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl text-white transition-all duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 
                                ${
                                  mediaError
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500/50"
                                }`}
                  >
                    <VideoCameraIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    녹화 바로 시작
                  </button>
                  <p className="text-center text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 p-2 rounded-md bg-yellow-500/10 dark:bg-yellow-500/20">
                    {countdown}초 후 자동으로 녹화가 시작됩니다.
                  </p>
                </>
              )}
              {timerState === TIMER_STATE.RECORDING && (
                <>
                  {" "}
                  {/* 답변 제출하기와 다시 녹화 버튼을 세로로 배치 */}
                  <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                  >
                    <PaperAirplaneIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 -rotate-12" />
                    답변 제출하기
                  </button>
                  <button
                    onClick={handleRecordAgain}
                    className="w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl bg-gray-500 hover:bg-gray-600 text-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                  >
                    <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    다시 녹화하기
                  </button>
                </>
              )}
              {(timerState === TIMER_STATE.IDLE || mediaError) && (
                <button
                  onClick={() => {
                    if (mediaError) {
                      window.location.reload(); // 미디어 오류 시 새로고침으로 권한 재요청 유도
                    } else {
                      // 다음 질문 또는 새 연습 시작 로직 (예시: 상태 초기화)
                      setQuestionNumber((prev) => prev + 1); // 다음 질문으로 (실제로는 목록에서 가져와야 함)
                      setCurrentQuestion(
                        MOCK_QUESTIONS[
                          Math.floor(Math.random() * MOCK_QUESTIONS.length)
                        ]
                      ); // 임시로 새 질문
                      setTimerState(TIMER_STATE.PREPARING);
                      setCountdown(PREPARATION_TIME);
                    }
                  }}
                  className="w-full flex items-center justify-center px-6 py-3.5 text-base sm:text-lg font-semibold rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-150 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                >
                  <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  {mediaError ? "권한 확인 및 새로고침" : "새 연습 시작"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isExitModalOpen}
        onClose={closeExitModal}
        title="연습 종료 확인"
      >
        <div className="p-5 sm:p-6 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-5" />
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
            정말로 나가시겠습니까?
          </h3>
          <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary mb-8">
            지금 나가시면 현재 진행 중인 연습은 저장되지 않습니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={closeExitModal}
              className="px-8 py-3 text-sm sm:text-base font-medium rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-light-text-primary dark:text-dark-text-primary transition-colors w-full sm:w-auto shadow-sm hover:shadow-md"
            >
              취소
            </button>
            <button
              onClick={handleConfirmExit}
              className="px-8 py-3 text-sm sm:text-base font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              확인 (나가기)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PracticeModePage;
