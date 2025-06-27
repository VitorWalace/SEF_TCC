// File: frontend/src/pages/Notificacoes.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { HeartIcon, ChatBubbleIcon, UserPlusIcon, BellIcon } from '../components/icons';

// Mapeamento de ícones para cada tipo de notificação
const iconMap = {
    new_review: <HeartIcon className="w-6 h-6 text-white" />,
    new_message: <ChatBubbleIcon className="w-6 h-6 text-white" />,
    new_follower: <UserPlusIcon className="w-6 h-6 text-white" />,
    default: <BellIcon className="w-6 h-6 text-white" />
};

// Mapeamento de cores para cada tipo de notificação
const colorMap = {
    new_review: 'bg-pink-500',
    new_message: 'bg-sky-500',
    new_follower: 'bg-emerald-500',
    default: 'bg-gray-500'
};

function Notificacoes() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await api.get(`/api/notifications/${user.id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        } finally {
            setLoading(false);
        }
    };

    // Busca as notificações quando a página carrega
    useEffect(() => {
        fetchNotifications();
    }, [user]);

    // Função para marcar uma notificação como lida e navegar para o link dela
    const handleNotificationClick = async (notification) => {
        // Marca como lida apenas se não estiver lida
        if (!notification.is_read) {
            try {
                await api.post(`/api/notifications/mark-as-read`, { notificationId: notification.id });
                // Atualiza a notificação na tela sem precisar recarregar tudo
                setNotifications(
                    notifications.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
                );
            } catch (error) {
                console.error("Erro ao marcar como lida:", error);
            }
        }
        // Navega para o link da notificação, se houver
        if (notification.link_to) {
            navigate(notification.link_to);
        }
    };
    
    const handleMarkAllAsRead = async () => {
        if (!user || unreadCount === 0) return;
        try {
            await api.post(`/api/notifications/mark-all-as-read/${user.id}`);
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Erro ao marcar todas como lidas:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <Layout pageTitle="Notificações">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
                <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center">
                        <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Suas Notificações</h2>
                        {unreadCount > 0 && (
                            <span className="ml-3 px-2.5 py-0.5 text-xs font-semibold text-white bg-indigo-500 rounded-full animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <button 
                        onClick={handleMarkAllAsRead} 
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline disabled:text-gray-400 disabled:no-underline" 
                        disabled={unreadCount === 0}
                    >
                        Marcar todas como lidas
                    </button>
                </header>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                        <p className="text-center p-12 text-gray-500 dark:text-gray-400">A carregar notificações...</p>
                    ) : notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-start p-4 cursor-pointer transition-colors duration-200 ${
                                    notification.is_read 
                                    ? 'bg-white dark:bg-gray-800' 
                                    : 'bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                                }`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {!notification.is_read && <span className="h-2 w-2 bg-indigo-500 rounded-full mr-3 absolute"></span>}
                                </div>
                                <div className={`flex-shrink-0 p-3 rounded-full mr-4 ${colorMap[notification.type] || colorMap.default}`}>
                                    {iconMap[notification.type] || iconMap.default}
                                </div>
                                <div className="flex-grow">
                                    <p className="text-gray-800 dark:text-gray-200">{notification.message}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{new Date(notification.created_at).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                            <BellIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                            <p className="mt-2">Não há nenhuma notificação para mostrar.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Notificacoes;