import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500',
        ghost: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-blue-500',
    };
    
    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]}`}
            {...props}
        >
            {children}
        </button>
    );
};