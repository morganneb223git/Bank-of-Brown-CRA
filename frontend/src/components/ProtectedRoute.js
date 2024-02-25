// Protected Route ./src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;