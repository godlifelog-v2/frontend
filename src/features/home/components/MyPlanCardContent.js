import { Flame, BookOpen, Clock, Calendar } from 'lucide-react';

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

const MyPlanCardContent = ({ myplan, onClick }) => (
  <div
    className="cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
    onClick={() => onClick && onClick(myplan)}
  >
    {myplan.myPlanInfos.fireState && (
      <div className="absolute top-4 right-4">
        <Flame size={20} className="text-orange-500" />
      </div>
    )}

    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            myplan.myPlanInfos.isActive ? 'bg-green-100' : 'bg-gray-100'
          }`}
        >
          <BookOpen
            size={20}
            className={myplan.myPlanInfos.isActive ? 'text-green-600' : 'text-gray-500'}
          />
        </div>
        <h3 className="font-bold text-lg text-gray-800" title={myplan.myPlanInfos.planTitle}>
          {truncateTitle(myplan.myPlanInfos.planTitle)}
        </h3>
      </div>
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">상태</span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            myplan.myPlanInfos.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {myplan.myPlanInfos.isActive ? '활성' : '비활성'}
        </span>
      </div>

      {myplan.myPlanInfos.repeatDays && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">반복</span>
          <span className="text-sm text-gray-700">
            {formatRepeatDays(myplan.myPlanInfos.repeatDays)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">기간</span>
        <div className="flex items-center space-x-1">
          <Clock size={14} className="text-gray-500" />
          <span className="text-sm text-gray-700">{myplan.myPlanInfos.endTo}일</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">경험치</span>
        <span className="text-sm font-semibold text-blue-600">{myplan.myPlanInfos.certExp} XP</span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">종료일</span>
      <div className="flex items-center space-x-1 text-sm text-gray-700">
        <Calendar size={14} />
        <span>{formatDate(myplan.myPlanInfos.planSubEnd)}</span>
      </div>
    </div>
  </div>
);

export default MyPlanCardContent;
