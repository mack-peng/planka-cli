import { ApiClient } from './client';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  backgroundGradient: string;
  backgroundImageId: string;
  backgroundType: 'gradient' | 'image';
  isHidden: boolean;
  ownerProjectManagerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectParams {
  name: string;
  description?: string;
  type?: string;
}

export interface UpdateProjectParams {
  name?: string;
  description?: string;
  backgroundGradient?: string;
  backgroundImageId?: string;
  backgroundType?: string;
  isFavorite?: boolean;
  isHidden?: boolean;
  ownerProjectManagerId?: string;
}

export class ProjectsAPI {
  constructor(private client: ApiClient) {}

  async list(): Promise<Project[]> {
    return this.client.request<Project[]>('/projects');
  }

  async get(id: string): Promise<Project> {
    return this.client.request<Project>(`/projects/${id}`);
  }

  async create(data: CreateProjectParams): Promise<Project> {
    return this.client.request<Project>('/projects', {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateProjectParams): Promise<Project> {
    return this.client.request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/projects/${id}`, { method: 'DELETE' });
  }
}
