import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

export const ChatPanel: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([
        { id: 1, role: 'model', content: 'Hello! I have processed your documents. Ask me anything about their content.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        const newUserMessage: ChatMessageType = {
            id: Date.now(),
            role: 'user',
            content: text,
        };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        // Mock model response
        setTimeout(() => {
            const modelResponse: ChatMessageType = {
                id: Date.now() + 1,
                role: 'model',
                content: `Based on the processed documents, the annual revenue for 2023 was reported to be significantly higher than the previous year, driven by strong performance in the new "Phoenix Project".`,
            };
            setMessages(prev => [...prev, modelResponse]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[60vh] bg-slate-50 rounded-lg border border-slate-200 shadow-inner">
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                       <div className="flex items-end justify-start">
                            <div className="max-w-xl px-4 py-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-none">
                                <div className="flex items-center justify-center space-x-1">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
};