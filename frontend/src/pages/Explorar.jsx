import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout.jsx';
import UserCard from '../components/UserCard.jsx';
import { SearchIcon } from '../components/icons';
import { mockUsers, allSubjects } from '../data/mockData.js'; // Importa os dados centralizados

function Explorar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const filteredUsers = useMemo(() => {
        return mockUsers.filter(user => {
            const nameMatches = user.name.toLowerCase().includes(searchTerm.toLowerCase());
            const subjectMatches = selectedSubject ? user.subjects.includes(selectedSubject) : true;
            return nameMatches && subjectMatches;
        });
    }, [searchTerm, selectedSubject]);

    return (
        <Layout pageTitle="Explorar Tutores">
            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Todas as Matérias</option>
                    {allSubjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>

            {/* Grelha de Resultados */}
            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-10">
                    <p className="text-gray-500">Nenhum tutor encontrado com os critérios selecionados.</p>
                </div>
            )}
        </Layout>
    );
}

export default Explorar;