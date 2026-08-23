import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/index';



const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set default authorization header if token exists
  if (token) {
    
  } else {
      }

  // Load user data on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Store token in axios headers
          
          
          // Fetch full profile from server to ensure fresh data
          const response = await api.get(`/api/users/profile`);
          const fullUser = response.data;
          
          localStorage.setItem('user', JSON.stringify(fullUser));
          setUser(fullUser);
        } catch (err) {
          console.error("Failed to load user profile from server:", err);
          // Fallback to local storage if offline/error but token hasn't expired
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post(`/api/users/login`, { email, password });
      
      const { token: receivedToken } = response.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      
      
      // Fetch the full authenticated user profile immediately
      const profileRes = await api.get(`/api/users/profile`);
      const fullUser = profileRes.data;
      
      localStorage.setItem('user', JSON.stringify(fullUser));
      setUser(fullUser);
      
      return { success: true, user: fullUser };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await api.post(`/api/users/register`, { name, email, password });
      
      return { success: true, data: response.data };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Update Profile handler
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const response = await api.put(`/api/users/profile`, profileData);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Profile update failed.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get(`/api/users/profile`);
      const fullUser = response.data;
      localStorage.setItem('user', JSON.stringify(fullUser));
      setUser(fullUser);
      return fullUser;
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, updateProfile, refreshUser, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
