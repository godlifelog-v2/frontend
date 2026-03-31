import React from "react";
import { Eye, Heart, Share2, GitFork } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoutineStats = ({ routineData, certificationStreak, handleLike, handleUnlike }) => {
  const navigate = useNavigate();
  const isLiked = routineData.isLiked || false;

  const handleLikeClick = () => {
    if (isLiked) {
      handleUnlike();
    } else {
      handleLike();
    }
  };

  const handleForkClick = () => {
    try {
      let repeatDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

      if (routineData.repeatDays) {
        if (Array.isArray(routineData.repeatDays)) {
          repeatDays = routineData.repeatDays;
        } else if (typeof routineData.repeatDays === "string" && routineData.repeatDays.includes(",")) {
          repeatDays = routineData.repeatDays.split(",");
        }
      }

      sessionStorage.setItem(
        "forkRoutineData",
        JSON.stringify({
          planTitle: `${routineData.planTitle} (복사본)`,
          endTo: routineData.endTo,
          targetIdx: routineData.targetIdx,
          isShared: routineData.isShared,
          planImp: routineData.planImp,
          jobIdx: routineData.jobIdx,
          jobEtcCateDTO: routineData.jobEtcCateDTO,
          activities: routineData.activities.map((activity) => ({
            activityTitle: activity.activityName || activity.activityTitle || "",
            activityName: activity.activityName || activity.activityTitle || "",
            description: activity.description || "",
            activityImp: activity.activityImp || 5,
            setTime: activity.setTime || "12:00",
            planIdx: null,
            activityIdx: null,
            verified: false,
          })),
          repeatDays,
          forkIdx: routineData.planIdx,
          forked: true,
        })
      );

      navigate("/routine/create");
    } catch (error) {
      console.error("포크 처리 중 오류 발생:", error);
      alert("포크 처리 중 오류가 발생했습니다: " + error.message);
    }
  };

  return (
    <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-8">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-4 divide-x divide-gray-200">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center text-blue-600 mb-1"><Eye className="w-4 h-4 mr-1" /><span className="text-sm font-medium">조회</span></div>
            <span className="text-lg font-bold">{routineData.viewCount || 0}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 cursor-pointer" onClick={handleLikeClick}>
            <div className="flex items-center mb-1" style={{ color: isLiked ? "#FF4136" : "#FF6B6B" }}>
              <Heart className="w-4 h-4 mr-1" fill={isLiked ? "#FF4136" : "none"} />
              <span className="text-sm font-medium">좋아요</span>
            </div>
            <span className="text-lg font-bold">{routineData.likeCount || 0}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-purple-50 transition-colors rounded" onClick={handleForkClick}>
            <div className="flex items-center text-purple-500 mb-1"><GitFork className="w-4 h-4 mr-1" /><span className="text-sm font-medium">포크</span></div>
            <span className="text-lg font-bold">{routineData.forkCount || 0}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center text-green-500 mb-1"><Share2 className="w-4 h-4 mr-1" /><span className="text-sm font-medium">공유</span></div>
            <span className="text-lg font-bold">{routineData.isShared ? "공개" : "비공개"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineStats;
