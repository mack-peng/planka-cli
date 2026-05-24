import { ApiClient } from './client';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  accessToken: string;
  events: string[];
  excludedEvents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookParams {
  name: string;
  url: string;
  events: string;
  excludedEvents?: string;
  accessToken?: string;
}

export interface UpdateWebhookParams {
  name?: string;
  url?: string;
  events?: string;
  excludedEvents?: string;
  accessToken?: string;
}

export class WebhooksAPI {
  constructor(private client: ApiClient) {}

  async list(): Promise<Webhook[]> {
    return this.client.request<Webhook[]>('/webhooks');
  }

  async create(data: CreateWebhookParams): Promise<Webhook> {
    return this.client.request<Webhook>('/webhooks', {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateWebhookParams): Promise<Webhook> {
    return this.client.request<Webhook>(`/webhooks/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/webhooks/${id}`, { method: 'DELETE' });
  }
}
