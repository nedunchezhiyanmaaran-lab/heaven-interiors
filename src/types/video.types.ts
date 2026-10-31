export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  projectId?: string;
  projectTitle?: string;
  isFeatured: boolean;
  displayOrder: number;
  isPublished: boolean;
  isTemporaryFile?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateVideoInput = Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateVideoInput = Partial<CreateVideoInput>;

