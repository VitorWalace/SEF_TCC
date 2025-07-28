// File: frontend/src/components/DeleteModal.jsx

import React from 'react';
import { TrashIcon, XMarkIcon } from './icons';

function DeleteModal({ title, message, onConfirm, onCancel, loading }) {
  const handleContentClick = (e) => e.stopPropagation();

  return (
    // Fundo semi-transparente
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onCancel}
    >
      {/* Container do Modal */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-transform animate-fade-in-up"
        onClick={handleContentClick}
      >
        <div className="p-6 text-center">
            {/* Ícone de Alerta */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            
            {/* Título e Mensagem */}
            <h3 className="mt-5 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{title}</h3>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              <p>{message}</p>
            </div>

            {/* Botões de Ação */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "A Apagar..." : "Sim, Apagar"}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;