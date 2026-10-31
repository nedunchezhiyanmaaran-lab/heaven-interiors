import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project.types';
import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { INITIAL_PROJECTS } from '@/data/mock-projects';

export interface IProjectService {
  getAll(): Promise<Project[]>;
  getPublished(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
  getById(id: string): Promise<Project | null>;
  create(data: CreateProjectInput): Promise<Project>;
  update(id: string, data: UpdateProjectInput): Promise<Project>;
  delete(id: string): Promise<void>;
  togglePublish(id: string): Promise<Project>;
  toggleFeatured(id: string): Promise<Project>;
}

class ProjectService implements IProjectService {
  private getProjects(): Project[] {
    return storageService.getItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  private saveProjects(projects: Project[]): void {
    storageService.setItem(STORAGE_KEYS.PROJECTS, projects);
  }

  async getAll(): Promise<Project[]> {
    const list = this.getProjects();
    return [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getPublished(): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter((p) => p.isPublished);
  }

  async getBySlug(slug: string): Promise<Project | null> {
    const all = await this.getAll();
    return all.find((p) => p.slug === slug) || null;
  }

  async getById(id: string): Promise<Project | null> {
    const all = await this.getAll();
    return all.find((p) => p.id === id) || null;
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const all = this.getProjects();
    const now = new Date().toISOString();
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      displayOrder: data.displayOrder ?? all.length + 1
    };

    all.push(newProject);
    this.saveProjects(all);
    return newProject;
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project> {
    const all = this.getProjects();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Project with id ${id} not found.`);
    }

    const updated: Project = {
      ...all[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };

    all[idx] = updated;
    this.saveProjects(all);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const all = this.getProjects();
    const filtered = all.filter((p) => p.id !== id);
    this.saveProjects(filtered);
  }

  async togglePublish(id: string): Promise<Project> {
    const p = await this.getById(id);
    if (!p) throw new Error(`Project with id ${id} not found.`);
    return this.update(id, { isPublished: !p.isPublished });
  }

  async toggleFeatured(id: string): Promise<Project> {
    const p = await this.getById(id);
    if (!p) throw new Error(`Project with id ${id} not found.`);
    return this.update(id, { isFeatured: !p.isFeatured });
  }
}

export const projectService = new ProjectService();

