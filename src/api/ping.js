import axiosInstance from './axiosInstance';

export const pingBackend = async () => {
    const response = await axiosInstance.get('/ping/');
    return response.data;
};