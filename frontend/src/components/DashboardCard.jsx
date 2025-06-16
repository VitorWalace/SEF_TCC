import React from 'react';
import { Link } from 'react-router-dom';

function DashboardCard({ to, icon: Icon, title, children, colorClass }) {
    return (
        <Link to={to} className={`block p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${colorClass}`}>
            <div className="flex items-center">
                <div className="mr-4">
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">{title}</h3>
                </div>
            </div>
            <p className="mt-2 text-sm opacity-90">{children}</p>
        </Link>
    );
}

export default DashboardCard;
