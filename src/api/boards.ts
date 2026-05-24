import { ApiClient } from './client';

export interface Board {
  id: string;
  name: string;
  position: number;
  projectId: string;
  alwaysDisplayCardCreator: boolean;
  defaultCardType: string;
  defaultView: 'kanban' | 'grid' | 'list';
  expandTaskListsByDefault: boolean;
  limitCardTypesToDefaultOne: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardParams {
  name?: string;
  position?: number;
}

export interface UpdateBoardParams {
  name?: string;
  position?: number;
  alwaysDisplayCardCreator?: boolean;
  defaultCardType?: string;
  defaultView?: string;
  expandTaskListsByDefault?: boolean;
  isSubscribed?: boolean;
  limitCardTypesToDefaultOne?: boolean;
}

export class BoardsAPI {
  constructor(private client: ApiClient) {}

  async get(id: string, subscribe?: boolean): Promise<Board> {
    return this.client.request<Board>(`/boards/${id}`, {
      query: subscribe !== undefined ? { subscribe: String(subscribe) } : undefined,
    });
  }

  async create(projectId: string, data?: CreateBoardParams): Promise<Board> {
    return this.client.request<Board>(`/projects/${projectId}/boards`, {
      method: 'POST',
      body: data || {},
    });
  }

  async update(id: string, data: UpdateBoardParams): Promise<Board> {
    return this.client.request<Board>(`/boards/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/boards/${id}`, { method: 'DELETE' });
  }
}
