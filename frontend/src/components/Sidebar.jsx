// File: frontend/src/components/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { 
    HomeIcon, 
    SearchIcon, 
    ChatIcon, 
    BellIcon, 
    UserCircleIcon, 
    LogoutIcon, 
    CalendarIcon,
    BriefcaseIcon, // Para o painel de admin
    BookOpenIcon    // Para "Meus Cursos"
} from './icons';

// Componente para um item de navegação reutilizável
const NavItem = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 my-1 rounded-lg font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg' // Estilo para o link ativo
          : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800' // Estilo para links inativos
      }`
    }
  >
    <Icon className="w-6 h-6 mr-4" />
    <span>{children}</span>
  </NavLink>
);

function Sidebar() {
  const { user, logout } = useAuth(); // Pega o usuário logado do contexto

  return (
    <aside className="h-screen w-64 bg-gray-100 text-gray-800 flex flex-col p-4 border-r border-gray-200">
      {/* Secção do Logo no topo */}
      <div className="px-4 mb-8">
        <Logo />
      </div>

      {/* Navegação principal */}
      <nav className="flex-grow">
        <NavItem to="/home" icon={HomeIcon}>Página Principal</NavItem>
        <NavItem to="/explorar" icon={SearchIcon}>Explorar Cursos</NavItem>
        <NavItem to="/my-courses" icon={BookOpenIcon}>Meus Cursos</NavItem>
        <NavItem to="/chat" icon={ChatIcon}>Chat</NavItem>
        <NavItem to="/notificacoes" icon={BellIcon}>Notificações</NavItem>
        <NavItem to="/agenda" icon={CalendarIcon}>A minha Agenda</NavItem>
        <NavItem to="/perfil" icon={UserCircleIcon}>Meu Perfil</NavItem>

        {/* Bloco condicional que só renderiza se o usuário for admin */}
        {user && user.role === 'admin' && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Admin</p>
            <NavItem to="/admin" icon={BriefcaseIcon}>
              Painel Admin
            </NavItem>
          </div>
        )}
      </nav>

      {/* Botão de Terminar Sessão na parte inferior */}
      <div className="mt-auto">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 my-1 rounded-lg font-medium text-gray-500 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
        >
          <LogoutIcon className="w-6 h-6 mr-4" />
          <span>Terminar Sessão</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;