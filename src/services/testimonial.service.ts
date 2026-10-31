import { Testimonial, CreateTestimonialInput, UpdateTestimonialInput } from '@/types/testimonial.types';
import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { INITIAL_TESTIMONIALS } from '@/data/mock-testimonials';

export interface ITestimonialService {
  getAll(): Promise<Testimonial[]>;
  getPublished(): Promise<Testimonial[]>;
  getById(id: string): Promise<Testimonial | null>;
  create(data: CreateTestimonialInput): Promise<Testimonial>;
  update(id: string, data: UpdateTestimonialInput): Promise<Testimonial>;
  delete(id: string): Promise<void>;
  togglePublish(id: string): Promise<Testimonial>;
}

class TestimonialService implements ITestimonialService {
  private getTestimonials(): Testimonial[] {
    return storageService.getItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  }

  private saveTestimonials(items: Testimonial[]): void {
    storageService.setItem(STORAGE_KEYS.TESTIMONIALS, items);
  }

  async getAll(): Promise<Testimonial[]> {
    const list = this.getTestimonials();
    return [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getPublished(): Promise<Testimonial[]> {
    const all = await this.getAll();
    return all.filter((t) => t.isPublished);
  }

  async getById(id: string): Promise<Testimonial | null> {
    const all = await this.getAll();
    return all.find((t) => t.id === id) || null;
  }

  async create(data: CreateTestimonialInput): Promise<Testimonial> {
    const all = this.getTestimonials();
    const newTestimonial: Testimonial = {
      ...data,
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      displayOrder: data.displayOrder ?? all.length + 1
    };

    all.push(newTestimonial);
    this.saveTestimonials(all);
    return newTestimonial;
  }

  async update(id: string, data: UpdateTestimonialInput): Promise<Testimonial> {
    const all = this.getTestimonials();
    const idx = all.findIndex((t) => t.id === id);
    if (idx === -1) {
      throw new Error(`Testimonial with id ${id} not found.`);
    }

    const updated: Testimonial = {
      ...all[idx],
      ...data
    };

    all[idx] = updated;
    this.saveTestimonials(all);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const all = this.getTestimonials();
    const filtered = all.filter((t) => t.id !== id);
    this.saveTestimonials(filtered);
  }

  async togglePublish(id: string): Promise<Testimonial> {
    const t = await this.getById(id);
    if (!t) throw new Error(`Testimonial with id ${id} not found.`);
    return this.update(id, { isPublished: !t.isPublished });
  }
}

export const testimonialService = new TestimonialService();

