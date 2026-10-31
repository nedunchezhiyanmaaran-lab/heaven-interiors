import { Material, CreateMaterialInput, UpdateMaterialInput } from '@/types/material.types';
import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { INITIAL_MATERIALS } from '@/data/mock-materials';

export interface IMaterialService {
  getAll(): Promise<Material[]>;
  getPublished(): Promise<Material[]>;
  getBySlug(slug: string): Promise<Material | null>;
  getById(id: string): Promise<Material | null>;
  create(data: CreateMaterialInput): Promise<Material>;
  update(id: string, data: UpdateMaterialInput): Promise<Material>;
  delete(id: string): Promise<void>;
  togglePublish(id: string): Promise<Material>;
  toggleFeatured(id: string): Promise<Material>;
}

class MaterialService implements IMaterialService {
  private getMaterials(): Material[] {
    return storageService.getItem<Material[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
  }

  private saveMaterials(materials: Material[]): void {
    storageService.setItem(STORAGE_KEYS.MATERIALS, materials);
  }

  async getAll(): Promise<Material[]> {
    const list = this.getMaterials();
    return [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getPublished(): Promise<Material[]> {
    const all = await this.getAll();
    return all.filter((m) => m.isPublished);
  }

  async getBySlug(slug: string): Promise<Material | null> {
    const all = await this.getAll();
    return all.find((m) => m.slug === slug) || null;
  }

  async getById(id: string): Promise<Material | null> {
    const all = await this.getAll();
    return all.find((m) => m.id === id) || null;
  }

  async create(data: CreateMaterialInput): Promise<Material> {
    const all = this.getMaterials();
    const now = new Date().toISOString();
    const newMaterial: Material = {
      ...data,
      id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      displayOrder: data.displayOrder ?? all.length + 1
    };

    all.push(newMaterial);
    this.saveMaterials(all);
    return newMaterial;
  }

  async update(id: string, data: UpdateMaterialInput): Promise<Material> {
    const all = this.getMaterials();
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) {
      throw new Error(`Material with id ${id} not found.`);
    }

    const updated: Material = {
      ...all[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };

    all[idx] = updated;
    this.saveMaterials(all);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const all = this.getMaterials();
    const filtered = all.filter((m) => m.id !== id);
    this.saveMaterials(filtered);
  }

  async togglePublish(id: string): Promise<Material> {
    const m = await this.getById(id);
    if (!m) throw new Error(`Material with id ${id} not found.`);
    return this.update(id, { isPublished: !m.isPublished });
  }

  async toggleFeatured(id: string): Promise<Material> {
    const m = await this.getById(id);
    if (!m) throw new Error(`Material with id ${id} not found.`);
    return this.update(id, { isFeatured: !m.isFeatured });
  }
}

export const materialService = new MaterialService();

