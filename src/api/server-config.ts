import { ApiClient } from './client';

export interface ServerConfig {
  id: string;
  smtpFrom?: string;
  smtpHost?: string;
  smtpName?: string;
  smtpPassword?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpTlsRejectUnauthorized?: boolean;
  smtpUser?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class ServerConfigAPI {
  constructor(private client: ApiClient) {}

  async get(): Promise<ServerConfig> {
    return this.client.request<ServerConfig>('/config');
  }

  async update(data: Partial<Omit<ServerConfig, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServerConfig> {
    return this.client.request<ServerConfig>('/config', {
      method: 'PATCH',
      body: data,
    });
  }

  async testSmtp(): Promise<void> {
    return this.client.request<void>('/config/test-smtp', { method: 'POST' });
  }
}
