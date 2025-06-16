import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, BookOpenIcon } from './icons';

function UserCard({ user }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex items-center space-x-4">
                    <img className="h-16 w-16 rounded-full object-cover" src={user.avatarUrl} alt={`Avatar de ${user.name}`} />
                    <div>
                        <p className="text-xl font-bold text-gray-900">{user.name}</p>
                        <div className="flex items-center mt-1">
                            <StarIcon className="w-5 h-5 text-yellow-400" />
                            <span className="text-gray-600 font-semibold ml-1">{user.rating?.toFixed(1) || 'N/A'}</span>
                            <span className="text-gray-400 ml-2">({user.reviews || 0} avaliações)</span>
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-gray-600 text-sm h-10">
                    {/* Garante que a bio existe antes de a tentar cortar */}
                    {user.bio ? `${user.bio.substring(0, 70)}...` : 'Sem biografia disponível.'}
                </p>
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 flex items-center text-sm"><BookOpenIcon className="w-5 h-5 mr-2" /> Matérias</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {user.subjects?.slice(0, 3).map((subject) => (
                            <span key={subject} className="px-3 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                                {subject}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-6 bg-gray-50 mt-auto">
                 <Link to={`/perfil/${user.id}`} className="block w-full text-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                    Ver Perfil
                </Link>
            </div>
        </div>
    );
}

export default UserCard;
