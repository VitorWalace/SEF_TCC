// File: frontend/src/pages/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function AdminRoute({ children }) {
  const { user } = useAuth();

  // Se não há usuário ou se o usuário não é admin, redireciona para a home
  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default AdminRoute;