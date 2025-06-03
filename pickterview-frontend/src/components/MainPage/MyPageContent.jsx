// src/components/MainPage/MyPageContent.jsx
import React from "react";
import {
  AcademicCapIcon,
  ShieldCheckIcon,
  TrophyIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowRightIcon,
  CheckBadgeIcon, // Used for recentActivities
  CheckBadgeIcon as SolidCheckBadgeIcon, // Used for MyPageData.badges
  FireIcon as SolidFireIcon, // Used for MyPageData.badges
} from "@heroicons/react/24/solid";

// 가상 사용자 정보 및 데이터
const MyPageData = {
  user: JSON.parse(localStorage.getItem("pickterviewUser")) || {
    name: "김플래티넘",
    tier: "PLATINUM",
    subTier: 2,
    profileImage: "/images/user.jpg", // Default if not in localStorage
  },
  scores: {
    recentPractice: 88,
    avgPractice: 82,
    recentExam: 92,
    avgExam: 85,
  },
  strengths: [
    "논리적인 답변 구성",
    "자신감 있는 태도",
    "명확한 발음 및 전달력",
  ],
  weaknesses: [
    "시선 처리의 자연스러움",
    "답변 시간 관리",
    "예상치 못한 질문 대처",
  ],
  recentActivities: [
    {
      id: 1,
      text: "일반 모드 연습 완료 (AI 피드백 확인)",
      date: "30분 전",
      type: "practice",
    },
    { id: 2, text: "일일 출석 보상 (+10P)", date: "2시간 전", type: "reward" },
    {
      id: 3,
      text: "실전 모의고사 응시 (결과 분석 완료)",
      date: "어제",
      type: "exam",
    },
    {
      id: 4,
      text: "새로운 배지 획득: 연습 전문가",
      date: "3일 전",
      type: "badge",
    },
  ],
  badges: [
    {
      id: "practicePro",
      name: "연습 전문가",
      icon: AcademicCapIcon,
      iconColor: "text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-500 to-sky-600",
      textColor: "text-white",
      detail: "연습 10회+",
    },
    {
      id: "examConqueror",
      name: "실전 정복자",
      icon: ShieldCheckIcon,
      iconColor: "text-red-400",
      bgColor: "bg-gradient-to-br from-red-500 to-rose-600",
      textColor: "text-white",
      detail: "실전 5회+",
    },
    {
      id: "perfectAttendant",
      name: "만점 출석러",
      icon: SolidCheckBadgeIcon,
      iconColor: "text-green-400",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      textColor: "text-white",
      detail: "30일 연속",
    },
    {
      id: "topAchiever",
      name: "Top Achiever",
      icon: TrophyIcon,
      iconColor: "text-amber-400",
      bgColor: "bg-gradient-to-br from-amber-500 to-yellow-500",
      textColor: "text-white",
      detail: "평균 90점+",
    },
    {
      id: "fireStarter",
      name: "열정 스타터",
      icon: SolidFireIcon,
      iconColor: "text-orange-400",
      bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
      textColor: "text-white",
      detail: "첫 활동",
    },
  ],
};

const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  iconBgColor,
  iconItselfColor,
}) => (
  <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-4 rounded-xl shadow-lg flex items-center space-x-3 h-full">
    <div
      className={`p-3 rounded-lg ${
        iconBgColor || "bg-gray-100 dark:bg-gray-700"
      }`}
    >
      <Icon
        className={`w-6 h-6 ${
          iconItselfColor || "text-gray-600 dark:text-gray-300"
        }`}
      />
    </div>
    <div>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
        {title}
      </p>
      <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
        {value}
        {unit && <span className="text-base ml-1">{unit}</span>}
      </p>
    </div>
  </div>
);

