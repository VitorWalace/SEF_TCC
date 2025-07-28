// File: frontend/src/components/SuccessModal.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from './icons'; // Usaremos um ícone de sucesso

function SuccessModal({ title, message, buttonText, buttonLink, onClose }) {
  return (
    // Fundo semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      {/* Container do Modal */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center transform transition-all animate-fade-in-up">
        
        {/* Ícone de Sucesso */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        
        {/* Título e Mensagem */}
        <h3 className="mt-5 text-2xl font-bold leading-6 text-gray-900 dark:text-gray-100">{title}</h3>
        <div className="mt-2 px-4 text-md text-gray-600 dark:text-gray-300">
          <p>{message}</p>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to={buttonLink}
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-lg shadow-sm px-4 py-3 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700"
          >
            {buttonText}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-lg shadow-sm px-4 py-3 bg-gray-200 dark:bg-gray-700 text-base font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;