import { ApiClient } from './client';

export interface BaseCustomFieldGroup {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export class BaseCustomFieldGroupsAPI {
  constructor(private client: ApiClient) {}

  async create(projectId: string, name: string): Promise<BaseCustomFieldGroup> {
    return this.client.request<BaseCustomFieldGroup>(
      `/projects/${projectId}/base-custom-field-groups`,
      { method: 'POST', body: { name } }
    );
  }

  async update(id: string, name: string): Promise<BaseCustomFieldGroup> {
    return this.client.request<BaseCustomFieldGroup>(`/base-custom-field-groups/${id}`, {
      method: 'PATCH',
      body: { name },
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/base-custom-field-groups/${id}`, { method: 'DELETE' });
  }
}
