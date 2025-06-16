import React from 'react';

export const FormInput = ({ id, type, placeholder, value, onChange, icon: Icon }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        {Icon && <Icon className="w-5 h-5 text-gray-400"/>}
    </div>
    <input 
      id={id} 
      type={type} 
      placeholder={placeholder}
      value={value} 
      onChange={onChange} 
      required 
      className="block w-full pl-10 pr-4 py-3 text-brand-secondary bg-white border border-gray-200 rounded-lg focus:border-brand-accent/50 focus:ring-brand-accent/50 focus:outline-none focus:ring focus:ring-opacity-40 transition-all duration-300"
    />
  </div>
);
