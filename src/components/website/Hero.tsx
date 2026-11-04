'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Storytelling stages refs
  const openingRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  // Video State
  const [videoLoaded, setVideoLoaded] = useState(false);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);

  // Safe seek mechanism that never overwhelms browser video decoder
  const performSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;

    const target = targetTimeRef.current;
    const diff = Math.abs(video.currentTime - target);

    if (diff > 0.02 && !isSeekingRef.current && video.readyState >= 2) {
      isSeekingRef.current = true;
      video.currentTime = target;
    }
  }, []);

  // Initialize video metadata and attach seek listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0.05;
      setVideoLoaded(true);
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
      const target = targetTimeRef.current;
      if (Math.abs(video.currentTime - target) > 0.03) {
        performSeek();
      }
    };

    if (video.readyState >= 1) {
      onLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    video.addEventListener('seeked', onSeeked);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [performSeek]);

  // Click handler to initiate scroll exploration
  const handleScrollToExplore = () => {
    if (typeof window !== 'undefined' && containerRef.current) {
      const targetY = window.innerHeight * 1.1;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/projects';
    }
  };

  // GSAP ScrollTrigger timeline synchronization
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) return;

      const video = videoRef.current;

      // Pinned scroll track for the kitchen transformation video
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate: (self) => {
          const progress = self.progress; // 0.0 -> 1.0

          // Synchronize Video Timeline with scroll progress
          if (video && video.duration && !isNaN(video.duration)) {
            targetTimeRef.current = progress * (video.duration - 0.05);
            performSeek();
          }

          // 1. OPENING STAGE (0.00 -> 0.16)
          // Fades out gently as soon as the visitor scrolls down
          if (openingRef.current) {
            if (progress <= 0.01) {
              gsap.set(openingRef.current, {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                pointerEvents: 'auto'
              });
            } else if (progress < 0.16) {
              const op = Math.max(0, 1 - (progress - 0.01) / 0.12);
              gsap.set(openingRef.current, {
                opacity: op,
                y: -progress * 140,
                visibility: op > 0.01 ? 'visible' : 'hidden',
                pointerEvents: op > 0.1 ? 'auto' : 'none'
              });
            } else {
              gsap.set(openingRef.current, {
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none'
              });
            }
          }

          // 2. FINALE STAGE (0.75 -> 1.00)
          // Appears when the kitchen transformation is beautifully realized
          if (finaleRef.current) {
            if (progress >= 0.75) {
              const op = Math.min(1, (progress - 0.75) / 0.12);
              gsap.set(finaleRef.current, {
                opacity: op,
                y: (1 - op) * 20,
                visibility: 'visible',
                pointerEvents: op > 0.3 ? 'auto' : 'none'
              });
            } else {
              gsap.set(finaleRef.current, {
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none'
              });
            }
          }
        }
      });

      return () => {
        scrollTriggerInstance.kill();
      };
    },
    { scope: containerRef, dependencies: [videoLoaded] }
  );

  return (
    <section
      id="home-hero"
      ref={containerRef}
      className="relative w-full h-[320vh] bg-[#141414]"
    >
      {/* 
        Native CSS Sticky Frame (top-0 h-screen).
        Pins the entire cinematic hero viewport while the visitor scrolls through the transformation.
      */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden bg-[#141414] select-none"
      >
        {/* ========================================================
            BRIGHT, VIVID CINEMATIC VIDEO (UNENCUMBERED BY HEAVY VIGNETTES)
           ======================================================== */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/Kitchen_transformation_timelapse_301709d7_1080p.mp4"
            poster="/videos/kitchen_timelapse_poster.jpg"
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02] will-change-contents"
          />

          {/* Subtle ambient gradient at the lower third — maintains bright natural daylight across 80% of frame while giving typography razor-sharp clarity */}
          <div className="absolute inset-x-0 bottom-0 h-72 sm:h-80 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />
        </div>

        {/* ========================================================
            REFINED ARCHITECTURAL OPENING (CENTERED, CLEAN & AIRY)
           ======================================================== */}
        <div
          ref={openingRef}
          className="absolute inset-0 z-20 flex flex-col justify-end items-center text-center p-6 sm:p-10 md:p-16 max-w-[1280px] mx-auto w-full pointer-events-auto will-change-transform pb-16 sm:pb-20 md:pb-24"
        >
          <div className="max-w-3xl flex flex-col items-center space-y-3.5 sm:space-y-4">
            {/* Atelier Moniker */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-5 sm:w-8 h-[1px] bg-[#C5A15B]/80 shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#C5A15B] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
                <span className="hidden sm:inline">HEAVEN INTERIORS • </span>ARCHITECTURAL ATELIER
              </span>
              <span className="w-5 sm:w-8 h-[1px] bg-[#C5A15B]/80 shrink-0" />
            </div>

            {/* Main Headline — Balanced editorial scale, clean & poetic */}
            <h1 className="text-3xl sm:text-5xl md:text-[3.25rem] font-serif font-light text-[#FAF7F0] leading-[1.14] tracking-[0.02em] max-w-2xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
              We transform spaces<br className="hidden sm:inline" /> into experiences.
            </h1>

            {/* Subtitle — Airy, modern, uncluttered */}
            <p className="text-xs sm:text-sm font-sans font-light uppercase tracking-[0.2em] text-[#E9E5DE]/85 max-w-lg mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
              Thoughtfully designed interiors. Beautifully crafted living.
            </p>

            {/* Architectural Minimalist Scroll Prompt */}
            <div className="pt-2 sm:pt-3">
              <button
                onClick={handleScrollToExplore}
                className="group inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/20 hover:border-[#C5A15B]/60 text-[#FAF7F0] transition-all duration-300 shadow-xl cursor-pointer"
                aria-label="Scroll to explore interior transformation"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15B] group-hover:scale-125 transition-transform" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-sans font-medium text-[#FAF7F0]/90 group-hover:text-white">
                  SCROLL TO EXPLORE
                </span>
                <ArrowDown className="w-3.5 h-3.5 text-[#C5A15B] transition-transform group-hover:translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            REFINED ARCHITECTURAL FINALE REVEAL (CENTERED & HARMONIOUS)
           ======================================================== */}
        <div
          ref={finaleRef}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute inset-0 z-20 flex flex-col justify-end items-center text-center p-6 sm:p-10 md:p-16 max-w-[1280px] mx-auto w-full pointer-events-none will-change-transform pb-16 sm:pb-20 md:pb-24"
        >
          <div className="max-w-3xl flex flex-col items-center space-y-3.5 sm:space-y-4">
            {/* Atelier Commission Moniker */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-5 sm:w-8 h-[1px] bg-[#C5A15B]/80 shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#C5A15B] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
                <span className="hidden sm:inline">TRANSFORMATION COMPLETE • </span>COMMISSION 2026
              </span>
              <span className="w-5 sm:w-8 h-[1px] bg-[#C5A15B]/80 shrink-0" />
            </div>

            {/* Finale Headline — Balanced two-line symmetry */}
            <h2 className="text-3xl sm:text-5xl md:text-[3.25rem] font-serif font-light text-[#FAF7F0] leading-[1.14] tracking-[0.02em] max-w-xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
              Your Dream Space.<br className="hidden sm:inline" /> Beautifully Realized.
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-sans font-light uppercase tracking-[0.18em] text-[#E9E5DE]/85 max-w-lg mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
              Bespoke turnkey interior architecture, master millwork, and end-to-end execution across India.
            </p>

            {/* Centered Luxury Action Buttons */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto w-full">
              <button
                onClick={handleScrollToProjects}
                className="px-7 py-3 rounded-full bg-[#C5A15B] hover:bg-[#d6b168] text-[#141414] font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-2.5 transition-all duration-300 shadow-xl cursor-pointer"
              >
                <span>EXPLORE OUR PROJECTS</span>
                <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
              </button>

              <Link
                href="/contact"
                className="px-7 py-3 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/20 hover:border-[#C5A15B] text-[#FAF7F0] hover:text-[#C5A15B] font-sans font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all duration-300 shadow-xl"
              >
                <span>CONSULT WITH ATELIER</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
