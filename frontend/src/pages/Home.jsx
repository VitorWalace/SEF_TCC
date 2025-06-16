// File: frontend/src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import DashboardCard from '../components/DashboardCard.jsx';
import CourseCard from '../components/CourseCard.jsx'; // 1. Importa o CourseCard
import { SearchIcon, BookOpenIcon, CalendarIcon } from '../components/icons';
import api from '../services/api.js'; // 2. Importa a nossa API

function Home() {
    const { user } = useAuth();

    // 3. Estados para guardar os cursos, carregamento e erros
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // 4. useEffect para buscar os cursos do backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/api/courses');
                // Pega apenas os 3 primeiros cursos para destacar
                setCourses(response.data.slice(0, 3)); 
            } catch (error) {
                console.error("Erro ao buscar cursos em destaque:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <Layout pageTitle="Painel de Controlo">
            {/* Cabeçalho de Boas-vindas */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Bem-vindo(a) de volta, {user?.name || 'Utilizador'}!
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Pronto(a) para começar a aprender e a ensinar?
                </p>
            </div>

            {/* 5. Cartões de Ação Rápida ATUALIZADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DashboardCard to="/explorar" icon={SearchIcon} title="Explorar Cursos" colorClass="bg-indigo-500 text-white">
                    Encontre o curso perfeito para você em nossa biblioteca.
                </DashboardCard>
                <DashboardCard to="/my-courses" icon={BookOpenIcon} title="Meus Cursos" colorClass="bg-emerald-500 text-white">
                    Gerencie e crie seus próprios cursos para compartilhar conhecimento.
                </DashboardCard>
                <DashboardCard to="/agenda" icon={CalendarIcon} title="A sua Agenda" colorClass="bg-amber-500 text-white">
                    Organize seus estudos e prazos.
                </DashboardCard>
            </div>

            {/* 6. Seção de Cursos em Destaque */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cursos em Destaque</h2>
                {loading ? (
                    <p>Carregando cursos...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Home;