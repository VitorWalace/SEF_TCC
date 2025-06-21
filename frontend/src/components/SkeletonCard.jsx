// File: frontend/src/components/SkeletonCard.jsx

import React from 'react';

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            {/* Animação de pulso para o esqueleto */}
            <div className="animate-pulse flex flex-col space-y-4">
                {/* Placeholder para a imagem */}
                <div className="bg-gray-200 h-40 rounded-md"></div>
                {/* Placeholder para o texto */}
                <div className="space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
                 <div className="space-y-2">
                    <div className="bg-gray-200 h-3 rounded w-full"></div>
                    <div className="bg-gray-200 h-3 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
}

export default SkeletonCard;