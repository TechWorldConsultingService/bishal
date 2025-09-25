import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/shoplogin" replace />;
  }
  return children;
};

export default ProtectedRoute;


