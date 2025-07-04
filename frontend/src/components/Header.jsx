// File: frontend/src/components/Header.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

function Header({ pageTitle }) {
    const { user } = useAuth();
    return (
        // File: frontend/src/components/Header.jsx
            <header className="bg-white dark:bg-red-500 shadow-sm p-4 flex justify-between items-center ...">       
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{pageTitle}</h1>
            <div className="flex items-center space-x-4">
                <ThemeSwitcher />
                <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">Olá, {user?.name || 'Utilizador'}!</span>
                <img 
                    className="w-10 h-10 rounded-full object-cover" 
                    src={`https://ui-avatars.com/api/?name=${user?.name.replace(" ", "+") || 'User'}&background=random`} 
                    alt="Avatar do utilizador"
                />
            </div>
        </header>
    );
}

export default Header;