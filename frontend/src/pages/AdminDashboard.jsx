// File: frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';
import { TrashIcon } from '../components/icons'; // Usaremos o ícone de lixeira

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/api/users')
            .then(response => setUsers(response.data))
            .catch(err => setError('Falha ao carregar os usuários.'))
            .finally(() => setLoading(false));
    }, []);

    // Função para deletar todos os cursos
    const handleDeleteAllCourses = async () => {
        // Pede uma dupla confirmação, pois esta é uma ação perigosa
        if (window.confirm('TEM CERTEZA? Esta ação apagará TODOS os cursos permanentemente e não pode ser desfeita.')) {
            if (window.confirm('Confirmação final: apagar TODOS os cursos?')) {
                try {
                    const response = await api.delete('/api/courses');
                    alert(response.data.message); // Mostra a mensagem de sucesso
                } catch (err) {
                    console.error("Falha ao deletar os cursos:", err);
                    alert('Ocorreu um erro ao tentar apagar os cursos.');
                }
            }
        }
    };

    if (loading) { return <Layout pageTitle="Painel do Admin"><div>Carregando...</div></Layout>; }
    if (error) { return <Layout pageTitle="Painel do Admin"><div className="text-red-500">{error}</div></Layout>; }

    return (
        <Layout pageTitle="Painel do Administrador">
            <div className="space-y-8">
                {/* Seção de Gerenciamento de Conteúdo */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Gerenciamento de Conteúdo</h2>
                    <div className="p-4 border border-red-500/30 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <h3 className="font-bold text-red-800 dark:text-red-300">Zona de Perigo</h3>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            A ação abaixo é irreversível. Tenha certeza do que está a fazer.
                        </p>
                        <button
                            onClick={handleDeleteAllCourses}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <TrashIcon className="w-5 h-5" />
                            Apagar Todos os Cursos
                        </button>
                    </div>
                </div>

                {/* Seção de Lista de Usuários */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Lista de Usuários</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nome</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Permissão</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Data de Criação</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 dark:text-gray-300">
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="py-3 px-4">{user.id}</td>
                                        <td className="py-3 px-4">{user.name}</td>
                                        <td className="py-3 px-4">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-bold leading-none rounded-full ${
                                                user.role === 'admin' 
                                                ? 'bg-green-200 text-green-800' 
                                                : 'bg-indigo-200 text-indigo-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;