import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../config/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    // Initialize state from localStorage
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('currentUser');
      return null;
    }
  });
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || null;
  });

  useEffect(() => {
    // Update localStorage when currentUser changes
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    // Update localStorage when userType changes
    if (userType) {
      localStorage.setItem('userType', userType);
    } else {
      localStorage.removeItem('userType');
    }
  }, [userType]);
  const login = async (credentials, type) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(`${type}/login`, credentials);
      
      // Handle response data structure based on your API response
      let user;
      if (type === 'university' && data.university) {
        user = {
          ...data.university,
          token: data.token
        };
      } else if (type === 'student' && data.student) {
        user = {
          ...data.student,
          token: data.token
        };
      } else {
        user = data.user || data;
      }
      
      setCurrentUser(user);
      setUserType(type);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, type) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(`${type}/register`, userData);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      if (userType) {
        await axiosInstance.post(`${userType}/logout`);
      }
      
      // Clear user data
      setCurrentUser(null);
      setUserType(null);
      
      // Navigate will be handled by the component calling logout
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server request fails
      setCurrentUser(null);
      setUserType(null);
    }
  };

  const value = {
    currentUser,
    userType,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
