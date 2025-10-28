import React from 'react';
import { ProcessingConfig, FullConfig } from '../types';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { FormSection } from './common/FormSection';
import { Toggle } from './common/Toggle';


interface ProcessingSettingsProps {
  config: ProcessingConfig;
  onChange: (tab: keyof FullConfig, field: keyof ProcessingConfig, value: any) => void;
}

export const ProcessingSettings: React.FC<ProcessingSettingsProps> = ({ config, onChange }) => {
    const handleChange = (field: keyof ProcessingConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange('processing', field, e.target.value);
    };
    const handleToggleChange = (field: keyof ProcessingConfig) => (value: boolean) => {
        onChange('processing', field, value);
    };
    const handleNumberChange = (field: keyof ProcessingConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('processing', field, parseFloat(e.target.value));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <FormSection title="Parsing & Extraction" description="How documents are parsed and content is extracted." />
            <Input
                label="Parse Method"
                id="parseMethod"
                value={config.parseMethod}
                onChange={handleChange('parseMethod')}
            />
            <Input
                label="Parser"
                id="parser"
                value={config.parser}
                onChange={handleChange('parser')}
            />
            <Input
                label="Output Directory"
                id="outputDir"
                value={config.outputDir}
                onChange={handleChange('outputDir')}
            />

            <FormSection title="Multimodal Processing" description="Enable processing for non-text content."/>
             <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <Toggle
                    id="enableImageProcessing"
                    label="Enable Image Processing"
                    enabled={config.enableImageProcessing}
                    onChange={handleToggleChange('enableImageProcessing')}
                />
                <Toggle
                    id="enableTableProcessing"
                    label="Enable Table Processing"
                    enabled={config.enableTableProcessing}
                    onChange={handleToggleChange('enableTableProcessing')}
                />
            </div>
            
            <FormSection title="Chunking" description="Settings for splitting documents into smaller chunks."/>
             <Input
                label="Chunk Size"
                id="chunkSize"
                type="number"
                value={config.chunkSize}
                onChange={handleNumberChange('chunkSize')}
                description="The maximum size of each text chunk."
            />
            <Input
                label="Chunk Overlap"
                id="chunkOverlap"
                type="number"
                value={config.chunkOverlap}
                onChange={handleNumberChange('chunkOverlap')}
                description="Number of tokens to overlap between chunks."
            />

            <FormSection title="Summarization" description="Configure entity and relation summarization."/>
             <Input
                label="Summary Language"
                id="summaryLanguage"
                value={config.summaryLanguage}
                onChange={handleChange('summaryLanguage')}
                description="The language for generating summaries."
            />

        </div>
    );
};