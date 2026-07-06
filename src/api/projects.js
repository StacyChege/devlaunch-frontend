import axiosInstance from './axiosInstance';

export const getProjectStats = async () => // Fetches the collection index of all existing workplaces belonging to the authenticated user.
     axiosInstance.get('/projects/stats/');

export const getProjects = async () =>  // Fetches the collection index of all existing workplaces belonging to the authenticated user.
        axiosInstance.get('/projects/');

export const createProject = (templateId) => // Creates a new workplace based on the provided template ID.
    axiosInstance.post('/projects/', { template_id: templateId });

export const getProject = (projectId) => // Fetches the details of a specific workplace based on the provided project ID.
    axiosInstance.get(`/projects/${projectId}/`);