// File: frontend/src/pages/Perfil.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { EditIcon, SaveIcon, StarIcon, BriefcaseIcon, LinkedInIcon, GithubIcon, ChatIcon } from '../components/icons';
import StatCard from '../components/StatCard.jsx';
import SocialLink from '../components/SocialLink.jsx';

function Perfil() {
    const { userId } = useParams();
    const { user: loggedInUser, updateUser } = useAuth();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const idToFetch = userId || loggedInUser?.id;
        if (!idToFetch) {
            setError('Não foi possível identificar o perfil a ser exibido.');
            setLoading(false);
            return;
        }
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/users/${idToFetch}`);
                setProfileUser(response.data);
            } catch (err) {
                setError('Usuário não encontrado.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [userId, loggedInUser?.id]);

    useEffect(() => {
        if (profileUser) {
            setFormData({
                name: profileUser.name || '',
                title: profileUser.title || '',
                bio: profileUser.bio || '',
                subjects: profileUser.subjects || '',
            });
        }
    }, [profileUser, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!profileUser) return;
        try {
            const response = await api.put(`/api/profile/${profileUser.id}`, formData);
            const updatedUserFromServer = response.data;
            setProfileUser(updatedUserFromServer);
            if (loggedInUser.id === profileUser.id) {
                updateUser(updatedUserFromServer);
            }
            setIsEditing(false);
        } catch (err) {
            alert("Não foi possível salvar as alterações.");
        }
    };
    
    const isMyProfile = profileUser && loggedInUser && loggedInUser.id === profileUser.id;

    if (loading) {
        return <Layout pageTitle="Carregando Perfil..."><div>Carregando...</div></Layout>;
    }
    if (error || !profileUser) {
        return (
            <Layout pageTitle="Erro">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600">{error || 'Usuário Não Encontrado'}</h2>
                    <Link to="/explorar" className="mt-6 inline-block py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                        Voltar para a Exploração
                    </Link>
                </div>
            </Layout>
        );
    }
    
    return (
        <Layout pageTitle={isMyProfile ? "Meu Perfil" : `Perfil de ${profileUser.name}`}>
            <div className="max-w-4xl mx-auto">
                {/* -- Capa e Foto de Perfil -- */}
                <div className="relative bg-white dark:bg-gray-800 rounded-t-xl shadow-lg">
                    <img className="h-48 w-full object-cover rounded-t-xl" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070" alt="Imagem de capa do perfil" />
                    <div className="absolute -bottom-16 left-8">
                        <img className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md" src={profileUser.avatarUrl || `https://ui-avatars.com/api/?name=${profileUser.name.replace(" ", "+")}&background=random`} alt={`Avatar de ${profileUser.name}`} />
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        {isMyProfile ? (
                            isEditing ? (
                                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 shadow-md transition-colors">
                                    <SaveIcon className="w-5 h-5" /> Salvar
                                </button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white shadow-md transition-colors">
                                    <EditIcon className="w-5 h-5" /> Editar Perfil
                                </button>
                            )
                        ) : (
                            <button onClick={() => navigate(`/chat/${profileUser.id}`)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
                                <ChatIcon className="w-5 h-5" /> Iniciar Conversa
                            </button>
                        )}
                    </div>
                </div>

                {/* --- Informações, Estatísticas e Biografia --- */}
                <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg pt-20 px-8 pb-8">
                    {/* --- Seção de Nome e Título --- */}
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Nome</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Título (Ex: Engenheiro de Software)</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{profileUser.name}</h1>
                            <p className="text-md text-gray-500 dark:text-gray-400">{profileUser.title || 'Título não preenchido'}</p>
                        </div>
                    )}

                    {/* --- Seção de Estatísticas --- */}
                    {/* No futuro, estes dados virão do backend */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard icon={StarIcon} value={4.9} label="Nota Média" color="bg-yellow-400" />
                        <StatCard icon={BriefcaseIcon} value={127} label="Sessões Concluídas" color="bg-sky-400" />
                        <StatCard icon={ChatIcon} value={42} label="Avaliações" color="bg-emerald-400" />
                    </div>
                    
                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Biografia</label>
                                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" rows="4"></textarea>
                                </div>
                                 <div>
                                    <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Matérias (separadas por vírgula)</label>
                                    <input type="text" name="subjects" value={formData.subjects} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Sobre Mim</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{profileUser.bio || 'Biografia não preenchida.'}</p>
                                 <div className="mt-4">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Matérias</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(profileUser.subjects?.split(',') || []).map((subject, i) => subject.trim() && (
                                            <span key={i} className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full">
                                                {subject.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Perfil;