import axiosInstance from "@/shared/api/axiosInstance";

// === 계정 ===

export const fetchMyAccount = async () => {
  const response = await axiosInstance.get("/myPage/auth/myAccount");
  return response.data;
};

export const updateNickname = async (userNick) => {
  const response = await axiosInstance.patch(
    "/myPage/auth/myAccount/modify/nickName",
    { userNick }
  );
  return response.data;
};

export const updateEmail = async (userEmail) => {
  const response = await axiosInstance.patch(
    "/myPage/auth/myAccount/modify/email",
    { userEmail }
  );
  return response.data;
};

export const updatePersonalInfo = async (data) => {
  const response = await axiosInstance.patch(
    "/myPage/auth/myAccount/modify/personal",
    data
  );
  return response.data;
};

export const updateJobTarget = async (data) => {
  const response = await axiosInstance.patch(
    "/myPage/auth/myAccount/modify/job-target",
    data
  );
  return response.data;
};

// === 내 루틴 ===

export const fetchMyRoutineList = async (params) => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", params.page);
  queryParams.append("size", params.size);
  queryParams.append("status", params.status);
  queryParams.append("sort", params.sort);
  queryParams.append("order", params.order);
  if (params.target) queryParams.append("target", params.target);
  if (params.job) queryParams.append("job", params.job);
  if (params.search) queryParams.append("search", params.search);

  const response = await axiosInstance.get(
    `/myPage/auth/list/myPlan?${queryParams.toString()}`
  );
  return response.data;
};

export const deleteRoutines = async (planIdxList) => {
  const response = await axiosInstance.patch(
    "/myPage/auth/delete/plans",
    planIdxList
  );
  return response.data;
};

export const toggleRoutineShared = async (planIdxList) => {
  const response = await axiosInstance.patch(
    "/myPage/auth/switch/isShared?mode=reverse",
    planIdxList
  );
  return response.data;
};

// === 좋아요 루틴 ===

export const fetchMyLikeList = async (params) => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", params.page);
  queryParams.append("size", params.size);
  queryParams.append("order", params.order);
  if (params.target !== null && params.target !== "")
    queryParams.append("target", params.target.toString());
  if (params.job !== null && params.job !== "")
    queryParams.append("job", params.job.toString());
  if (params.search) queryParams.append("search", params.search);

  const response = await axiosInstance.get(
    `/myPage/auth/list/myLike?${queryParams.toString()}`
  );
  return response.data;
};

export const deleteLikes = async (planIndexes) => {
  const response = await axiosInstance.delete(
    `/myPage/auth/delete/likes?planIndexes=${planIndexes}`
  );
  return response.data;
};

// === 보안 ===

export const changePassword = async (data) => {
  const response = await axiosInstance.patch(
    "/myPage/auth/security/change/password",
    data
  );
  return response.data;
};

export const deleteAccount = async (userPw) => {
  const response = await axiosInstance.patch("/myPage/auth/accountDeletion", {
    userPw,
  });
  return response.data;
};

// === 카테고리 ===

export const fetchJobCategories = async () => {
  const response = await axiosInstance.get("/categories/job");
  return response.data;
};

export const fetchTargetCategories = async () => {
  const response = await axiosInstance.get("/categories/target");
  return response.data;
};

// === 이메일 인증 ===

export const sendVerificationEmail = async (userEmail) => {
  const response = await axiosInstance.post(
    "/verify/emails/send/verification-requests",
    { userEmail }
  );
  return response.data;
};

export const verifyEmailCode = async (userEmail, code) => {
  const response = await axiosInstance.post(
    `/verify/emails/verifications?code=${code}`,
    { userEmail }
  );
  return response.data;
};

// === 검색 기록 ===

export const fetchSearchHistory = async (type) => {
  const response = await axiosInstance.get(`/search/log?type=${type}`);
  return response.data;
};

export const saveSearchHistory = async (keyword, type) => {
  const response = await axiosInstance.get(
    `/search/log?keyword=${encodeURIComponent(keyword)}&type=${type}`
  );
  return response.data;
};

export const deleteSearchHistoryItem = async (logIdx) => {
  const response = await axiosInstance.patch(`/search/log/${logIdx}`, {});
  return response.data;
};
