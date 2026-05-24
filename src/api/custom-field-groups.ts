import { ApiClient } from './client';

export interface CustomFieldGroup {
  id: string;
  name: string;
  position: number;
  boardId: string;
  cardId: string;
  baseCustomFieldGroupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomFieldGroupParams {
  name: string;
  position?: number;
  baseCustomFieldGroupId?: string;
}

export interface UpdateCustomFieldGroupParams {
  name?: string;
  position?: number;
}

export class CustomFieldGroupsAPI {
  constructor(private client: ApiClient) {}

  async get(id: string): Promise<CustomFieldGroup> {
    return this.client.request<CustomFieldGroup>(`/custom-field-groups/${id}`);
  }

  async createForBoard(boardId: string, data: CreateCustomFieldGroupParams): Promise<CustomFieldGroup> {
    return this.client.request<CustomFieldGroup>(`/boards/${boardId}/custom-field-groups`, {
      method: 'POST',
      body: data,
    });
  }

  async createForCard(cardId: string, data: CreateCustomFieldGroupParams): Promise<CustomFieldGroup> {
    return this.client.request<CustomFieldGroup>(`/cards/${cardId}/custom-field-groups`, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateCustomFieldGroupParams): Promise<CustomFieldGroup> {
    return this.client.request<CustomFieldGroup>(`/custom-field-groups/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/custom-field-groups/${id}`, { method: 'DELETE' });
  }
}
