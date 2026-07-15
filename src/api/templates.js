import axiosInstance from './axiosInstance';

// Fetches the public template gallery — no auth required
// Omits the category param when "ALL" is selected so the backend
// returns everything instead of filtering for a category called "ALL"
export const getTemplates = (category) => {
  const params = category && category !== 'ALL' ? { category } : {};
  return axiosInstance.get('/templates/', { params });
};