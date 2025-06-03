// src/components/MainPage/UserInfoCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    name: "플래티넘", // Default or fallback tier name
    colorHex: "#49b2d4", // Default or fallback color
    colorClass: "text-tier-platinum",
    bgColorClass: "bg-tier-platinum/20",
    iconColor: "text-tier-platinum",
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

  return {
    displayName: `${tierData.name} ${subTier || 1}`,
    ...tierData,
  };
};

const initialChecklistItems = [
  { id: 1, text: "일일 출석체크", completed: true, points: 10 },
  { id: 2, text: "연속 출석체크 (7일)", completed: false, points: 70 },
  { id: 3, text: "일일 연습면접 수행", completed: false, points: 50 },
  { id: 4, text: "실전 면접 1회 완료", completed: false, points: 100 },
];

function UserInfoCard({ onMyPageToggle }) {
  const [userData, setUserData] = useState(null);
  const [checklist, setChecklist] = useState(initialChecklistItems);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("pickterviewUser");
    let parsedUser;
    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
    } else {
      // Fallback/default user if nothing in localStorage
      parsedUser = {
        isLoggedIn: true,
        name: "이진규", // Default name
        tier: "DIAMOND", // Default tier
        subTier: 2,
        exp: 60,
        points: 52500,
        email: "aiduriaaa@", // Default email
        profileImage: "/images/user.jpg", // Default profile image
      };
      // Optionally save this default user to localStorage if you want it to persist
      // localStorage.setItem("pickterviewUser", JSON.stringify(parsedUser));
    }
    setUserData(parsedUser);

    // Initialize checklist based on potentially new/default user
    const checklistKey = `checklist_${parsedUser.name}_${parsedUser.email}`; // Make key more unique
    const storedChecklist = localStorage.getItem(checklistKey);
    if (storedChecklist) {
      setChecklist(JSON.parse(storedChecklist));
    } else {
      // Reset checklist to initial for a new or default user
      const initialItems = initialChecklistItems.map(
        (item) =>
          item.id === 1
            ? { ...item, completed: true }
            : { ...item, completed: false } // Ensure only first is completed by default
      );
      setChecklist(initialItems);
      localStorage.setItem(checklistKey, JSON.stringify(initialItems));
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = () => {
    localStorage.removeItem("pickterviewUser");
    // Potentially remove checklist too, or handle it based on your app's logic for logout
    // if (userData) {
    //   localStorage.removeItem(`checklist_${userData.name}_${userData.email}`);
    // }
    navigate("/login");
  };

  const toggleChecklistItem = (id) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    if (userData) {
      const checklistKey = `checklist_${userData.name}_${userData.email}`;
      localStorage.setItem(checklistKey, JSON.stringify(updatedChecklist));
    }
  };

  if (!userData) {
    return (
      <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 sm:p-7 rounded-2xl shadow-xl w-full animate-pulse flex flex-col lg:h-full">
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
          {" "}
          {/* Changed from mt-auto to mt-4 */}
          <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
          <div className="space-y-1.5">
            <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
        <div className="w-full mt-auto pt-3 space-y-2">
          {" "}
          {/* This mt-auto pushes buttons down */}
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const currentTier = getTierInfo(userData.tier, userData.subTier);

  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 sm:p-7 rounded-2xl shadow-xl w-full animate-fadeInUp flex flex-col lg:h-full">
      <div className="flex flex-col items-center text-center mb-5 flex-shrink-0">
        {" "}
        {/* Added flex-shrink-0 */}
        <div className="relative mb-3">
          <img
            src={userData.profileImage || "/images/user.jpg"} // Use userData.profileImage
            alt="프로필"
            className="w-28 h-28 sm:w-30 sm:h-30 rounded-full object-cover border-4 border-light-border dark:border-dark-border shadow-lg"
          />
          <div
            className={`absolute -bottom-1 -right-1 p-1 rounded-full shadow-md`}
            style={{ backgroundColor: `${currentTier.colorHex}30` }} // Template literal for safety
          >
            <StarIcon
              className="w-5 h-5 sm:w-5.5 sm:h-5.5"
              style={{ color: currentTier.colorHex }}
            />
          </div>
        </div>
        <h2 className="text-2xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-0.5">
          {userData.name}
        </h2>
        <p
          className="text-sm sm:text-sm font-semibold px-2.5 py-0.5 rounded-full"
          style={{
            color: currentTier.colorHex,
            backgroundColor: `${currentTier.colorHex}20`, // Template literal
          }}
        >
          {currentTier.displayName}
        </p>
      </div>

      <div className="space-y-4 mb-5 flex-shrink-0">
        {" "}
        {/* Added flex-shrink-0 */}
        <div>
          <div
            className="flex justify-between text-xs sm:text-sm font-medium mb-1"
            style={{ color: currentTier.colorHex }}
          >
            <span>경험치</span>
            <span>{userData.exp}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3.5 sm:h-4 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full"
              style={{
                width: `${userData.exp}%`,
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
            {userData.points ? userData.points.toLocaleString() : 0}{" "}
            {/* Added check for points */}
            <span className="text-accent-main text-md sm:text-lg">P</span>
          </p>
        </div>
      </div>

      {/* 오늘의 목표: This section will take up remaining space due to mt-auto on the button container below it */}
      <div className="border-t border-light-border dark:border-dark-border pt-4 mb-auto overflow-y-auto custom-scrollbar-thin">
        {" "}
        {/* mb-auto here makes this section grow, overflow for its content */}
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
                    // Ensure color is applied correctly
                    color: item.completed
                      ? currentTier.colorHex // Use tier color for completed points
                      : "rgb(156 163 175 / 1)", // Default gray for incomplete points
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
        {" "}
        {/* Buttons at the bottom, flex-shrink-0 */}
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
        <button
          onClick={handleLogout}
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
