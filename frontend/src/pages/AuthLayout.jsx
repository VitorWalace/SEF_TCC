import React from 'react';

function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen font-sans bg-brand-light">
      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Lado Esquerdo - Boas-vindas (Visível em telas grandes) */}
        <div className="relative hidden lg:flex flex-col items-center justify-center bg-slate-900 p-12 overflow-hidden">
          {/* Fundo com "aurora" */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 right-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 text-center">
              <h1 className="text-5xl font-bold tracking-tight text-white">Saber em Fluxo</h1>
              {/* Cores ajustadas para maior visibilidade */}
              <p className="mt-4 text-2xl font-light text-slate-300">Conecte-se. Aprenda. Evolua.</p>
              <p className="mt-8 max-w-md text-lg text-slate-400">A plataforma definitiva para aprendizado colaborativo. Transforme seus estudos em uma jornada compartilhada.</p>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="flex flex-col items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
