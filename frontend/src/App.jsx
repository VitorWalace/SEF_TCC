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
import MyCourses from './pages/MyCourses.jsx';
import CreateCourse from './pages/CreateCourse.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

import ProtectedRoute from './pages/ProtectedRoute.jsx';
import AdminRoute from './pages/AdminRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/explorar" element={<ProtectedRoute><Explorar /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/perfil/:userId" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/chat/:recipientId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
        <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
        
        <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route path="/create-course" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path="/edit-course/:courseId" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />

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