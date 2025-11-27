
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <input
        id={id}
        className="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
        {...props}
      />
    </div>
  );
};

export default Input;
