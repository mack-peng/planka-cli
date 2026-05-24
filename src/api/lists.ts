import { ApiClient } from './client';

export interface List_ {
  id: string;
  name: string;
  position: number;
  boardId: string;
  color: string;
  type: 'active' | 'closed' | 'archive' | 'trash';
  createdAt: string;
  updatedAt: string;
}

export interface CreateListParams {
  name: string;
  position?: number;
  type?: string;
}

export interface UpdateListParams {
  name?: string;
  position?: number;
  color?: string;
  type?: string;
  boardId?: string;
}

export class ListsAPI {
  constructor(private client: ApiClient) {}

  async get(id: string): Promise<List_> {
    return this.client.request<List_>(`/lists/${id}`);
  }

  async create(boardId: string, data: CreateListParams): Promise<List_> {
    return this.client.request<List_>(`/boards/${boardId}/lists`, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateListParams): Promise<List_> {
    return this.client.request<List_>(`/lists/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/lists/${id}`, { method: 'DELETE' });
  }

  async clear(id: string): Promise<void> {
    return this.client.request<void>(`/lists/${id}/clear`, { method: 'POST' });
  }

  async moveCards(id: string, listId: string): Promise<void> {
    return this.client.request<void>(`/lists/${id}/move-cards`, {
      method: 'POST',
      body: { listId },
    });
  }

  async sort(id: string, fieldName: string, order: string): Promise<void> {
    return this.client.request<void>(`/lists/${id}/sort`, {
      method: 'POST',
      body: { fieldName, order },
    });
  }
}
