export interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  projectAssociation: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export type CreateTestimonialInput = Omit<Testimonial, 'id' | 'createdAt'>;
export type UpdateTestimonialInput = Partial<CreateTestimonialInput>;

