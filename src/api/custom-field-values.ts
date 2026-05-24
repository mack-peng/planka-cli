import { ApiClient } from './client';

export interface CustomFieldValue {
  id: string;
  cardId: string;
  customFieldGroupId: string;
  customFieldId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export class CustomFieldValuesAPI {
  constructor(private client: ApiClient) {}

  async set(
    cardId: string,
    customFieldGroupId: string,
    customFieldId: string,
    content: string
  ): Promise<CustomFieldValue> {
    return this.client.request<CustomFieldValue>(
      `/cards/${cardId}/custom-field-values/customFieldGroupId:${customFieldGroupId}:customFieldId:${customFieldId}`,
      { method: 'PATCH', body: { content } }
    );
  }

  async delete(
    cardId: string,
    customFieldGroupId: string,
    customFieldId: string
  ): Promise<void> {
    return this.client.request<void>(
      `/cards/${cardId}/custom-field-value/customFieldGroupId:${customFieldGroupId}:customFieldId:${customFieldId}`,
      { method: 'DELETE' }
    );
  }
}
