import React, { useState, useEffect } from "react";
// useNavigate는 HomePage에서 로그아웃 후 페이지 이동을 담당하므로 여기서 직접 사용하지 않음
// import { useNavigate } from "react-router-dom";
import {
  UserIcon as MyPageIcon,
  ArrowRightOnRectangleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as SolidCheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const getTierInfo = (tierName, subTier) => {
  const tierUpper = tierName?.toUpperCase();
  let tierData = {
    name: "티어 정보 없음", // 기본값 또는 로딩 중 표시
    colorHex: "#9CA3AF", // 기본 회색
    colorClass: "text-gray-400",
    bgColorClass: "bg-gray-400/10",
    iconColor: "text-gray-400",
  };

  if (tierUpper === "BRONZE")
    tierData = {
      name: "브론즈",
      colorHex: "#8b6259",
      colorClass: "text-tier-bronze",
      bgColorClass: "bg-tier-bronze/10",
      iconColor: "text-tier-bronze",
    };
  else if (tierUpper === "SILVER")
    tierData = {
      name: "실버",
      colorHex: "#969fab",
      colorClass: "text-tier-silver",
      bgColorClass: "bg-tier-silver/20",
      iconColor: "text-tier-silver",
    };
  else if (tierUpper === "GOLD")
    tierData = {
      name: "골드",
      colorHex: "#ec9a01",
      colorClass: "text-tier-gold",
      bgColorClass: "bg-tier-gold/20",
      iconColor: "text-tier-gold",
    };
  else if (tierUpper === "PLATINUM")
    tierData = {
      name: "플래티넘",
      colorHex: "#49b2d4",
      colorClass: "text-tier-platinum",
      bgColorClass: "bg-tier-platinum/20",
      iconColor: "text-tier-platinum",
    };
  else if (tierUpper === "DIAMOND")
    tierData = {
      name: "다이아몬드",
      colorHex: "#476ac2",
      colorClass: "text-tier-diamond",
      bgColorClass: "bg-tier-diamond/20",
      iconColor: "text-tier-diamond",
    };
  // 백엔드에서 오는 tier 문자열이 "BRONZE3" 같은 형태라면 여기서 파싱 필요
  // 예시: const mainTierMatch = tierName?.match(/([A-Z]+)/i);
  //       const subTierMatch = tierName?.match(/(\d+)$/);
  //       const mainTier = mainTierMatch ? mainTierMatch[0].toUpperCase() : null;
  //       const actualSubTier = subTierMatch ? parseInt(subTierMatch[0]) : subTier || 1;
  //       if (mainTier === "BRONZE") tierData = ...
  //       return { displayName: `${tierData.name} ${actualSubTier}`, ...tierData };

  return {
    displayName: `${tierData.name} ${
      subTier || (tierName === "LOADING" ? "" : 1)
    }`, // 로딩 중일 때 subTier 숫자 숨김
    ...tierData,
  };
};

const initialChecklistItems = [
  { id: 1, text: "일일 출석체크", completed: false, points: 10 }, // 기본은 false, 첫날은 true로 변경 가능
  { id: 2, text: "연속 출석체크 (7일)", completed: false, points: 70 },
  { id: 3, text: "일일 연습면접 수행", completed: false, points: 50 },
  { id: 4, text: "실전 면접 1회 완료", completed: false, points: 100 },
];

// user prop과 onLogoutRequest prop을 받도록 수정
function UserInfoCard({ user, onMyPageToggle, onLogoutRequest }) {
  const [checklist, setChecklist] = useState(initialChecklistItems);
  // const navigate = useNavigate(); // HomePage에서 처리하므로 여기서는 삭제

  // user prop이 변경될 때 체크리스트를 로드/초기화하도록 useEffect 수정
  useEffect(() => {
    if (user && user.email && user.name) {
      // user 정보가 있을 때만 실행
      const checklistKey = `checklist_${user.name}_${user.email}`;
      const storedChecklist = localStorage.getItem(checklistKey);
      if (storedChecklist) {
        setChecklist(JSON.parse(storedChecklist));
      } else {
        // 새 사용자 또는 정보 없는 사용자를 위해 초기화
        // 첫 번째 항목만 true로 하는 로직이 필요하다면 여기서 처리
        const initialItemsWithFirstCompleted = initialChecklistItems.map(
          (item, index) => (index === 0 ? { ...item, completed: true } : item)
        );
        setChecklist(initialItemsWithFirstCompleted);
        localStorage.setItem(
          checklistKey,
          JSON.stringify(initialItemsWithFirstCompleted)
        );
      }
    } else {
      // user 정보가 없으면 (예: 로그아웃 직후), 체크리스트를 초기 상태로 되돌림
      setChecklist(initialChecklistItems);
    }
  }, [user]); // user prop이 바뀔 때마다 이 useEffect 실행

  const toggleChecklistItem = (id) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    if (user && user.email && user.name) {
      // user 정보가 있을 때만 localStorage에 저장
      const checklistKey = `checklist_${user.name}_${user.email}`;
      localStorage.setItem(checklistKey, JSON.stringify(updatedChecklist));
    }
  };

  // 로딩 상태: user prop이 아직 없거나, user.tier가 "LOADING"일 때 (HomePage에서 초기값으로 설정한 경우)
  if (!user || user.tier === "LOADING") {
    return (
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 sm:p-7 rounded-2xl shadow-xl w-full animate-pulse flex flex-col lg:h-full">
        {/* 스켈레톤 UI (이전과 동일) */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-28 h-28 sm:w-30 sm:h-30 rounded-full bg-gray-300 dark:bg-gray-700 mb-3"></div>
          <div className="h-7 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-1.5"></div>
          <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
        </div>
        <div className="space-y-4 mb-5">
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-700 pt-4 mt-4">
          <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="space-y-1.5">
            <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            {/* ... */}
          </div>
        </div>
        <div className="w-full mt-auto pt-3 space-y-2">
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // user prop에서 직접 데이터를 가져와 사용
  const currentTier = getTierInfo(user.tier, user.subTier);

  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 sm:p-7 rounded-2xl shadow-xl w-full animate-fadeInUp flex flex-col lg:h-full">
      <div className="flex flex-col items-center text-center mb-5 flex-shrink-0">
        <div className="relative mb-3">
          <img
            src={user.profileImage || "/images/user.jpg"} // 기본 이미지 경로 수정
            alt={user.name || "프로필"}
            className="w-28 h-28 sm:w-30 sm:h-30 rounded-full object-cover border-4 border-light-border dark:border-dark-border shadow-lg"
          />
          <div
            className={`absolute -bottom-1 -right-1 p-1 rounded-full shadow-md`}
            style={{ backgroundColor: `${currentTier.colorHex}30` }}
          >
            <StarIcon
              className="w-5 h-5 sm:w-5.5 sm:h-5.5"
              style={{ color: currentTier.colorHex }}
            />
          </div>
        </div>
        <h2 className="text-2xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-0.5">
          {user.name || "사용자 이름"}
        </h2>
        <p
          className="text-sm sm:text-sm font-semibold px-2.5 py-0.5 rounded-full"
          style={{
            color: currentTier.colorHex,
            backgroundColor: `${currentTier.colorHex}20`,
          }}
        >
          {currentTier.displayName}
        </p>
      </div>

      <div className="space-y-4 mb-5 flex-shrink-0">
        <div>
          <div
            className="flex justify-between text-xs sm:text-sm font-medium mb-1"
            style={{ color: currentTier.colorHex }}
          >
            <span>경험치</span>
            <span>{user.exp != null ? user.exp : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3.5 sm:h-4 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full"
              style={{
                width: `${user.exp != null ? user.exp : 0}%`,
                backgroundColor: currentTier.colorHex,
              }}
            ></div>
          </div>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary mb-0.5">
            보유 포인트
          </p>
          <p className="text-xl sm:text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {user.points != null ? user.points.toLocaleString() : 0}{" "}
            <span className="text-accent-main text-md sm:text-lg">P</span>
          </p>
        </div>
      </div>

      <div className="border-t border-light-border dark:border-dark-border pt-4 mb-auto overflow-y-auto custom-scrollbar-thin">
        <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2 flex-shrink-0">
          오늘의 목표
        </h4>
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => toggleChecklistItem(item.id)}
                className={`flex items-center w-full p-2 rounded-lg transition-colors text-left ${
                  item.completed
                    ? "bg-green-500/10 dark:bg-green-400/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                {item.completed ? (
                  <SolidCheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                ) : (
                  <CheckCircleIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    item.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : "text-light-text-secondary dark:text-dark-text-secondary"
                  }`}
                >
                  {item.text}
                </span>
                <span
                  className={`ml-auto text-xs font-medium`}
                  style={{
                    color: item.completed
                      ? currentTier.colorHex
                      : "rgb(156 163 175 / 1)",
                  }}
                >
                  +{item.points}P
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full pt-4 space-y-2 flex-shrink-0">
        <button
          onClick={onMyPageToggle}
          className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-medium
                           bg-accent-main/10 hover:bg-accent-main/20 dark:bg-accent-main/20 dark:hover:bg-accent-main/30
                           text-accent-main dark:text-sky-400 dark:hover:text-sky-300
                           transition-colors duration-200"
        >
          <MyPageIcon className="w-4.5 h-4.5 mr-2" />
          마이페이지
        </button>
        {/* HomePage에서 전달받은 로그아웃 함수 호출 */}
        <button
          onClick={onLogoutRequest}
          className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-medium
                           bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400
                           dark:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-4.5 h-4.5 mr-2" />
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default UserInfoCard;
