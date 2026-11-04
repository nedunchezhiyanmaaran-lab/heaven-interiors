'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useVideos } from '@/hooks/useDataServices';
import { videoService } from '@/services/video.service';
import { VideoItem } from '@/types/video.types';
import { INITIAL_VIDEOS } from '@/data/mock-videos';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Compass,
  Sparkles,
  Clock,
  ArrowUpRight,
  SlidersHorizontal,
  Layers,
  Eye,
  X
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Architectural film dossier specifications for each film
const FILM_SPECS: Record<string, {
  coordinates: string;
  aspectRatio: string;
  scale: string;
  palette: string[];
  soundscape: string;
}> = {
  'vid-06': {
    coordinates: '19.0176° N, 72.8176° E',
    aspectRatio: '16:9 4K UHD',
    scale: '7,500 SQ.FT TURNKEY RESIDENCE',
    palette: ['Concrete Substrate', 'Walnut Veneer', 'Architectural Brass', 'Pure White Millwork'],
    soundscape: 'Binaural Craftsmanship & Tooling Acoustics'
  },
  'vid-01': {
    coordinates: '18.9986° N, 72.8145° E',
    aspectRatio: '2.39:1 Anamorphic',
    scale: '6,800 SQ.FT DUPLEX PENTHOUSE',
    palette: ['Silver Travertine', 'Smoked Oak', 'Fluted Glass', 'Brushed Bronze'],
    soundscape: 'Arabian Sea Breezes & Ambient Acoustic Resonance'
  },
  'vid-02': {
    coordinates: '19.0660° N, 72.8680° E',
    aspectRatio: '16:9 4K Master',
    scale: '14,000 SQ.FT EXECUTIVE HEADQUARTERS',
    palette: ['Acoustic Oak Baffles', 'Nero Marquina', 'Linear LED Coves', 'Charcoal Wool'],
    soundscape: 'Contemporary Dynamic Workspace Soundscape'
  },
  'vid-03': {
    coordinates: '17.4325° N, 78.4071° E',
    aspectRatio: '2.39:1 Anamorphic',
    scale: '9,200 SQ.FT MONOLITHIC VILLA',
    palette: ['Board-Formed Concrete', 'Dark Stained Teak', 'Honed Basalt', 'Raw Linen'],
    soundscape: 'Architectural Silence & Courtyard Water Reflections'
  },
  'vid-04': {
    coordinates: '19.1136° N, 72.8697° E',
    aspectRatio: '16:9 Macro 4K',
    scale: 'HEAVEN INTERIORS WORKSHOP ATELIER',
    palette: ['Birch Marine Plywood', 'Calibrated Veneers', 'Organic Adhesives', 'Sanding Grit'],
    soundscape: 'Hand-Plane Whispers & Precision Millwork Timber Resonance'
  },
  'vid-05': {
    coordinates: '15.5872° N, 73.7712° E',
    aspectRatio: '2.39:1 Anamorphic',
    scale: '5,400 SQ.FT HERITAGE SANCTUARY',
    palette: ['Hand-Carved Teak', 'Lime Plaster', 'Terracotta Tile', 'Monsoon Granite'],
    soundscape: 'Tropical Assagao Canopy & Monsoon Rains'
  }
};

const CANONICAL_CATEGORIES = [
  'All',
  'Construction Progress',
  'Design Walkthroughs',
  'Completed Projects',
  'Behind the Scenes',
  'Site Visits'
];

