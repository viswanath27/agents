import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: string;
    description?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, description, children, ...props }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <select
                id={id}
                className="block w-full pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                {...props}
            >
                {children}
            </select>
            {description && (
                <p className="mt-1 text-xs text-slate-500">{description}</p>
            )}
        </div>
    );
};