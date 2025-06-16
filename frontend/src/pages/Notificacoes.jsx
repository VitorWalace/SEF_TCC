import React, { useState } from 'react';
import Layout from '../components/Layout.jsx';
import NotificationItem from '../components/NotificationItem.jsx';

const initialNotifications = [
    { id: 1, user: 'Ana Silva', type: 'like', text: '<strong>Ana Silva</strong> curtiu o seu perfil.', time: 'há 5 minutos', read: false },
    { id: 2, user: 'Bruno Costa', type: 'message', text: '<strong>Bruno Costa</strong> enviou-lhe uma nova mensagem.', time: 'há 2 horas', read: false },
    { id: 3, user: 'Carla Dias', type: 'follower', text: '<strong>Carla Dias</strong> começou a seguir o seu perfil.', time: 'há 1 dia', read: true },
    { id: 4, user: 'Daniel Martins', type: 'like', text: '<strong>Daniel Martins</strong> curtiu a sua publicação sobre "React Hooks".', time: 'há 2 dias', read: true },
];

function Notificacoes() {
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id) => {
        setNotifications(
            notifications.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    return (
        <Layout pageTitle="Notificações">
            <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
                <header className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                        <h2 className="font-bold text-gray-800 text-lg">As suas Notificações</h2>
                        {unreadCount > 0 && <span className="ml-3 px-2.5 py-0.5 text-xs font-semibold text-white bg-indigo-500 rounded-full">{unreadCount}</span>}
                    </div>
                    <div className="flex gap-2">
                         <button onClick={handleMarkAllAsRead} className="text-sm text-indigo-600 hover:underline disabled:text-gray-400" disabled={unreadCount === 0}>
                            Marcar todas como lidas
                        </button>
                        <button onClick={handleClearAll} className="text-sm text-red-600 hover:underline disabled:text-gray-400" disabled={notifications.length === 0}>
                            Limpar tudo
                        </button>
                    </div>
                </header>

                <div>
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
                        ))
                    ) : (
                        <div className="text-center p-12 text-gray-500">
                            <p>Não há nenhuma notificação para mostrar.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Notificacoes;