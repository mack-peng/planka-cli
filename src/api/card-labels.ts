import { ApiClient } from './client';

export interface CardLabel {
  id: string;
  cardId: string;
  labelId: string;
  createdAt: string;
  updatedAt: string;
}

export class CardLabelsAPI {
  constructor(private client: ApiClient) {}

  async add(cardId: string, labelId: string): Promise<CardLabel> {
    return this.client.request<CardLabel>(`/cards/${cardId}/card-labels`, {
      method: 'POST',
      body: { labelId },
    });
  }

  async remove(cardId: string, labelId: string): Promise<void> {
    return this.client.request<void>(
      `/cards/${cardId}/card-labels/labelId:${labelId}`,
      { method: 'DELETE' }
    );
  }
}
