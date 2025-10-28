import React from 'react';
import { RAGQueryConfig, FullConfig } from '../types';
import { Input } from './common/Input';
import { FormSection } from './common/FormSection';

interface RAGQuerySettingsProps {
  config: RAGQueryConfig;
  onChange: (tab: keyof FullConfig, field: keyof RAGQueryConfig, value: any) => void;
}

export const RAGQuerySettings: React.FC<RAGQuerySettingsProps> = ({ config, onChange }) => {
    const handleNumberChange = (field: keyof RAGQueryConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('ragQuery', field, parseFloat(e.target.value));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <FormSection title="Retrieval Parameters" description="Control how information is retrieved from the knowledge base." />
            <Input
                label="History Turns"
                id="historyTurns"
                type="number"
                value={config.historyTurns}
                onChange={handleNumberChange('historyTurns')}
                description="Number of previous conversation turns to include as context."
            />
            <Input
                label="Cosine Similarity Threshold"
                id="cosineThreshold"
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={config.cosineThreshold}
                onChange={handleNumberChange('cosineThreshold')}
                description="Minimum similarity score for retrieved chunks."
            />
            <Input
                label="Top K"
                id="topK"
                type="number"
                value={config.topK}
                onChange={handleNumberChange('topK')}
                description="The maximum number of chunks to retrieve."
            />
            
            <FormSection title="Context Token Limits" description="Set maximum token limits for different context elements."/>
            <Input
                label="Max Tokens for Text Chunk"
                id="maxTokensTextChunk"
                type="number"
                value={config.maxTokensTextChunk}
                onChange={handleNumberChange('maxTokensTextChunk')}
            />
            <Input
                label="Max Tokens for Relation Description"
                id="maxTokensRelationDesc"
                type="number"
                value={config.maxTokensRelationDesc}
                onChange={handleNumberChange('maxTokensRelationDesc')}
            />
             <Input
                label="Max Tokens for Entity Description"
                id="maxTokensEntityDesc"
                type="number"
                value={config.maxTokensEntityDesc}
                onChange={handleNumberChange('maxTokensEntityDesc')}
            />
        </div>
    );
};