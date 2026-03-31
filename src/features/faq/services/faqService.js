import axiosInstance from "@/shared/api/axiosInstance";

export const getFaqList = async () => {
  const res = await axiosInstance.get("/faq");
  const data = res.data;
  if (data?.message && Array.isArray(data.message)) return data.message;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getFaqDetail = async (faqIdx) => {
  const res = await axiosInstance.get(`/faq/${faqIdx}`);
  return res.data?.message ?? res.data;
};

export const createFaq = async (data) => {
  await axiosInstance.post("/faq/admin/write", data);
};

export const updateFaq = async (faqIdx, data) => {
  await axiosInstance.patch(`/faq/admin/${faqIdx}`, data);
};

export const deleteFaq = async (faqIdx) => {
  await axiosInstance.delete(`/faq/admin/${faqIdx}`);
};
