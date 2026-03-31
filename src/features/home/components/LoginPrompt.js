import { BookOpen, LogIn } from 'lucide-react';

const LoginPrompt = ({ onLoginClick }) => (
  <div className="text-center py-8 bg-white rounded-xl shadow-lg border border-gray-100">
    <div className="mb-4">
      <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500 mb-2">나만의 루틴을 관리하려면</p>
      <p className="text-gray-600 font-medium">로그인이 필요합니다</p>
    </div>
    <div className="flex justify-center space-x-3">
      <button
        onClick={onLoginClick}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <LogIn size={16} />
        <span>로그인</span>
      </button>
    </div>
  </div>
);

export default LoginPrompt;
