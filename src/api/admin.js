import axiosInstance from './axiosInstance';

// All endpoints require the ADMIN role (enforced server-side).

export const getAdminOverview = () => axiosInstance.get('/admin/overview/');

export const getAdminUsers = ({ search, role } = {}) => {
  const params = {};
  if (search && search.trim()) params.search = search.trim();
  if (role && role !== 'ALL') params.role = role;
  return axiosInstance.get('/admin/users/', { params });
};

export const setUserActive = (id, isActive) =>
  axiosInstance.post(`/admin/users/${id}/set-active/`, { is_active: isActive });

export const getAdminTemplates = () => axiosInstance.get('/admin/templates/');

export const createAdminTemplate = (data) =>
  axiosInstance.post('/admin/templates/', data);

export const updateAdminTemplate = (id, data) =>
  axiosInstance.patch(`/admin/templates/${id}/`, data);

export const deleteAdminTemplate = (id) =>
  axiosInstance.delete(`/admin/templates/${id}/`);
