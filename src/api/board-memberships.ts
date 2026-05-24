import { ApiClient } from './client';

export interface BoardMembership {
  id: string;
  boardId: string;
  userId: string;
  projectId: string;
  role: 'editor' | 'viewer';
  canComment: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardMembershipParams {
  userId: string;
  role: string;
  canComment: boolean;
}

export interface UpdateBoardMembershipParams {
  role?: string;
  canComment?: boolean;
}

export class BoardMembershipsAPI {
  constructor(private client: ApiClient) {}

  async create(boardId: string, data: CreateBoardMembershipParams): Promise<BoardMembership> {
    return this.client.request<BoardMembership>(`/boards/${boardId}/board-memberships`, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateBoardMembershipParams): Promise<BoardMembership> {
    return this.client.request<BoardMembership>(`/board-memberships/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/board-memberships/${id}`, { method: 'DELETE' });
  }
}
