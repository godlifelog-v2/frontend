import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Lock, Edit, Trash2, AlertCircle } from "lucide-react";

import RoutineForm from "../components/form/RoutineForm";
import RoutineHeader from "../components/detail/RoutineHeader";
import RoutineStats from "../components/detail/RoutineStats";
import ReviewSection from "../components/detail/ReviewSection";
import FloatingActionButton from "../components/detail/FloatingActionButton";
import { useRoutineDetail } from "../hooks/useRoutineDetail";

export default function RoutineDetailPage() {
  const { planIdx } = useParams();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    routineData,
    isLoading,
    error,
    isPrivateMessage,
    certifiedActivities,
    certificationStreak,
    setNewReview,
    isSubmittingReview,
    handleSubmitReview,
    formatReviewDate,
    handleActivityCertification,
    handleRoutineAction,
    handleLike,
    handleUnlike,
    handleDeleteRoutine,
    handleSaveChanges,
    getStatusBadgeStyle,
    getStatusText,
  } = useRoutineDetail(planIdx, navigate);

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  if (isPrivateMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 flex justify-center items-center">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Lock className="w-16 h-16 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-800">비공개 루틴입니다</h1>
            <p className="text-gray-600">이 루틴은 작성자만 볼 수 있는 비공개 루틴입니다.</p>
            <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!routineData) {
    return <div className="flex justify-center items-center min-h-screen">루틴 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8 relative">
      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold">루틴 삭제 확인</h3>
            </div>
            <p className="mb-6">이 루틴을 정말 삭제하시겠습니까? 삭제된 루틴은 복구할 수 없습니다.</p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="hover:bg-gray-100">취소</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDeleteRoutine();
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 relative">
        {routineData?.isWriter === 1 && !routineData.isCompleted && !isEditMode && (
          <div className="flex justify-end mb-4 space-x-3">
            <Button onClick={() => setShowDeleteConfirm(true)} className="bg-red-500 hover:bg-red-600" variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />삭제하기
            </Button>
            <Button onClick={toggleEditMode} className="bg-blue-500 hover:bg-blue-600" variant="default">
              <Edit className="w-4 h-4 mr-2" />수정하기
            </Button>
          </div>
        )}

        <Card className="overflow-hidden shadow-lg">
          <div className="relative">
            <RoutineHeader
              routineData={routineData}
              getStatusBadgeStyle={getStatusBadgeStyle}
              getStatusText={getStatusText}
            />
            <RoutineStats
              routineData={routineData}
              certificationStreak={certificationStreak}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
            />
          </div>

          <CardContent className="p-8 pt-16">
            <div className="space-y-6 mt-4">
              <RoutineForm
                isReadOnly={!isEditMode}
                routineData={routineData}
                isActive={!!routineData.isActive}
                certifiedActivities={certifiedActivities}
                onCertifyActivity={handleActivityCertification}
                onSubmit={isEditMode ? (formData) => handleSaveChanges(formData, () => setIsEditMode(false)) : undefined}
                isEditMode={isEditMode}
              />
            </div>

            {!isEditMode && (
              <ReviewSection
                reviews={routineData.review}
                handleSubmitReview={(reviewText) => {
                  setNewReview(reviewText);
                  handleSubmitReview(reviewText);
                }}
                isSubmittingReview={isSubmittingReview}
                formatReviewDate={formatReviewDate}
              />
            )}

            {!isEditMode && (
              <div className="flex gap-3">
                <Button type="button" onClick={() => navigate(-1)} variant="outline" className="flex-1">
                  목록으로 돌아가기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!isEditMode && (
          <FloatingActionButton routineData={routineData} handleRoutineAction={handleRoutineAction} />
        )}
      </div>
    </div>
  );
}
