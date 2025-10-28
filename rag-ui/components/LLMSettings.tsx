import React from 'react';
import { LLMConfig, FullConfig } from '../types';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { Toggle } from './common/Toggle';
import { FormSection } from './common/FormSection';

interface LLMSettingsProps {
  config: LLMConfig;
  onChange: (tab: keyof FullConfig, field: keyof LLMConfig, value: any) => void;
}

export const LLMSettings: React.FC<LLMSettingsProps> = ({ config, onChange }) => {
    const handleChange = (field: keyof LLMConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange('llm', field, e.target.value);
    };
    const handleToggleChange = (field: keyof LLMConfig) => (value: boolean) => {
        onChange('llm', field, value);
    };
    const handleNumberChange = (field: keyof LLMConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('llm', field, parseFloat(e.target.value));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <FormSection title="Model Provider" description="Select and configure the LLM provider." />
            <Select
                label="LLM Binding"
                id="llm_binding"
                value={config.binding}
                onChange={handleChange('binding')}
                description="The provider service for the language model."
            >
                <option value="openai">openai</option>
                <option value="ollama">ollama</option>
                <option value="lollms">lollms</option>
                <option value="azure_openai">azure_openai</option>
                <option value="lmstudio">lmstudio</option>
            </Select>
            <Input
                label="LLM Model"
                id="llm_model"
                value={config.model}
                onChange={handleChange('model')}
                description="The specific model name to use."
            />
            <div className="lg:col-span-3">
                 <Input
                    label="Binding Host"
                    id="llm_host"
                    value={config.host}
                    onChange={handleChange('host')}
                    description="The API endpoint for the LLM service."
                />
            </div>
             <div className="lg:col-span-3">
                <Input
                    label="API Key"
                    id="llm_apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={handleChange('apiKey')}
                    description="Your API key for the selected service."
                />
            </div>

            {config.binding === 'azure_openai' && (
                 <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormSection title="Azure OpenAI Settings" description="Specific settings for Azure deployment." />
                     <Input
                        label="Azure API Version"
                        id="azureApiVersion"
                        value={config.azureApiVersion}
                        onChange={handleChange('azureApiVersion')}
                     />
                     <Input
                        label="Azure Deployment Name"
                        id="azureDeployment"
                        value={config.azureDeployment}
                        onChange={handleChange('azureDeployment')}
                     />
                 </div>
            )}


            <FormSection title="Performance & Behavior" description="Tune model performance and behavior."/>
            <Input
                label="Timeout (seconds)"
                id="timeout"
                type="number"
                value={config.timeout}
                onChange={handleNumberChange('timeout')}
            />
            <Input
                label="Temperature"
                id="temperature"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={config.temperature}
                onChange={handleNumberChange('temperature')}
            />
            <Input
                label="Max Tokens"
                id="maxTokens"
                type="number"
                value={config.maxTokens}
                onChange={handleNumberChange('maxTokens')}
            />
            <Input
                label="Max Concurrent Requests"
                id="maxAsync"
                type="number"
                value={config.maxAsync}
                onChange={handleNumberChange('maxAsync')}
            />
            
            <FormSection title="Caching" description="Enable caching to improve performance and reduce costs."/>
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <Toggle
                    id="enableCache"
                    label="Enable LLM Cache"
                    enabled={config.enableCache}
                    onChange={handleToggleChange('enableCache')}
                />
                <Toggle
                    id="enableCacheForExtract"
                    label="Enable Cache for Extraction"
                    enabled={config.enableCacheForExtract}
                    onChange={handleToggleChange('enableCacheForExtract')}
                />
            </div>
        </div>
    );
};
