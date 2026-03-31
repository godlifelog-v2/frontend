import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { renderIcon } from "@/components/common/badge-selector/icon-utils";
import {
  Clock,
  Flame,
  Eye,
  Heart,
  GitFork,
  CheckCircle,
  XCircle,
  Activity,
  Calendar,
} from "lucide-react";

const adjustColor = (hex, percent) => {
  if (!hex) return "#4F46E5";
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(0x1000000 + (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
};

const formatRepeatDays = (repeatDays) => {
  if (!repeatDays) return "없음";
  const dayMap = { mon: "월", tue: "화", wed: "수", thu: "목", fri: "금", sat: "토", sun: "일" };
  if (typeof repeatDays === "string") return repeatDays.split(",").map((day) => dayMap[day] || day).join(", ");
  if (Array.isArray(repeatDays)) return repeatDays.map((day) => dayMap[day] || day).join(", ");
  return "없음";
};

const RoutineCard = ({ routine, onClick, isPublic = false, isActive }) => {
  let planInfos, activities, jobInfo, targetInfo;
  let isActiveStatus;

  if (isPublic) {
    const { planInfos: pInfo, jobDefault, jobEtc, targetInfos } = routine;
    planInfos = pInfo;
    jobInfo = jobDefault?.name === "직접입력" && jobEtc ? { ...jobEtc } : jobDefault || jobEtc;
    targetInfo = targetInfos;
    activities = routine.activities || [];
    isActiveStatus = isActive !== undefined ? isActive : planInfos?.isActive === 1;
  } else {
    const { myPlanInfos, myActivities, jobDefaultInfos, jobAddedInfos, targetInfos } = routine;
    planInfos = myPlanInfos;
    activities = myActivities || [];
    jobInfo = jobDefaultInfos || jobAddedInfos;
    targetInfo = targetInfos;
    isActiveStatus = isActive !== undefined ? isActive : planInfos?.isActive === 1;
  }

  const getGradientStyle = () => {
    const baseColor = jobInfo?.color || "#4F46E5";
    if (isActiveStatus) {
      return { background: `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(baseColor, 20)} 100%)`, opacity: 1 };
    }
    return { background: `${baseColor}`, opacity: 0.5 };
  };

  return (
    <Card
      className="mb-4 overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 border-l-4"
      style={{ borderLeftColor: jobInfo?.color || "#4F46E5" }}
      onClick={() => onClick && onClick(planInfos.planIdx)}
    >
      <div className="relative p-5 border-b" style={getGradientStyle()}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white drop-shadow-sm">{planInfos.planTitle}</h3>
            <div className="flex items-center mt-2">
              <div className="bg-white p-1.5 rounded-full mr-2 shadow-sm">
                {jobInfo && renderIcon(jobInfo.iconKey || "leaf", 18, "", false, jobInfo.color)}
              </div>
              <span className="text-white text-sm font-medium drop-shadow-sm">{jobInfo?.name || "직업 없음"}</span>
            </div>
            {isPublic && planInfos.userNick && (
              <div className="flex items-center mt-2 bg-white bg-opacity-20 rounded-full px-2 py-1">
                <div className="w-4 h-4 rounded-full bg-white mr-1"></div>
                <span className="text-white text-xs">{planInfos.userNick}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end">
            <Badge variant="outline" className={`${isActiveStatus ? "bg-green-100 text-green-600 border-green-300" : "bg-gray-100 text-gray-500 border-gray-300"} font-medium px-3 py-1 shadow-sm`}>
              {isActiveStatus ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : <XCircle className="w-3.5 h-3.5 mr-1.5" />}
              {isActiveStatus ? "활성" : "비활성"}
            </Badge>
            {!isPublic && planInfos.repeatDays && (
              <div className="flex mt-3">
                <Badge variant="outline" className="bg-white text-gray-800 font-medium px-2 py-1 shadow-md border border-gray-200">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {formatRepeatDays(planInfos.repeatDays)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className={`p-5 ${isActiveStatus ? "bg-gradient-to-b from-white to-gray-50" : "bg-white"}`}>
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <div className="p-1.5 rounded-full bg-teal-50 mr-2.5" style={{ color: targetInfo?.color || "#008080" }}>
              {targetInfo && renderIcon(targetInfo.iconKey || "target", 18, "", false, targetInfo.color)}
            </div>
            <span className="text-sm font-medium text-gray-800">{targetInfo?.name || "목표 없음"}</span>
          </div>

          {activities && activities.length > 0 && (
            <div className="ml-2 mb-3">
              <div className="flex items-center text-gray-600 mb-2">
                <Activity className="w-4 h-4 mr-2" />
                <span className="text-sm">활동 {activities.length}개</span>
              </div>
              <div className="bg-white rounded-md p-2.5 shadow-sm border border-gray-100">
                {activities.slice(0, 2).map((activity, idx) => (
                  <div key={activity.activityIdx || idx} className="flex items-center mb-2 last:mb-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-700 font-medium mr-2">{activity.activityName || activity.activityTitle}</span>
                    {activity.setTime && (
                      <span className="text-gray-500 text-xs ml-auto bg-gray-100 px-2 py-0.5 rounded-full flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.setTime}
                      </span>
                    )}
                  </div>
                ))}
                {activities.length > 2 && (
                  <div className="text-xs text-blue-500 font-medium mt-1.5 text-center">+ {activities.length - 2}개 더 보기...</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200">
          {isPublic ? (
            <>
              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-blue-50">
                <div className="flex items-center text-blue-600 mb-1"><Eye className="w-4 h-4 mr-1" /><span className="text-xs font-medium">조회</span></div>
                <span className="text-sm font-bold text-gray-800">{planInfos.viewCount || 0}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-red-50">
                <div className="flex items-center text-red-500 mb-1"><Heart className="w-4 h-4 mr-1" /><span className="text-xs font-medium">좋아요</span></div>
                <span className="text-sm font-bold text-gray-800">{planInfos.likeCount || 0}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-purple-50">
                <div className="flex items-center text-purple-500 mb-1"><GitFork className="w-4 h-4 mr-1" /><span className="text-xs font-medium">포크</span></div>
                <span className="text-sm font-bold text-gray-800">{planInfos.forkCount || 0}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-blue-50">
                <div className="flex items-center text-blue-600 mb-1"><Flame className="w-4 h-4 mr-1" /><span className="text-xs font-medium">경험치</span></div>
                <span className="text-sm font-bold text-gray-800">{planInfos.certExp || 0}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-orange-50">
                <div className="flex items-center text-orange-500 mb-1"><Flame className="w-4 h-4 mr-1" /><span className="text-xs font-medium">중요도</span></div>
                <span className="text-sm font-bold text-gray-800">{planInfos.planImp || 0}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-md bg-green-50">
                <div className="flex items-center text-green-600 mb-1"><Eye className="w-4 h-4 mr-1" /><span className="text-xs font-medium">공개여부</span></div>
                <span className="text-sm font-bold text-gray-800">{planInfos.isShared ? "공개" : "비공개"}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoutineCard;
