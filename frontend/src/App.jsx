// File: frontend/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import EsqueceuSenha from './pages/EsqueceuSenha.jsx';
import Home from './pages/Home.jsx';
import Explorar from './pages/Explorar.jsx';
import Chat from './pages/Chat.jsx';
import Perfil from './pages/Perfil.jsx';
import Notificacoes from './pages/Notificacoes.jsx';
import Agenda from './pages/Agenda.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx'; // Importa o novo painel
import AdminRoute from './pages/AdminRoute.jsx'; // Importa a nova rota protegida

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
        <Route path="/" element={<Login />} />

        {/* Rotas Protegidas para Usuários Normais */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/explorar" element={<ProtectedRoute><Explorar /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/perfil/:userId" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
        <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />

        {/* Rota Protegida para Administradores */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;