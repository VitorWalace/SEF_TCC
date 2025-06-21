// File: frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // Importamos nossa instância do axios

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Adicionamos um estado de loading para evitar "piscadas" na tela
  const [loading, setLoading] = useState(true);

  // 1. ESTE useEffect RODA UMA VEZ QUANDO A APLICAÇÃO CARREGA
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      // Se encontramos dados salvos, restauramos a sessão
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Também reconfiguramos o token para futuras chamadas à API
      api.defaults.headers.authorization = `Bearer ${storedToken}`;
    }
    // Finaliza o carregamento inicial
    setLoading(false); 
  }, []); // O array vazio [] garante que isso só rode uma vez

  // 2. FUNÇÃO DE LOGIN ATUALIZADA
  const login = (userData, token) => {
    // Salva no localStorage para persistir
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);

    // Configura o token para as próximas requisições
    api.defaults.headers.authorization = `Bearer ${token}`;

    // Atualiza o estado do usuário no React
    setUser(userData);
  };

  // 3. FUNÇÃO DE LOGOUT ATUALIZADA
  const logout = () => { 
    // Limpa o localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Limpa o estado e o token da API
    api.defaults.headers.authorization = null;
    setUser(null); 
  };

  const updateUser = (newUserData) => {
    setUser(prevUser => {
      const updatedUser = {...prevUser, ...newUserData};
      // Garante que o localStorage também seja atualizado se o perfil for editado
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // Não renderiza nada enquanto verifica a sessão, para evitar a "piscada" para a tela de login
  if (loading) {
    return <div>Carregando sessão...</div>;
  }

  const value = { user, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}