import { ApiClient } from './client';

export interface Notification {
  id: string;
  userId: string;
  creatorUserId: string;
  actionId: string;
  cardId: string;
  boardId: string;
  commentId: string;
  type: string;
  isRead: boolean;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export class NotificationsAPI {
  constructor(private client: ApiClient) {}

  async list(): Promise<Notification[]> {
    return this.client.request<Notification[]>('/notifications');
  }

  async get(id: string): Promise<Notification> {
    return this.client.request<Notification>(`/notifications/${id}`);
  }

  async update(id: string, isRead: boolean): Promise<Notification> {
    return this.client.request<Notification>(`/notifications/${id}`, {
      method: 'PATCH',
      body: { isRead },
    });
  }

  async readAll(): Promise<void> {
    return this.client.request<void>('/notifications/read-all', { method: 'POST' });
  }
}
