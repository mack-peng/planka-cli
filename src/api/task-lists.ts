import { ApiClient } from './client';

export interface TaskList {
  id: string;
  name: string;
  position: number;
  cardId: string;
  hideCompletedTasks: boolean;
  showOnFrontOfCard: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskListParams {
  name: string;
  position?: number;
  hideCompletedTasks?: boolean;
  showOnFrontOfCard?: boolean;
}

export interface UpdateTaskListParams {
  name?: string;
  position?: number;
  hideCompletedTasks?: boolean;
  showOnFrontOfCard?: boolean;
}

export class TaskListsAPI {
  constructor(private client: ApiClient) {}

  async get(id: string): Promise<TaskList> {
    return this.client.request<TaskList>(`/task-lists/${id}`);
  }

  async create(cardId: string, data: CreateTaskListParams): Promise<TaskList> {
    return this.client.request<TaskList>(`/cards/${cardId}/task-lists`, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateTaskListParams): Promise<TaskList> {
    return this.client.request<TaskList>(`/task-lists/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/task-lists/${id}`, { method: 'DELETE' });
  }
}
