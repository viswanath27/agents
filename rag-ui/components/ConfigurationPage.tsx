import React, { useState, useMemo } from 'react';
import { ConfigTab, FullConfig } from '../types';
import { ServerSettings } from './ServerSettings';
import { LLMSettings } from './LLMSettings';
import { EmbeddingSettings } from './EmbeddingSettings';
import { ProcessingSettings } from './ProcessingSettings';
import { RAGQuerySettings } from './RAGQuerySettings';
import { DatabaseSettings } from './DatabaseSettings';
import { Button } from './common/Button';

interface ConfigurationPageProps {
    onNext: () => void;
}

const tabs: ConfigTab[] = ['Server', 'LLM', 'Embedding', 'Processing', 'RAG Query', 'Database'];

const initialConfig: FullConfig = {
    server: {
        host: '0.0.0.0',
        port: '9621',
        webUITitle: 'My Graph KB',
        webUIDescription: 'Simple and Fast Graph Based RAG System',
        logLevel: 'INFO',
        tiktokenCacheDir: './tiktoken_cache',
        authAccounts: '',
        tokenSecret: '',
        tokenExpireHours: 48,
        lightragApiKey: '',
        ssl: false,
        sslCertfile: '',
        sslKeyfile: '',
        inputDir: './inputs',
        logDir: './logs'
    },
    llm: {
        enableCache: true,
        enableCacheForExtract: true,
        timeout: 240,
        temperature: 0,
        maxAsync: 4,
        maxTokens: 32768,
        binding: 'openai',
        model: 'gpt-4o',
        host: 'https://api.openai.com/v1',
        apiKey: '',
        azureApiVersion: '2024-08-01-preview',
        azureDeployment: 'gpt-4o',
    },
    embedding: {
        binding: 'ollama',
        model: 'bge-m3:latest',
        dim: 1024,
        apiKey: '',
        host: 'http://localhost:11434',
        batchNum: 32,
        maxAsync: 16,
        azureDeployment: 'text-embedding-3-large',
    },
    processing: {
        parseMethod: 'auto',
        outputDir: './output',
        parser: 'mineru',
        enableImageProcessing: true,
        enableTableProcessing: true,
        chunkSize: 1200,
        chunkOverlap: 100,
        summaryLanguage: 'English'
    },
    ragQuery: {
        historyTurns: 3,
        cosineThreshold: 0.2,
        topK: 60,
        maxTokensTextChunk: 4000,
        maxTokensRelationDesc: 4000,
        maxTokensEntityDesc: 4000,
    },
    database: {
        kvStorage: 'PGKVStorage',
        vectorStorage: 'PGVectorStorage',
        docStatusStorage: 'PGDocStatusStorage',
        graphStorage: 'Neo4JStorage',
        postgres: {
            host: 'localhost',
            port: 5432,
            user: 'your_username',
            password: '',
            database: 'your_database',
        },
        neo4j: {
            uri: 'neo4j+s://xxxxxxxx.databases.neo4j.io',
            username: 'neo4j',
            password: '',
        }
    }
}

export const ConfigurationPage: React.FC<ConfigurationPageProps> = ({ onNext }) => {
    const [activeTab, setActiveTab] = useState<ConfigTab>('Server');
    const [config, setConfig] = useState<FullConfig>(initialConfig);

    const handleInputChange = (tab: keyof FullConfig, field: string, value: any) => {
        setConfig(prev => {
            const tabData = prev[tab];
            const fieldParts = field.split('.'); // For nested fields like 'postgres.host'
            
            if (fieldParts.length > 1) {
                return {
                    ...prev,
                    [tab]: {
                        ...tabData,
                        [fieldParts[0]]: {
                            //@ts-ignore
                            ...tabData[fieldParts[0]],
                            [fieldParts[1]]: value,
                        }
                    }
                }
            }

            return {
                ...prev,
                [tab]: {
                    ...tabData,
                    [field]: value,
                }
            };
        });
    };
    
    const handleReset = () => {
        setConfig(initialConfig);
    };

    const tabContent = useMemo(() => {
        switch (activeTab) {
            case 'Server': return <ServerSettings config={config.server} onChange={handleInputChange} />;
            case 'LLM': return <LLMSettings config={config.llm} onChange={handleInputChange} />;
            case 'Embedding': return <EmbeddingSettings config={config.embedding} onChange={handleInputChange} />;
            case 'Processing': return <ProcessingSettings config={config.processing} onChange={handleInputChange} />;
            case 'RAG Query': return <RAGQuerySettings config={config.ragQuery} onChange={handleInputChange} />;
            case 'Database': return <DatabaseSettings config={config.database} onChange={handleInputChange} />;
            default: return null;
        }
    }, [activeTab, config]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">System Configuration</h2>
                <p className="text-slate-500 mt-1">Configure your RAG system settings, models, and parameters</p>
            </div>
            
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-md`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="pt-8">
                {tabContent}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
                <Button variant="secondary" onClick={handleReset}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>
                    Reset
                </Button>
                <Button variant="primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    Save Configuration
                </Button>
                <Button variant="ghost" onClick={onNext}>
                    Next: Upload Document
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Button>
            </div>
        </div>
    );
};