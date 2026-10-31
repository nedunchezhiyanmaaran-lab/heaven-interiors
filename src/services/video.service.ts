import { VideoItem, CreateVideoInput, UpdateVideoInput } from '@/types/video.types';
import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { INITIAL_VIDEOS } from '@/data/mock-videos';

// In-memory session registry for temporary video object URLs
const temporaryVideoObjectUrls = new Map<string, string>();

export interface IVideoService {
  getAll(): Promise<VideoItem[]>;
  getPublished(): Promise<VideoItem[]>;
  getById(id: string): Promise<VideoItem | null>;
  create(data: CreateVideoInput, file?: File): Promise<VideoItem>;
  update(id: string, data: UpdateVideoInput, file?: File): Promise<VideoItem>;
  delete(id: string): Promise<void>;
  togglePublish(id: string): Promise<VideoItem>;
  toggleFeatured(id: string): Promise<VideoItem>;
  getPlayableUrl(video: VideoItem): string;
}

class VideoService implements IVideoService {
  private getVideos(): VideoItem[] {
    return storageService.getItem<VideoItem[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
  }

  private saveVideos(videos: VideoItem[]): void {
    storageService.setItem(STORAGE_KEYS.VIDEOS, videos);
  }

  async getAll(): Promise<VideoItem[]> {
    const list = this.getVideos();
    return [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getPublished(): Promise<VideoItem[]> {
    const all = await this.getAll();
    return all.filter((v) => v.isPublished);
  }

  async getById(id: string): Promise<VideoItem | null> {
    const all = await this.getAll();
    return all.find((v) => v.id === id) || null;
  }

  getPlayableUrl(video: VideoItem): string {
    // If there is an active session object URL for this video, return it
    if (temporaryVideoObjectUrls.has(video.id)) {
      return temporaryVideoObjectUrls.get(video.id)!;
    }
    return video.videoUrl;
  }

  async create(data: CreateVideoInput, file?: File): Promise<VideoItem> {
    const all = this.getVideos();
    const now = new Date().toISOString();
    const id = `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    let finalVideoUrl = data.videoUrl;
    let isTemp = false;

    if (file) {
      if (typeof window !== 'undefined') {
        finalVideoUrl = URL.createObjectURL(file);
        temporaryVideoObjectUrls.set(id, finalVideoUrl);
        isTemp = true;
      }
    }

    const newVideo: VideoItem = {
      ...data,
      id,
      videoUrl: finalVideoUrl,
      isTemporaryFile: isTemp,
      createdAt: now,
      updatedAt: now,
      displayOrder: data.displayOrder ?? all.length + 1
    };

    all.push(newVideo);
    this.saveVideos(all);
    return newVideo;
  }

  async update(id: string, data: UpdateVideoInput, file?: File): Promise<VideoItem> {
    const all = this.getVideos();
    const idx = all.findIndex((v) => v.id === id);
    if (idx === -1) {
      throw new Error(`Video with id ${id} not found.`);
    }

    let finalVideoUrl = data.videoUrl ?? all[idx].videoUrl;
    let isTemp = all[idx].isTemporaryFile;

    if (file) {
      if (typeof window !== 'undefined') {
        finalVideoUrl = URL.createObjectURL(file);
        temporaryVideoObjectUrls.set(id, finalVideoUrl);
        isTemp = true;
      }
    }

    const updated: VideoItem = {
      ...all[idx],
      ...data,
      videoUrl: finalVideoUrl,
      isTemporaryFile: isTemp,
      updatedAt: new Date().toISOString()
    };

    all[idx] = updated;
    this.saveVideos(all);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const all = this.getVideos();
    const filtered = all.filter((v) => v.id !== id);
    if (temporaryVideoObjectUrls.has(id)) {
      try {
        URL.revokeObjectURL(temporaryVideoObjectUrls.get(id)!);
      } catch {
        // ignore
      }
      temporaryVideoObjectUrls.delete(id);
    }
    this.saveVideos(filtered);
  }

  async togglePublish(id: string): Promise<VideoItem> {
    const v = await this.getById(id);
    if (!v) throw new Error(`Video with id ${id} not found.`);
    return this.update(id, { isPublished: !v.isPublished });
  }

  async toggleFeatured(id: string): Promise<VideoItem> {
    const v = await this.getById(id);
    if (!v) throw new Error(`Video with id ${id} not found.`);
    return this.update(id, { isFeatured: !v.isFeatured });
  }
}

export const videoService = new VideoService();

