// File: frontend/src/pages/Explorar.jsx

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import CourseCard from '../components/CourseCard.jsx'; // Usa o card de curso
import SkeletonCard from '../components/SkeletonCard.jsx'; // Usa o skeleton para o loading
import api from '../services/api.js';

function Explorar() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Efeito para buscar todos os cursos da API
    useEffect(() => {
        setLoading(true);
        api.get('/api/courses')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar cursos:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Filtra os cursos com base na busca do usuário
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Skeletons = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
    );

    return (
        <Layout pageTitle="Explorar Cursos">
            {/* Barra de Pesquisa */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar por título ou instrutor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700"
                />
            </div>

            {/* Grelha de Resultados */}
            {loading ? <Skeletons /> : (
                filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-10">
                        <p className="text-gray-500">Nenhum curso encontrado com os critérios selecionados.</p>
                    </div>
                )
            )}
        </Layout>
    );
}

export default Explorar;