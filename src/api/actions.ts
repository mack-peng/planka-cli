import { ApiClient } from './client';

export interface Action {
  id: string;
  type: string;
  boardId: string;
  cardId: string;
  userId: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export class ActionsAPI {
  constructor(private client: ApiClient) {}

  async getBoardActions(boardId: string, beforeId?: string): Promise<Action[]> {
    return this.client.request<Action[]>(`/boards/${boardId}/actions`, {
      query: beforeId ? { beforeId } : undefined,
    });
  }

  async getCardActions(cardId: string, beforeId?: string): Promise<Action[]> {
    return this.client.request<Action[]>(`/cards/${cardId}/actions`, {
      query: beforeId ? { beforeId } : undefined,
    });
  }
}
