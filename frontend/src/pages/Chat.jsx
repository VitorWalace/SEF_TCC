// File: frontend/src/pages/Chat.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import io from 'socket.io-client';
import { PaperAirplaneIcon, TrashIcon, SearchIcon } from '../components/icons';

const socket = io('http://localhost:3001');

function Chat() {
    const { user } = useAuth();
    const { recipientId } = useParams();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Efeito para buscar as conversas iniciais
    useEffect(() => {
        if (user) {
            setLoading(true);
            api.get(`/api/chat/conversations/${user.id}`).then(response => {
                let currentConversations = response.data;
                const targetId = recipientId || currentConversations[0]?.id;

                if (targetId && !currentConversations.some(c => c.id == targetId) && user.id != targetId) {
                    api.get(`/api/users/${targetId}`).then(userRes => {
                        const newUser = userRes.data;
                        if (newUser) {
                            const updatedList = [newUser, ...currentConversations];
                            setConversations(updatedList);
                            setActiveConversation(newUser);
                        }
                    });
                } else if (targetId) {
                    setActiveConversation(currentConversations.find(c => c.id == targetId));
                }
                
                setConversations(currentConversations);
            }).catch(err => console.error("Erro ao buscar conversas", err))
            .finally(() => setLoading(false));
        }
    }, [user, recipientId]);

    // Efeito para buscar as mensagens da conversa ativa e se conectar à sala do socket
    useEffect(() => {
        if (activeConversation && user) {
            api.get(`/api/chat/messages/${user.id}/${activeConversation.id}`).then(response => {
                setMessages(response.data);
            });
            const roomName = [user.id, activeConversation.id].sort().join('-');
            socket.emit('join_room', roomName);
        } else {
            setMessages([]);
        }
    }, [activeConversation, user]);

    // Efeito para ouvir por novas mensagens em tempo real
    useEffect(() => {
        const handleReceiveMessage = (data) => {
            if (activeConversation && (data.sender_id == activeConversation.id)) {
                setMessages(prev => [...prev, data]);
            }
        };
        socket.on('receive_message', handleReceiveMessage);
        return () => socket.off('receive_message', handleReceiveMessage);
    }, [activeConversation]);

    // Efeito para pesquisar usuários
    useEffect(() => {
        if (searchTerm.trim() !== '') {
            api.get(`/api/users/search?q=${searchTerm}&currentUserId=${user.id}`)
                .then(response => setSearchResults(response.data));
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, user?.id]);

    // Efeito para rolar para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !activeConversation) return;

        const roomName = [user.id, activeConversation.id].sort().join('-');
        const payload = {
            sender_id: user.id,
            recipient_id: activeConversation.id,
            body: newMessage,
            room: roomName,
        };
        
        socket.emit('send_message', payload);
        
        await api.post('/api/chat/messages', payload);
        
        setMessages(prev => [...prev, { ...payload, created_at: new Date().toISOString() }]);
        setNewMessage('');
    };
    
    const handleDeleteConversation = async (partnerId) => {
        if (window.confirm('Tem certeza que deseja apagar todo o histórico desta conversa?')) {
            try {
                await api.delete(`/api/chat/conversations/${user.id}/${partnerId}`);
                setConversations(prev => prev.filter(c => c.id !== partnerId));
                if (activeConversation?.id === partnerId) {
                    setActiveConversation(null);
                }
            } catch (err) {
                alert('Erro ao apagar a conversa.');
            }
        }
    };

    const handleSelectConversation = (partner) => {
        setSearchTerm('');
        setSearchResults([]);
        navigate(`/chat/${partner.id}`);
    };
    
    if (loading) return <Layout pageTitle="Chat"><div>Carregando...</div></Layout>;

    return (
        <Layout pageTitle="Chat">
            <div className="flex h-[calc(100vh-120px)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700">
                
                <aside className="w-full md:w-1/3 border-r dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
                    <header className="p-4 border-b dark:border-gray-700 flex-shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Pesquisar ou iniciar conversa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
                            />
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </header>

                    <div className="overflow-y-auto flex-grow">
                        {searchResults.length > 0 && (
                            <div className="p-2">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase px-2">Resultados da Pesquisa</h3>
                                {searchResults.map(result => (
                                    <div key={result.id} onClick={() => handleSelectConversation(result)} className="p-3 flex items-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg">
                                        <img className="h-10 w-10 rounded-full" src={result.avatarUrl || `https://ui-avatars.com/api/?name=${result.name.replace(" ", "+")}`} alt={result.name} />
                                        <p className="ml-3 font-semibold text-gray-800 dark:text-gray-200">{result.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="p-2">
                             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase px-2 mt-2">Conversas</h3>
                             {conversations.map((convo) => (
                                <div key={convo.id} onClick={() => handleSelectConversation(convo)} className={`p-3 flex items-center cursor-pointer rounded-lg relative group transition-colors duration-200 ${activeConversation?.id === convo.id ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}>
                                    <img className="h-12 w-12 rounded-full" src={convo.avatarUrl || `https://ui-avatars.com/api/?name=${convo.name.replace(" ", "+")}`} alt={convo.name} />
                                    <div className="ml-4">
                                        <p className="font-semibold text-gray-900 dark:text-gray-200">{convo.name}</p>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteConversation(convo.id); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {activeConversation ? (
                    <main className="w-2/3 flex-col hidden md:flex">
                        <header className="p-4 border-b dark:border-gray-700 flex items-center shadow-sm bg-white dark:bg-gray-800 z-10">
                             <img className="h-10 w-10 rounded-full" src={activeConversation.avatarUrl || `https://ui-avatars.com/api/?name=${activeConversation.name.replace(" ", "+")}`} alt={activeConversation.name} />
                             <h2 className="font-bold text-gray-800 dark:text-gray-100 ml-4">{activeConversation.name}</h2>
                        </header>

                        <div className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
                            {messages.map((msg, index) => (
                                <div key={msg.id || index} className={`flex my-1 ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`px-4 py-2 rounded-2xl max-w-lg shadow-sm ${msg.sender_id === user.id ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'}`}>
                                        {msg.body}
                                    </div>
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>

                        <footer className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                            <form onSubmit={handleSendMessage} className="flex items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escreva a sua mensagem..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                <button type="submit" className="ml-4 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex-shrink-0">
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </footer>
                    </main>
                ) : (
                    <div className="w-2/3 items-center justify-center text-gray-500 hidden md:flex">
                        <p>Selecione uma conversa para começar.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Chat;