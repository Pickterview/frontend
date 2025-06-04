// src/components/Practice/CoverLetterSubmitModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import Modal from "../Common/Modal"; // Uses the new header-less Modal
import {
  DocumentArrowUpIcon, // For submitting document
  CheckCircleIcon,
  ArrowRightIcon,
  LightBulbIcon, // For tips or emphasis
} from "@heroicons/react/24/solid"; // Or outline if you prefer

const ANALYSIS_DURATION = 5000; // 5 seconds

function CoverLetterSubmitModal({ isOpen, onClose, onStartPractice }) {
  const [coverLetterText, setCoverLetterText] = useState("");
  const [submissionStep, setSubmissionStep] = useState("form"); // 'form', 'analyzing', 'analysis_complete'
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCoverLetterText("");
      setSubmissionStep("form");
      setProgress(0);
    }
  }, [isOpen]);

  const handleSubmitText = () => {
    if (coverLetterText.trim() === "") {
      alert("자기소개서를 입력해주세요.");
      return;
    }
    setSubmissionStep("analyzing");
    setProgress(0);

    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(
        100,
        Math.round((elapsedTime / ANALYSIS_DURATION) * 100)
      );
      setProgress(currentProgress);

      if (elapsedTime >= ANALYSIS_DURATION) {
        clearInterval(interval);
        setProgress(100);
        setSubmissionStep("analysis_complete");
      }
    }, 100);
  };

  const handleConfirmStartPractice = () => {
    onStartPractice(coverLetterText);
    // Parent (HomePage) will handle closing this modal via its own state update.
  };

  const handleCloseModal = useCallback(() => {
    if (submissionStep !== "analyzing") {
      onClose();
    }
  }, [submissionStep, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      {/* Step 1: Form for submitting cover letter */}
      {submissionStep === "form" && (
        <div className="w-full flex flex-col items-center">
          <span className="inline-flex items-center justify-center p-3.5 bg-accent-main/10 dark:bg-accent-main/20 rounded-full mb-5 shadow-sm">
            <DocumentArrowUpIcon className="w-10 h-10 sm:w-12 sm:h-12 text-accent-main dark:text-accent-light" />
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            자기소개서 제출하기
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6 max-w-sm">
            AI 면접관이 자기소개서 내용을 기반으로 맞춤형 질문을 준비합니다.
            (현재는 일반 질문이 시뮬레이션됩니다)
          </p>

          <textarea
            value={coverLetterText}
            onChange={(e) => setCoverLetterText(e.target.value)}
            placeholder="자기소개서 전체 내용을 여기에 붙여넣어 주세요..."
            rows={10}
            className="w-full max-w-lg p-4 border border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-accent-main focus:border-accent-main dark:bg-dark-bg-input custom-scrollbar-thin text-sm mb-6 shadow-sm dark:placeholder-gray-500"
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-sm">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-light-text-primary dark:text-dark-text-primary transition-colors w-full sm:flex-1"
            >
              취소
            </button>
            <button
              onClick={handleSubmitText}
              className="px-6 py-3 text-sm font-medium rounded-lg text-white transition-colors bg-accent-main hover:bg-accent-dark focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-bg-secondary dark:focus:ring-offset-dark-bg-secondary focus:ring-accent-main/70 w-full sm:flex-1 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              제출 및 분석 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Analyzing cover letter */}
      {submissionStep === "analyzing" && (
        <div className="w-full flex flex-col items-center py-4">
          <div role="status" className="mb-6">
            {" "}
            {/* SVG Spinner */}
            <svg
              aria-hidden="true"
              className="inline w-12 h-12 sm:w-14 sm:h-14 text-gray-200 animate-spin dark:text-gray-700 fill-accent-main"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">
            자기소개서 분석 중...
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
            AI가 핵심 내용을 파악하고 질문을 준비하고 있습니다.
          </p>
          <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-3.5">
            <div
              className="bg-accent-main h-3 sm:h-3.5 rounded-full transition-all duration-100 ease-linear flex items-center justify-center text-white text-[10px]"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && `${progress}%`}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Analysis complete, confirm practice */}
      {submissionStep === "analysis_complete" && (
        <div className="w-full flex flex-col items-center py-4">
          <span className="inline-flex items-center justify-center p-3 bg-green-500/10 dark:bg-green-500/20 rounded-full mb-5 shadow-sm">
            <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 dark:text-green-400" />
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">
            분석 완료!
          </h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-xs">
            자기소개서 기반으로 맞춤형 면접 연습을 시작할 준비가 되었습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-sm">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-light-text-primary dark:text-dark-text-primary transition-colors w-full sm:flex-1"
            >
              나중에 하기
            </button>
            <button
              onClick={handleConfirmStartPractice}
              className="px-6 py-3 text-sm font-medium rounded-lg text-white transition-colors bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-bg-secondary dark:focus:ring-offset-dark-bg-secondary focus:ring-green-600/50 w-full sm:flex-1 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              연습 시작하기 <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CoverLetterSubmitModal;
