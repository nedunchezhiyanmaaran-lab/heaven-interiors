import { Enquiry, CreateEnquiryInput, EnquiryStatus } from '@/types/enquiry.types';
import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { INITIAL_ENQUIRIES } from '@/data/mock-enquiries';

export interface IEnquiryService {
  getAll(): Promise<Enquiry[]>;
  getById(id: string): Promise<Enquiry | null>;
  create(data: CreateEnquiryInput): Promise<Enquiry>;
  updateStatus(id: string, status: EnquiryStatus, notes?: string): Promise<Enquiry>;
  delete(id: string): Promise<void>;
}

class EnquiryService implements IEnquiryService {
  private getEnquiries(): Enquiry[] {
    return storageService.getItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  }

  private saveEnquiries(items: Enquiry[]): void {
    storageService.setItem(STORAGE_KEYS.ENQUIRIES, items);
  }

  async getAll(): Promise<Enquiry[]> {
    const list = this.getEnquiries();
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getById(id: string): Promise<Enquiry | null> {
    const all = await this.getAll();
    return all.find((e) => e.id === id) || null;
  }

  async create(data: CreateEnquiryInput): Promise<Enquiry> {
    const all = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...data,
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    all.unshift(newEnquiry);
    this.saveEnquiries(all);
    return newEnquiry;
  }

  async updateStatus(id: string, status: EnquiryStatus, notes?: string): Promise<Enquiry> {
    const all = this.getEnquiries();
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) {
      throw new Error(`Enquiry with id ${id} not found.`);
    }

    const updated: Enquiry = {
      ...all[idx],
      status,
      notes: notes !== undefined ? notes : all[idx].notes
    };

    all[idx] = updated;
    this.saveEnquiries(all);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const all = this.getEnquiries();
    const filtered = all.filter((e) => e.id !== id);
    this.saveEnquiries(filtered);
  }
}

export const enquiryService = new EnquiryService();

