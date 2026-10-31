'use client';

import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Studio Principal' | 'Senior Architect';
}

const DEMO_USER: AdminUser = {
  id: 'usr-admin-01',
  name: 'Studio Principal',
  email: 'admin@heaveninteriors.com',
  role: 'Studio Principal'
};

export const DEMO_CREDENTIALS = {
  email: 'admin@heaveninteriors.com',
  password: 'admin123'
};

class AuthService {
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const session = storageService.getItem<AdminUser | null>(
      STORAGE_KEYS.AUTH_SESSION,
      null
    );
    return session !== null;
  }

  getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    return storageService.getItem<AdminUser | null>(STORAGE_KEYS.AUTH_SESSION, null);
  }

  login(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
      password === DEMO_CREDENTIALS.password
    ) {
      storageService.setItem(STORAGE_KEYS.AUTH_SESSION, DEMO_USER);
      return { success: true, user: DEMO_USER };
    }
    // Also allow demo bypass if email contains "admin"
    if (email.trim().toLowerCase().includes('admin') && password.length >= 4) {
      const user: AdminUser = {
        ...DEMO_USER,
        email: email.trim().toLowerCase()
      };
      storageService.setItem(STORAGE_KEYS.AUTH_SESSION, user);
      return { success: true, user };
    }
    return {
      success: false,
      error: 'Invalid credentials. Please use demo credentials: admin@heaveninteriors.com / admin123'
    };
  }

  logout(): void {
    storageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }
}

export const authService = new AuthService();