const SectionCard = ({
  title,
  icon: Icon,
  iconColor,
  children,
  moreLink = "#",
  className = "",
  onMoreClick,
}) => (
  <div
    className={`bg-light-bg-secondary dark:bg-dark-bg-secondary p-4 rounded-xl shadow-lg flex flex-col ${className}`}
  >
    <div className="flex justify-between items-center mb-2.5 flex-shrink-0">
      <h3 className="text-md font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center">
        <Icon className={`w-5 h-5 mr-2 ${iconColor || "text-gray-500"}`} />
        {title}
      </h3>
      <button
        onClick={
          onMoreClick ||
          (() => alert(`'${title}' 더보기 클릭됨 (경로: ${moreLink})`))
        }
        className="text-xs font-medium text-accent-main hover:underline flex items-center"
      >
        더보기 <ArrowRightIcon className="w-3 h-3 ml-0.5" />
      </button>
    </div>
    <div className="flex-grow overflow-y-auto custom-scrollbar-thin pr-1">
      {children}
    </div>
  </div>
);

const MyPageContent = ({ onOpenDetailModal }) => {
  const { user, scores, strengths, weaknesses, recentActivities, badges } =
    MyPageData;

  const currentUser = user || {
    name: "사용자",
    tier: "UNRANKED",
    subTier: 0,
    profileImage: "/images/user.jpg",
  };

  return (
    <div className="flex flex-col gap-4 p-1 animate-fadeInUp_fast flex-1">
      {/* 상단 환영 메시지 */}
      <div
        className="flex items-center justify-between p-4 rounded-xl shadow-lg text-white flex-shrink-0 bg-cover bg-center relative min-h-[120px] sm:min-h-[130px]"
        style={{ backgroundImage: "url('/images/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
        <div className="flex items-center space-x-3 sm:space-x-4 relative z-10">
          <img
            src="/images/user.jpg"
            alt={currentUser.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/70 object-cover shadow-md"
          />
          <div>
            <h2 className="text-xl md:text-2xl font-bold drop-shadow-md">
              {currentUser.name}님, 안녕하세요!
            </h2>
            <p className="text-xs md:text-sm opacity-90 drop-shadow-sm">
              오늘의 Pickterview, 함께 성장해요.
            </p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-2xl sm:text-3xl font-bold drop-shadow-md">
            {currentUser.tier}{" "}
            <span className="text-lg sm:text-xl">{currentUser.subTier}</span>
          </p>
          <p className="text-xs sm:text-sm opacity-80 drop-shadow-sm">
            Current Tier
          </p>
        </div>
      </div>

      {/* 점수 통계 섹션 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard
          title="최근 연습"
          value={scores.recentPractice}
          unit="점"
          icon={AcademicCapIcon}
          iconBgColor="bg-blue-100 dark:bg-blue-500/20"
          iconItselfColor="text-blue-500"
        />
        <StatCard
          title="평균 연습"
          value={scores.avgPractice}
          unit="점"
          icon={AcademicCapIcon}
          iconBgColor="bg-sky-100 dark:bg-sky-500/20"
          iconItselfColor="text-sky-500"
        />
        <StatCard
          title="최근 실전"
          value={scores.recentExam}
          unit="점"
          icon={ShieldCheckIcon}
          iconBgColor="bg-red-100 dark:bg-red-500/20"
          iconItselfColor="text-red-500"
        />
        <StatCard
          title="평균 실전"
          value={scores.avgExam}
          unit="점"
          icon={ShieldCheckIcon}
          iconBgColor="bg-rose-100 dark:bg-rose-500/20"
          iconItselfColor="text-rose-500"
        />
      </div>

      {/* 최근 활동 및 배지 - Adjusted column spans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-shrink-0">
        <div className="lg:col-span-6">
          {" "}
          {/* Changed from lg:col-span-7 */}
          <SectionCard
            title="최근 활동"
            icon={ClockIcon}
            iconColor="text-gray-500"
            className="lg:h-full"
            onMoreClick={() =>
              onOpenDetailModal("activities", "최근 활동 전체 보기")
            }
          >
            <ul className="space-y-2.5 pt-1">
              {recentActivities.slice(0, 3).map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-center pb-2 border-b border-dashed border-gray-200 dark:border-gray-700/50 last:border-b-0 last:pb-0" // Removed justify-between
                >
                  {/* Left part: Icon and Text - this part will grow */}
                  <div className="flex items-center space-x-2.5 flex-grow min-w-0 mr-3">
                    {" "}
                    {/* Added flex-grow, min-w-0, mr-3 */}
                    {activity.type === "practice" && (
                      <AcademicCapIcon className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                    )}
                    {activity.type === "reward" && (
                      <CheckBadgeIcon className="w-4.5 h-4.5 text-green-500 flex-shrink-0" />
                    )}
                    {activity.type === "exam" && (
                      <ShieldCheckIcon className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                    )}
                    {activity.type === "badge" && (
                      <TrophyIcon className="w-4.5 h-4.5 text-amber-500 flex-shrink-0" />
                    )}
                    <span className="text-sm text-light-text-primary dark:text-dark-text-secondary truncate">
                      {" "}
                      {/* Added truncate */}
                      {activity.text}
                    </span>
                  </div>

                  {/* Right part: Timestamp */}
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 whitespace-nowrap">
                    {" "}
                    {/* Added whitespace-nowrap */}
                    {activity.date}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
        <div className="lg:col-span-6">
          {" "}
          {/* Changed from lg:col-span-5 */}
          <SectionCard
            title="나의 배지"
            icon={TrophyIcon}
            iconColor="text-amber-400"
            className="lg:h-full"
            onMoreClick={() =>
              onOpenDetailModal("badges", "나의 배지 전체 보기")
            }
          >
            {badges.length > 0 ? (
              <div className="flex space-x-3 overflow-x-auto custom-scrollbar-thin pb-2 pt-1">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    title={badge.detail}
                    className={`flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-default p-2 ${badge.bgColor} border-2 border-white/20 transition-all duration-300 hover:shadow-2xl hover:border-white/50`}
                  >
                    <badge.icon
                      className={`w-8 h-8 sm:w-10 sm:h-10 mb-1 ${badge.textColor}`}
                    />
                    <p
                      className={`text-[11px] sm:text-xs font-bold ${badge.textColor} leading-tight`}
                    >
                      {badge.name}
                    </p>
                    <p
                      className={`text-[9px] sm:text-[10px] ${badge.textColor} opacity-80 leading-tight`}
                    >
                      {badge.detail}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 flex-grow flex items-center justify-center">
                획득한 배지가 아직 없어요.
              </p>
            )}
          </SectionCard>
        </div>
      </div>

      {/* 강점 및 약점 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
        <SectionCard
          title="나의 강점"
          icon={LightBulbIcon}
          iconColor="text-green-500"
          onMoreClick={() => onOpenDetailModal("strengths", "나의 강점 상세")}
        >
          <ul className="space-y-1.5 text-sm text-light-text-secondary dark:text-dark-text-secondary pt-1">
            {strengths.slice(0, 3).map((s, i) => (
              <li key={i} className="flex items-start py-1">
                <span className="text-green-500 mr-2 mt-0.5 text-md">
                  &#10003;
                </span>
                {s}
              </li>
            ))}
            {strengths.length === 0 && (
              <li className="text-center text-gray-400 py-2">
                아직 분석된 강점이 없어요.
              </li>
            )}
          </ul>
        </SectionCard>
        <SectionCard
          title="개선할 점"
          icon={ExclamationTriangleIcon}
          iconColor="text-yellow-500"
          onMoreClick={() => onOpenDetailModal("weaknesses", "개선할 점 상세")}
        >
          <ul className="space-y-1.5 text-sm text-light-text-secondary dark:text-dark-text-secondary pt-1">
            {weaknesses.slice(0, 3).map((w, i) => (
              <li key={i} className="flex items-start py-1">
                <span className="text-yellow-500 mr-2 mt-0.5 text-md">
                  &#8226;
                </span>
                {w}
              </li>
            ))}
            {weaknesses.length === 0 && (
              <li className="text-center text-gray-400 py-2">
                아직 분석된 개선점이 없어요.
              </li>
            )}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
};

export default MyPageContent;
