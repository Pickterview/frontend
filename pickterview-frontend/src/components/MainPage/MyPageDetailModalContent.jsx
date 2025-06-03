// src/components/MainPage/MyPageDetailModalContent.jsx
import React from "react";
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon as SolidArrowRightIcon,
  TrophyIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowRightIcon,
  CheckBadgeIcon as SolidCheckBadgeIcon,
  FireIcon as SolidFireIcon,
} from "@heroicons/react/24/solid";
// MyPageData를 여기서도 임시로 사용 (실제로는 props로 받거나 API 호출)
const MyPageData = {
  user: JSON.parse(localStorage.getItem("pickterviewUser")) || {
    name: "김플래티넘",
    tier: "PLATINUM",
    subTier: 2,
    profileImage: "/images/user.jpg",
  },
  scores: { recentPractice: 88, avgPractice: 82, recentExam: 92, avgExam: 85 },
  strengths: [
    "논리적인 답변 구성",
    "자신감 있는 태도",
    "명확한 발음 및 전달력",
    "구체적인 경험 제시",
    "긍정적인 자세",
  ],
  weaknesses: [
    "시선 처리의 자연스러움",
    "답변 시간 관리",
    "예상치 못한 질문 대처",
    "목소리 톤 단조로움",
    "결론 도출 미흡",
  ],
  recentActivities: [
    /* MyPageContent와 동일한 더 많은 데이터 */
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
    { id: 5, text: "자소서 모드 연습 시작", date: "4일 전", type: "practice" },
    {
      id: 6,
      text: "프로필 정보 업데이트 완료",
      date: "5일 전",
      type: "profile",
    },
  ],
  badges: [
    /* MyPageContent와 동일한 더 많은 데이터 */
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
    {
      id: "feedbackMaster",
      name: "피드백 마스터",
      icon: LightBulbIcon,
      iconColor: "text-purple-400",
      bgColor: "bg-gradient-to-br from-purple-500 to-violet-600",
      textColor: "text-white",
      detail: "피드백 10회 확인",
    },
  ],
};

const MyPageDetailModalContent = ({ type }) => {
  const { strengths, weaknesses, recentActivities, badges } = MyPageData;

  if (type === "activities") {
    return (
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar-thin pr-2">
        {recentActivities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <span className="text-sm text-light-text-primary dark:text-dark-text-secondary">
              {activity.text}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {activity.date}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (type === "badges") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar-thin pr-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center ${badge.bgColor}`}
          >
            <badge.icon className={`w-10 h-10 mb-2 ${badge.textColor}`} />
            <p className={`text-sm font-semibold ${badge.textColor}`}>
              {badge.name}
            </p>
            <p className={`text-xs ${badge.textColor} opacity-80`}>
              {badge.detail}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (type === "strengths") {
    return (
      <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary max-h-[60vh] overflow-y-auto custom-scrollbar-thin pr-2">
        {strengths.map((s, i) => (
          <li key={i} className="flex items-start py-1">
            <span className="text-green-500 mr-2 mt-0.5 text-md">&#10003;</span>
            {s}
          </li>
        ))}
      </ul>
    );
  }

  if (type === "weaknesses") {
    return (
      <ul className="space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary max-h-[60vh] overflow-y-auto custom-scrollbar-thin pr-2">
        {weaknesses.map((w, i) => (
          <li key={i} className="flex items-start py-1">
            <span className="text-yellow-500 mr-2 mt-0.5 text-md">&#8226;</span>
            {w}
          </li>
        ))}
      </ul>
    );
  }
  if (type === "news") {
    // Pickterview 소식 더보기
    return (
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar-thin pr-2">
        <h4 className="text-lg font-semibold mb-3">전체 소식</h4>
        <ul className="space-y-3 text-sm">
          <li className="pb-2 border-b dark:border-gray-700">
            <strong>[업데이트]</strong> 새로운 면접 질문 유형이 추가되었습니다!
            지금 바로 확인해보세요. (2024-05-26)
          </li>
          <li className="pb-2 border-b dark:border-gray-700">
            <strong>[공지]</strong> 서버 점검 안내: 매주 수요일 02:00 ~ 03:00
            (1시간) (2024-05-22)
          </li>
          <li className="pb-2 border-b dark:border-gray-700">
            <strong>[팁]</strong> 면접 합격률 높이는 꿀팁 #3: STAR 기법 활용법
            완벽 정리 (2024-05-20)
          </li>
          <li className="pb-2 border-b dark:border-gray-700">
            <strong>[이벤트]</strong> Pickterview 출시 기념 친구 추천 이벤트!
            (2024-05-15)
          </li>
          <li className="pb-2 border-b dark:border-gray-700">
            <strong>[공지]</strong> 개인정보처리방침 개정 안내 (2024-05-10)
          </li>
        </ul>
      </div>
    );
  }

  return (
    <p className="text-sm text-gray-500">해당 컨텐츠를 불러올 수 없습니다.</p>
  );
};

export default MyPageDetailModalContent;
