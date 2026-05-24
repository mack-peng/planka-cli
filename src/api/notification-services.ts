import { ApiClient } from './client';

export interface NotificationService {
  id: string;
  url: string;
  format: 'text' | 'markdown' | 'html';
  boardId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationServiceParams {
  url: string;
  format: string;
}

export class NotificationServicesAPI {
  constructor(private client: ApiClient) {}

  async createForBoard(boardId: string, data: CreateNotificationServiceParams): Promise<NotificationService> {
    return this.client.request<NotificationService>(`/boards/${boardId}/notification-services`, {
      method: 'POST',
      body: data,
    });
  }

  async createForUser(userId: string, data: CreateNotificationServiceParams): Promise<NotificationService> {
    return this.client.request<NotificationService>(`/users/${userId}/notification-services`, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: CreateNotificationServiceParams): Promise<NotificationService> {
    return this.client.request<NotificationService>(`/notification-services/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/notification-services/${id}`, { method: 'DELETE' });
  }

  async test(id: string): Promise<void> {
    return this.client.request<void>(`/notification-services/${id}/test`, { method: 'POST' });
  }
}
