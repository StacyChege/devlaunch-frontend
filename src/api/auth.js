import axiosInstance from './axiosInstance';

// These functions handle the HTTP calls only.
// State management after the call lives in AuthContext, not here

export const registerUser = (name, email, password, confirmPassword) =>
  axiosInstance.post('/auth/register/', {
    full_name: name,
    email,
    password,
    confirm_password: confirmPassword,
  });

export const loginUser = (email, password) =>
  axiosInstance.post('/auth/login/', { email, password });

// Called on app load to verify a stored token is still valid
export const fetchMe = () =>
  axiosInstance.get('/auth/me/');