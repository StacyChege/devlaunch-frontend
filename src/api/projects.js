import axiosInstance from './axiosInstance';

export const getProjects = async () => {
    return axiosInstance.get('/projects/stats/')
}