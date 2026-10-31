'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useVideos } from '@/hooks/useDataServices';
import { videoService } from '@/services/video.service';
import { VideoItem } from '@/types/video.types';
import { Play, X, Film } from 'lucide-react';

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const { videos, loading } = useVideos(true);

  const categories = ['All', ...Array.from(new Set(videos.map((v) => v.category)))];

  const filtered =
    selectedCategory === 'All'
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  return (
    <div className="pt-36 pb-32 bg-[#141414] text-[#F5F0E6] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#C5A15B]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono">
              06 / FILMS ARCHIVE
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#F5F0E6] leading-[1.05] tracking-tight">
            SPACES IN MOTION
          </h1>
          <p className="text-base text-[#E9E5DE]/75 font-sans font-light mt-5 leading-relaxed">
            Stories, spaces and craft brought to life through film. Discover full architectural walkthroughs, site diaries, and craftsmanship narratives.
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-14 pb-6 border-b border-white/10">
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-sans transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#C5A15B] text-[#141414] font-medium shadow-md'
                    : 'bg-transparent text-[#E9E5DE]/70 hover:text-white border border-white/15 hover:border-[#C5A15B]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#E9E5DE]/45 font-mono uppercase tracking-[0.2em]">
            {filtered.length} {filtered.length === 1 ? 'FILM' : 'FILMS'}
          </div>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="py-24 text-center text-[#E9E5DE]/50 font-serif">
            Loading films...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="text-2xl font-serif text-[#F5F0E6]">No Films Available</div>
            <p className="text-sm text-[#E9E5DE]/60 max-w-md mx-auto">
              No published films match the &ldquo;{selectedCategory}&rdquo; category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((video) => (
              <div
                key={video.id}
                className="group bg-[#1c1c1c] border border-white/5 hover:border-[#C5A15B]/40 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => setActiveVideo(video)}
                    className="relative w-full aspect-[16/10] overflow-hidden bg-[#242424] cursor-pointer"
                  >
                    <Image
                      src={video.thumbnailUrl || '/brand/logo.png'}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                    <div className="absolute top-3 left-3 bg-[#141414]/90 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#C5A15B] border border-[#C5A15B]/30 font-mono">
                      {video.category}
                    </div>

                    {video.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-0.5 text-[11px] font-mono text-white/90">
                        {video.duration}
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#C5A15B]/90 text-[#141414] flex items-center justify-center pl-1 shadow-2xl transform group-hover:scale-110 group-hover:bg-[#DFC488] transition-all duration-300">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    {video.projectTitle && (
                      <div className="text-[11px] uppercase tracking-[0.2em] text-[#C5A15B] font-mono">
                        {video.projectTitle}
                      </div>
                    )}
                    <h3 className="text-xl font-serif text-[#F5F0E6] group-hover:text-[#DFC488] transition-colors leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs text-[#E9E5DE]/75 font-sans font-light leading-relaxed line-clamp-3">
                      {video.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="w-full py-2.5 rounded-full border border-[#C5A15B]/40 hover:bg-[#C5A15B] hover:text-[#141414] text-[#C5A15B] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] font-sans"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Watch Architectural Film</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
          <div className="relative w-full max-w-5xl bg-[#141414] border border-[#C5A15B]/30 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#1a1a1a]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A15B] font-mono">
                  {activeVideo.category}
                </span>
                <h4 className="text-lg sm:text-xl font-serif text-[#F5F0E6]">
                  {activeVideo.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close video player"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={videoService.getPlayableUrl(activeVideo)}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={activeVideo.thumbnailUrl}
              >
                Your browser does not support HTML5 video playback.
              </video>
            </div>

            <div className="p-4 sm:p-6 bg-[#181818] text-xs sm:text-sm text-[#E9E5DE]/80 font-sans font-light leading-relaxed">
              {activeVideo.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
