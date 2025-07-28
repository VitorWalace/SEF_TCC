// File: frontend/src/components/Modal.jsx

import React from 'react';
import { XMarkIcon } from './icons'; // Usaremos um ícone para fechar

function Modal({ children, title, onClose }) {
  // Impede que o clique dentro do modal o feche
  const handleContentClick = (e) => e.stopPropagation();

  return (
    // Fundo semi-transparente que cobre a tela
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose} // Fecha o modal ao clicar no fundo
    >
      {/* Container principal do Modal */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-transform animate-fade-in-up"
        onClick={handleContentClick}
      >
        {/* Cabeçalho do Modal */}
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Conteúdo do Modal */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Modal;