import { ApiClient } from './client';

export interface Comment {
  id: string;
  cardId: string;
  text: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class CommentsAPI {
  constructor(private client: ApiClient) {}

  async list(cardId: string, beforeId?: string): Promise<Comment[]> {
    return this.client.request<Comment[]>(`/cards/${cardId}/comments`, {
      query: beforeId ? { beforeId } : undefined,
    });
  }

  async create(cardId: string, text: string): Promise<Comment> {
    return this.client.request<Comment>(`/cards/${cardId}/comments`, {
      method: 'POST',
      body: { text },
    });
  }

  async update(id: string, text: string): Promise<Comment> {
    return this.client.request<Comment>(`/comments/${id}`, {
      method: 'PATCH',
      body: { text },
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/comments/${id}`, { method: 'DELETE' });
  }
}
