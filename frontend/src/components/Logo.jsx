// File: frontend/src/components/Logo.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// Importe a sua imagem da pasta assets
import minhaLogo from '../assets/Logo.png';

function Logo() {
  return (
    // Usamos 'group' para que o efeito de hover no Link afete o logo e o texto
    <Link to="/home" className="flex items-center mb-6 group">
      <img 
        src={minhaLogo} 
        alt="Saber em Fluxo Logo" 
        // Diminuímos o tamanho do logo e adicionamos uma transição suave
        className="h-10 w-10 transition-transform duration-300 group-hover:rotate-12" 
      />
      {/* Diminuímos o tamanho da fonte e ajustamos a cor */}
      <h1 className="text-xl font-bold text-gray-800 ml-3 transition-colors duration-300 group-hover:text-indigo-600">
        Saber em Fluxo
      </h1>
    </Link>
  );
}

export default Logo;