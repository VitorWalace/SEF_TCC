// File: frontend/src/pages/CourseDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';

function CourseDetail() {
    const { courseId } = useParams(); // Pega o ID do curso da URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Chama a nova rota que criamos no backend
                const response = await api.get(`/api/courses/${courseId}`);
                setCourse(response.data);
            } catch (err) {
                setError('Não foi possível carregar o curso.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]); // O efeito roda sempre que o ID do curso na URL mudar

    if (loading) {
        return <Layout pageTitle="Carregando..."><div>Carregando curso...</div></Layout>;
    }

    if (error) {
        return <Layout pageTitle="Erro"><div className="text-red-500">{error}</div></Layout>;
    }

    if (!course) {
        return <Layout pageTitle="Não Encontrado"><div>Curso não encontrado.</div></Layout>;
    }

    return (
        <Layout pageTitle={course.title}>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <img 
                        className="h-64 w-full object-cover" 
                        src={course.course_image_url || 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070'} 
                        alt={`Capa de ${course.title}`} 
                    />
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
                        <p className="text-lg text-gray-600 mt-2">Criado por: {course.instructor_name}</p>
                        
                        <div className="mt-8 pt-6 border-t">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conteúdo do Curso</h2>
                            {/* A classe 'whitespace-pre-wrap' preserva as quebras de linha e espaços do texto */}
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                                {course.content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CourseDetail;