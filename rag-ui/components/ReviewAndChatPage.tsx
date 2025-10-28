import React from 'react';
import { Button } from './common/Button';
import { ChatPanel } from './ChatPanel';

interface ReviewAndChatPageProps {
    onBack: () => void;
}

export const ReviewAndChatPage: React.FC<ReviewAndChatPageProps> = ({ onBack }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Review & Chat</h2>
                <p className="text-slate-500 mt-1">Review extracted knowledge and interact with your documents.</p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Review Panel */}
                <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Extracted Knowledge</h3>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 h-full min-h-[40vh] lg:min-h-0">
                        <p className="text-sm text-slate-500">Review panel for entities, relationships, and document chunks will be displayed here.</p>
                        {/* Placeholder content */}
                        <div className="mt-4 space-y-3">
                            <div className="p-3 bg-white rounded-md shadow-sm border border-slate-100">
                                <h4 className="font-semibold text-sm text-slate-800">Entity: "Acme Corp"</h4>
                                <p className="text-xs text-slate-600">Type: Organization</p>
                            </div>
                             <div className="p-3 bg-white rounded-md shadow-sm border border-slate-100">
                                <h4 className="font-semibold text-sm text-slate-800">Entity: "Project Phoenix"</h4>
                                <p className="text-xs text-slate-600">Type: Project</p>
                            </div>
                             <div className="p-3 bg-white rounded-md shadow-sm border border-slate-100">
                                <h4 className="font-semibold text-sm text-slate-800">Relation: Reports</h4>
                                 <p className="text-xs text-slate-600">Acme Corp -&gt; Revenue -&gt; $1.2 Billion</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="lg:col-span-2">
                     <ChatPanel />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex">
                <Button variant="secondary" onClick={onBack}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                    Back to Document Processing
                </Button>
            </div>
        </div>
    );
};