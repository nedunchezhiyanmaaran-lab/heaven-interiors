'use client';

import React, { useState } from 'react';
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
        await projectService.create(projectData);
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
    <div className="max-w-5xl mx-auto p-6 sm:p-10 space-y-7 font-sans">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DEC9]">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#78726A] hover:text-[#141414] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio Projects</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isNew && initialProject && (
            <Link
              href={`/projects/${initialProject.slug}`}
              target="_blank"
              className="px-3.5 py-2 border border-[#E5DEC9] bg-[#FFFFFF] hover:border-[#C5A15B]/50 hover:text-[#C5A15B] rounded-full text-xs text-[#141414] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#78726A]" />
              <span>Preview Live</span>
            </Link>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="px-4 py-2 border border-[#E5DEC9] bg-[#FFFFFF] hover:border-[#141414] rounded-full text-xs font-semibold text-[#78726A] hover:text-[#141414] transition-colors"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-[#B43A3A] text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#2E7D5A] text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Section 1: Basic Identity */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-5">
          <h2 className="font-bold text-base sm:text-lg text-[#141414] tracking-tight">
            1. Core Identity & Typology
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Skyward Penthouse"
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="the-skyward-penthouse"
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Turnkey">Turnkey</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Heritage Restoration">Heritage Restoration</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Worli Sea Face, Mumbai"
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Completion Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Narrative & Descriptions */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-5">
          <h2 className="font-bold text-base sm:text-lg text-[#141414] tracking-tight">
            2. Architectural Narrative & Copy
          </h2>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
              Short Description (Card Summary)
            </label>
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Elevated coastal residence overlooking the Arabian Sea..."
              className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
              Full Project Description
            </label>
            <textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Detailed spatial layout, millwork details, client brief..."
              className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Design Concept
              </label>
              <textarea
                rows={3}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Monolithic materiality with warm travertine..."
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Challenges Overcome
              </label>
              <textarea
                rows={3}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Acoustic isolation and ceiling height..."
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Solutions & Execution
              </label>
              <textarea
                rows={3}
                value={solutions}
                onChange={(e) => setSolutions(e.target.value)}
                placeholder="Bespoke fluted acoustic timber panelling..."
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Gallery & Photography */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base sm:text-lg text-[#141414] tracking-tight">
              3. Architectural Photography Gallery
            </h2>
            <span className="text-[11px] text-[#78726A]">
              First photograph or Starred photo is primary cover
            </span>
          </div>

          <ImageUploader
            images={galleryImages}
            onChange={setGalleryImages}
            allowMultiple={true}
            maxFiles={24}
            label="Upload Project Photographs"
          />
        </div>

        {/* Section 4: Video Showcase */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-4">
          <h2 className="font-bold text-base sm:text-lg text-[#141414] tracking-tight">
            4. Project Video & Documentary Film
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Film Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. The Skyward Penthouse — Architectural Tour"
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Video URL (MP4 / WebM / YouTube / Vimeo)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://assets.mixkit.co/.../video.mp4"
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Publishing Settings */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-5">
          <h2 className="font-bold text-base sm:text-lg text-[#141414] tracking-tight">
            5. Curation & Publishing Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A15B] focus:ring-[#C5A15B]"
              />
              <div>
                <div className="text-xs font-semibold text-[#141414]">Published</div>
                <div className="text-[11px] text-[#78726A]">Visible in public portfolio</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A15B] focus:ring-[#C5A15B]"
              />
              <div>
                <div className="text-xs font-semibold text-[#141414]">Featured</div>
                <div className="text-[11px] text-[#78726A]">Highlighted on Home Hero</div>
              </div>
            </label>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                Display Order Priority
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
