export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  isCover?: boolean;
  order: number;
}

export interface ProjectVideo {
  id: string;
  url: string;
  title: string;
  type: 'url' | 'file';
  posterUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  year: string | number;
  shortDescription: string;
  fullDescription: string;
  designConcept: string;
  challenges: string;
  solutions: string;
  coverImage: string;
  galleryImages: ProjectImage[];
  videos: ProjectVideo[];
  isFeatured: boolean;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectInput = Partial<CreateProjectInput>;

