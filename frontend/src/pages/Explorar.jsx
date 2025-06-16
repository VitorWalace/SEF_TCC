// File: frontend/src/pages/Explorar.jsx

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import CourseCard from '../components/CourseCard.jsx'; // Importa nosso novo componente
import api from '../services/api.js';

function Explorar() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Busca os dados da nossa nova rota no backend
                const response = await api.get('/api/courses');
                setCourses(response.data);
            } catch (err) {
                setError('Não foi possível carregar os cursos.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourses();
    }, []);

    return (
        <Layout pageTitle="Explorar Cursos">
            {/* Podemos adicionar filtros aqui no futuro */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar por cursos..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {loading && <p>Carregando cursos...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}

            {!loading && courses.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">Nenhum curso encontrado no momento.</p>
                </div>
            )}
        </Layout>
    );
}

export default Explorar;