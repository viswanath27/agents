import React from 'react';

const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001 2.5L2.5 9.063l9.501 12.438 9.5-12.438L12.001 2.5zM12 5.215l6.904 4.54-6.904 9.048-6.903-9.048L12 5.215z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center">
        <DiamondIcon className="h-10 w-10 mr-4" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            RAG Document Intelligence
          </h1>
          <p className="text-sm sm:text-base text-blue-200">
            Enterprise Document Processing & Knowledge Extraction
          </p>
        </div>
      </div>
    </header>
  );
};