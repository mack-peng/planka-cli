import { ApiClient } from './client';

export interface BackgroundImage {
  id: string;
  projectId: string;
  url: string;
  thumbnailUrls: Record<string, string>;
  size: string;
  createdAt: string;
  updatedAt: string;
}

export class BackgroundImagesAPI {
  constructor(private client: ApiClient) {}

  async delete(id: string): Promise<void> {
    return this.client.request<void>(`/background-images/${id}`, { method: 'DELETE' });
  }

  async upload(projectId: string, formData: FormData): Promise<BackgroundImage> {
    return this.client.uploadFile<BackgroundImage>(
      `/projects/${projectId}/background-images`,
      formData
    );
  }
}
