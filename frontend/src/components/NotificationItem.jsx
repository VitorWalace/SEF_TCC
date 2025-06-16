import React from 'react';
import { HeartIcon, ChatBubbleIcon, UserPlusIcon } from './icons';

const iconMap = {
    like: <HeartIcon className="w-6 h-6 text-white" />,
    message: <ChatBubbleIcon className="w-6 h-6 text-white" />,
    follower: <UserPlusIcon className="w-6 h-6 text-white" />,
};

const colorMap = {
    like: 'bg-pink-500',
    message: 'bg-sky-500',
    follower: 'bg-emerald-500',
};

function NotificationItem({ notification, onMarkAsRead }) {
    return (
        <div
            onClick={() => onMarkAsRead(notification.id)}
            className={`flex items-start p-4 border-b border-gray-200 cursor-pointer transition-colors duration-200 ${notification.read ? 'bg-white' : 'bg-indigo-50 hover:bg-indigo-100'}`}
        >
            {!notification.read && <span className="h-2 w-2 bg-indigo-500 rounded-full mr-3 mt-2 animate-pulse"></span>}
            <div className={`p-3 rounded-full mr-4 ${colorMap[notification.type]}`}>
                {iconMap[notification.type]}
            </div>
            <div className="flex-grow">
                <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: notification.text }}></p>
                <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
            </div>
        </div>
    );
}

export default NotificationItem;