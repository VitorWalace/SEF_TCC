// File: frontend/src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import CourseCard from '../components/CourseCard.jsx';
import StatCard from '../components/StatCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { SearchIcon, BookOpenIcon, UserCircleIcon } from '../components/icons';
import api from '../services/api.js';

function Home() {
    const { user } = useAuth();
    const [recentCourses, setRecentCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        // Se o usuário estiver logado, busca os dados
        if (user) {
            const fetchAllData = async () => {
                try {
                    // Adiciona um pequeno delay para que a animação de loading seja visível
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const [recentCoursesRes, enrolledCoursesRes] = await Promise.all([
                        api.get('/api/courses'),
                        api.get(`/api/users/${user.id}/enrolled-courses`)
                    ]);

                    setRecentCourses(recentCoursesRes.data.slice(0, 3));
                    setEnrolledCourses(enrolledCoursesRes.data);

                } catch (error) {
                    console.error("Erro ao buscar dados da página inicial:", error);
                } finally {
                    setLoading(false);
                    // Ativa as animações de entrada
                    setTimeout(() => setStartAnimation(true), 100);
                }
            };
            fetchAllData();
        } else {
            // Se não há usuário, apenas para o loading e não busca nada
            setLoading(false);
        }
    }, [user]); // Roda o efeito sempre que o objeto 'user' mudar

    // Componente para renderizar os skeletons
    const Skeletons = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    );

    return (
        <Layout pageTitle="Painel de Controlo">
            <div className={startAnimation ? 'start-animation' : ''}>

                {/* --- HERO SECTION --- */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl shadow-2xl mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Bem-vindo(a), {user?.name || 'Explorador'}!
                    </h1>
                    <p className="text-lg text-indigo-200 mb-6">
                        O conhecimento te espera. Continue sua jornada de aprendizado.
                    </p>
                    
                    {!loading && user && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard icon={BookOpenIcon} value={enrolledCourses.length} label="Cursos Inscritos" color="bg-indigo-500" />
                            <StatCard icon={UserCircleIcon} value={0} label="Certificados" color="bg-purple-500" />
                            <StatCard icon={SearchIcon} value={recentCourses.length} label="Novos Cursos" color="bg-pink-500" />
                        </div>
                    )}
                </div>

                {/* --- SEÇÕES DE CURSOS --- */}
                <div className="space-y-12">
                    {/* Seção "Continue de Onde Parou" */}
                    {user && (
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Continue de Onde Parou</h2>
                            {loading ? <Skeletons /> : (
                                enrolledCourses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-gray-100 rounded-lg">
                                        <p className="text-gray-500">Você ainda não se inscreveu em nenhum curso.</p>
                                        <a href="/explorar" className="text-indigo-600 font-semibold hover:underline mt-1 inline-block">Explore agora!</a>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* Seção "Descubra Novos Cursos" */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Descubra Novos Cursos</h2>
                        {loading ? <Skeletons /> : (
                            recentCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {recentCourses.map(course => <CourseCard key={course.id} course={course} />)}
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-gray-100 rounded-lg">
                                    <p className="text-gray-500">Nenhum curso novo no momento. Volte em breve!</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Home;