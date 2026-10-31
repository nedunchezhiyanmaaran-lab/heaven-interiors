export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  deliverables: string[];
  displayOrder: number;
  isPublished: boolean;
}

export type CreateServiceInput = Omit<ServiceItem, 'id'>;
export type UpdateServiceInput = Partial<CreateServiceInput>;

