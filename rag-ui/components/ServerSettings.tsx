import React from 'react';
import { ServerConfig, FullConfig } from '../types';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { FormSection } from './common/FormSection';
import { Toggle } from './common/Toggle';

interface ServerSettingsProps {
    config: ServerConfig;
    onChange: (tab: keyof FullConfig, field: keyof ServerConfig, value: any) => void;
}

export const ServerSettings: React.FC<ServerSettingsProps> = ({ config, onChange }) => {
    const handleChange = (field: keyof ServerConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange('server', field, e.target.value);
    };
     const handleToggleChange = (field: keyof ServerConfig) => (value: boolean) => {
        onChange('server', field, value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <FormSection title="Web Server" description="Basic web server and UI settings."/>
            <Input 
                label="Host"
                id="host"
                value={config.host}
                onChange={handleChange('host')}
                description="Server host address"
            />
            <Input 
                label="Port"
                id="port"
                type="number"
                value={config.port}
                onChange={handleChange('port')}
                description="Server port number"
            />
            <Input 
                label="WebUI Title"
                id="webUITitle"
                value={config.webUITitle}
                onChange={handleChange('webUITitle')}
                description="Title displayed in the web interface"
            />
            <div className="lg:col-span-3">
                <Input 
                    label="WebUI Description"
                    id="webUIDescription"
                    value={config.webUIDescription}
                    onChange={handleChange('webUIDescription')}
                    description="Description shown in the web interface"
                />
            </div>

            <FormSection title="Authentication & API" description="Configure user access and server API key."/>
            <Input 
                label="Auth Accounts"
                id="authAccounts"
                value={config.authAccounts}
                onChange={handleChange('authAccounts')}
                placeholder="user1:pass1,user2:pass2"
                description="Comma-separated user:password pairs."
            />
            <Input 
                label="Token Secret Key"
                id="tokenSecret"
                type="password"
                value={config.tokenSecret}
                onChange={handleChange('tokenSecret')}
                description="Secret key for signing JWT tokens."
            />
            <Input 
                label="Token Expiration (hours)"
                id="tokenExpireHours"
                type="number"
                value={config.tokenExpireHours}
                onChange={handleChange('tokenExpireHours')}
                description="User token validity period."
            />
            <div className="lg:col-span-3">
                <Input 
                    label="LightRAG API Key"
                    id="lightragApiKey"
                    type="password"
                    value={config.lightragApiKey}
                    onChange={handleChange('lightragApiKey')}
                    description="API key required to access the LightRAG Server API."
                />
            </div>
            
            <FormSection title="Security (SSL)" description="Enable and configure SSL for HTTPS."/>
            <div className="lg:col-span-3">
                <Toggle
                    id="ssl"
                    label="Enable SSL"
                    enabled={config.ssl}
                    onChange={handleToggleChange('ssl')}
                    description="Encrypt traffic with SSL/TLS."
                 />
            </div>
             {config.ssl && (
                <>
                    <Input
                        label="SSL Certificate File"
                        id="sslCertfile"
                        value={config.sslCertfile}
                        onChange={handleChange('sslCertfile')}
                        placeholder="/path/to/cert.pem"
                    />
                    <Input
                        label="SSL Key File"
                        id="sslKeyfile"
                        value={config.sslKeyfile}
                        onChange={handleChange('sslKeyfile')}
                        placeholder="/path/to/key.pem"
                    />
                </>
            )}

            <FormSection title="Directories & Logging" description="Set up paths for inputs, cache, and logs." />
             <Input 
                label="Input Directory"
                id="inputDir"
                value={config.inputDir}
                onChange={handleChange('inputDir')}
                description="Absolute path for document input directory."
            />
            <Input 
                label="TIKTOKEN Cache Directory"
                id="tiktokenCacheDir"
                value={config.tiktokenCacheDir}
                onChange={handleChange('tiktokenCacheDir')}
                description="Local directory for cached tiktoken models."
            />
             <Input 
                label="Log Directory"
                id="logDir"
                value={config.logDir}
                onChange={handleChange('logDir')}
                description="Directory to store log files."
            />
            <Select
                label="Log Level"
                id="logLevel"
                value={config.logLevel}
                onChange={handleChange('logLevel')}
                description="Logging verbosity level."
            >
                <option>INFO</option>
                <option>DEBUG</option>
                <option>WARN</option>
                <option>ERROR</option>
            </Select>
           
        </div>
    );
};