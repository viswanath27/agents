export interface Step {
  id: number;
  name: string;
}

export type ConfigTab = 'Server' | 'LLM' | 'Embedding' | 'Processing' | 'RAG Query' | 'Database';

export interface ServerConfig {
  host: string;
  port: string;
  webUITitle: string;
  webUIDescription: string;
  logLevel: string;
  tiktokenCacheDir: string;
  authAccounts: string;
  tokenSecret: string;
  tokenExpireHours: number;
  lightragApiKey: string;
  ssl: boolean;
  sslCertfile: string;
  sslKeyfile: string;
  inputDir: string;
  logDir: string;
}

export interface LLMConfig {
  enableCache: boolean;
  enableCacheForExtract: boolean;
  timeout: number;
  temperature: number;
  maxAsync: number;
  maxTokens: number;
  binding: 'openai' | 'ollama' | 'lollms' | 'azure_openai' | 'lmstudio';
  model: string;
  host: string;
  apiKey: string;
  azureApiVersion: string;
  azureDeployment: string;
}

export interface EmbeddingConfig {
  binding: 'openai' | 'ollama' | 'lollms' | 'azure_openai' | 'lmstudio';
  model: string;
  dim: number;
  apiKey: string;
  host: string;
  batchNum: number;
  maxAsync: number;
  azureDeployment: string;
}

export interface ProcessingConfig {
  parseMethod: string;
  outputDir: string;
  parser: string;
  enableImageProcessing: boolean;
  enableTableProcessing: boolean;
  chunkSize: number;
  chunkOverlap: number;
  summaryLanguage: string;
}

export interface RAGQueryConfig {
  historyTurns: number;
  cosineThreshold: number;
  topK: number;
  maxTokensTextChunk: number;
  maxTokensRelationDesc: number;
  maxTokensEntityDesc: number;
}

export interface PostgresConfig {
  host: string;
  port: number;
  user: string;
  password: '';
  database: string;
}
export interface Neo4jConfig {
  uri: string;
  username: string;
  password: '';
}

export interface DatabaseConfig {
  kvStorage: string;
  vectorStorage: string;
  docStatusStorage: string;
  graphStorage: string;
  postgres: PostgresConfig;
  neo4j: Neo4jConfig;
}


export interface FullConfig {
  server: ServerConfig;
  llm: LLMConfig;
  embedding: EmbeddingConfig;
  processing: ProcessingConfig;
  ragQuery: RAGQueryConfig;
  database: DatabaseConfig;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'model';
  content: string;
}