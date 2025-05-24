import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ userTypeRequired }) => {
  const { currentUser, userType, loading } = useAuth();
  
  // If still loading auth state, show nothing
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Check if user is authenticated and has correct user type (if required)
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (userTypeRequired && userType !== userTypeRequired) {
    // Redirect to appropriate dashboard if logged in as different user type
    if (userType === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (userType === 'university') {
      return <Navigate to="/university/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and has correct user type, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
