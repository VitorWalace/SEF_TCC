// File: frontend/src/components/Layout.jsx

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ children, pageTitle }) {
  return (
    // Adicionamos as classes dark: aqui
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;