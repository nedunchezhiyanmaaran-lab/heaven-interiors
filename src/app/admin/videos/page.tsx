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
    // Temporary preview URL for immediate session feedback
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
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Video & Film Showcase"
        subtitle="Manage architectural motion documentaries, site walkthroughs, and atelier films"
        actionButton={
          <button
            onClick={openCreateModal}
            className="btn-gold px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-sans flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Film</span>
          </button>
        }
      />

      <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Technical Notice Banner */}
        <div className="p-4 bg-[#1a1a1a] border border-[#C5A15B]/30 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-[#C5A15B] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#E9E5DE]/80 leading-relaxed space-y-1">
            <span className="font-semibold text-[#F5F0E6] block">
              Architectural Video Storage Architecture (Demo Notice):
            </span>
            <span>
              In compliance with local browser storage limits, video metadata and compressed poster thumbnails are persisted in LocalStorage. Locally selected MP4 files use temporary browser object URLs for live playback during the current browser session. Public demo CDN links remain permanently accessible. (Ready for PostgreSQL + Cloudinary integration in production).
            </span>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="bg-[#181818] border border-white/10 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Poster / Play trigger */}
                <div
                  onClick={() => setPreviewVideo(vid)}
                  className="relative aspect-[16/10] w-full bg-[#242424] cursor-pointer overflow-hidden"
                >
                  <Image
                    src={vid.thumbnailUrl || '/brand/logo.png'}
                    alt={vid.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  <div className="absolute top-3 left-3 bg-[#141414]/90 px-2 py-0.5 text-[10px] uppercase font-bold text-[#C5A15B] rounded border border-[#C5A15B]/30">
                    {vid.category}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#C5A15B] text-[#141414] flex items-center justify-center pl-0.5 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  </div>

                  {vid.isTemporaryFile && (
                    <div className="absolute bottom-2 left-2 bg-amber-500/90 text-[#141414] text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Local Session File
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-[#C5A15B] uppercase tracking-wider font-sans">
                      {vid.projectTitle ? `Commission: ${vid.projectTitle}` : 'Atelier Feature'}
                    </div>

                    <button
                      onClick={() => handleToggleFeatured(vid.id)}
                      className={`p-1 rounded ${
                        vid.isFeatured ? 'text-[#C5A15B]' : 'text-white/20 hover:text-white'
                      }`}
                      title="Featured Video"
                    >
                      <Star className={`w-3.5 h-3.5 ${vid.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-serif text-[#F5F0E6] leading-snug line-clamp-1">
                    {vid.title}
                  </h3>

                  <p className="text-xs text-[#E9E5DE]/70 font-sans line-clamp-2">
                    {vid.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(vid.id)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    vid.isPublished
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {vid.isPublished ? 'Published' : 'Draft'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewVideo(vid)}
                    className="p-1.5 text-white/50 hover:text-[#C5A15B] rounded"
                    title="Play Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openEditModal(vid)}
                    className="p-1.5 text-white/50 hover:text-white rounded"
                    title="Edit Film Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="p-1.5 text-red-400/60 hover:text-red-400 rounded"
                    title="Delete Film"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#181818] border border-white/15 rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-serif text-[#F5F0E6]">
                {editingVideo ? 'Edit Architectural Film' : 'Add New Video Showcase'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1.5">
                  Film Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aura Headquarters — Turnkey Fitout Documentary"
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                  >
                    {VIDEO_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1.5">
                    Associate with Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                  >
                    <option value="">No Project (General Atelier Film)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Narrative summary of what this film documents..."
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none resize-none"
                />
              </div>

              {/* Video Source Selection (File or URL) */}
              <div className="p-4 bg-[#141414] border border-white/10 rounded-lg space-y-4">
                <div className="text-[11px] uppercase tracking-wider text-[#C5A15B] font-medium">
                  Video File Source
                </div>

                <div>
                  <label className="block text-[11px] text-[#E9E5DE]/80 mb-1">
                    Option A: Upload Local MP4 Video File (Session Playback)
                  </label>
                  <input
                    type="file"
                    accept="video/mp4,video/*"
                    onChange={handleVideoFileUpload}
                    className="text-xs text-white/70 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#C5A15B] file:text-[#141414] file:font-semibold hover:file:bg-[#DFC488]"
                  />
                  {selectedVideoFile && (
                    <span className="text-[11px] text-emerald-400 block mt-1">
                      Selected: {selectedVideoFile.name} ({(selectedVideoFile.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-[#E9E5DE]/80 mb-1">
                    Option B: Or Direct MP4 / CDN Video URL
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://assets.mixkit.co/.../sample.mp4"
                    className="w-full bg-[#1a1a1a] border border-white/15 rounded px-3 py-1.5 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Poster Thumbnail Upload */}
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B]">
                  Poster Thumbnail Image
                </label>
                <div className="flex items-center gap-4">
                  {thumbnailUrl && (
                    <div className="relative w-20 h-14 rounded overflow-hidden bg-black flex-shrink-0 border border-white/15">
                      <Image
                        src={thumbnailUrl}
                        alt="Poster preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="text-xs text-white/70 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-white/10 file:text-white hover:file:bg-white/20"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#C5A15B]"
                  />
                  <span className="text-xs text-[#F5F0E6]">Publish on Public Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#C5A15B]"
                  />
                  <span className="text-xs text-[#F5F0E6]">Feature in Showcase</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-medium"
                >
                  {saving ? 'Saving...' : 'Save Film'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Playback Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
          <div className="relative w-full max-w-4xl bg-[#141414] border border-[#C5A15B]/30 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a1a1a]">
              <div className="text-sm font-serif text-[#F5F0E6]">
                {previewVideo.title}
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={videoService.getPlayableUrl(previewVideo)}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Video playback preview not available.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

