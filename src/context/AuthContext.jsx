import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextInstance'; 
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export function AuthProvider({ children }) {
  // Global State Variables
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Re-hydrate User Session on Page Mount / Refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/auth/me/');
        setUser(response.data.user); 
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Session restoration failed:", error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Native Auth Actions Exposed to Subcomponents
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login/`, {
        email,
        password,
      });

      const { access, refresh, user: userData } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      setAccessToken(access);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register/`, {
        name,
        email,
        password,
      });
      
      const { access, refresh, user: userData } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      setAccessToken(access);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;