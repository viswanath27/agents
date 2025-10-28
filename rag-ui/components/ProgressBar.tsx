import React from 'react';

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">Processing Documents</span>
                <span className="text-sm font-medium text-blue-700">{clampedProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${clampedProgress}%` }}
                ></div>
            </div>
        </div>
    );
};
