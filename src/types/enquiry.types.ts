export type EnquiryStatus = 'new' | 'contacted' | 'completed';

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  budgetRange?: string;
  status: EnquiryStatus;
  createdAt: string;
  notes?: string;
}

export type CreateEnquiryInput = Omit<Enquiry, 'id' | 'createdAt' | 'status' | 'notes'> & {
  budgetRange?: string;
};

