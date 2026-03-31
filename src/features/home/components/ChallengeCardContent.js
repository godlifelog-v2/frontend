import { Users, Calendar, Tag } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ko-KR');
};

const truncateTitle = (title, maxLength = 10) => {
  if (!title) return '';
  return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
};

const ChallengeCardContent = ({ challenge, onClick, getCategoryName }) => (
  <div
    className="cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
    onClick={() => onClick && onClick(challenge)}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <Users size={20} className="text-white" />
        </div>
        <h3 className="font-bold text-lg text-gray-800" title={challenge.challTitle}>
          {truncateTitle(challenge.challTitle)}
        </h3>
      </div>
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Tag size={14} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            {getCategoryName ? getCategoryName(challenge.challCategoryIdx) : challenge.challCategoryIdx}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">참가자</span>
        <span className="text-sm font-semibold text-blue-600">
          {challenge.currentParticipants} / {challenge.maxParticipants}명
        </span>
      </div>

      {challenge.challEndTime && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">종료일</span>
          <div className="flex items-center space-x-1 text-sm text-gray-700">
            <Calendar size={14} />
            <span>{formatDate(challenge.challEndTime)}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ChallengeCardContent;
