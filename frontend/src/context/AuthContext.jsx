// File: frontend/src/context/AuthContext.jsx (Versão Final e Correta)

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Efeito que carrega o usuário do localStorage ao abrir o site
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.authorization = `Bearer ${storedToken}`;
    }
  }, []);

  // Função de login que guarda os dados do usuário (incluindo a role)
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    api.defaults.headers.authorization = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => { 
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    api.defaults.headers.authorization = null;
    setUser(null); 
  };

  const updateUser = (newUserData) => {
    setUser(prevUser => {
      const updatedUser = {...prevUser, ...newUserData};
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = { user, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}