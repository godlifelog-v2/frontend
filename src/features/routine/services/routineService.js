import axiosInstance from "@/shared/api/axiosInstance";

// === 목록 ===

export const getPublicRoutineList = async (params) => {
  const response = await axiosInstance.get("/list/plan/default", { params });
  return response.data;
};

export const getMyRoutineList = async () => {
  const response = await axiosInstance.get("/list/auth/myPlans");
  return response.data;
};

// === 상세 ===

export const getRoutineDetail = async (planIdx) => {
  const response = await axiosInstance.get(`/plan/detail/${planIdx}`);
  return response.data;
};

export const checkLikeStatus = async (planIdx) => {
  const response = await axiosInstance.get(`/plan/checkLike/${planIdx}`);
  return response.data;
};

// === 생성 / 수정 / 삭제 ===

export const createRoutine = async (routineData) => {
  const response = await axiosInstance.post("/plan/auth/write", routineData);
  return response.data;
};

export const updateRoutine = async (routineData) => {
  const response = await axiosInstance.patch("/plan/auth/modify", routineData);
  return response.data;
};

export const deleteRoutine = async (planIdx) => {
  const response = await axiosInstance.patch(`/plan/auth/delete/${planIdx}`, {});
  return response.data;
};

// === 루틴 액션 ===

export const toggleRoutineActive = async (data) => {
  const response = await axiosInstance.patch("/plan/auth/stopNgo", data);
  return response.data;
};

export const completeRoutineEarly = async (planIdx) => {
  const response = await axiosInstance.patch(`/plan/auth/earlyComplete/${planIdx}`);
  return response.data;
};

export const certifyActivity = async (certData) => {
  const response = await axiosInstance.post("/verify/auth/routine", certData);
  return response.data;
};

// === 좋아요 ===

export const likeRoutine = async (planIdx, data) => {
  const response = await axiosInstance.post(`/plan/auth/likePlan/${planIdx}`, data);
  return response.data;
};

export const unlikeRoutine = async (planIdx) => {
  const response = await axiosInstance.delete(`/plan/auth/unLikePlan/${planIdx}`);
  return response.data;
};

// === 리뷰 ===

export const addReview = async (reviewData) => {
  const response = await axiosInstance.patch("/plan/auth/addReview", reviewData);
  return response.data;
};

export const getReviews = async (planIdx) => {
  const response = await axiosInstance.get(`/plan/reviews/${planIdx}`);
  return response.data;
};

// === 카테고리 ===

export const getJobCategories = async () => {
  const response = await axiosInstance.get("/categories/job");
  return response.data;
};

export const getTargetCategories = async () => {
  const response = await axiosInstance.get("/categories/target");
  return response.data;
};

export const getIconCategories = async () => {
  const response = await axiosInstance.get("/categories/icon");
  return response.data;
};
