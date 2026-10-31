'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projectService } from '@/services/project.service';
import { Project } from '@/types/project.types';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONCEPT' | 'CHALLENGES' | 'SOLUTIONS' | 'GALLERY' | 'VIDEOS'>('OVERVIEW');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await projectService.getBySlug(slug);
        setProject(p);
      } catch (err) {
        console.error('Error fetching project detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex items-center justify-center bg-[#F7F3EB] text-[#141414] font-serif">
        Loading case study...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center bg-[#F7F3EB] text-[#141414] text-center px-6">
        <h1 className="text-3xl font-serif mb-4">Project Not Found</h1>
        <p className="text-sm text-[#666666] max-w-md mb-8">
          The requested project might have been unpublished or moved.
        </p>
        <Link
          href="/projects"
          className="btn-gold px-6 py-3 text-xs uppercase tracking-widest"
        >
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const allImages = [
    { url: project.coverImage, caption: 'Cover Photograph' },
    ...(project.galleryImages || [])
  ];

  const currentDisplayImg = allImages[activeImageIdx] || allImages[0];

  return (
    <div className="pt-28 pb-32 bg-[#F7F3EB] text-[#141414]">
      {/* Top Breadcrumb & Eyebrow matching Reference Section 04 */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
            03 / PROJECT
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#141414]/60 hover:text-[#C5A15B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Works</span>
          </Link>
        </div>
      </div>

      {/* Title & Metadata Header matching Reference */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mb-10">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#141414] leading-[1.08] tracking-tight">
          {project.title}
        </h1>
        <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-sans font-medium mt-3">
          {project.category} • {project.location} • {project.year}
        </div>
      </div>

      {/* Main Panoramic Image & Thumbnail Strip matching Reference */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Panoramic View */}
          <div className="lg:col-span-10 relative w-full aspect-[16/9] sm:aspect-[21/10] rounded-xl overflow-hidden bg-[#242424] shadow-2xl">
            <Image
              src={currentDisplayImg.url}
              alt={project.title}
              fill
              priority
              sizes="90vw"
              className="object-cover object-center transition-all duration-700 ease-out"
            />
            {currentDisplayImg.caption && (
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded text-xs text-white/90 font-sans italic">
                {currentDisplayImg.caption}
              </div>
            )}
          </div>

          {/* Vertical / Strip Thumbnails */}
          <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
            {allImages.slice(0, 5).map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`relative w-24 lg:w-full aspect-[16/10] rounded overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                  activeImageIdx === i ? 'border-[#C5A15B] shadow-md scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Bar matching Reference: OVERVIEW, CONCEPT, CHALLENGES, SOLUTIONS, GALLERY, VIDEOS */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mb-16">
        <div className="flex items-center gap-6 sm:gap-10 border-b border-[#141414]/15 pb-4 overflow-x-auto">
          {(['OVERVIEW', 'CONCEPT', 'CHALLENGES', 'SOLUTIONS', 'GALLERY', 'VIDEOS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors whitespace-nowrap relative pb-1 ${
                activeTab === tab
                  ? 'text-[#C5A15B]'
                  : 'text-[#666666] hover:text-[#141414]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#C5A15B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Section Content based on Tabs */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#141414] leading-tight uppercase">
                A HOME ABOVE <br />
                THE HORIZON
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-[#444444] font-sans leading-relaxed">
              <p className="text-xl font-serif text-[#141414] font-light leading-relaxed">
                {project.shortDescription}
              </p>
              <p>{project.fullDescription}</p>
            </div>
          </div>
        )}

        {activeTab === 'CONCEPT' && (
          <div className="max-w-3xl space-y-4">
            <h3 className="text-2xl font-serif text-[#141414]">Architectural Concept</h3>
            <p className="text-base text-[#444444] font-sans leading-relaxed">
              {project.designConcept || 'Natural light, biophilic flow, and monumental limestone surfaces sculpted into a private sanctuary.'}
            </p>
          </div>
        )}

        {activeTab === 'CHALLENGES' && (
          <div className="max-w-3xl space-y-4">
            <h3 className="text-2xl font-serif text-[#141414]">Spatial Challenges</h3>
            <p className="text-base text-[#444444] font-sans leading-relaxed">
              {project.challenges || 'Managing tropical coastal humidity while integrating seamless concealed HVAC without sacrificing ceiling heights.'}
            </p>
          </div>
        )}

        {activeTab === 'SOLUTIONS' && (
          <div className="max-w-3xl space-y-4">
            <h3 className="text-2xl font-serif text-[#141414]">Atelier Solutions</h3>
            <p className="text-base text-[#444444] font-sans leading-relaxed">
              {project.solutions || 'Vacuum-pressed BWP calibrated marine plywood joinery, shadow-line acoustic coves, and unsealed natural travertine.'}
            </p>
          </div>
        )}

        {activeTab === 'GALLERY' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allImages.map((img, i) => (
              <div key={i} className="space-y-2 group">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg bg-black">
                  <Image src={img.url} alt={`Gallery image ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                {img.caption && (
                  <p className="text-xs text-[#666666] font-sans italic">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'VIDEOS' && (
          <div>
            {project.videos && project.videos.length > 0 ? (
              <div className="max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                <video src={project.videos[0].url} controls className="w-full h-full object-cover">
                  Your browser does not support HTML5 video.
                </video>
              </div>
            ) : (
              <p className="text-sm text-[#777777] italic">No video tour attached to this project.</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA Bar */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mt-24 pt-12 border-t border-[#141414]/15 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-serif text-[#141414]">Commission an Architectural Sanctuary</h3>
          <p className="text-xs text-[#666666] font-sans">Contact our studio to discuss your upcoming residence or commercial headquarters.</p>
        </div>
        <Link
          href="/contact"
          className="btn-gold px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] font-sans font-bold flex items-center gap-2"
        >
          <span>INITIATE ENQUIRY</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
