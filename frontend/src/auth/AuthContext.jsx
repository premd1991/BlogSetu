import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check user session on mount
  const checkAuthStatus = async () => {
    setLoading(true);
    const response = await apiFetch('/user/me');
    if (response.success && response.data.user) {
      setUser(response.data.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setError(null);
    const response = await apiFetch('/user/login', {
      method: 'POST',
      body: { email, password }
    });

    if (response.success && response.data.user) {
      setUser(response.data.user);
      return { success: true, message: response.message };
    } else {
      setError(response.message);
      return { success: false, message: response.message };
    }
  };

  const register = async (fullName, email, password, gender) => {
    setError(null);
    const response = await apiFetch('/user/register', {
      method: 'POST',
      body: { fullName, email, password, gender }
    });

    return {
      success: response.success,
      message: response.message
    };
  };

  const logout = async () => {
    const response = await apiFetch('/user/logout');
    if (response.success) {
      setUser(null);
    }
    return {
      success: response.success,
      message: response.message
    };
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
