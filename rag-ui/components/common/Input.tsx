import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    description?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, description, ...props }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <input
                id={id}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                {...props}
            />
            {description && (
                <p className="mt-1 text-xs text-slate-500">{description}</p>
            )}
        </div>
    );
};