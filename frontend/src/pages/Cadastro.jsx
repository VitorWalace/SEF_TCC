// File: frontend/src/pages/Cadastro.jsx (versão com auto-login)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Logo from '../components/Logo.jsx';
import { FormInput } from '../components/FormInput.jsx';
import { MailIcon } from '../components/icons/MailIcon.jsx';
import { LockIcon } from '../components/icons/LockIcon.jsx';
import { UserIcon } from '../components/icons/UserIcon.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx'; // 1. IMPORTE O useAuth

function Cadastro() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. PEGUE A FUNÇÃO DE LOGIN DO CONTEXTO
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
      };
      const response = await api.post('/api/auth/register', payload);

      // --- 3. MUDANÇA NA LÓGICA DE SUCESSO ---
      // Pega o usuário e o token da resposta do backend
      const { user, token } = response.data;

      // Usa a função do nosso AuthContext para fazer o login
      login(user, token);

      // Atualiza a mensagem de sucesso e redireciona para a HOME
      setSuccess('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/home'), 2000);

    } catch (err) {
      const message = err.response?.data?.message || 'Ocorreu um erro ao criar a conta. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
        <Logo />
        <div className="bg-white p-8 rounded-xl shadow-lg w-full mt-8">
            <h2 className="text-2xl font-bold text-center text-brand-secondary mb-6">Crie sua Conta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-100 text-center border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">{error}</div>}
                {success && <div className="bg-green-100 text-center border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">{success}</div>}
                
                <FormInput id="nome" type="text" placeholder="Nome completo" value={formData.nome} onChange={handleChange} icon={UserIcon} />
                <FormInput id="email" type="email" placeholder="Seu melhor email" value={formData.email} onChange={handleChange} icon={MailIcon} />
                <FormInput id="senha" type="password" placeholder="Senha" value={formData.senha} onChange={handleChange} icon={LockIcon} />
                <FormInput id="confirmarSenha" type="password" placeholder="Confirme a senha" value={formData.confirmarSenha} onChange={handleChange} icon={LockIcon} />
                
                <button type="submit" disabled={loading || success} className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 transition-all duration-300">
                    {loading ? 'Criando Conta...' : 'CRIAR CONTA'}
                </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">Faça login</Link>
            </p>
        </div>
    </AuthLayout>
  );
}

export default Cadastro;