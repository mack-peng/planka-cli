import { ApiClient } from './client';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: 'admin' | 'projectOwner' | 'boardUser';
  organization: string;
  phone: string;
  language?: string;
  avatar: Record<string, unknown>;
  apiKeyPrefix?: string;
  defaultEditorMode?: string;
  defaultHomeView?: string;
  defaultProjectsOrder?: string;
  enableFavoritesByDefault?: boolean;
  gravatarUrl?: string;
  isDeactivated: boolean;
  isDefaultAdmin?: boolean;
  isSsoUser?: boolean;
  lockedFieldNames?: string[];
  subscribeToCardWhenCommenting?: boolean;
  subscribeToOwnCards?: boolean;
  turnOffRecentCardHighlighting?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserParams {
  email: string;
  name: string;
  username: string;
  password: string;
  language?: string;
  organization?: string;
  phone?: string;
  role?: string;
  subscribeToCardWhenCommenting?: boolean;
  subscribeToOwnCards?: boolean;
  turnOffRecentCardHighlighting?: boolean;
}

export interface UpdateUserParams {
  name?: string;
  organization?: string;
  phone?: string;
  role?: string;
  language?: string;
  defaultEditorMode?: string;
  defaultHomeView?: string;
  defaultProjectsOrder?: string;
  enableFavoritesByDefault?: boolean;
  isDeactivated?: boolean;
  isSsoUser?: boolean;
  subscribeToCardWhenCommenting?: boolean;
  subscribeToOwnCards?: boolean;
  turnOffRecentCardHighlighting?: boolean;
  apiKey?: Record<string, unknown>;
  avatar?: Record<string, unknown>;
}

export class UsersAPI {
  constructor(private client: ApiClient) {}

  async list(): Promise<User[]> {
    return this.client.request<User[]>('/users');
  }

  async get(id: string, subscribe?: boolean): Promise<User> {
    return this.client.request<User>(`/users/${id}`, {
      query: subscribe !== undefined ? { subscribe: String(subscribe) } : undefined,
    });
  }

  async create(data: CreateUserParams): Promise<User> {
    return this.client.request<User>('/users', {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateUserParams): Promise<User> {
    return this.client.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/users/${id}`, { method: 'DELETE' });
  }

  async createApiKey(id: string): Promise<{ item: string }> {
    return this.client.request<{ item: string }>(`/users/${id}/api-key`, { method: 'POST' });
  }

  async updateAvatar(id: string, formData: FormData): Promise<void> {
    return this.client.uploadFile<void>(`/users/${id}/avatar`, formData);
  }

  async updateEmail(id: string, email: string, currentPassword: string): Promise<void> {
    return this.client.request<void>(`/users/${id}/email`, {
      method: 'PATCH',
      body: { email, currentPassword },
    });
  }

  async updatePassword(id: string, password: string, currentPassword: string): Promise<void> {
    return this.client.request<void>(`/users/${id}/password`, {
      method: 'PATCH',
      body: { password, currentPassword },
    });
  }

  async updateUsername(id: string, username: string, currentPassword: string): Promise<void> {
    return this.client.request<void>(`/users/${id}/username`, {
      method: 'PATCH',
      body: { username, currentPassword },
    });
  }
}
