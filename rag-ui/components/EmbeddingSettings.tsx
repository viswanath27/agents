import React from 'react';
import { EmbeddingConfig, FullConfig } from '../types';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { FormSection } from './common/FormSection';

interface EmbeddingSettingsProps {
  config: EmbeddingConfig;
  onChange: (tab: keyof FullConfig, field: keyof EmbeddingConfig, value: any) => void;
}

export const EmbeddingSettings: React.FC<EmbeddingSettingsProps> = ({ config, onChange }) => {
    const handleChange = (field: keyof EmbeddingConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange('embedding', field, e.target.value);
    };
    const handleNumberChange = (field: keyof EmbeddingConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('embedding', field, parseFloat(e.target.value));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <FormSection title="Model Provider" description="Select and configure the embedding model provider." />
            <Select
                label="Embedding Binding"
                id="embedding_binding"
                value={config.binding}
                onChange={handleChange('binding')}
                description="The provider service for the embedding model."
            >
                <option value="openai">openai</option>
                <option value="ollama">ollama</option>
                <option value="lollms">lollms</option>
                <option value="azure_openai">azure_openai</option>
                <option value="lmstudio">lmstudio</option>
            </Select>
            <Input
                label="Embedding Model"
                id="embedding_model"
                value={config.model}
                onChange={handleChange('model')}
                description="The specific model name to use."
            />
            <Input
                label="Embedding Dimensions"
                id="embedding_dim"
                type="number"
                value={config.dim}
                onChange={handleNumberChange('dim')}
                description="The dimensionality of the embedding vectors."
            />
             <div className="lg:col-span-3">
                 <Input
                    label="Binding Host"
                    id="embedding_host"
                    value={config.host}
                    onChange={handleChange('host')}
                    description="The API endpoint for the embedding service."
                />
            </div>
            <div className="lg:col-span-3">
                <Input
                    label="API Key"
                    id="embedding_apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={handleChange('apiKey')}
                    description="Your API key for the selected service."
                />
            </div>
            {config.binding === 'azure_openai' && (
                 <div className="lg:col-span-3">
                    <FormSection title="Azure OpenAI Settings" description="Specific settings for Azure deployment." />
                     <Input
                        label="Azure Embedding Deployment Name"
                        id="azureDeployment"
                        value={config.azureDeployment}
                        onChange={handleChange('azureDeployment')}
                     />
                 </div>
            )}
            <FormSection title="Performance" description="Tune embedding performance."/>
            <Input
                label="Batch Size"
                id="batchNum"
                type="number"
                value={config.batchNum}
                onChange={handleNumberChange('batchNum')}
                description="Number of chunks to send in a single request."
            />
            <Input
                label="Max Concurrent Requests"
                id="maxAsync"
                type="number"
                value={config.maxAsync}
                onChange={handleNumberChange('maxAsync')}
                description="Maximum concurrent requests to the embedding service."
            />
        </div>
    );
};
