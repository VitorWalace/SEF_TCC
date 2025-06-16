import React from 'react';

function StatCard({ icon: Icon, value, label, color }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className={`p-3 rounded-full mr-4 ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
}

export default StatCard;