import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './common/Button';
import { FileUpload } from './FileUpload';
import { ProgressBar } from './ProgressBar';
import { LogViewer } from './LogViewer';
import { LogEntry } from '../types';

interface DocumentProcessingPageProps {
    onBack: () => void;
    onNext: () => void;
}

const mockLogs: Omit<LogEntry, 'timestamp'>[] = [
    { level: 'INFO', message: 'Starting document processing...' },
    { level: 'INFO', message: 'Found 3 documents to process.' },
    { level: 'INFO', message: 'Processing "Annual_Report_2023.pdf"...' },
    { level: 'INFO', message: 'Extracting text content...' },
    { level: 'INFO', message: 'Text extraction complete. 5,432 words found.' },
    { level: 'INFO', message: 'Chunking document into 25 parts.' },
    { level: 'INFO', message: 'Generating embeddings for chunks 1-10...' },
    { level: 'WARN', message: 'Image on page 12 could not be parsed.' },
    { level: 'INFO', message: 'Generating embeddings for chunks 11-25...' },
    { level: 'INFO', message: 'Finished processing "Annual_Report_2023.pdf".' },
    { level: 'INFO', message: 'Processing "Market_Analysis_Q4.docx"...' },
    { level: 'INFO', message: 'Extracting text content...' },
    { level: 'INFO', message: 'Text extraction complete. 1,289 words found.' },
    { level: 'INFO', message: 'Finished processing "Market_Analysis_Q4.docx".' },
    { level: 'INFO', message: 'Processing "Competitor_Overview.pptx"...' },
    { level: 'ERROR', message: 'Failed to process "Competitor_Overview.pptx". File is corrupted.' },
    { level: 'INFO', message: 'Document processing complete. 2/3 files processed successfully.' },
];

export const DocumentProcessingPage: React.FC<DocumentProcessingPageProps> = ({ onBack, onNext }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const handleFilesSelected = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
    };

    const startProcessing = () => {
        setIsProcessing(true);
        setLogs([]);
        setProgress(0);
    };

    useEffect(() => {
        if (!isProcessing) return;

        const totalSteps = mockLogs.length;
        let currentStep = 0;

        const logInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                const newLog = mockLogs[currentStep];
                setLogs(prev => [...prev, { ...newLog, timestamp: new Date().toLocaleTimeString() }]);
                currentStep++;
                setProgress(Math.round((currentStep / totalSteps) * 100));
            } else {
                clearInterval(logInterval);
                setIsProcessing(false);
            }
        }, 500);

        return () => clearInterval(logInterval);
    }, [isProcessing]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Document Processing</h2>
                <p className="text-slate-500 mt-1">Upload your documents to build the knowledge graph.</p>
            </div>
            
            <FileUpload onFilesSelected={handleFilesSelected} disabled={isProcessing} />

            {files.length > 0 && (
                <div className="mt-8 text-center">
                    <Button variant="primary" onClick={startProcessing} disabled={isProcessing || files.length === 0}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        {isProcessing ? 'Processing...' : `Start Processing ${files.length} File(s)`}
                    </Button>
                </div>
            )}
            
            {(isProcessing || logs.length > 0) && (
                <div className="mt-8 space-y-6">
                    <ProgressBar progress={progress} />
                    <LogViewer logs={logs} />
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                 <Button variant="secondary" onClick={onBack} disabled={isProcessing}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                    Back to Configuration
                </Button>
                <Button variant="ghost" onClick={onNext} disabled={isProcessing || progress < 100}>
                    Next: Review & Chat
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Button>
            </div>
        </div>
    );
};
