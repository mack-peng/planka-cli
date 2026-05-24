import { ApiClient } from './client';

export interface CustomField {
  id: string;
  name: string;
  position: number;
  showOnFrontOfCard: boolean;
  baseCustomFieldGroupId: string;
  customFieldGroupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomFieldParams {
  name: string;
  position?: number;
  showOnFrontOfCard?: boolean;
}

export class CustomFieldsAPI {
  constructor(private client: ApiClient) {}

  async createInBaseGroup(baseCustomFieldGroupId: string, data: CreateCustomFieldParams): Promise<CustomField> {
    return this.client.request<CustomField>(
      `/base-custom-field-groups/${baseCustomFieldGroupId}/custom-fields`,
      { method: 'POST', body: data }
    );
  }

  async createInGroup(customFieldGroupId: string, data: CreateCustomFieldParams): Promise<CustomField> {
    return this.client.request<CustomField>(
      `/custom-field-groups/${customFieldGroupId}/custom-fields`,
      { method: 'POST', body: data }
    );
  }

  async update(id: string, data: CreateCustomFieldParams): Promise<CustomField> {
    return this.client.request<CustomField>(`/custom-fields/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/custom-fields/${id}`, { method: 'DELETE' });
  }
}
