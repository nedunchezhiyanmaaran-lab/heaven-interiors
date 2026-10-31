import { ServiceItem, CreateServiceInput, UpdateServiceInput } from '@/types/service.types';
import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { INITIAL_SERVICES } from '@/data/mock-services';

export interface IServiceService {
  getAll(): Promise<ServiceItem[]>;
  getPublished(): Promise<ServiceItem[]>;
  getById(id: string): Promise<ServiceItem | null>;
  create(data: CreateServiceInput): Promise<ServiceItem>;
  update(id: string, data: UpdateServiceInput): Promise<ServiceItem>;
  delete(id: string): Promise<void>;
  togglePublish(id: string): Promise<ServiceItem>;
}

class ServiceService implements IServiceService {
  private getServices(): ServiceItem[] {
    return storageService.getItem<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  private saveServices(services: ServiceItem[]): void {
    storageService.setItem(STORAGE_KEYS.SERVICES, services);
  }

  async getAll(): Promise<ServiceItem[]> {
    const list = this.getServices();
    return [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getPublished(): Promise<ServiceItem[]> {
    const all = await this.getAll();
    return all.filter((s) => s.isPublished);
  }

  async getById(id: string): Promise<ServiceItem | null> {
    const all = await this.getAll();
    return all.find((s) => s.id === id) || null;
  }

  async create(data: CreateServiceInput): Promise<ServiceItem> {
    const all = this.getServices();
    const newService: ServiceItem = {
      ...data,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      displayOrder: data.displayOrder ?? all.length + 1
    };

    all.push(newService);
    this.saveServices(all);
    return newService;
  }

  async update(id: string, data: UpdateServiceInput): Promise<ServiceItem> {
    const all = this.getServices();
    const idx = all.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Service with id ${id} not found.`);
    }

    const updated: ServiceItem = {
      ...all[idx],
      ...data
    };

    all[idx] = updated;
    this.saveServices(all);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const all = this.getServices();
    const filtered = all.filter((s) => s.id !== id);
    this.saveServices(filtered);
  }

  async togglePublish(id: string): Promise<ServiceItem> {
    const s = await this.getById(id);
    if (!s) throw new Error(`Service with id ${id} not found.`);
    return this.update(id, { isPublished: !s.isPublished });
  }
}

export const serviceService = new ServiceService();

