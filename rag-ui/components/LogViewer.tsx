import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface LogViewerProps {
    logs: LogEntry[];
}

const getLogLevelColor = (level: LogEntry['level']) => {
    switch(level) {
        case 'INFO': return 'text-blue-400';
        case 'WARN': return 'text-yellow-400';
        case 'ERROR': return 'text-red-400';
        default: return 'text-gray-400';
    }
};

export const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div>
            <h3 className="text-md font-semibold text-slate-700 mb-2">Live Log</h3>
            <div ref={logContainerRef} className="bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm text-gray-200 shadow-inner">
                {logs.map((log, index) => (
                    <div key={index} className="flex">
                        <span className="text-gray-500 mr-4">{log.timestamp}</span>
                        <span className={`font-bold w-12 ${getLogLevelColor(log.level)}`}>{log.level}</span>
                        <span>{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
