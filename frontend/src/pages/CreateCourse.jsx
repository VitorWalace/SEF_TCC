// File: frontend/src/pages/CreateCourse.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import MDEditor from '@uiw/react-md-editor';

function CreateCourse() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Pega os dados do utilizador logado

    // Estados para controlar os campos do formulário
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [content, setContent] = useState('');
    
    // Estados para feedback
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validação para garantir que o utilizador está logado
        if (!user) {
            setError('Você precisa estar logado para criar um curso.');
            return;
        }

        setLoading(true);

        const courseData = {
            title,
            description,
            content,
            course_image_url: imageUrl,
            instructor_id: user.id // AQUI ESTÁ A CORREÇÃO CRUCIAL
        };

        try {
            await api.post('/api/courses', courseData);
            setSuccess('Curso criado com sucesso! A redirecionar...');
            // Redireciona para a página "Meus Cursos" após o sucesso
            setTimeout(() => navigate('/my-courses'), 2000);
        } catch (err) {
            const message = err.response?.data?.message || 'Ocorreu um erro ao criar o curso.';
            setError(message);
            console.error("Erro ao criar curso:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout pageTitle="Criar Novo Curso">
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Informações do Curso</h2>
                    
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}
                    {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">{success}</div>}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título do Curso</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL da Imagem de Capa</label>
                            <input
                                type="text"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://exemplo.com/imagem.png"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição Curta</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                rows="3"
                                required
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conteúdo Principal</label>
                            <div data-color-mode="light">
                                <MDEditor
                                    value={content}
                                    onChange={setContent}
                                    height={400}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button 
                            type="submit" 
                            disabled={loading || success}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70"
                        >
                            {loading ? 'A criar...' : 'Criar Curso'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default CreateCourse;