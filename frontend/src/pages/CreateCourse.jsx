// File: frontend/src/pages/CreateCourse.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

// Importa o novo editor de Markdown
import MDEditor from '@uiw/react-md-editor';

function CreateCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course_image_url: ''
    });
    const [content, setContent] = useState("**Olá!** Comece a escrever o conteúdo do seu curso aqui.");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const isEditing = Boolean(courseId);

    // Busca os dados do curso se estiver no modo de edição
    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            api.get(`/api/courses/${courseId}`)
                .then(response => {
                    const { title, description, course_image_url, content } = response.data;
                    setFormData({
                        title: title || '',
                        description: description || '',
                        course_image_url: course_image_url || ''
                    });
                    setContent(content || '');
                })
                .catch(err => {
                    console.error("Erro ao carregar dados do curso para edição:", err);
                    setError('Não foi possível carregar os dados do curso.');
                })
                .finally(() => setLoading(false));
        }
    }, [courseId, isEditing]);

    // Função para lidar com a mudança nos inputs normais
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title || !formData.description) {
            setError('Título e Descrição são campos obrigatórios.');
            return;
        }

        setLoading(true);

        const payload = {
            ...formData,
            content: content, // Adiciona o conteúdo do editor ao payload
            instructor_id: user.id,
        };

        try {
            if (isEditing) {
                await api.put(`/api/courses/${courseId}`, payload);
                setSuccess('Curso atualizado com sucesso! Redirecionando...');
            } else {
                await api.post('/api/courses', payload);
                setSuccess('Curso criado com sucesso! Redirecionando...');
            }
            setTimeout(() => navigate('/my-courses'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Ocorreu um erro ao salvar o curso.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout pageTitle={isEditing ? "Editar Curso" : "Criar Novo Curso"}>
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? `Editando: ${formData.title}` : "Informações do Curso"}</h2>
                    
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}
                    {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">{success}</div>}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título do Curso</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                        <div>
                            <label htmlFor="course_image_url" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem de Capa</label>
                            <input type="text" name="course_image_url" id="course_image_url" value={formData.course_image_url} onChange={handleChange} placeholder="https://exemplo.com/imagem.png" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
                            <textarea name="description" id="description" rows="3" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo Completo do Curso (Editor Markdown)</label>
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
                        <button type="submit" disabled={loading || success} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 transition-all">
                            {loading ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Criar Curso')}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default CreateCourse;