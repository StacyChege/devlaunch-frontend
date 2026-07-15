import axiosInstance from './axiosInstance';

export const getProjectStats = () =>
  axiosInstance.get('/projects/stats/');

export const getProjects = () =>
  axiosInstance.get('/projects/');

// template_id tells the backend which template to clone for the new project
export const createProject = (templateId) =>
  axiosInstance.post('/projects/', { template_id: templateId });

export const getProject = (id) =>
  axiosInstance.get(`/projects/${id}/`);

// PATCH sends only the changed fields — the backend merges them
export const updateProject = (id, data) =>
  axiosInstance.patch(`/projects/${id}/`, data);

export const deleteProject = (id) =>
  axiosInstance.delete(`/projects/${id}/`);

// Logo upload uses FormData because files cannot be sent as JSON
export const uploadProjectLogo = (id, file) => {
  const formData = new FormData();
  formData.append('logo', file);
  return axiosInstance.post(`/projects/${id}/logo/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};