import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Garante que o caminho para o contexto está correto

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Se não houver utilizador autenticado, redireciona para a página de autenticação
    return <Navigate to="/login" replace />;
  }

  // Se houver um utilizador, renderiza o componente filho (a página protegida)
  return children;
}

export default ProtectedRoute;
