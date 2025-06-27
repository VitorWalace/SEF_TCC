// File: frontend/src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Logo from '../components/Logo.jsx';
import { FormInput } from '../components/FormInput.jsx';
import { MailIcon } from '../components/icons/MailIcon.jsx';
import { LockIcon } from '../components/icons/LockIcon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js'; // Importa a nossa API

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Função de submit que chama a API de verdade
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Faz a chamada POST para a rota de login do backend
      const response = await api.post('/api/auth/login', { email, password });

      // Pega o usuário e o token da resposta do backend
      const { user, token } = response.data;

      // Usa a função de login do nosso AuthContext
      login(user, token);
      
      // Navega para a página principal
      navigate('/home');

    } catch (err) {
      // Se o backend retornar um erro (como 401), ele será exibido aqui
      const message = err.response?.data?.message || 'Email ou senha inválidos. Verifique suas credenciais.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
        <Logo />
        <div className="bg-white p-8 rounded-xl shadow-lg w-full mt-8">
            <h2 className="text-2xl font-bold text-center text-brand-secondary mb-6">Bem-vindo(a) de volta</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="bg-red-100 text-center border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">{error}</div>}
                <FormInput id="email" type="email" placeholder="seu.email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={MailIcon} />
                <FormInput id="password" type="password" placeholder="A sua senha" value={password} onChange={(e) => setPassword(e.target.value)} icon={LockIcon} />
                <div className="text-right">
                    <Link to="/esqueceu-senha" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Esqueceu a senha?</Link>
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 transition-all duration-300">
                    {loading ? 'A validar...' : 'ENTRAR'}
                </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/cadastro" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">Registe-se</Link>
            </p>
        </div>
    </AuthLayout>
  );
}

export default Login;