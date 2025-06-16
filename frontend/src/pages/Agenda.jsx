import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout.jsx';
import AddEventModal from '../components/AddEventModal.jsx';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/icons';

const initialEvents = [
    { date: '2025-06-15', title: 'Sessão de Cálculo I', time: '14:00', with: 'Ana Silva' },
    { date: '2025-06-22', title: 'Revisão de Redação', time: '10:00', with: 'Bruno Costa' },
];

function Agenda() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // Inicia em Junho de 2025
    const [events, setEvents] = useState(initialEvents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const daysInMonth = useMemo(() => {
        const days = [];
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        return days;
    }, [currentDate]);

    const startingDayIndex = firstDayOfMonth.getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setIsModalOpen(true);
    };

    const handleAddEvent = ({ title, time }) => {
        const dateString = selectedDate.toISOString().split('T')[0];
        const newEvent = { date: dateString, title, time, with: 'Auto-agendado' };
        setEvents([...events, newEvent]);
    };

    return (
        <Layout pageTitle="A Minha Agenda">
            {isModalOpen && <AddEventModal date={selectedDate} onClose={() => setIsModalOpen(false)} onAddEvent={handleAddEvent} />}

            <div className="bg-white p-6 rounded-xl shadow-md">
                {/* Cabeçalho do Calendário */}
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">
                        {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate)}
                    </h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">
                        <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Grelha do Calendário */}
                <div className="grid grid-cols-7 gap-1 text-center">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="font-semibold text-gray-600 text-sm py-2">{day}</div>
                    ))}

                    {Array.from({ length: startingDayIndex }).map((_, index) => (
                        <div key={`empty-${index}`} className="border rounded-md border-transparent"></div>
                    ))}

                    {daysInMonth.map(day => {
                        const dateString = day.toISOString().split('T')[0];
                        const dayEvents = events.filter(e => e.date === dateString);
                        const isToday = new Date().toDateString() === day.toDateString();

                        return (
                            <div key={day.toString()} onClick={() => handleDayClick(day)} className="border rounded-md p-2 h-32 flex flex-col cursor-pointer hover:bg-gray-50 transition-colors">
                                <span className={`font-semibold ${isToday ? 'bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center' : 'text-gray-700'}`}>
                                    {day.getDate()}
                                </span>
                                <div className="flex-grow overflow-y-auto mt-1">
                                    {dayEvents.map(event => (
                                        <div key={event.title} className="bg-indigo-100 text-indigo-800 text-xs p-1 rounded-md mb-1 truncate">
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}

export default Agenda;
