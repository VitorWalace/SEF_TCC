// File: frontend/src/pages/CourseDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { BookOpenIcon, CheckCircleIcon } from '../components/icons';
import ReactMarkdown from 'react-markdown';

// Componente para o botão de inscrição, que muda de estado
const EnrollmentButton = ({ isEnrolled, onEnroll, disabled }) => {
    if (isEnrolled) {
        return (
            <div className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-100 text-green-800 font-semibold rounded-lg">
                <CheckCircleIcon className="w-6 h-6" />
                <span>Você está inscrito!</span>
            </div>
        );
    }

    return (
        <button
            onClick={onEnroll}
            disabled={disabled}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Inscrever-se no Curso
        </button>
    );
};


function CourseDetail() {
    const { courseId } = useParams();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false); // Novo estado para a inscrição
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('content');

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !courseId) return;
            try {
                setLoading(true);
                // Usamos Promise.all para buscar dados do curso e status da inscrição em paralelo
                const [courseRes, enrollmentRes] = await Promise.all([
                    api.get(`/api/courses/${courseId}`),
                    api.get(`/api/courses/${courseId}/enrollment-status/${user.id}`)
                ]);
                
                setCourse(courseRes.data);
                setIsEnrolled(enrollmentRes.data.isEnrolled);

            } catch (err) {
                setError('Não foi possível carregar os dados do curso.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, user]); // Roda sempre que o curso ou o usuário mudar

    // Função para realizar a inscrição
    const handleEnroll = async () => {
        try {
            await api.post('/api/enrollments', {
                user_id: user.id,
                course_id: courseId
            });
            // Atualiza o estado para refletir a nova inscrição na tela
            setIsEnrolled(true); 
            alert('Inscrição realizada com sucesso!');
        } catch (err) {
            console.error("Erro ao se inscrever:", err);
            alert(err.response?.data?.message || "Não foi possível realizar a inscrição.");
        }
    };

    if (loading) { return <Layout pageTitle="Carregando..."><div>Carregando...</div></Layout>; }
    if (error) { return <Layout pageTitle="Erro"><div>{error}</div></Layout>; }
    if (!course) { return <Layout pageTitle="Não Encontrado"><div>Curso não encontrado.</div></Layout>; }

    const isInstructor = user?.id === course.instructor_id;

    return (
        <Layout pageTitle={course.title}>
            <div className="max-w-4xl mx-auto">
                {/* --- CABEÇALHO DO CURSO --- */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <img className="h-64 w-full object-cover" src={course.course_image_url || 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070'} alt={`Capa de ${course.title}`} />
                    <div className="p-6 md:flex md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{course.title}</h1>
                            <Link to={`/perfil/${course.instructor_id}`} className="inline-block mt-2 text-md lg:text-lg text-gray-600 hover:text-indigo-600 hover:underline">
                                Criado por: {course.instructor_name}
                            </Link>
                        </div>
                        {/* --- BOTÃO DE INSCRIÇÃO --- */}
                        <div className="mt-4 md:mt-0">
                            {/* Só mostra o botão se o usuário logado NÃO for o instrutor */}
                            {!isInstructor && (
                                <EnrollmentButton 
                                    isEnrolled={isEnrolled} 
                                    onEnroll={handleEnroll} 
                                    disabled={isEnrolled}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* --- CONTEÚDO --- */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sobre este Curso</h2>
                    <div className="prose max-w-none text-gray-700 mb-8"><p>{course.description || "Nenhuma descrição disponível."}</p></div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Conteúdo Principal</h2>
                    <div className="prose max-w-none text-gray-700"><ReactMarkdown>{course.content || "Nenhum conteúdo disponível."}</ReactMarkdown></div>
                </div>
            </div>
        </Layout>
    );
}

export default CourseDetail;