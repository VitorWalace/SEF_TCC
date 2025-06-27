// File: frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async (userId) => {
      try {
          const response = await api.get(`/api/notifications/${userId}/unread-count`);
          setUnreadCount(parseInt(response.data.unreadCount, 10));
      } catch (error) {
          console.error("Falha ao buscar contagem de notificações", error);
      }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      api.defaults.headers.authorization = `Bearer ${storedToken}`;
      fetchUnreadCount(userData.id);
    }
    setLoading(false); 
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    api.defaults.headers.authorization = `Bearer ${token}`;
    setUser(userData);
    fetchUnreadCount(userData.id);
  };

  const logout = () => { 
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    api.defaults.headers.authorization = null;
    setUser(null);
    setUnreadCount(0);
  };
  
  const updateUser = (newUserData) => {
    setUser(prevUser => {
      const updatedUser = {...prevUser, ...newUserData};
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = { user, login, logout, updateUser, unreadCount, fetchUnreadCount };

  if (loading) {
    return <div>Carregando sessão...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}