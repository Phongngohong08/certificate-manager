import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3002';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedUser && storedUserType) {
      setCurrentUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials, type) => {
    try {
      setLoading(true);
      const url = `${API_URL}/${type}/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setCurrentUser(data.user);
      setUserType(type);
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('userType', type);
      
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
      const url = `${API_URL}/${type}/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
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
      const url = `${API_URL}/${userType}/logout`;
      await fetch(url, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear user data
      setCurrentUser(null);
      setUserType(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userType');
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
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
