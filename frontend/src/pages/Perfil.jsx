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
        const fetchProfileData = async () => {
            const idToFetch = userId || loggedInUser?.id;
            if (!idToFetch) {
                setError('Não foi possível identificar o perfil a ser exibido.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await api.get(`/api/users/${idToFetch}`);
                setProfileUser(response.data);
            } catch (err) {
                setError('Usuário não encontrado.');
            } finally {
                setLoading(false);
            }
        };

        if (loggedInUser) {
            fetchProfileData();
        }
    }, [userId, loggedInUser]);

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
        const payload = {
            name: formData.name,
            title: formData.title,
            bio: formData.bio,
            subjects: formData.subjects,
        };

        try {
            const response = await api.put(`/api/profile/${profileUser.id}`, payload);
            const updatedUserFromServer = response.data;
            
            setProfileUser(updatedUserFromServer);

            if (loggedInUser.id === profileUser.id) {
                updateUser(updatedUserFromServer);
            }

            setIsEditing(false);
        } catch (err) {
            console.error("Falha ao salvar o perfil", err);
            alert("Não foi possível salvar as alterações.");
        }
    };
    
    // A verificação agora é mais robusta
    const isMyProfile = profileUser && loggedInUser && loggedInUser.id === profileUser.id;

    if (loading) { return <Layout pageTitle="Carregando Perfil..."><div>Carregando...</div></Layout>; }
    if (error || !profileUser) { return <Layout pageTitle="Erro"><div>{error}</div></Layout>; }
    
    return (
        <Layout pageTitle={isMyProfile ? "Meu Perfil" : `Perfil de ${profileUser.name}`}>
            <div className="max-w-4xl mx-auto">
                <div className="relative bg-white rounded-t-xl shadow-lg">
                    <img className="h-48 w-full object-cover rounded-t-xl" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070" alt="Imagem de capa do perfil" />
                    <div className="absolute -bottom-16 left-8">
                        <img className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md" src={profileUser.avatarUrl || `https://ui-avatars.com/api/?name=${profileUser.name.replace(" ", "+")}&background=random`} alt={`Avatar de ${profileUser.name}`} />
                    </div>
                    
                    {/* Este bloco agora deve funcionar corretamente */}
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
                            <button onClick={() => navigate('/chat')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
                                <ChatIcon className="w-5 h-5" /> Iniciar Conversa
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-b-xl shadow-lg pt-20 px-8 pb-8">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-500">Nome</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-xl font-bold text-gray-800 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500">Título (Ex: Engenheiro de Software)</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="text-md text-gray-600 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500">Biografia</label>
                                <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="text-md text-gray-600 w-full p-2 border rounded-md" rows="4"></textarea>
                            </div>
                             <div>
                                <label className="text-sm font-bold text-gray-500">Matérias (separadas por vírgula)</label>
                                <input type="text" name="subjects" value={formData.subjects} onChange={handleInputChange} className="text-md text-gray-600 w-full p-2 border rounded-md" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{profileUser.name}</h1>
                            <p className="text-md text-gray-500">{profileUser.title || 'Título não preenchido'}</p>
                            <p className="mt-4 text-gray-600">{profileUser.bio || 'Biografia não preenchida.'}</p>
                             <div className="mt-4">
                                <h4 className="font-semibold text-gray-800">Matérias</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {/* Lógica para exibir as matérias corretamente */}
                                    {(profileUser.subjects?.split(',') || []).map((subject, i) => subject.trim() && (
                                        <span key={i} className="px-3 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                                            {subject.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Perfil;