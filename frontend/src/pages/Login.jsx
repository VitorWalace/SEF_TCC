// File: frontend/src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Logo from '../components/Logo.jsx';
import { FormInput } from '../components/FormInput.jsx';
import { MailIcon } from '../components/icons/MailIcon.jsx';
import { LockIcon } from '../components/icons/LockIcon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { user, token } = response.data;
      login(user, token);
      navigate('/home');
    } catch (err) {
      const message = err.response?.data?.message || 'Email ou senha inválidos. Verifique suas credenciais.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-md w-full space-y-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="text-center">
            <div className="flex justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
              <Logo className="w-32 h-32" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Bem-vindo(a) de volta</h2>
            <p className="text-sm text-gray-600 mb-8">Entre na sua conta para continuar sua jornada de aprendizado</p>
          </div>

          <div className="bg-white py-8 px-10 shadow-2xl rounded-2xl space-y-6 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-center p-4 rounded-lg border-l-4 border-red-500 text-red-700 animate-shake" role="alert">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <FormInput
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={MailIcon}
                  className="transform transition-all duration-300 focus:scale-[1.02]"
                />
                <FormInput
                  id="password"
                  type="password"
                  placeholder="A sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={LockIcon}
                  className="transform transition-all duration-300 focus:scale-[1.02]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/esqueceu-senha" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    A validar...
                  </span>
                ) : (
                  'ENTRAR'
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-300 hover:underline">
                Registe-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;