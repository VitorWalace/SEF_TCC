// File: frontend/src/components/AddLessonModal.jsx

import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

function AddLessonModal({ module, onClose, onLessonAdd }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("O título da aula é obrigatório.");
            return;
        }
        setLoading(true);
        // Chama a função passada pelo pai (CourseBuilder) para adicionar a aula
        await onLessonAdd({ title, content });
        setLoading(false);
        onClose(); // Fecha o modal
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Adicionar Aula ao Módulo: "{module.title}"</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="lesson-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título da Aula</label>
                            <input
                                type="text"
                                id="lesson-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conteúdo da Aula</label>
                            <div data-color-mode="light">
                                <MDEditor
                                    value={content}
                                    onChange={setContent}
                                    height={250}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                            {loading ? "Adicionando..." : "Adicionar Aula"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddLessonModal;