import { ApiClient } from './client';

export interface Task {
  id: string;
  name: string;
  position: number;
  taskListId: string;
  assigneeUserId: string;
  isCompleted: boolean;
  linkedCardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskParams {
  name: string;
  position?: number;
  isCompleted?: boolean;
  linkedCardId?: string;
}

export interface UpdateTaskParams {
  name?: string;
  position?: number;
  isCompleted?: boolean;
  assigneeUserId?: string;
  taskListId?: string;
}

export class TasksAPI {
  constructor(private client: ApiClient) {}

  async create(taskListId: string, data: CreateTaskParams): Promise<Task> {
    return this.client.request<Task>(`/task-lists/${taskListId}/tasks`, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateTaskParams): Promise<Task> {
    return this.client.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/tasks/${id}`, { method: 'DELETE' });
  }
}
