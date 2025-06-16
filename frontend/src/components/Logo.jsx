import React from 'react';
import { Link } from 'react-router-dom';

// Importe a sua imagem da pasta assets
import minhaLogo from '../assets/Logo.png'; // <-- MUDE "minha-logo.png" PARA O NOME EXATO DO SEU ARQUIVO

function Logo() {
  return (
    <Link to="/login" className="flex items-center justify-center mb-6">
      <img 
        src={minhaLogo} 
        alt="Saber em Fluxo Logo" 
        className="w-14 h-14" // <-- Você pode ajustar o tamanho aqui
      />
      <h1 className="text-3xl font-bold text-gray-800 ml-3">
        Saber em Fluxo
      </h1>
    </Link>
  );
}

export default Logo;
