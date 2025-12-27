import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If adminOnly is true, check if user is admin
  if (adminOnly) {
    // You'll need to fetch user role from your database
    // This is a placeholder - implement based on your user data
    const isAdmin = user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.com');
    if (!isAdmin) {
      return <Navigate to="/blog" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;