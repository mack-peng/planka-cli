import { ApiClient } from './client';

export interface CardMembership {
  id: string;
  cardId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class CardMembershipsAPI {
  constructor(private client: ApiClient) {}

  async add(cardId: string, userId: string): Promise<CardMembership> {
    return this.client.request<CardMembership>(`/cards/${cardId}/card-memberships`, {
      method: 'POST',
      body: { userId },
    });
  }

  async remove(cardId: string, userId: string): Promise<void> {
    return this.client.request<void>(
      `/cards/${cardId}/card-memberships/userId:${userId}`,
      { method: 'DELETE' }
    );
  }
}
