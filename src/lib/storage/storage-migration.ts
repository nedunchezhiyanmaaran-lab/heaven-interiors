import { STORAGE_KEYS, STORAGE_VERSION } from './storage-keys';
import { INITIAL_PROJECTS } from '@/data/mock-projects';
import { INITIAL_VIDEOS } from '@/data/mock-videos';
import { INITIAL_MATERIALS } from '@/data/mock-materials';
import { INITIAL_SERVICES } from '@/data/mock-services';
import { INITIAL_TESTIMONIALS } from '@/data/mock-testimonials';
import { INITIAL_WEBSITE_CONTENT } from '@/data/mock-website-content';
import { INITIAL_ENQUIRIES } from '@/data/mock-enquiries';

export function runStorageMigrations(): void {
  if (typeof window === 'undefined') return;

  try {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);

    if (!currentVersion) {
      // First time initialization
      if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
        localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.MATERIALS)) {
        localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(INITIAL_MATERIALS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.WEBSITE_CONTENT)) {
        localStorage.setItem(STORAGE_KEYS.WEBSITE_CONTENT, JSON.stringify(INITIAL_WEBSITE_CONTENT));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
      }
      localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
    }
  } catch (error) {
    console.warn('[StorageMigration] Error during migration check:', error);
  }
}

