import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { PaperAirplaneIcon } from '../components/icons';

// Dados de simulação
const initialConversations = {
  '1': {
    id: 1,
    name: 'Ana Silva',
    avatarUrl: 'https://placehold.co/100x100/A8D5E2/333333?text=AS',
    messages: [
      { id: 1, text: 'Olá! Vi que és especialista em Cálculo. Podes ajudar-me com um problema?', sender: 'me' },
      { id: 2, text: 'Olá! Claro, manda o problema que eu dou uma vista de olhos.', sender: 'other' },
    ]
  },
  '2': {
    id: 2,
    name: 'Daniel Martins',
    avatarUrl: 'https://placehold.co/100x100/4CAF50/FFFFFF?text=DM',
    messages: [
      { id: 1, text: 'Boa tarde, Daniel. Tudo bem?', sender: 'me' },
    ]
  },
};

function Chat() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState(initialConversations);
    const [activeConversationId, setActiveConversationId] = useState(1);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const activeConversation = conversations[activeConversationId];

    // Efeito para rolar para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation.messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: newMessage,
            sender: 'me'
        };

        const updatedConversations = { ...conversations };
        updatedConversations[activeConversationId].messages.push(newMsg);

        setConversations(updatedConversations);
        setNewMessage('');

        // Simular resposta automática
        setTimeout(() => {
            const autoReply = {
                id: Date.now() + 1,
                text: 'Ok, vou analisar e já te respondo!',
                sender: 'other'
            };
             const updatedAgain = { ...updatedConversations };
             updatedAgain[activeConversationId].messages.push(autoReply);
             setConversations(updatedAgain);
        }, 1500);
    };

    return (
        <Layout pageTitle="Chat">
            <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-md overflow-hidden">
                {/* Lista de Conversas (Esquerda) */}
                <aside className="w-1/3 border-r border-gray-200">
                    <header className="p-4 border-b border-gray-200">
                        <h2 className="font-bold text-gray-800">Conversas</h2>
                    </header>
                    <div className="overflow-y-auto h-full">
                        {Object.values(conversations).map((convo) => (
                            <div
                                key={convo.id}
                                onClick={() => setActiveConversationId(convo.id)}
                                className={`p-4 flex items-center cursor-pointer border-l-4 ${activeConversationId === convo.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-gray-100'}`}
                            >
                                <img className="h-12 w-12 rounded-full object-cover" src={convo.avatarUrl} alt={convo.name} />
                                <div className="ml-4 flex-grow">
                                    <p className="font-semibold text-gray-900">{convo.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{convo.messages[convo.messages.length - 1].text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Janela da Conversa (Direita) */}
                <main className="w-2/3 flex flex-col">
                    {/* Cabeçalho da Conversa */}
                    <header className="p-4 border-b border-gray-200 flex items-center shadow-sm">
                         <img className="h-10 w-10 rounded-full object-cover" src={activeConversation.avatarUrl} alt={activeConversation.name} />
                         <h2 className="font-bold text-gray-800 ml-4">{activeConversation.name}</h2>
                    </header>

                    {/* Mensagens */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeConversation.messages.map(msg => (
                            <div key={msg.id} className={`flex my-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 rounded-2xl max-w-lg ${msg.sender === 'me' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>

                    {/* Formulário de Envio */}
                    <footer className="p-4 border-t border-gray-200 bg-gray-50">
                        <form onSubmit={handleSendMessage} className="flex items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escreva a sua mensagem..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button type="submit" className="ml-4 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                <PaperAirplaneIcon className="w-5 h-5 transform rotate-45" />
                            </button>
                        </form>
                    </footer>
                </main>
            </div>
        </Layout>
    );
}

export default Chat;
