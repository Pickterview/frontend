// src/services/practiceAttemptService.js

const PRACTICE_MODE_GENERAL_STORAGE_KEY = "pickterviewPracticeModeGeneral";
const DAILY_LIMIT = Infinity;

export const getTodaysDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

export const getPracticeAttemptStatus = () => {
  const today = getTodaysDate();
  const storedData = localStorage.getItem(PRACTICE_MODE_GENERAL_STORAGE_KEY);
  let attemptsMadeToday = 0;

  if (storedData) {
    try {
      const data = JSON.parse(storedData);
      if (data.date === today) {
        attemptsMadeToday = data.attempts || 0;
      }
      // If date is not today, attemptsMadeToday remains 0 (effectively reset)
    } catch (e) {
      console.error("Failed to parse practice attempt data:", e);
      attemptsMadeToday = 0;
    }
  }

  const attemptsLeft = Math.max(0, DAILY_LIMIT - attemptsMadeToday);
  return {
    attemptsLeft: attemptsLeft,
    canAttempt: attemptsLeft > 0,
    attemptsMadeToday: attemptsMadeToday,
  };
};

export const recordPracticeAttempt = () => {
  const today = getTodaysDate();
  const status = getPracticeAttemptStatus();

  if (!status.canAttempt) {
    console.warn("No practice attempts left for today to record.");
    return false;
  }

  const newAttemptsMade = status.attemptsMadeToday + 1;
  const newData = {
    date: today,
    attempts: newAttemptsMade,
  };
  localStorage.setItem(
    PRACTICE_MODE_GENERAL_STORAGE_KEY,
    JSON.stringify(newData)
  );
  console.log("Practice attempt recorded:", newData); // 기록 확인 로그
  return true;
};
