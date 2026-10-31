'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project, CreateProjectInput } from '@/types/project.types';
import { projectService } from '@/services/project.service';
import { slugify } from '@/utils/slug';
import { ImageUploader, UploadedImageItem } from './ImageUploader';
import { ArrowLeft, Save, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ProjectEditorFormProps {
  initialProject?: Project;
  isNew?: boolean;
}

export const ProjectEditorForm: React.FC<ProjectEditorFormProps> = ({
  initialProject,
  isNew = false
}) => {
  const router = useRouter();

  const [title, setTitle] = useState(initialProject?.title || '');
  const [slug, setSlug] = useState(initialProject?.slug || '');
  const [category, setCategory] = useState(initialProject?.category || 'Residential');
  const [location, setLocation] = useState(initialProject?.location || '');
  const [year, setYear] = useState(initialProject?.year?.toString() || '2025');
  const [shortDesc, setShortDesc] = useState(initialProject?.shortDescription || '');
  const [fullDesc, setFullDesc] = useState(initialProject?.fullDescription || '');
  const [concept, setConcept] = useState(initialProject?.designConcept || '');
  const [challenges, setChallenges] = useState(initialProject?.challenges || '');
  const [solutions, setSolutions] = useState(initialProject?.solutions || '');
  const [isFeatured, setIsFeatured] = useState<boolean>(initialProject?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState<boolean>(initialProject?.isPublished ?? true);
  const [displayOrder, setDisplayOrder] = useState<number>(initialProject?.displayOrder ?? 1);

  // Gallery Images state
  const [galleryImages, setGalleryImages] = useState<UploadedImageItem[]>(() => {
    if (initialProject?.galleryImages && initialProject.galleryImages.length > 0) {
      return initialProject.galleryImages;
    }
    if (initialProject?.coverImage) {
      return [
        {
          id: 'initial-cover',
          url: initialProject.coverImage,
          caption: 'Cover Photo',
          isCover: true,
          order: 1
        }
      ];
    }
    return [];
  });

  // Video URL
  const [videoUrl, setVideoUrl] = useState(initialProject?.videos?.[0]?.url || '');
  const [videoTitle, setVideoTitle] = useState(initialProject?.videos?.[0]?.title || '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-generate slug from title if new or untouched
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || !initialProject) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (publishStatus?: boolean) => {
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Project URL slug is required.');
      return;
    }

    setSaving(true);

    try {
      // Find cover image from gallery, or fallback to first image or default
      const coverItem = galleryImages.find((img) => img.isCover) || galleryImages[0];
      const coverUrl = coverItem
        ? coverItem.url
        : initialProject?.coverImage ||
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85';

      const finalPublished = publishStatus !== undefined ? publishStatus : isPublished;

      const projectData: CreateProjectInput = {
        title: title.trim(),
        slug: slugify(slug),
        category: category.trim(),
        location: location.trim(),
        year: year.trim(),
        shortDescription: shortDesc.trim(),
        fullDescription: fullDesc.trim(),
        designConcept: concept.trim(),
        challenges: challenges.trim(),
        solutions: solutions.trim(),
        coverImage: coverUrl,
        galleryImages,
        videos: videoUrl.trim()
          ? [
              {
                id: `pvid-${Date.now()}`,
                url: videoUrl.trim(),
                title: videoTitle.trim() || `${title} Tour`,
                type: 'url',
                posterUrl: coverUrl
              }
            ]
          : [],
        isFeatured,
        displayOrder: Number(displayOrder) || 1,
        isPublished: finalPublished
      };

      if (isNew) {
        const created = await projectService.create(projectData);
        setSuccess('Project created successfully!');
        setTimeout(() => {
          router.push('/admin/projects');
        }, 800);
      } else if (initialProject) {
        await projectService.update(initialProject.id, projectData);
        setSuccess('Project updated successfully!');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 font-sans">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A15B] hover:text-[#DFC488]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isNew && initialProject && (
            <Link
              href={`/projects/${initialProject.slug}`}
              target="_blank"
              className="px-3.5 py-2 border border-white/15 hover:border-[#C5A15B] rounded-lg text-xs text-[#E9E5DE] flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A15B]" />
              <span>Preview Live</span>
            </Link>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="px-4 py-2 border border-white/20 hover:border-white/50 rounded-lg text-xs font-medium text-white/80 transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="btn-gold px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Form Sections */}
      <div className="space-y-8">
        {/* Section 1: Basic Identity */}
        <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
          <h2 className="text-sm font-sans uppercase tracking-wider text-[#C5A15B] font-medium">
            1. Core Identity & Typology
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Skyward Penthouse"
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                URL Slug * (Editable)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="the-skyward-penthouse"
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] font-mono focus:border-[#C5A15B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Turnkey">Turnkey</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Heritage Restoration">Heritage Restoration</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Worli Sea Face, Mumbai"
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                Completion Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Narrative & Descriptions */}
        <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
          <h2 className="text-sm font-sans uppercase tracking-wider text-[#C5A15B] font-medium">
            2. Architectural Narrative & Copy
          </h2>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
              Short Description (Card Summary)
            </label>
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Concise 1-2 sentence overview for portfolio cards..."
              className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
              Full Architectural Description
            </label>
            <textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Deep spatial narrative detailing travertine masonry, lighting choreography, joinery, and atmosphere..."
              className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                Design Concept
              </label>
              <textarea
                rows={3}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. Biophilic luxury meets rectilinear clarity..."
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                Spatial Challenges
              </label>
              <textarea
                rows={3}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="e.g. Integrating central HVAC without compromising ceiling heights..."
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                Atelier Solutions
              </label>
              <textarea
                rows={3}
                value={solutions}
                onChange={(e) => setSolutions(e.target.value)}
                placeholder="e.g. Shadow-line acoustic ceiling coves and vacuum-pressed BWP ply..."
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Image Management */}
        <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
          <h2 className="text-sm font-sans uppercase tracking-wider text-[#C5A15B] font-medium">
            3. Photographic Gallery Management
          </h2>

          <ImageUploader
            images={galleryImages}
            onChange={setGalleryImages}
            allowMultiple={true}
            maxFiles={20}
            label="Upload High-Resolution Project Photographs"
          />
        </div>

        {/* Section 4: Video Walkthrough URL */}
        <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
          <h2 className="text-sm font-sans uppercase tracking-wider text-[#C5A15B] font-medium">
            4. Project Video Tour (Optional)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                Video Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. Skyward Penthouse Architectural Tour"
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1.5">
                MP4 Direct URL or Cloudinary CDN Link
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://assets.mixkit.co/.../video.mp4"
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Publishing & Visibility Controls */}
        <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
          <h2 className="text-sm font-sans uppercase tracking-wider text-[#C5A15B] font-medium">
            5. Display & Visibility Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A15B] focus:ring-[#C5A15B]"
              />
              <span className="text-xs text-[#F5F0E6]">
                Publish on Live Website
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A15B] focus:ring-[#C5A15B]"
              />
              <span className="text-xs text-[#F5F0E6]">
                Feature on Homepage Showcase
              </span>
            </label>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-24 bg-[#121212] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/projects"
            className="px-6 py-2.5 rounded-lg text-xs text-[#E9E5DE]/70 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="btn-gold px-8 py-3 rounded-lg text-xs uppercase tracking-wider font-medium shadow-lg"
          >
            {saving ? 'Saving Changes...' : 'Save & Update Commission'}
          </button>
        </div>
      </div>
    </div>
  );
};
