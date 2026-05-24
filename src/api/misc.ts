import { ApiClient } from './client';

export interface Bootstrap {
  [key: string]: unknown;
}

export interface Terms {
  [key: string]: unknown;
}

export class MiscAPI {
  constructor(private client: ApiClient) {}

  async bootstrap(): Promise<Bootstrap> {
    return this.client.request<Bootstrap>('/bootstrap');
  }

  async terms(language?: string): Promise<Terms> {
    return this.client.request<Terms>('/terms', {
      query: language ? { language } : undefined,
    });
  }
}
