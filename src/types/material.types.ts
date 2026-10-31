export interface MaterialImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface MaterialSpecification {
  key: string;
  value: string;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  thickness: string;
  dimensions: string;
  finishType: string;
  color: string;
  specifications: MaterialSpecification[];
  additionalNotes: string;
  coverImage: string;
  galleryImages: MaterialImage[];
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateMaterialInput = Omit<Material, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMaterialInput = Partial<CreateMaterialInput>;

