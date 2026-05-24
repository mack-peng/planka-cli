import { ApiClient } from './client';

export interface Attachment {
  id: string;
  cardId: string;
  name: string;
  type: 'file' | 'link';
  data: Record<string, unknown>;
  creatorUserId: string;
  createdAt: string;
  updatedAt: string;
}

export class AttachmentsAPI {
  constructor(private client: ApiClient) {}

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/attachments/${id}`, { method: 'DELETE' });
  }

  async update(id: string, data: { name?: string }): Promise<Attachment> {
    return this.client.request<Attachment>(`/attachments/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }
}
