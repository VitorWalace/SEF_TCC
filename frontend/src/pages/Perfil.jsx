// File: frontend/src/pages/Perfil.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js'; // Usaremos a nossa API
import { EditIcon, SaveIcon, StarIcon, BriefcaseIcon, LinkedInIcon, GithubIcon, ChatIcon } from '../components/icons';
import StatCard from '../components/StatCard.jsx';
import SocialLink from '../components/SocialLink.jsx';

function Perfil() {
    const { userId } = useParams(); // Pega o ID da URL, se houver
    const { user: loggedInUser, updateUser } = useAuth();
    const navigate = useNavigate();

    // Novos estados para guardar os dados do perfil, carregamento e erros
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // useEffect para buscar os dados do perfil na API
    useEffect(() => {
        const fetchProfileData = async () => {
            // Se a URL tiver um /:userId, usamos ele. Senão, usamos o id do usuário logado.
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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (loggedInUser) {
            fetchProfileData();
        }
    }, [userId, loggedInUser]); // Roda de novo se o ID na URL ou o usuário logado mudar

    // Sincroniza o formulário de edição com os dados do perfil carregado
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
            console.error("Falha ao salvar o perfil", err);
            alert("Não foi possível salvar as alterações.");
        }
    };
    
    // Lógica para saber se estamos no nosso próprio perfil
    const isMyProfile = profileUser && loggedInUser && loggedInUser.id === profileUser.id;

    if (loading) {
        return <Layout pageTitle="Carregando Perfil..."><div>Carregando...</div></Layout>;
    }

    if (error || !profileUser) {
        return (
            <Layout pageTitle="Erro">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600">{error}</h2>
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
                <div className="relative bg-white rounded-t-xl shadow-lg">
                    <img className="h-48 w-full object-cover rounded-t-xl" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070" alt="Imagem de capa do perfil" />
                    <div className="absolute -bottom-16 left-8">
                        <img className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md" src={profileUser.avatarUrl || `https://ui-avatars.com/api/?name=${profileUser.name.replace(" ", "+")}&background=random`} alt={`Avatar de ${profileUser.name}`} />
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

                <div className="bg-white rounded-b-xl shadow-lg pt-20 px-8 pb-8">
                    {/* Conteúdo do Perfil */}
                    {/* ... (O resto do seu JSX para exibir os detalhes do perfil) ... */}
                </div>
            </div>
        </Layout>
    );
}

export default Perfil;