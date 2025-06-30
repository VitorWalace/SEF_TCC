// File: frontend/src/pages/CourseDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { BookOpenIcon, StarIcon, CheckCircleIcon, ChatBubbleLeftRightIcon, ChevronDownIcon } from '../components/icons';
import ReactMarkdown from 'react-markdown';

// ... (Componentes EnrollmentButton e StarRating, sem alterações) ...

function CourseDetail() {
    const { courseId } = useParams();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const [openModuleId, setOpenModuleId] = useState(null); // Novo estado para controlar o módulo aberto
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/courses/${courseId}`);
                setCourse(response.data);
                // Por padrão, abre o primeiro módulo
                if (response.data.modules && response.data.modules.length > 0) {
                    setOpenModuleId(response.data.modules[0].id);
                }
            } catch (err) {
                setError('Não foi possível carregar o curso.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId]);
    
    // Função para abrir ou fechar um módulo
    const toggleModule = (moduleId) => {
        setOpenModuleId(prevId => (prevId === moduleId ? null : moduleId));
    };


    if (loading) return <Layout pageTitle="Carregando..."><div>Carregando...</div></Layout>;
    if (error) return <Layout pageTitle="Erro"><div>{error}</div></Layout>;
    if (!course) return <Layout pageTitle="Não Encontrado"><div>Curso não encontrado.</div></Layout>;

    // ... (Componente TabButton, sem alterações) ...
    
    return (
        <Layout pageTitle={course.title}>
            <div className="max-w-4xl mx-auto">
                {/* --- CABEÇALHO DO CURSO --- */}
                {/* ... (Seu cabeçalho existente, sem alterações) ... */}
                
                {/* --- NAVEGAÇÃO DAS ABAS --- */}
                <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
                    {/* ... (Seus botões de aba, sem alterações) ... */}
                </div>

                {/* --- CONTEÚDO DAS ABAS --- */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    {activeTab === 'content' && (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sobre este Curso</h2>
                            <p className="prose max-w-none text-gray-700 mb-8">{course.description || "Nenhuma descrição disponível."}</p>
                            
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conteúdo do Curso</h2>
                            <div className="space-y-2">
                                {/* Mapeia os módulos para criar as seções do acordeão */}
                                {course.modules.map((module) => (
                                    <div key={module.id} className="border rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
                                        >
                                            <span className="font-bold text-lg">{module.title}</span>
                                            <ChevronDownIcon className={`w-6 h-6 transition-transform ${openModuleId === module.id ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {/* Mostra as aulas se o módulo estiver aberto */}
                                        {openModuleId === module.id && (
                                            <div className="p-4 border-t">
                                                <ul className="space-y-2">
                                                    {module.lessons.map(lesson => (
                                                        <li key={lesson.id} className="p-2 rounded-md hover:bg-indigo-50 flex items-center">
                                                            <BookOpenIcon className="w-5 h-5 mr-3 text-indigo-500" />
                                                            {lesson.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ... (O conteúdo das outras abas, como Avaliações e Perguntas, continua aqui) ... */}
                </div>
            </div>
        </Layout>
    );
}

export default CourseDetail;