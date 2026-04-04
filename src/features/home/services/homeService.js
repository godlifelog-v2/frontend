import axiosInstance from '@/shared/api/axiosInstance';

export const fetchLatestPlans = async () => {
  const response = await axiosInstance.get('/list/plan/latest');
  return response.data;
};

export const fetchLatestChallenges = async () => {
  const response = await axiosInstance.get('/challenges/latest');
  return response.data;
};

export const fetchChallengeCategories = async () => {
  const response = await axiosInstance.get('/categories/challenge');
  return response.data;
};

export const fetchMyPlans = async () => {
  const response = await axiosInstance.get('/list/auth/myPlans');
  return response.data;
};
