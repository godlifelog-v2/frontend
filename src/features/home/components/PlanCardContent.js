import { Eye, Heart, GitFork, BookOpen, Calendar, Tag } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ko-KR');
};

const formatRepeatDays = (repeatDays) => {
  if (!repeatDays) return '';
  const dayMap = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' };
  try {
    return repeatDays
      .split(',')
      .map((day) => dayMap[day.trim()])
      .filter(Boolean)
      .join(', ');
  } catch {
    return '';
  }
};

const truncateTitle = (title, maxLength = 10) => {
  if (!title) return '';
  return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
};

const PlanCardContent = ({ plan, onClick }) => (
  <div
    className="cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
    onClick={() => onClick && onClick(plan)}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: plan.targetInfos.color + '20' }}
        >
          <BookOpen size={20} style={{ color: plan.targetInfos.color }} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800" title={plan.planInfos.planTitle}>
            {truncateTitle(plan.planInfos.planTitle)}
          </h3>
          <p className="text-sm text-gray-500">{plan.planInfos.userNick}</p>
        </div>
      </div>
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-center space-x-2">
        <Tag size={12} className="text-gray-500" />
        <span className="text-sm" style={{ color: plan.targetInfos.color }}>
          {plan.targetInfos.name}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">추천직업</span>
        <span className="text-sm text-gray-700">{plan.jobDefault.name}</span>
      </div>

      {plan.planInfos?.repeatDays && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">반복요일</span>
          <span className="text-sm text-gray-700">{formatRepeatDays(plan.planInfos.repeatDays)}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">생성일</span>
        <div className="flex items-center space-x-1 text-sm text-gray-700">
          <Calendar size={14} />
          <span>{formatDate(plan.planInfos.planSubDate)}</span>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Eye size={14} />
          <span>{plan.planInfos.viewCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Heart size={14} />
          <span>{plan.planInfos.likeCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <GitFork size={14} />
          <span>{plan.planInfos.forkCount}</span>
        </div>
      </div>
    </div>
  </div>
);

export default PlanCardContent;
