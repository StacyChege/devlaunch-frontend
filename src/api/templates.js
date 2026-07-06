import axiosInstance from './axiosInstance';

export const getTemplates = (category) => {
    const params = category && category !== 'All' ? { category } : {};
    return axiosInstance.get('/templates/', { params });
}; // Fetches the collection index of all available templates, optionally filtered by category.