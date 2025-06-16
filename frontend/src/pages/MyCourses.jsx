// File: frontend/src/pages/MyCourses.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

function MyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            api.get(`/api/users/${user.id}/courses`)
                .then(response => {
                    setCourses(response.data);
                })
                .catch(error => console.error("Erro ao buscar cursos:", error))
                .finally(() => setLoading(false));
        }
    }, [user]);

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
            try {
                await api.delete(`/api/courses/${courseId}`);
                setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
            } catch (error) {
                console.error("Falha ao excluir o curso:", error);
                alert('Ocorreu um erro ao tentar excluir o curso.');
            }
        }
    };

    if (loading) {
        return <Layout pageTitle="Meus Cursos"><div>Carregando...</div></Layout>;
    }

    return (
        <Layout pageTitle="Meus Cursos">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Seus Cursos</h2>
                <Link
                    to="/create-course"
                    className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                >
                    Criar Novo Curso
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                {courses.length > 0 ? (
                    <div className="space-y-4">
                        {courses.map(course => (
                            <div key={course.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800">{course.title}</h3>
                                    <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                    <button
                                        onClick={() => navigate(`/edit-course/${course.id}`)}
                                        className="px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <h3 className="text-xl font-semibold text-gray-700">Você ainda não criou nenhum curso.</h3>
                        <p className="text-gray-500 mt-2">Clique no botão acima para começar a ensinar!</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default MyCourses;