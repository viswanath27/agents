import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
    message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                    AI
                </div>
            )}
            <div className={`max-w-lg px-4 py-3 rounded-2xl shadow-sm ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
        </div>
    );
};