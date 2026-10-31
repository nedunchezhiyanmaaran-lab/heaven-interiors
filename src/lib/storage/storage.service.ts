'use client';

import { runStorageMigrations } from './storage-migration';
import { STORAGE_KEYS } from './storage-keys';

type StorageListener = (key: string) => void;

class CentralStorageService {
  private initialized = false;
  private listeners: Set<StorageListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    try {
      runStorageMigrations();
      this.initialized = true;

      // Cross-tab synchronization
      window.addEventListener('storage', (e) => {
        if (e.key) {
          this.notifyListeners(e.key);
        }
      });
    } catch (err) {
      console.error('[StorageService] Initialization error:', err);
    }
  }

  public getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    this.init();

    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`[StorageService] Failed to read or parse key "${key}":`, error);
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    this.init();

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      this.notifyChange(key);
      return true;
    } catch (error: any) {
      if (
        error.name === 'QuotaExceededError' ||
        error.code === 22 ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        console.error(
          `[StorageService] LocalStorage quota exceeded while saving key "${key}". Try optimizing or reducing uploaded image sizes.`
        );
        alert(
          'Storage quota reached. Please optimize images or remove older uploaded files before adding more.'
        );
      } else {
        console.error(`[StorageService] Failed to set key "${key}":`, error);
      }
      return false;
    }
  }

  public removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    this.init();

    try {
      localStorage.removeItem(key);
      this.notifyChange(key);
    } catch (error) {
      console.error(`[StorageService] Failed to remove key "${key}":`, error);
    }
  }

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(key: string): void {
    this.listeners.forEach((listener) => {
      try {
        listener(key);
      } catch (err) {
        console.error('[StorageService] Error in storage listener:', err);
      }
    });
  }

  public notifyChange(key: string): void {
    this.notifyListeners(key);
    if (typeof window !== 'undefined') {
      try {
        // Dispatch custom event for same-tab reactive updates
        window.dispatchEvent(
          new CustomEvent('heaven-storage-update', { detail: { key } })
        );
      } catch {
        // Ignore fallback
      }
    }
  }

  public resetAllToDefaults(): void {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      runStorageMigrations();
      this.notifyChange(STORAGE_KEYS.PROJECTS);
      this.notifyChange(STORAGE_KEYS.VIDEOS);
      this.notifyChange(STORAGE_KEYS.MATERIALS);
      this.notifyChange(STORAGE_KEYS.SERVICES);
      this.notifyChange(STORAGE_KEYS.TESTIMONIALS);
      this.notifyChange(STORAGE_KEYS.WEBSITE_CONTENT);
      this.notifyChange(STORAGE_KEYS.ENQUIRIES);
    } catch (err) {
      console.error('[StorageService] Reset error:', err);
    }
  }
}

export const storageService = new CentralStorageService();

