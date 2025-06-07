import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useSelector(state => state.auth);

  if (auth.loading) {
    return <div>Cargando...</div>;
  }

  if (!auth.token || !allowedRoles.includes(auth.role)) {
    // No está logueado o rol no autorizado
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;