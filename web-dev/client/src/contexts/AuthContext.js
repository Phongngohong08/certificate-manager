import React, { createContext, useState, useContext, useEffect } from 'react';

const API_URL = 'http://localhost:3002/api'; // Adjust the API URL as needed

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
      const url = `${API_URL}/${type}/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      console.log('response đây', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
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
      if (userType) {
        const url = `${API_URL}/${userType}/logout`;
        await fetch(url, {
          method: 'POST',
          credentials: 'include',
        });
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
