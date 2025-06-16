import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Logo from '../components/Logo.jsx';
import { FormInput } from '../components/FormInput.jsx';
import { MailIcon } from '../components/icons/MailIcon.jsx';

function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(`Um email de recuperação foi enviado para ${email}.`);
    }, 1500);
  };

  return (
    <AuthLayout>
        <Logo />
        <div className="bg-white p-8 rounded-xl shadow-lg w-full mt-8">
            <h2 className="text-2xl font-bold text-center text-brand-secondary mb-2">Recuperar Senha</h2>
            {success ? (
                <div className="text-center mt-6">
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-md mb-6" role="alert">{success}</div>
                <Link to="/login" className="w-full inline-block py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700">Voltar para o Login</Link>
                </div>
            ) : (
                <>
                <p className="text-center text-gray-600 mb-6 text-sm">Insira seu email para receber o link de recuperação.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput id="email" type="email" placeholder="Seu email de cadastro" value={email} onChange={(e) => setEmail(e.target.value)} icon={MailIcon} />
                    {/* BOTÃO CORRIGIDO: Cor alterada para Índigo */}
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 transition-all duration-300">
                    {loading ? 'Enviando...' : 'ENVIAR LINK'}
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-600">
                    Lembrou a senha?{' '}
                    {/* LINK CORRIGIDO: Cor alterada para Índigo */}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">Faça login</Link>
                </p>
                </>
            )}
        </div>
    </AuthLayout>
  );
}

export default EsqueceuSenha;
