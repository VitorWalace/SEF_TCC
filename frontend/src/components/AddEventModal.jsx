import React, { useState } from 'react';

function AddEventModal({ date, onClose, onAddEvent }) {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('14:00');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;
        onAddEvent({ title, time });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Adicionar Evento</h2>
                <p className="mb-4 text-gray-600">Data: <span className="font-semibold">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(date)}</span></p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título do Evento</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Hora</label>
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Adicionar Evento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEventModal;