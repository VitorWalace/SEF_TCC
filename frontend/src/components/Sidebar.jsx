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
    BriefcaseIcon,
    BookOpenIcon 
} from './icons';

const NavItem = ({ to, icon: Icon, children, badgeCount }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex items-center px-4 py-3 my-1 rounded-lg font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg'
          : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
      }`
    }
  >
    <Icon className="w-6 h-6 mr-4" />
    <span>{children}</span>
    {badgeCount > 0 && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-800">
            {badgeCount > 9 ? '9+' : badgeCount}
        </span>
    )}
  </NavLink>
);

function Sidebar() {
  const { user, logout, unreadCount } = useAuth();

  return (
    <aside className="h-screen w-64 bg-gray-100 text-gray-800 flex-shrink-0 flex-col p-4 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300 hidden md:flex">
      <div className="px-4 mb-8">
        <Logo />
      </div>
      <nav className="flex-grow">
        <NavItem to="/home" icon={HomeIcon}>Página Principal</NavItem>
        <NavItem to="/explorar" icon={SearchIcon}>Explorar Cursos</NavItem>
        <NavItem to="/my-courses" icon={BookOpenIcon}>Meus Cursos</NavItem>
        <NavItem to="/chat" icon={ChatIcon}>Chat</NavItem>
        <NavItem to="/notificacoes" icon={BellIcon} badgeCount={unreadCount}>Notificações</NavItem>
        <NavItem to="/agenda" icon={CalendarIcon}>A minha Agenda</NavItem>
        <NavItem to="/perfil" icon={UserCircleIcon}>Meu Perfil</NavItem>

        {user && user.role === 'admin' && (
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Admin</p>
            <NavItem to="/admin" icon={BriefcaseIcon}>
              Painel Admin
            </NavItem>
          </div>
        )}
      </nav>
      <div className="mt-auto">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 my-1 rounded-lg font-medium text-gray-500 hover:bg-red-100 hover:text-red-700 dark:text-gray-400 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors duration-200"
        >
          <LogoutIcon className="w-6 h-6 mr-4" />
          <span>Terminar Sessão</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;