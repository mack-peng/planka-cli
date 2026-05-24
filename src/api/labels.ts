import { ApiClient } from './client';

export interface Label {
  id: string;
  name: string;
  color: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabelParams {
  name: string;
  color: string;
  position?: number;
}

export interface UpdateLabelParams {
  name?: string;
  color?: string;
  position?: number;
}

export class LabelsAPI {
  constructor(private client: ApiClient) {}

  async create(boardId: string, data: CreateLabelParams): Promise<Label> {
    return this.client.request<Label>(`/boards/${boardId}/labels`, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateLabelParams): Promise<Label> {
    return this.client.request<Label>(`/labels/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/labels/${id}`, { method: 'DELETE' });
  }
}
