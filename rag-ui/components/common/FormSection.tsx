import React from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description }) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 pt-8 first:pt-0">
        {/* The border is hidden on the first section of a grid */}
        <div className="hidden first:block h-0"></div>
        <div className="block first:hidden border-t border-slate-200 -mx-8 mb-8"></div>

        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
);
