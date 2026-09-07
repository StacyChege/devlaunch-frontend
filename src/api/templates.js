import axiosInstance from './axiosInstance';

// Fetches the public template gallery — no auth required.
// Any filter set to 'ALL' / empty is omitted so the backend returns
// everything instead of filtering on a literal "ALL".
export const getTemplates = ({ category, techStack, pricing, search } = {}) => {
  const params = {};
  if (category && category !== 'ALL') params.category = category;
  if (techStack && techStack !== 'ALL') params.tech_stack = techStack;
  if (pricing && pricing !== 'ALL') params.pricing = pricing;
  if (search && search.trim()) params.search = search.trim();
  return axiosInstance.get('/templates/', { params });
};

export const getTemplate = (slug) => axiosInstance.get(`/templates/${slug}/`);
