import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import UserCard from '../components/UserCard.jsx';
import DashboardCard from '../components/DashboardCard.jsx';
import { SearchIcon, ChatIcon, CalendarIcon } from '../components/icons';
import { mockUsers } from '../data/mockData.js'; // **CORREÇÃO: Importa os dados do ficheiro central**

function Home() {
    const { user } = useAuth();

    // Seleciona os primeiros 3 utilizadores da lista para destacar
    const featuredTutors = mockUsers.slice(0, 3);

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

            {/* Cartões de Ação Rápida */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DashboardCard to="/explorar" icon={SearchIcon} title="Explorar Tutores" colorClass="bg-indigo-500 text-white">
                    Encontre o tutor perfeito por matéria e disponibilidade.
                </DashboardCard>
                <DashboardCard to="/chat" icon={ChatIcon} title="As suas Mensagens" colorClass="bg-emerald-500 text-white">
                    Veja as suas conversas e continue a aprender.
                </DashboardCard>
                <DashboardCard to="/agenda" icon={CalendarIcon} title="A sua Agenda" colorClass="bg-amber-500 text-white">
                    Organize as suas sessões de estudo e tutoria.
                </DashboardCard>
            </div>

            {/* Tutores em Destaque */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tutores em Destaque</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {/* **CORREÇÃO: Utiliza a lista de tutores em destaque** */}
                     {featuredTutors.map(tutor => (
                        <UserCard key={tutor.id} user={tutor} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Home;