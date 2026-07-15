/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchMe } from '../api/auth';

// Central auth context — wraps the whole app so any component can
// access the logged-in user without passing props down manually
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Starts true so ProtectedRoute waits for the token check before
  // deciding to redirect. Prevents logged-in users being kicked to /login on refresh
  const [isLoading, setIsLoading] = useState(true);

  // Runs once on app load — checks if a token is already saved in the
  // browser and verifies it with the backend before rendering any pages
  useEffect(() => {
    const rehydrate = async () => {
      const storedToken = localStorage.getItem('accessToken');

      // No token saved means the user has never logged in or already logged out
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify the stored token is still valid by calling /auth/me/
        // The Axios interceptor attaches the token automatically
        const response = await fetchMe();
        setUser(response.data);
        setAccessToken(storedToken);
        setIsAuthenticated(true);
      } catch {
        // Token is expired or invalid — clear everything and start fresh
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        // Always set loading to false when the check is done, success or fail
        setIsLoading(false);
      }
    };

    rehydrate();
  }, []);

  // Called from LoginPage — saves tokens to localStorage so they
  // survive a page refresh, then updates the context state
  const login = async (email, password) => {
    const response = await loginUser(email, password);
    const { user, access, refresh } = response.data;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    setUser(user);
    setAccessToken(access);
    setIsAuthenticated(true);
  };

  // JWT is stateless so logout just means discarding the tokens —
  // no API call needed. The access token will expire on its own
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  // Called from RegisterPage — does not log the user in automatically
  // because email verification is required first
  const register = async (name, email, password, confirmPassword) => {
    await registerUser(name, email, password, confirmPassword);
  };

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}