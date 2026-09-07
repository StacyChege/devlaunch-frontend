import axiosInstance from './axiosInstance';

// These functions handle the HTTP calls only.
// State management after the call lives in AuthContext, not here.

export const registerUser = (name, email, password, confirmPassword) =>
  axiosInstance.post('/auth/register/', {
    full_name: name,
    email,
    password,
    confirm_password: confirmPassword,
  });

export const loginUser = (email, password) =>
  axiosInstance.post('/auth/login/', { email, password });

// Called on app load to verify a stored token is still valid.
export const fetchMe = () => axiosInstance.get('/auth/me/');

export const updateProfile = (fullName) =>
  axiosInstance.patch('/auth/me/', { full_name: fullName });

export const changePassword = (currentPassword, newPassword) =>
  axiosInstance.post('/auth/change-password/', {
    current_password: currentPassword,
    new_password: newPassword,
  });

// Confirms the address from the emailed link. Returns auth tokens on success,
// so the user lands on the dashboard already signed in.
export const verifyEmail = (token) =>
  axiosInstance.post('/auth/verify-email/', { token });

export const resendVerification = (email) =>
  axiosInstance.post('/auth/resend-verification/', { email });

export const requestPasswordReset = (email) =>
  axiosInstance.post('/auth/password-reset/', { email });

export const confirmPasswordReset = (uid, token, newPassword) =>
  axiosInstance.post('/auth/password-reset/confirm/', {
    uid,
    token,
    new_password: newPassword,
  });
