// File: frontend/src/pages/CourseDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { BookOpenIcon, CheckCircleIcon } from '../components/icons';
import ReactMarkdown from 'react-markdown';

function CourseDetail() {
    const { courseId } = useParams();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estado para controlar qual aula está ativa
    const [activeLesson, setActiveLesson] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId) return;
            try {
                setLoading(true);
                const response = await api.get(`/api/courses/${courseId}`);
                const courseData = response.data;
                setCourse(courseData);

                // Define a primeira aula do primeiro módulo como ativa por padrão
                if (courseData.modules && courseData.modules.length > 0 && courseData.modules[0].lessons.length > 0) {
                    setActiveLesson(courseData.modules[0].lessons[0]);
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

    if (loading) return <Layout pageTitle="Carregando..."><div>Carregando curso...</div></Layout>;
    if (error || !course) return <Layout pageTitle="Erro"><div>{error || "Curso não encontrado."}</div></Layout>;

    return (
        <Layout pageTitle={course.title}>
            <div className="max-w-6xl mx-auto">
                {/* --- CABEÇALHO DO CURSO COM IMAGEM (RESTAURADO) --- */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                    <img 
                        className="h-64 w-full object-cover" 
                        src={course.course_image_url || 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070'} 
                        alt={`Capa de ${course.title}`} 
                    />
                    <div className="p-6">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">{course.title}</h1>
                        <p className="text-md lg:text-lg text-gray-600 dark:text-gray-400 mt-2">
                            Criado por: <Link to={`/perfil/${course.instructor_id}`} className="hover:underline">{course.instructor_name}</Link>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* --- MENU DE AULAS (Esquerda) --- */}
                    <aside className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-6">
                            <div className="mb-4">
                                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Conteúdo do Curso</h2>
                            </div>
                            <div className="space-y-4">
                                {course.modules && course.modules.map((module) => (
                                    <div key={module.id}>
                                        <h3 className="font-semibold text-gray-600 dark:text-gray-300 px-2 mb-2">{module.title}</h3>
                                        <ul className="space-y-1">
                                            {module.lessons.map(lesson => (
                                                <li key={lesson.id}>
                                                    <button 
                                                        onClick={() => setActiveLesson(lesson)}
                                                        className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                            activeLesson?.id === lesson.id 
                                                            ? 'bg-indigo-600 text-white font-semibold' 
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <BookOpenIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                                                        {lesson.title}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* --- CONTEÚDO DA AULA (Direita) --- */}
                    <main className="flex-grow">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 min-h-[60vh]">
                            {activeLesson ? (
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{activeLesson.title}</h1>
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                                            <ReactMarkdown>
                                                {activeLesson.content || "Nenhum conteúdo para esta aula ainda."}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center flex flex-col justify-center items-center h-full">
                                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Selecione uma aula</h2>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">Escolha uma aula no menu ao lado para começar a aprender.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
}

export default CourseDetail;