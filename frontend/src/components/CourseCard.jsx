// File: frontend/src/components/CourseCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon } from './icons';

function CourseCard({ course }) {
    const imageUrl = course.course_image_url || 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070';

    return (
        // Adicionamos as mesmas classes de transição aqui
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
            <img className="h-40 w-full object-cover" src={imageUrl} alt={`Capa do curso ${course.title}`} />
            
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 truncate" title={course.title}>{course.title}</h3>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                    <UserCircleIcon className="w-5 h-5 mr-2" />
                    <span>Criado por <strong>{course.instructor_name}</strong></span>
                </div>
                <p className="mt-4 text-gray-600 text-sm h-16 overflow-hidden">
                    {course.description}
                </p>
            </div>
            
            <div className="p-4 bg-gray-50 mt-auto">
                 <Link 
                    to={`/courses/${course.id}`}
                    className="block w-full text-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
                >
                    Ver Curso
                </Link>
            </div>
        </div>
    );
}

export default CourseCard;