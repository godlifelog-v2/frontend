import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useMyAccount } from "../hooks/useMyAccount";
import UserHeader from "../components/UserHeader";
import MyPageTabs from "../components/MyPageTabs";
import RoutineTabContent from "../components/RoutineTabContent";
import LikedRoutineTabContent from "../components/LikedRoutineTabContent";
import MyProfileForm from "../components/MyProfileForm";
import SecuritySettings from "../components/SecuritySettings";
// TODO: QnA 리팩토링 완료 후 @/features/qna에서 import로 변경
import QnAList from "@/components/QnA/QnaList";

export default function MyPage() {
  const navigate = useNavigate();
  const {
    userData,
    setUserData,
    loading,
    error,
    retryCount,
    maxRetryCount,
    activeSideTab,
    setActiveSideTab,
    editing,
    tempData,
    handleEdit,
    handleCancel,
    handleChange,
    handleSave,
    handleRetry,
  } = useMyAccount();

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="w-full flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">사용자 정보를 불러오는 중...</p>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500">
                  재시도 중... ({retryCount}/{maxRetryCount})
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="w-full p-8">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                다시 시도
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="w-full">
          <UserHeader
            userData={userData}
            editing={editing}
            tempData={tempData}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleChange={handleChange}
            handleSave={handleSave}
          />

          <MyPageTabs
            activeSideTab={activeSideTab}
            setActiveSideTab={setActiveSideTab}
          />

          {activeSideTab === "routines" && <RoutineTabContent />}

          {activeSideTab === "likes" && <LikedRoutineTabContent />}

          {activeSideTab === "challenges" && (
            <div className="p-5 text-center">
              <Trophy size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">참여한 챌린지가 없습니다.</p>
              <button
                className="mt-3 text-xs px-3 py-1 bg-blue-600 text-white rounded-lg"
                onClick={() => navigate("/challenges/list")}
              >
                챌린지 참여하기
              </button>
            </div>
          )}

          {activeSideTab === "mypage" && (
            <>
              <MyProfileForm userData={userData} setUserData={setUserData} />
              <div className="pt-3">
                <SecuritySettings />
              </div>
            </>
          )}

          {activeSideTab === "chat" && <QnAList />}
        </div>
      </CardContent>
    </Card>
  );
}
