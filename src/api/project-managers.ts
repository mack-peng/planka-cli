import { ApiClient } from './client';

export interface ProjectManager {
  id: string;
  userId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export class ProjectManagersAPI {
  constructor(private client: ApiClient) {}

  async create(projectId: string, userId: string): Promise<ProjectManager> {
    return this.client.request<ProjectManager>(`/projects/${projectId}/project-managers`, {
      method: 'POST',
      body: { userId },
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/project-managers/${id}`, { method: 'DELETE' });
  }
}
