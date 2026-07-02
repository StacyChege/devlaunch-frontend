import axiosInstance from './axiosInstance';

export const getProjectStats = async () => {
    return axiosInstance.get('/projects/stats/')
}