// File: frontend/src/components/StatCard.jsx

import React from 'react';

function StatCard({ icon: Icon, value, label, color }) {
    return (
        // O fundo do card continua com o efeito de vidro
        <div className="flex items-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm shadow-lg">
            <div className={`p-3 rounded-full mr-4 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                {/* AQUI ESTÁ A MUDANÇA: trocamos 'text-white' por 'text-gray-800' e 'text-gray-600' */}
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
            </div>
        </div>
    );
}

export default StatCard;