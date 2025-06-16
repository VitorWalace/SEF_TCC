// File: frontend/src/pages/AdminDashboard.jsx (versão simplificada)

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users');
                setUsers(response.data);
            } catch (err) {
                setError('Falha ao carregar os usuários.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <Layout pageTitle="Painel do Admin"><div>Carregando usuários...</div></Layout>;
    }

    if (error) {
        return <Layout pageTitle="Painel do Admin"><div className="text-red-500">{error}</div></Layout>;
    }

    return (
        <Layout pageTitle="Painel do Administrador">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Lista de Usuários do Sistema</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nome</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Permissão</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Data de Criação</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
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
        </Layout>
    );
}

export default AdminDashboard;