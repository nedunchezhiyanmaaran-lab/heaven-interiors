import { WebsiteContent } from '@/types/website-content.types';
import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { INITIAL_WEBSITE_CONTENT } from '@/data/mock-website-content';

export interface IWebsiteContentService {
  getContent(): Promise<WebsiteContent>;
  updateContent(data: Partial<WebsiteContent>): Promise<WebsiteContent>;
  updateHero(hero: Partial<WebsiteContent['hero']>): Promise<WebsiteContent>;
  updateAbout(about: Partial<WebsiteContent['about']>): Promise<WebsiteContent>;
  updateProcess(process: WebsiteContent['process']): Promise<WebsiteContent>;
  updateContact(contact: Partial<WebsiteContent['contact']>): Promise<WebsiteContent>;
  updateFooter(footer: Partial<WebsiteContent['footer']>): Promise<WebsiteContent>;
}

class WebsiteContentService implements IWebsiteContentService {
  private getStoredContent(): WebsiteContent {
    return storageService.getItem<WebsiteContent>(
      STORAGE_KEYS.WEBSITE_CONTENT,
      INITIAL_WEBSITE_CONTENT
    );
  }

  private saveContent(content: WebsiteContent): void {
    storageService.setItem(STORAGE_KEYS.WEBSITE_CONTENT, content);
  }

  async getContent(): Promise<WebsiteContent> {
    return this.getStoredContent();
  }

  async updateContent(data: Partial<WebsiteContent>): Promise<WebsiteContent> {
    const current = this.getStoredContent();
    const updated: WebsiteContent = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.saveContent(updated);
    return updated;
  }

  async updateHero(hero: Partial<WebsiteContent['hero']>): Promise<WebsiteContent> {
    const current = this.getStoredContent();
    return this.updateContent({
      hero: { ...current.hero, ...hero }
    });
  }

  async updateAbout(about: Partial<WebsiteContent['about']>): Promise<WebsiteContent> {
    const current = this.getStoredContent();
    return this.updateContent({
      about: { ...current.about, ...about }
    });
  }

  async updateProcess(process: WebsiteContent['process']): Promise<WebsiteContent> {
    return this.updateContent({ process });
  }

  async updateContact(contact: Partial<WebsiteContent['contact']>): Promise<WebsiteContent> {
    const current = this.getStoredContent();
    return this.updateContent({
      contact: { ...current.contact, ...contact }
    });
  }

  async updateFooter(footer: Partial<WebsiteContent['footer']>): Promise<WebsiteContent> {
    const current = this.getStoredContent();
    return this.updateContent({
      footer: { ...current.footer, ...footer }
    });
  }
}

export const websiteContentService = new WebsiteContentService();

