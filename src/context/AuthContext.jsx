/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  fetchMe,
  verifyEmail as verifyEmailRequest,
} from '../api/auth';

// Central auth context — wraps the whole app so any component can
// access the logged-in user without passing props down manually.
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Starts true so ProtectedRoute waits for the token check before
  // deciding to redirect. Prevents logged-in users being kicked to /login on refresh.
  const [isLoading, setIsLoading] = useState(true);

  // Runs once on app load — checks if a token is already saved in the
  // browser and verifies it with the backend before rendering any pages.
  useEffect(() => {
    const rehydrate = async () => {
      const storedToken = localStorage.getItem('accessToken');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // The Axios interceptor attaches the token automatically.
        const response = await fetchMe();
        setUser(response.data);
        setAccessToken(storedToken);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    rehydrate();
  }, []);

  // Persists a { user, access, refresh } payload from the backend and
  // flips the app into the authenticated state. Shared by login and
  // email verification (which also signs the user in).
  const applySession = ({ user: nextUser, access, refresh }) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setUser(nextUser);
    setAccessToken(access);
    setIsAuthenticated(true);
  };

  const login = async (email, password) => {
    const response = await loginUser(email, password);
    applySession(response.data);
  };

  // JWT is stateless so logout just means discarding the tokens.
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  // Does not sign the user in — email verification is required first.
  // Returns the response so the caller can show a "check your email" state.
  const register = (name, email, password, confirmPassword) =>
    registerUser(name, email, password, confirmPassword);

  // Confirms the emailed link and signs the user in with the returned tokens.
  const verifyEmail = async (token) => {
    const response = await verifyEmailRequest(token);
    applySession(response.data);
  };

  // Merge a fresh user payload (e.g. after a profile edit) into context
  // so the sidebar/topbar update without a page reload.
  const updateUser = (nextUser) => setUser(nextUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        verifyEmail,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
