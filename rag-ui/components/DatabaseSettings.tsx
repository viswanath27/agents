import React, { useMemo } from 'react';
import { DatabaseConfig, FullConfig, PostgresConfig, Neo4jConfig } from '../types';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { FormSection } from './common/FormSection';

interface DatabaseSettingsProps {
  config: DatabaseConfig;
  onChange: (tab: keyof FullConfig, field: string, value: any) => void;
}

const PostgresForm: React.FC<{config: PostgresConfig, onChange: (field: string, value: any) => void}> = ({ config, onChange }) => (
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 p-4 border border-slate-200 rounded-lg">
        <h4 className="lg:col-span-3 font-semibold text-md text-slate-700">PostgreSQL Configuration</h4>
         <Input
            label="Host"
            id="pg_host"
            value={config.host}
            onChange={(e) => onChange('postgres.host', e.target.value)}
        />
        <Input
            label="Port"
            id="pg_port"
            type="number"
            value={config.port}
            onChange={(e) => onChange('postgres.port', parseInt(e.target.value))}
        />
        <Input
            label="Database"
            id="pg_database"
            value={config.database}
            onChange={(e) => onChange('postgres.database', e.target.value)}
        />
        <Input
            label="User"
            id="pg_user"
            value={config.user}
            onChange={(e) => onChange('postgres.user', e.target.value)}
        />
        <Input
            label="Password"
            id="pg_password"
            type="password"
            value={config.password}
            onChange={(e) => onChange('postgres.password', e.target.value)}
        />
    </div>
);

const Neo4jForm: React.FC<{config: Neo4jConfig, onChange: (field: string, value: any) => void}> = ({ config, onChange }) => (
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 p-4 border border-slate-200 rounded-lg">
        <h4 className="lg:col-span-3 font-semibold text-md text-slate-700">Neo4j Configuration</h4>
        <div className="lg:col-span-3">
             <Input
                label="Neo4j URI"
                id="neo4j_uri"
                value={config.uri}
                onChange={(e) => onChange('neo4j.uri', e.target.value)}
            />
        </div>
        <Input
            label="Username"
            id="neo4j_username"
            value={config.username}
            onChange={(e) => onChange('neo4j.username', e.target.value)}
        />
        <Input
            label="Password"
            id="neo4j_password"
            type="password"
            value={config.password}
            onChange={(e) => onChange('neo4j.password', e.target.value)}
        />
    </div>
);


export const DatabaseSettings: React.FC<DatabaseSettingsProps> = ({ config, onChange }) => {
    const handleChange = (field: keyof DatabaseConfig) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange('database', field, e.target.value);
    };

    const handleNestedChange = (field: string, value: any) => {
        onChange('database', field, value);
    }

    const needsPostgres = useMemo(() => {
        return Object.values(config).some(val => typeof val === 'string' && val.startsWith('PG'));
    }, [config]);

    const needsNeo4j = useMemo(() => {
        return Object.values(config).some(val => typeof val === 'string' && val.startsWith('Neo4J'));
    }, [config]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormSection title="Storage Backend Selection" description="Choose the data storage service for each component."/>
            <Select
                label="KV Storage"
                id="kvStorage"
                value={config.kvStorage}
                onChange={handleChange('kvStorage')}
            >
                <option>PGKVStorage</option>
                {/* Add other options here */}
            </Select>
             <Select
                label="Vector Storage"
                id="vectorStorage"
                value={config.vectorStorage}
                onChange={handleChange('vectorStorage')}
            >
                <option>PGVectorStorage</option>
                 {/* Add other options here */}
            </Select>
             <Select
                label="Doc Status Storage"
                id="docStatusStorage"
                value={config.docStatusStorage}
                onChange={handleChange('docStatusStorage')}
            >
                <option>PGDocStatusStorage</option>
                 {/* Add other options here */}
            </Select>
             <Select
                label="Graph Storage"
                id="graphStorage"
                value={config.graphStorage}
                onChange={handleChange('graphStorage')}
            >
                <option>Neo4JStorage</option>
                 {/* Add other options here */}
            </Select>

            <FormSection title="Database Connection Details" description="Provide credentials for the selected databases."/>
            
            {needsPostgres && <PostgresForm config={config.postgres} onChange={handleNestedChange} />}
            {needsNeo4j && <Neo4jForm config={config.neo4j} onChange={handleNestedChange} />}

        </div>
    );
};