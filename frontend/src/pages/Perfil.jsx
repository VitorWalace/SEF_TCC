import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { mockUsers } from '../data/mockData.js';
import { EditIcon, SaveIcon, StarIcon, BriefcaseIcon, LinkedInIcon, GithubIcon, ChatIcon } from '../components/icons';
import StatCard from '../components/StatCard.jsx';
import SocialLink from '../components/SocialLink.jsx';

function Perfil() {
    const { userId } = useParams();
    const { user: loggedInUser, updateUser } = useAuth();
    const navigate = useNavigate();

    const userToShow = userId ? mockUsers.find(u => u.id === parseInt(userId, 10)) : loggedInUser;
    const isMyProfile = !userId || (loggedInUser && loggedInUser.id === userToShow?.id);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (userToShow) {
            setFormData({
                name: userToShow.name || '',
                title: userToShow.title || '',
                bio: userToShow.bio || '',
                isAvailable: userToShow.isAvailable || false,
                subjects: userToShow.subjects?.join(', ') || '',
                linkedin: userToShow.socials?.linkedin || '',
                github: userToShow.socials?.github || '',
            });
        }
    }, [userToShow, isEditing]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = () => {
        const updatedData = {
            name: formData.name,
            title: formData.title,
            bio: formData.bio,
            isAvailable: formData.isAvailable,
            subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
            socials: {
                linkedin: formData.linkedin,
                github: formData.github,
            }
        };
        updateUser(updatedData);
        setIsEditing(false);
    };

    if (!userToShow) {
        return (
            <Layout pageTitle="Erro">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600">Utilizador Não Encontrado</h2>
                    <p className="mt-2 text-gray-600">O perfil que está a tentar aceder não existe.</p>
                    <Link to="/explorar" className="mt-6 inline-block py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                        Voltar para a Exploração
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout pageTitle={isMyProfile ? "Meu Perfil" : `Perfil de ${userToShow.name}`}>
            <div className="max-w-4xl mx-auto">
                {/* -- Capa e Foto de Perfil -- */}
                <div className="relative bg-white rounded-t-xl shadow-lg">
                    <img className="h-48 w-full object-cover rounded-t-xl" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070" alt="Imagem de capa do perfil" />
                    <div className="absolute -bottom-16 left-8">
                        <img className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md" src={userToShow.avatarUrl} alt={`Avatar de ${userToShow.name}`} />
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
                            <button onClick={() => navigate('/chat')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
                                <ChatIcon className="w-5 h-5" /> Iniciar Conversa
                            </button>
                        )}
                    </div>
                </div>

                {/* -- Informações e Estatísticas -- */}
                <div className="bg-white rounded-b-xl shadow-lg pt-20 px-8 pb-8">
                    {isEditing ? (
                        <div className="space-y-1">
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-3xl font-bold text-gray-800 w-full border-b-2 focus:outline-none focus:border-indigo-500" />
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="text-md text-gray-500 w-full border-b-2 focus:outline-none focus:border-indigo-500" />
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{userToShow.name}</h1>
                            <p className="text-md text-gray-500">{userToShow.title}</p>
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard icon={StarIcon} value={userToShow.stats?.rating || 0} label="Nota Média" color="bg-yellow-400" />
                        <StatCard icon={BriefcaseIcon} value={userToShow.stats?.sessions || 0} label="Sessões Concluídas" color="bg-sky-400" />
                        <StatCard icon={ChatIcon} value={userToShow.stats?.reviews || 0} label="Avaliações" color="bg-emerald-400" />
                    </div>

                    {/* ... (resto do JSX) ... */}
                </div>
            </div>
        </Layout>
    );
}
export default Perfil;