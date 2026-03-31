import { useState, useEffect, useCallback } from "react";
import {
  getRoutineDetail,
  checkLikeStatus,
  certifyActivity,
  toggleRoutineActive,
  completeRoutineEarly,
  addReview,
  likeRoutine,
  unlikeRoutine,
  deleteRoutine,
  updateRoutine,
} from "../services/routineService";

export const useRoutineDetail = (planIdx, navigate) => {
  const [routineData, setRoutineData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrivateMessage, setIsPrivateMessage] = useState(false);

  const [certifiedActivities, setCertifiedActivities] = useState({});
  const [certificationStreak, setCertificationStreak] = useState(0);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const [newReview, setNewReview] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchRoutineData = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const userInfoString = localStorage.getItem("userInfo");

      const data = await getRoutineDetail(planIdx);
      const routine = data.message;

      // 비공개 루틴 권한 체크
      if (!routine.isShared) {
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
        const currentUserIdx = userInfo ? userInfo.userIdx : null;

        if (parseInt(currentUserIdx) !== routine.userIdx) {
          setIsPrivateMessage(true);
          setIsLoading(false);
          return;
        }
      }

      // 추천 상태 조회
      if (token) {
        try {
          const likeData = await checkLikeStatus(planIdx);
          if (likeData !== null) {
            routine.isLiked = likeData.isLiked || (typeof likeData.message === "boolean" ? likeData.message : false);
            if (likeData.likeCount !== undefined) {
              routine.likeCount = likeData.likeCount;
            }
          }
        } catch {
          // 좋아요 상태 조회 실패 시 무시
        }
      }

      setRoutineData(routine);
      setError(null);
    } catch (err) {
      console.error("루틴 데이터 가져오기 실패:", err);
      setError("루틴 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [planIdx]);

  useEffect(() => {
    if (planIdx) {
      fetchRoutineData();
    }
  }, [planIdx, fetchRoutineData]);

  // 활동 인증
  const handleActivityCertification = async (activityIdx) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userIdx = userInfo.userIdx || 1;

      const certData = {
        planIdx: parseInt(planIdx),
        activityIdx,
        userIdx: parseInt(userIdx),
      };

      const response = await certifyActivity(certData);

      if (response.success || response.status === "success" || response.code === 200) {
        const updatedCertifications = { ...certifiedActivities, [activityIdx]: true };
        setCertifiedActivities(updatedCertifications);

        const allActivities = routineData?.activities || [];
        if (allActivities.length > 0) {
          const allCertified = allActivities.every(
            (activity) => updatedCertifications[activity.activityIdx] === true
          );
          if (allCertified) {
            setCertificationStreak((prev) => prev + 1);
            setShowCompletionMessage(true);
            setTimeout(() => setShowCompletionMessage(false), 3000);
          }
        }

        await fetchRoutineData();
      } else {
        alert(response.message || "인증에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("활동 인증 실패:", err);
      alert(
        err.response?.data?.message
          ? `인증에 실패했습니다: ${err.response.data.message}`
          : "인증에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  // 루틴 시작/완료
  const handleRoutineAction = async (action) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userIdx = parseInt(userInfo.userIdx || 1);

      setRoutineData((prev) => ({
        ...prev,
        isActive: action === "start",
        isCompleted: action === "complete",
      }));

      let response;
      if (action === "start") {
        response = await toggleRoutineActive({ planIdx: parseInt(planIdx), userIdx, isActive: 1 });
      } else {
        response = await completeRoutineEarly(parseInt(planIdx));
      }

      if (response.success) {
        alert(action === "start" ? "루틴을 시작했습니다!" : "루틴을 끝냈습니다!");
        await fetchRoutineData();
      }
    } catch (err) {
      console.error(`루틴 ${action === "start" ? "시작" : "끝내기"} 실패:`, err);
      setRoutineData((prev) => ({
        ...prev,
        isActive: action !== "start",
        isCompleted: action !== "complete",
      }));
      alert(
        err.response?.data?.message
          ? `루틴을 ${action === "start" ? "시작" : "끝내기"}하는데 실패했습니다.\n사유: ${err.response.data.message}`
          : `루틴을 ${action === "start" ? "시작" : "끝내기"}하는데 실패했습니다.`
      );
    }
  };

  // 리뷰 제출
  const handleSubmitReview = async (reviewText) => {
    const reviewContent = reviewText || newReview;
    if (!reviewContent.trim()) return;

    setIsSubmittingReview(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userIdx = userInfo.userIdx || 1;

      const reviewData = {
        planIdx: parseInt(planIdx),
        userIdx: parseInt(userIdx),
        review: reviewContent,
        isCompleted: 1,
        isDeleted: 0,
      };

      const response = await addReview(reviewData);

      if (response.status === "success" || response.code === 200) {
        setNewReview("");
        alert("리뷰가 성공적으로 등록되었습니다.");
        await fetchRoutineData();
      }
    } catch (err) {
      console.error("리뷰 등록 실패:", err);
      alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 좋아요
  const handleLike = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/user/login");
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const userIdx = userInfo.userIdx || 1;

      const response = await likeRoutine(planIdx, { userIdx: parseInt(userIdx) });

      if (response.success || response.code === 200) {
        await fetchRoutineData();
      } else {
        alert(response.message || "추천 처리에 실패했습니다.");
      }
    } catch (err) {
      console.error("추천 실패:", err);
      alert("추천 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 좋아요 취소
  const handleUnlike = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/user/login");
      return;
    }

    try {
      const response = await unlikeRoutine(planIdx);

      if (response.success || response.code === 200) {
        await fetchRoutineData();
      } else {
        alert(response.message || "추천 취소 처리에 실패했습니다.");
      }
    } catch (err) {
      console.error("추천 취소 실패:", err);
      alert("추천 취소 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 루틴 삭제
  const handleDeleteRoutine = async () => {
    try {
      await deleteRoutine(planIdx);
      alert("루틴이 성공적으로 삭제되었습니다!");
      navigate("/routine/mylist");
    } catch (err) {
      console.error("루틴 삭제 실패:", err);
      alert(
        err.response?.data?.message
          ? `루틴 삭제 실패: ${err.response.data.message}`
          : err.request
          ? "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
          : "요청 중 오류가 발생했습니다."
      );
    }
  };

  // 루틴 수정
  const handleSaveChanges = async (formData, onSuccess) => {
    try {
      const requestData = { ...formData, planIdx };
      await updateRoutine(requestData);
      alert("루틴이 성공적으로 수정되었습니다!");
      if (onSuccess) onSuccess();
      await fetchRoutineData();
    } catch (err) {
      console.error("루틴 수정 실패:", err);
      alert(
        err.response?.data?.message
          ? `루틴 수정 실패: ${err.response.data.message}`
          : err.request
          ? "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
          : "요청 중 오류가 발생했습니다."
      );
    }
  };

  const formatReviewDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  const getStatusBadgeStyle = () => {
    if (!routineData) return "bg-gray-200 text-gray-700";
    if (routineData.isCompleted) return "bg-green-500 text-white";
    if (routineData.isActive) return "bg-blue-500 text-white";
    return "bg-gray-200 text-gray-700";
  };

  const getStatusText = () => {
    if (!routineData) return "준비 상태";
    if (routineData.isCompleted) return "완료된 루틴";
    if (routineData.isActive) return "진행 중";
    return "준비 상태";
  };

  return {
    routineData,
    isLoading,
    error,
    isPrivateMessage,
    certifiedActivities,
    certificationStreak,
    showCompletionMessage,
    newReview,
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
    fetchRoutineData,
  };
};
