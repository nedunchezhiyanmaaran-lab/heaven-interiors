'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useVideos, useProjects } from '@/hooks/useDataServices';
import { videoService } from '@/services/video.service';
import { compressImageFile } from '@/utils/image-compression';
import { VIDEO_CATEGORIES } from '@/data/mock-videos';
import { VideoItem, CreateVideoInput } from '@/types/video.types';
import {
  Film,
  Plus,
  Play,
  Trash2,
  Edit,
  Eye,
  Upload,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Star
} from 'lucide-react';

export default function AdminVideosPage() {
  const { videos, refresh } = useVideos();
  const { projects } = useProjects();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(VIDEO_CATEGORIES[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  // Preview Player
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingVideo(null);
    setTitle('');
    setDescription('');
    setCategory(VIDEO_CATEGORIES[0]);
    setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-with-a-view-of-the-city-43181-large.mp4');
    setThumbnailUrl('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80');
    setProjectId('');
    setIsFeatured(false);
    setIsPublished(true);
    setDisplayOrder(videos.length + 1);
    setSelectedVideoFile(null);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (v: VideoItem) => {
    setEditingVideo(v);
    setTitle(v.title);
    setDescription(v.description);
    setCategory(v.category);
    setVideoUrl(v.videoUrl);
    setThumbnailUrl(v.thumbnailUrl);
    setProjectId(v.projectId || '');
    setIsFeatured(v.isFeatured);
    setIsPublished(v.isPublished);
    setDisplayOrder(v.displayOrder);
    setSelectedVideoFile(null);
    setError(null);
    setModalOpen(true);
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1200, quality: 0.8 });
      setThumbnailUrl(compressed);
    } catch (err: any) {
      setError(err?.message || 'Error processing thumbnail');
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid MP4/video file.');
      return;
    }
    setSelectedVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Video title is required.');
      return;
    }
    if (!videoUrl && !selectedVideoFile) {
      setError('Please provide a video file or stable MP4 URL.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const selectedProject = projects.find((p) => p.id === projectId);

      const input: CreateVideoInput = {
        title: title.trim(),
        description: description.trim(),
        category,
        videoUrl: videoUrl.trim(),
        thumbnailUrl:
          thumbnailUrl ||
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        projectId: projectId || undefined,
        projectTitle: selectedProject ? selectedProject.title : undefined,
        isFeatured,
        displayOrder: Number(displayOrder) || 1,
        isPublished
      };

      if (editingVideo) {
        await videoService.update(editingVideo.id, input, selectedVideoFile || undefined);
      } else {
        await videoService.create(input, selectedVideoFile || undefined);
      }

      setModalOpen(false);
      refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to save video');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this film?')) {
      await videoService.delete(id);
      refresh();
    }
  };

  const handleTogglePublish = async (id: string) => {
    await videoService.togglePublish(id);
    refresh();
  };

  const handleToggleFeatured = async (id: string) => {
    await videoService.toggleFeatured(id);
    refresh();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen font-sans">
      <AdminHeader
        title="Video Showcase"
        subtitle="Manage architectural motion documentaries, site walkthroughs, and atelier films"
        actionButton={
          <button
            onClick={openCreateModal}
            className="bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Film</span>
          </button>
        }
      />

      <div className="p-6 sm:p-10 space-y-6 max-w-[1500px] w-full mx-auto">
        {/* Technical Notice Banner */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl flex items-start gap-3 shadow-xs">
          <Info className="w-4 h-4 text-[#C5A15B] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#78726A] leading-relaxed space-y-0.5">
            <span className="font-semibold text-[#141414] block">
              Architectural Video Storage Architecture:
            </span>
            <span>
              Video metadata and compressed poster thumbnails are persisted in LocalStorage. Locally selected MP4 files use temporary browser object URLs for live playback during the current browser session. Public demo CDN links remain permanently accessible.
            </span>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#C5A15B] transition-all"
            >
              <div>
                {/* Poster / Play trigger */}
                <div
                  onClick={() => setPreviewVideo(vid)}
                  className="relative aspect-[16/10] w-full bg-[#F5F0E6] cursor-pointer overflow-hidden"
                >
                  <Image
                    src={vid.thumbnailUrl || '/brand/logo.png'}
                    alt={vid.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" />

                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-sans font-medium text-[#141414] rounded-full border border-[#E5DEC9]">
                    {vid.category}
                  </div>

                  {vid.isFeatured && (
                    <div className="absolute top-3 right-3 bg-[#C5A15B]/20 text-[#9E7B36] border border-[#C5A15B]/30 px-2 py-0.5 text-[9px] font-bold rounded-full flex items-center gap-1 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>FEATURED</span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/90 text-[#141414] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current text-[#141414]" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-[#141414] leading-snug line-clamp-1">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-[#78726A] line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>

                  {vid.projectTitle && (
                    <div className="text-[11px] text-[#C5A15B] font-semibold pt-1">
                      Commission: {vid.projectTitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Controls */}
              <div className="px-5 py-3.5 border-t border-[#E5DEC9]/70 bg-[#F5F0E6]/30 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(vid.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                    vid.isPublished
                      ? 'bg-[#2E7D5A]/15 text-[#2E7D5A] border border-[#2E7D5A]/30'
                      : 'bg-[#C5A15B]/15 text-[#9E7B36] border border-[#C5A15B]/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      vid.isPublished ? 'bg-[#2E7D5A]' : 'bg-[#C5A15B]'
                    }`}
                  />
                  <span>{vid.isPublished ? 'LIVE' : 'DRAFT'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleFeatured(vid.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      vid.isFeatured ? 'text-[#C5A15B]' : 'text-[#78726A] hover:text-[#C5A15B]'
                    }`}
                    title={vid.isFeatured ? 'Remove featured' : 'Mark as featured'}
                  >
                    <Star className={`w-3.5 h-3.5 ${vid.isFeatured ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => openEditModal(vid)}
                    className="p-1.5 text-[#78726A] hover:text-[#C5A15B] hover:bg-[#F5F0E6] rounded-lg transition-colors"
                    title="Edit film"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="p-1.5 text-[#78726A] hover:text-[#B43A3A] hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete film"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {videos.length === 0 && (
            <div className="col-span-full py-20 text-center bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl space-y-3">
              <p className="font-semibold text-base text-[#141414]">No architectural motion films found.</p>
              <button
                onClick={openCreateModal}
                className="bg-[#141414] hover:bg-[#C5A15B] text-white hover:text-[#141414] px-4 py-2 rounded-full text-xs font-semibold"
              >
                Upload First Video
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DEC9]">
              <h2 className="font-bold text-lg text-[#141414]">
                {editingVideo ? 'Edit Architectural Film' : 'Upload New Film'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#78726A] hover:text-[#141414] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#B43A3A] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Film Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aura Headquarters — Lighting & Material Flow"
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  >
                    {VIDEO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Associated Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  >
                    <option value="">None / Standalone Reel</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural scope, cinematography, spatial walkthrough notes..."
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Video Source (Direct MP4 URL or File Upload)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/.../video.mp4"
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none mb-2"
                />

                <div className="flex items-center gap-3">
                  <label className="flex-1 border border-dashed border-[#E5DEC9] hover:border-[#C5A15B] bg-[#F5F0E6]/30 rounded-xl p-3 text-center cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                    <span className="text-xs text-[#78726A] flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-[#C5A15B]" />
                      <span>{selectedVideoFile ? selectedVideoFile.name : 'Or Choose Local MP4 File'}</span>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Poster Thumbnail (Image URL or File Upload)
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none mb-2"
                />

                <label className="block border border-dashed border-[#E5DEC9] hover:border-[#C5A15B] bg-[#F5F0E6]/30 rounded-xl p-2.5 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                  <span className="text-xs text-[#78726A] flex items-center justify-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-[#C5A15B]" />
                    <span>Upload Poster Photo</span>
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#141414]">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A15B]"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#141414]">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A15B]"
                  />
                  <span>Featured Film</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E5DEC9] text-[#78726A] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#141414] hover:bg-[#C5A15B] text-white hover:text-[#141414] px-5 py-2 rounded-full text-xs font-semibold shadow-sm transition-all"
                >
                  {saving ? 'Saving...' : 'Save Film'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Player Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141414] border border-[#222222] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative font-sans">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative aspect-video w-full bg-black">
              <video
                src={previewVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-5 text-white">
              <h3 className="font-bold text-lg">{previewVideo.title}</h3>
              <p className="text-xs text-white/70 mt-1">{previewVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