export default function VideosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const screeningRoomRef = useRef<HTMLDivElement>(null);
  const activeVideoElementRef = useRef<HTMLVideoElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { videos: liveVideos, loading } = useVideos(true);
  // Use INITIAL_VIDEOS before mount to ensure zero SSR hydration mismatch
  const videos = mounted ? liveVideos : INITIAL_VIDEOS;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFilmIndex, setActiveFilmIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [cinemaMode, setCinemaMode] = useState<boolean>(false);
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(null);

  // Timecode scrubber state for screening theater
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const categories = CANONICAL_CATEGORIES;

  const filteredVideos =
    selectedCategory === 'All'
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  const activeFilm = filteredVideos[activeFilmIndex] || filteredVideos[0] || videos[0];
  const activeSpecs = activeFilm ? FILM_SPECS[activeFilm.id] || {
    coordinates: '19.0760° N, 72.8777° E',
    aspectRatio: '16:9 4K UHD',
    scale: 'ARCHITECTURAL RESIDENCE',
    palette: ['Natural Wood', 'Stone Slab', 'Architectural Steel'],
    soundscape: 'Ambient Spatial Soundscape'
  } : null;

  // Sync play/pause with screening room video element
  const togglePlay = () => {
    const v = activeVideoElementRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = activeVideoElementRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleTimeUpdate = () => {
    const v = activeVideoElementRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (!duration && v.duration) {
      setDuration(v.duration);
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = activeVideoElementRef.current;
    if (!v || !duration) return;
    const target = (parseFloat(e.target.value) / 100) * duration;
    v.currentTime = target;
    setCurrentTime(target);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Switch active film in master screening room
  const selectFilm = (index: number) => {
    setActiveFilmIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
    if (activeVideoElementRef.current) {
      activeVideoElementRef.current.currentTime = 0;
    }
  };

  // GSAP ScrollTrigger Aperture Reveals for film strips
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const strips = gsap.utils.toArray<HTMLElement>('.film-strip-reveal');
      strips.forEach((strip) => {
        gsap.fromTo(
          strip,
          { clipPath: 'inset(8% 4% 8% 4%)', opacity: 0.7, scale: 0.96 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: strip,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 0.5
            }
          }
        );
      });
    },
    { scope: containerRef, dependencies: [filteredVideos] }
  );

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-[#141414] text-[#F5F0E6] transition-colors duration-700 ${
        cinemaMode ? 'bg-[#0a0a0a]' : 'bg-[#141414]'
      }`}
    >
      {/* ========================================================
          1. EDITORIAL HEADER & CINEMA PROLOGUE
         ======================================================== */}
      <section className="pt-32 sm:pt-40 pb-12 max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-white/10">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#1c1c1c] border border-[#C5A15B]/30 text-[#C5A15B]">
              <Film className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-semibold">
                ARCHITECTURAL CINEMA ARCHIVE &bull; 06 CHRONICLES
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#F5F0E6] leading-[1.02] tracking-tight uppercase">
              SPACES IN MOTION
            </h1>

            <p className="text-sm sm:text-base text-[#E9E5DE]/80 font-sans font-light leading-relaxed max-w-2xl">
              Photographs freeze moments. Architecture lives across daylight and time. We produce dedicated 4K cinematic monographs for every completed commission to record the movement of light, tactile resonance, and spatial spirit.
            </p>
          </div>

          {/* Quick Stats & Coordinates */}
          <div className="flex flex-wrap items-center gap-6 lg:flex-col lg:items-end text-right font-mono text-xs text-[#E9E5DE]/60">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#C5A15B]" />
              <span>STUDIO ATELIER ARCHIVE</span>
            </div>
            <div className="text-[11px] text-[#C5A15B]">
              4K ANAMORPHIC &bull; SPATIAL SOUND
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveFilmIndex(0);
                }}
                className={`px-4 sm:px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] font-sans transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-[#C5A15B] text-[#141414] font-semibold shadow-lg shadow-[#C5A15B]/20'
                    : 'bg-[#1c1c1c]/80 text-[#E9E5DE]/70 hover:text-white border border-white/10 hover:border-[#C5A15B]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCinemaMode(!cinemaMode)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] transition-all ${
                cinemaMode
                  ? 'bg-[#C5A15B] text-[#141414] font-semibold'
                  : 'bg-[#1c1c1c] text-[#E9E5DE]/70 border border-white/10 hover:border-[#C5A15B]/40'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{cinemaMode ? 'EXIT CINEMA MODE' : 'CINEMA LIGHTING'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. MASTER SCREENING THEATER (Interactive 21:9 Room)
         ======================================================== */}
      {activeFilm && (
        <section
          ref={screeningRoomRef}
          className="relative max-w-[1440px] mx-auto px-6 sm:px-12 py-8"
        >
          {/* Ambient Glow behind the theatre */}
          <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-96 bg-[#C5A15B]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Theater Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/15 shadow-2xl">
            {/* Top Theater Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#141414]/90 backdrop-blur-md border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#C5A15B] animate-ping" />
                <span suppressHydrationWarning className="text-[#C5A15B] uppercase tracking-widest font-semibold">
                  SCREENING THEATER &bull; {activeSpecs?.aspectRatio || '16:9 4K UHD'}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-6 text-[#E9E5DE]/60 text-[11px]">
                <span suppressHydrationWarning>{activeSpecs?.coordinates}</span>
                <span>&bull;</span>
                <span suppressHydrationWarning className="text-[#C5A15B]">{activeSpecs?.scale}</span>
              </div>
            </div>

            {/* Video Canvas Container (21:9 Anamorphic format) */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-black overflow-hidden group">
              <video
                key={activeFilm.id}
                suppressHydrationWarning
                ref={activeVideoElementRef}
                src={videoService.getPlayableUrl(activeFilm)}
                poster={activeFilm.thumbnailUrl}
                muted={isMuted}
                playsInline
                loop
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-cover object-center cursor-pointer"
              />

              {/* Cinematic Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Center Play/Pause Overlay */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer group-hover:bg-black/20 transition-all"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#C5A15B]/20 animate-ping" />
                    <div className="w-20 h-20 rounded-full border border-[#C5A15B] bg-[#141414]/90 backdrop-blur-md text-[#C5A15B] flex items-center justify-center pl-1 shadow-2xl hover:scale-110 hover:bg-[#C5A15B] hover:text-[#141414] transition-all duration-300">
                      <Play className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                </div>
              )}

              {/* On-Canvas Bottom Meta */}
              <div className="absolute bottom-16 sm:bottom-20 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                <div className="space-y-1 max-w-2xl">
                  <span suppressHydrationWarning className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A15B] bg-[#141414]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#C5A15B]/30">
                    {activeFilm.category}
                  </span>
                  <h2 suppressHydrationWarning className="text-2xl sm:text-4xl md:text-5xl font-serif font-light text-[#F5F0E6] drop-shadow-2xl">
                    {activeFilm.title}
                  </h2>
                </div>

                {activeFilm.projectTitle && (
                  <Link
                    href={`/projects`}
                    className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414]/90 hover:bg-[#C5A15B] text-[#F5F0E6] hover:text-[#141414] border border-white/20 hover:border-[#C5A15B] text-xs font-mono uppercase tracking-wider transition-all shadow-xl"
                  >
                    <span>Commission Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Custom Player Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-2.5 z-10">
                {/* Timeline Scrubber */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[#C5A15B] w-12 text-right">
                    {formatTime(currentTime)}
                  </span>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleScrubberChange}
                    className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#C5A15B]"
                  />

                  <span className="font-mono text-[11px] text-[#E9E5DE]/60 w-12">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Action Buttons */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 text-[#F5F0E6] hover:text-[#C5A15B] transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-1.5 text-[#F5F0E6] hover:text-[#C5A15B] transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span suppressHydrationWarning className="hidden sm:inline-block font-mono text-[10px] text-[#E9E5DE]/50 uppercase tracking-widest">
                      {activeSpecs?.soundscape}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveModalVideo(activeFilm)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#C5A15B] hover:text-[#DFC488] transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">FULL CINEMA EXPANSION</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Chapter Switcher Tabs (6 Curated Films) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-white/10 bg-[#141414] border-t border-white/10">
              {filteredVideos.map((film, idx) => (
                <button
                  key={film.id}
                  onClick={() => selectFilm(idx)}
                  className={`p-4 text-left transition-all group flex flex-col justify-between gap-3 ${
                    activeFilmIndex === idx
                      ? 'bg-[#1f1b17] border-b-2 border-b-[#C5A15B]'
                      : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono text-[#C5A15B] font-bold">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-[#E9E5DE]/50">
                      {film.duration || '03:00'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-serif text-[#F5F0E6] line-clamp-1 group-hover:text-[#C5A15B] transition-colors">
                      {film.title}
                    </h4>
                    <p className="text-[10px] font-mono text-[#817970] uppercase tracking-wider line-clamp-1">
                      {film.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          3. SCROLL-DRIVEN ARCHITECTURAL MONOGRAPHS (Film Strips)
         ======================================================== */}
      <section className="py-24 sm:py-32 max-w-[1440px] mx-auto px-6 sm:px-12 space-y-28 sm:space-y-40">
        <div className="text-center max-w-2xl mx-auto space-y-3 pb-8">
          <span className="text-xs uppercase tracking-[0.28em] text-[#C5A15B] font-mono font-semibold">
            CURATED ANTHOLOGY
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F0E6] uppercase tracking-tight">
            THE ARCHITECTURAL CHRONICLES
          </h2>
          <p className="text-sm text-[#E9E5DE]/70 font-sans font-light leading-relaxed">
            Every episode explores an individual commission through structural engineering, tactile material palettes, and live interior transformations.
          </p>
        </div>

        {/* Alternating Widescreen Monograph Rows */}
        {filteredVideos.map((video, idx) => {
          const specs = FILM_SPECS[video.id] || {
            coordinates: '19.0760° N, 72.8777° E',
            aspectRatio: '16:9 4K UHD',
            scale: 'COMMISSION RESIDENCE',
            palette: ['Birch Core', 'Veneers', 'Brass Joinery'],
            soundscape: 'Binaural Soundscape'
          };

          const isEven = idx % 2 === 0;

          return (
            <article
              key={video.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center ${
                isEven ? '' : 'lg:grid-flow-dense'
              }`}
            >
              {/* Film Frame Visual Column */}
              <div
                className={`lg:col-span-7 ${
                  isEven ? 'lg:col-start-1' : 'lg:col-start-6'
                }`}
              >
                <div
                  onClick={() => setActiveModalVideo(video)}
                  className="film-strip-reveal relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-[#1c1c1c] border border-white/10 shadow-2xl cursor-pointer group will-change-transform"
                >
                  <Image
                    src={video.thumbnailUrl || '/brand/logo.png'}
                    alt={video.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />

                  {/* Dark Vignettes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover:opacity-75 transition-opacity" />

                  {/* Top Film Coordinate Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-[#141414]/90 backdrop-blur-md px-3 py-1 rounded text-[#C5A15B] border border-[#C5A15B]/30 uppercase tracking-widest font-semibold">
                      CH. 0{idx + 1} &bull; {video.category}
                    </span>
                    <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-white/80">
                      {video.duration || '03:45'}
                    </span>
                  </div>

                  {/* Floating Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#C5A15B] bg-[#141414]/85 backdrop-blur-md text-[#C5A15B] flex items-center justify-center pl-1 shadow-2xl group-hover:scale-110 group-hover:bg-[#C5A15B] group-hover:text-[#141414] transition-all duration-300">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                    </div>
                  </div>

                  {/* Bottom Technical Spec strip on hover */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-[#E9E5DE]/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded">
                    <span>{specs.aspectRatio}</span>
                    <span className="text-[#C5A15B]">{specs.coordinates}</span>
                  </div>
                </div>
              </div>

              {/* Dossier Meta Column */}
              <div
                className={`lg:col-span-5 space-y-6 ${
                  isEven ? 'lg:col-start-8' : 'lg:col-start-1'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-[1.5px] bg-[#C5A15B]" />
                    <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-semibold">
                      {video.projectTitle || 'ARCHITECTURAL RECORD'}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-serif font-light text-[#F5F0E6] leading-tight">
                    {video.title}
                  </h3>

                  <p className="text-sm text-[#E9E5DE]/80 font-sans font-light leading-relaxed pt-2">
                    {video.description}
                  </p>
                </div>

                {/* Tactile Materiality Palette & Dossier specs */}
                <div className="p-5 rounded-xl bg-[#1c1c1c]/70 border border-white/5 space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[#817970] uppercase">SPATIAL VOLUME</span>
                    <span className="text-[#F5F0E6]">{specs.scale}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[#817970] uppercase">SOUND DESIGN</span>
                    <span className="text-[#C5A15B]">{specs.soundscape}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[#817970] uppercase text-[10px] block">
                      TACTILE MATERIAL PALETTE
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {specs.palette.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded bg-[#242424] text-[10px] text-[#E9E5DE]/90 border border-white/5"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Action Trigger */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => {
                      selectFilm(idx);
                      if (screeningRoomRef.current) {
                        screeningRoomRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#C5A15B] hover:bg-[#d6b168] text-[#141414] font-sans font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-xl"
                  >
                    <span>Load in Master Theater</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <button
                    onClick={() => setActiveModalVideo(video)}
                    className="p-3 rounded-full border border-white/20 hover:border-[#C5A15B] text-[#E9E5DE] hover:text-[#C5A15B] transition-colors"
                    title="Open Fullscreen Cinema Modal"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* ========================================================
          4. CINEMATOGRAPHY MANIFESTO & SPATIAL ACOUSTICS
         ======================================================== */}
      <section className="py-24 sm:py-32 bg-[#171717] border-y border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-semibold">
              06 / CINEMATOGRAPHIC PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#F5F0E6] uppercase tracking-tight">
              WHY WE DOCUMENT SPACES IN MOTION
            </h2>
            <p className="text-sm sm:text-base text-[#E9E5DE]/80 font-sans leading-relaxed">
              Interior architecture cannot be fully experienced from a frozen viewpoint. A room changes by the hour as sunlight drifts across raw masonry and calibrated veneers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 space-y-4 shadow-xl">
              <span className="text-2xl font-serif text-[#C5A15B]">I.</span>
              <h3 className="text-lg font-serif text-[#F5F0E6]">Calibrated Daylight</h3>
              <p className="text-xs sm:text-sm text-[#817970] font-sans leading-relaxed">
                Recording natural morning sunlight as it washes across silver travertine, revealing microscopic grain and subtle architectural shadow lines over twelve hours.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 space-y-4 shadow-xl">
              <span className="text-2xl font-serif text-[#C5A15B]">II.</span>
              <h3 className="text-lg font-serif text-[#F5F0E6]">Tactile Acoustics</h3>
              <p className="text-xs sm:text-sm text-[#817970] font-sans leading-relaxed">
                Capturing the authentic acoustic dampening of custom-pressed oak ceiling baffles and handmade wool carpets against reflective monolithic stone slabs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 space-y-4 shadow-xl">
              <span className="text-2xl font-serif text-[#C5A15B]">III.</span>
              <h3 className="text-lg font-serif text-[#F5F0E6]">Spatial Metamorphosis</h3>
              <p className="text-xs sm:text-sm text-[#817970] font-sans leading-relaxed">
                Documenting the profound turnkey progression from bare concrete structural slabs and exposed conduits into serene, bespoke residential sanctuaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FULLSCREEN CINEMA SCREENING MODAL PLAYER
         ======================================================== */}
      {activeModalVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-10 animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-6xl bg-[#141414] border border-[#C5A15B]/40 rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.9)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-white/10">
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4 text-[#C5A15B]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5A15B]">
                  HEAVEN INTERIORS ARCHITECTURAL CINEMA &bull; {activeModalVideo.category}
                </span>
              </div>

              <button
                onClick={() => setActiveModalVideo(null)}
                className="p-2 text-[#E9E5DE] hover:text-[#C5A15B] transition-colors rounded-full hover:bg-white/5"
                aria-label="Close cinema modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Video Player with Native HTML5 Controls */}
            <div className="relative w-full aspect-[16/9] bg-black">
              <video
                src={videoService.getPlayableUrl(activeModalVideo)}
                poster={activeModalVideo.thumbnailUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-6 bg-[#181818] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-serif text-[#F5F0E6]">
                  {activeModalVideo.title}
                </h3>
                <p className="text-xs text-[#817970] font-sans max-w-xl">
                  {activeModalVideo.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  onClick={() => setActiveModalVideo(null)}
                  className="px-5 py-2.5 rounded-full bg-[#C5A15B] hover:bg-[#d6b168] text-[#141414] font-sans font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  Commission Architecture
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
