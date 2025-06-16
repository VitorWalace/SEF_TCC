import React from 'react';

function SocialLink({ href, icon: Icon, children }) {
    if (!href) return null;
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <Icon className="w-5 h-5 mr-2" />
            <span>{children}</span>
        </a>
    );
}

export default SocialLink;
