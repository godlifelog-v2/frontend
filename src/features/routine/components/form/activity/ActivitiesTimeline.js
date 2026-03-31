import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { Clock, AlertCircle, FileText, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

function ActivitiesTimeline({
  control,
  certifiedActivities = {},
  isActive = false,
  onCertifyActivity = null,
  isEditMode = false,
  routineData = null,
}) {
  const activities = useWatch({ control, name: "activities", defaultValue: [] });
  const [sortedActivities, setSortedActivities] = useState([]);

  useEffect(() => {
    if (!activities.length) {
      setSortedActivities([]);
      return;
    }

    const processedActivities = activities.map((activity) => {
      let startMinutes = null;
      let formattedStart = null;

      if (activity.setTime) {
        const [hours, minutes] = activity.setTime.split(":").map(Number);
        startMinutes = hours * 60 + minutes;
        formattedStart = formatTime(startMinutes);
      }

      return { ...activity, startMinutes, formattedStart };
    });

    const sorted = [...processedActivities].sort((a, b) => a.startMinutes - b.startMinutes);
    setSortedActivities(sorted);
  }, [activities]);

  function formatTime(totalMinutes) {
    if (totalMinutes === undefined || totalMinutes === null || isNaN(totalMinutes)) return "00:00";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  const ImportanceStars = ({ importance }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < importance ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  );

  const TimelineItem = ({ activity, isLast, index }) => {
    const hasMemo = activity.description && activity.description.trim() !== "";
    const importance = activity.activityImp;
    const isCertified =
      (activity.verified === true || certifiedActivities[activity.activityIdx] === true) &&
      routineData?.isWriter === 1;

    const getColor = (importance, isCertified) => {
      if (!isEditMode && isCertified && isActive) return "bg-green-50 border-l-4 border-green-500";
      switch (importance) {
        case 5: return "bg-red-50 border-l-4 border-red-400";
        case 4: return "bg-orange-50 border-l-4 border-orange-400";
        case 3: return "bg-yellow-50 border-l-4 border-yellow-400";
        case 2: return "bg-blue-50 border-l-4 border-blue-400";
        default: return "bg-slate-50 border-l-4 border-slate-400";
      }
    };

    const colorClass = getColor(importance, isCertified);

    const handleCertify = () => {
      if (onCertifyActivity) onCertifyActivity(activity.activityIdx);
    };

    return (
      <div className="flex items-start mb-2">
        <div className="flex flex-col items-center mr-4">
          <div className={`rounded-full w-6 h-6 ${isCertified && isActive ? "bg-green-500" : "bg-blue-500"} text-white flex items-center justify-center text-xs`}>
            {isCertified && isActive ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
          </div>
          <div className="text-xs font-medium text-blue-600">{activity.formattedStart}</div>
          {!isLast && <div className="w-0.5 bg-blue-200 h-12 my-1 ml-0.5"></div>}
        </div>

        <div className={`${colorClass} rounded-lg p-3 shadow-sm flex-1 hover:shadow-md transition-shadow`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-slate-700">{activity.activityName || "무제 활동"}</h4>
              {!isEditMode && isCertified && isActive && (
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-0.5" />완료
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <ImportanceStars importance={importance} />
            </div>
          </div>

          {hasMemo && (
            <div className="mt-2 text-xs text-slate-600 flex items-center">
              <FileText className="h-3 w-3 mr-1 text-blue-400 flex-shrink-0" />
              <span className="line-clamp-1">{activity.description}</span>
            </div>
          )}

          {!isEditMode && isActive && !isCertified && onCertifyActivity &&
            (routineData?.isWriter === 1 || routineData == null) && (
            <div className="mt-2 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50 flex items-center gap-1 text-xs py-1 h-7"
                onClick={handleCertify}
              >
                <CheckCircle2 className="h-3 w-3" />
                인증하기
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="border rounded-lg p-4 bg-white shadow-inner">
        <div className="mb-4 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h4 className="text-sm font-semibold text-blue-700">하루 일정 타임라인</h4>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>중요도에 따른 테두리 색상:</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div><span>매우 높음</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded-sm"></div><span>높음</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div><span>보통</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div><span>낮음</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div><span>매우 낮음</span></div>
              {isActive && <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div><span>인증 완료</span></div>}
            </div>
          </div>
        </div>

        {!isActive && (
          <div className="p-2 mb-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
            <AlertCircle className="inline-block h-4 w-4 mr-1" />이 루틴이 활성화되지 않았습니다. 루틴을 시작하면 인증 버튼이 표시됩니다.
          </div>
        )}

        <div className="py-2">
          {sortedActivities.map((activity, index) => (
            <TimelineItem
              key={activity.activityIdx ? `a-${activity.activityIdx}` : `temp-${index}`}
              activity={activity}
              isLast={index === sortedActivities.length - 1}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivitiesTimeline;
