import { ApiClient } from './client';

export interface Card {
  id: string;
  name: string;
  description: string;
  position: number;
  boardId: string;
  listId: string;
  prevListId: string;
  type: string;
  dueDate: string;
  isDueCompleted: boolean;
  isClosed: boolean;
  coverAttachmentId: string;
  stopwatch: Record<string, unknown>;
  listChangedAt: string;
  creatorUserId: string;
  commentsTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardParams {
  name: string;
  description?: string;
  dueDate?: string;
  isDueCompleted?: boolean;
  position?: number;
  stopwatch?: Record<string, unknown>;
  type?: string;
}

export interface UpdateCardParams {
  name?: string;
  description?: string;
  dueDate?: string;
  isDueCompleted?: boolean;
  position?: number;
  stopwatch?: Record<string, unknown>;
  type?: string;
  boardId?: string;
  listId?: string;
  coverAttachmentId?: string;
  isSubscribed?: boolean;
}

export interface ListCardsQuery {
  beforeListChangedAt?: string;
  beforeId?: string;
  search?: string;
  userIds?: string;
  labelIds?: string;
}

export interface DuplicateCardParams {
  boardId?: string;
  listId?: string;
  name?: string;
  position?: number;
}

export class CardsAPI {
  constructor(private client: ApiClient) {}

  async get(id: string): Promise<Card> {
    return this.client.request<Card>(`/cards/${id}`);
  }

  async list(listId: string, query?: ListCardsQuery): Promise<Card[]> {
    const q: Record<string, string | undefined> = {};
    if (query) {
      if (query.beforeListChangedAt) q['before[listChangedAt]'] = query.beforeListChangedAt;
      if (query.beforeId) q['before[id]'] = query.beforeId;
      if (query.search) q['search'] = query.search;
      if (query.userIds) q['userIds'] = query.userIds;
      if (query.labelIds) q['labelIds'] = query.labelIds;
    }
    return this.client.request<Card[]>(`/lists/${listId}/cards`, { query: q });
  }

  async create(listId: string, data: CreateCardParams): Promise<Card> {
    return this.client.request<Card>(`/lists/${listId}/cards`, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateCardParams): Promise<Card> {
    return this.client.request<Card>(`/cards/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/cards/${id}`, { method: 'DELETE' });
  }

  async duplicate(id: string, data: DuplicateCardParams): Promise<Card> {
    return this.client.request<Card>(`/cards/${id}/duplicate`, {
      method: 'POST',
      body: data,
    });
  }

  async markNotificationsRead(id: string): Promise<void> {
    return this.client.request<void>(`/cards/${id}/read-notifications`, { method: 'POST' });
  }
}
