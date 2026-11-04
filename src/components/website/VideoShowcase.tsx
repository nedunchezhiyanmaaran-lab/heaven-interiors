'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useVideos } from '@/hooks/useDataServices';
import { videoService } from '@/services/video.service';
import { VideoItem } from '@/types/video.types';
import { Play, X, ArrowRight } from 'lucide-react';

export const VideoShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const { videos, loading } = useVideos(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  // Active hero film: either user selected or first published video
  const activeFilm = selectedVideo || videos[0] || {
    id: 'hero-film-1',
    title: 'A Home in Harmony',
    category: 'Project Walkthrough',
    duration: '04:23',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-with-a-view-of-the-city-43181-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    description: 'An intimate 4K walkthrough exploring the spatial volumes, bespoke travertine installations, and sunset reflections.'
  };

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // 1. Aperture expansion animation on main video frame
      if (heroFrameRef.current) {
        gsap.fromTo(
          heroFrameRef.current,
          { clipPath: 'inset(10% 8% 10% 8%)', scale: 0.95 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1.0,
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: heroFrameRef.current,
              start: 'top 80%'
            }
          }
        );
      }

      // 2. Play button radar wave ripple
      gsap.to('.play-btn-pulse', {
        scale: 1.8,
        opacity: 0,
        repeat: -1,
        duration: 2.2,
        ease: 'power2.out'
      });

      // 3. Bottom thumbnail row entrance
      if (thumbnailsRef.current && thumbnailsRef.current.children.length > 0) {
        gsap.fromTo(
          Array.from(thumbnailsRef.current.children),
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: thumbnailsRef.current,
              start: 'top 90%'
            }
          }
        );
      }
    },
    { scope: containerRef, dependencies: [videos] }
  );

  return (
    <section
      id="videos"
      ref={containerRef}
      className="relative py-28 sm:py-36 bg-[#141414] text-[#F5F0E6] overflow-hidden border-t border-white/5"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Header matching Section 07 of Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between mb-16">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              06 / FILMS
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#F5F0E6] leading-[1.08] tracking-tight uppercase">
              SPACES IN MOTION
            </h2>
          </div>

          <div className="lg:col-span-4 lg:text-right space-y-4">
            <p className="text-xs sm:text-sm text-[#E9E5DE]/70 font-sans max-w-sm ml-auto leading-relaxed">
              Stories, spaces and craft brought to life through film.
            </p>
            <Link
              href="/videos"
              className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#C5A15B] hover:text-[#DFC488] transition-colors"
            >
              <span>WATCH ALL FILMS</span>
              <span className="w-8 h-8 rounded-full border border-[#C5A15B]/40 group-hover:border-[#C5A15B] group-hover:bg-[#C5A15B] group-hover:text-[#141414] flex items-center justify-center transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Hero Featured Video Frame matching Reference */}
        <div
          ref={heroFrameRef}
          onClick={() => setPlayingVideo(activeFilm as VideoItem)}
          className="relative w-full aspect-[21/9] sm:aspect-[16/8] rounded-xl overflow-hidden bg-[#1c1c1c] border border-white/10 shadow-2xl cursor-pointer group"
        >
          <Image
            src={activeFilm.thumbnailUrl || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85'}
            alt={activeFilm.title}
            fill
            sizes="100vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* Central Play Button with Glowing Ripple */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="play-btn-pulse absolute inset-0 rounded-full bg-[#C5A15B]/40" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#C5A15B] bg-[#141414]/80 backdrop-blur-md text-[#C5A15B] flex items-center justify-center pl-1 shadow-2xl group-hover:bg-[#C5A15B] group-hover:text-[#141414] group-hover:scale-110 transition-all duration-300">
                <Play className="w-7 h-7 fill-current" />
              </div>
            </div>
          </div>

          {/* Bottom Left Title Overlay matching Reference */}
          <div className="absolute bottom-8 left-8 sm:left-12 space-y-1">
            <h3 className="text-2xl sm:text-4xl font-serif font-light text-[#F5F0E6]">
              {activeFilm.title}
            </h3>
            <div className="text-xs text-[#C5A15B] uppercase tracking-[0.2em] font-sans">
              {activeFilm.category} • {activeFilm.duration || '04:23'}
            </div>
          </div>
        </div>

        {/* Bottom Film Selector Thumbnails Row matching Section 07 */}
        <div
          ref={thumbnailsRef}
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {videos.slice(0, 6).map((vid, i) => (
            <div
              key={vid.id || i}
              onClick={() => setSelectedVideo(vid)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${
                activeFilm.id === vid.id
                  ? 'border-[#C5A15B] bg-white/5'
                  : 'border-white/5 bg-[#181818] hover:border-white/20'
              }`}
            >
              <div className="relative w-14 h-10 rounded overflow-hidden bg-black flex-shrink-0">
                <Image
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-[#C5A15B]">
                  0{i + 1}
                </div>
                <div className="text-xs font-serif text-[#F5F0E6] truncate">
                  {vid.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
          <div className="relative w-full max-w-5xl bg-[#141414] border border-[#C5A15B]/30 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#1a1a1a]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A15B] font-mono">
                  {playingVideo.category}
                </span>
                <h4 className="text-lg sm:text-xl font-serif text-[#F5F0E6]">
                  {playingVideo.title}
                </h4>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close video player"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={videoService.getPlayableUrl(playingVideo)}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={playingVideo.thumbnailUrl}
              >
                Your browser does not support HTML5 video playback.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
