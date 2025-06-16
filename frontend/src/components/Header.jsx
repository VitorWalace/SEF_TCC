import React from 'react';
import { useAuth } from '../context/AuthContext';

function Header({ pageTitle }) {
    const { user } = useAuth();
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
            <div className="flex items-center">
                <span className="text-gray-600 mr-4">Olá, {user?.name || 'Utilizador'}!</span>
                <img 
                    className="w-10 h-10 rounded-full object-cover" 
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                    alt="Avatar do utilizador"
                />
            </div>
        </header>
    );
}

export default Header;
