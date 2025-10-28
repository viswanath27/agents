import React from 'react';

interface ToggleProps {
    label: string;
    id: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, id, enabled, onChange, description }) => {
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
                {description && (
                    <p className="text-xs text-slate-500">{description}</p>
                )}
            </div>
            <button
                type="button"
                id={id}
                className={`${
                    enabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                role="switch"
                aria-checked={enabled}
                onClick={() => onChange(!enabled)}
            >
                <span
                    aria-hidden="true"
                    className={`${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
    );
};
