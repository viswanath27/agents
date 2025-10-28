import React, { useState, useCallback } from 'react';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    disabled?: boolean;
}

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf': return '📄';
        case 'doc':
        case 'docx': return '📝';
        case 'ppt':
        case 'pptx': return '📊';
        case 'xls':
        case 'xlsx': return '📈';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return '🖼️';
        default: return '📁';
    }
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, disabled }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (newFiles: FileList | null) => {
        if (newFiles) {
            const fileArray = Array.from(newFiles);
            const updatedFiles = [...files, ...fileArray];
            setFiles(updatedFiles);
            onFilesSelected(updatedFiles);
        }
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if(!disabled) setIsDragging(true);
    }, [disabled]);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if(!disabled) {
            handleFiles(e.dataTransfer.files);
        }
    }, [disabled, files]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const dropzoneClasses = `flex justify-center items-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
        disabled ? 'bg-slate-200 border-slate-300 cursor-not-allowed' :
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
    }`;

    return (
        <div>
            <div 
                className={dropzoneClasses}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    multiple
                    onChange={onFileChange}
                    disabled={disabled}
                />
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m0 0l4-4m-4 4h12" /></svg>
                    <p className="mt-2 text-sm text-slate-600">
                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">PDF, DOCX, PPTX, etc.</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-md font-semibold text-slate-700">Selected Files:</h3>
                    <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{getFileIcon(file.name)}</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 truncate" style={{maxWidth: '300px'}}>{file.name}</p>
                                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => !disabled && removeFile(index)}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                    disabled={disabled}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
