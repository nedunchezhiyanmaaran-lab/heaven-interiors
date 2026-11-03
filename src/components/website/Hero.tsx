'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowUpRight, Compass, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Storytelling stages refs
  const openingRef = useRef<HTMLDivElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  // Scrubber UI refs
  const scrubberFillRef = useRef<HTMLDivElement>(null);
  const scrubberLabelRef = useRef<HTMLSpanElement>(null);

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

      // Pin and track the hero container across a generous 400vh scroll track
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

          // 1. OPENING STAGE (0.00 -> 0.18)
          // "WE TRANSFORM SPACES INTO EXPERIENCES."
          if (openingRef.current) {
            if (progress <= 0.01) {
              gsap.set(openingRef.current, {
                opacity: 1,
                y: 0,
                visibility: 'visible',
                pointerEvents: 'auto'
              });
            } else if (progress < 0.18) {
              const op = Math.max(0, 1 - (progress - 0.01) / 0.14);
              gsap.set(openingRef.current, {
                opacity: op,
                y: -progress * 180,
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

          // 2. EDITORIAL BEAT 1 (0.22 -> 0.44)
          // "01 / TACTILE MATERIALITY — From raw structural foundation to sculpted architectural sanctuary."
          if (beat1Ref.current) {
            if (progress >= 0.22 && progress <= 0.44) {
              let op = 0;
              if (progress < 0.27) {
                op = (progress - 0.22) / 0.05;
              } else if (progress > 0.39) {
                op = 1 - (progress - 0.39) / 0.05;
              } else {
                op = 1;
              }
              const clamped = Math.max(0, Math.min(1, op));
              gsap.set(beat1Ref.current, {
                opacity: clamped,
                y: (1 - clamped) * 20,
                visibility: clamped > 0.01 ? 'visible' : 'hidden'
              });
            } else {
              gsap.set(beat1Ref.current, {
                opacity: 0,
                visibility: 'hidden'
              });
            }
          }

          // 3. EDITORIAL BEAT 2 (0.48 -> 0.70)
          // "02 / LIGHT & PROPORTION — Calibrated illumination and bespoke millwork crafted for human living."
          if (beat2Ref.current) {
            if (progress >= 0.48 && progress <= 0.70) {
              let op = 0;
              if (progress < 0.53) {
                op = (progress - 0.48) / 0.05;
              } else if (progress > 0.65) {
                op = 1 - (progress - 0.65) / 0.05;
              } else {
                op = 1;
              }
              const clamped = Math.max(0, Math.min(1, op));
              gsap.set(beat2Ref.current, {
                opacity: clamped,
                y: (1 - clamped) * 20,
                visibility: clamped > 0.01 ? 'visible' : 'hidden'
              });
            } else {
              gsap.set(beat2Ref.current, {
                opacity: 0,
                visibility: 'hidden'
              });
            }
          }

          // 4. FINALE STAGE (0.74 -> 1.00)
          // "YOUR DREAM SPACE. BEAUTIFULLY REALIZED."
          if (finaleRef.current) {
            if (progress >= 0.74) {
              const op = Math.min(1, (progress - 0.74) / 0.10);
              gsap.set(finaleRef.current, {
                opacity: op,
                y: (1 - op) * 24,
                visibility: 'visible',
                pointerEvents: op > 0.4 ? 'auto' : 'none'
              });
            } else {
              gsap.set(finaleRef.current, {
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none'
              });
            }
          }

          // 5. SCRUBBER PROGRESS BAR
          if (scrubberFillRef.current) {
            gsap.set(scrubberFillRef.current, {
              width: `${(progress * 100).toFixed(1)}%`
            });
          }
          if (scrubberLabelRef.current) {
            scrubberLabelRef.current.textContent = `${Math.round(progress * 100).toString().padStart(2, '0')}%`;
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
      className="relative w-full h-[400vh] bg-[#141414]"
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
            CINEMATIC VIDEO CANVAS & VIGNETTE
           ======================================================== */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/Untitled_Scene_11-03_19_58_07_20261104014542.mp4"
            poster="/videos/hero_poster.jpg"
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
            className="w-full h-full object-cover object-center will-change-contents"
          />

          {/* Architectural Vignettes & Contrast Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>

        {/* ========================================================
            STAGE 1: OPENING HERO OVERLAY (0% - 18% SCROLL)
           ======================================================== */}
        <div
          ref={openingRef}
          className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 md:p-16 max-w-[1400px] mx-auto w-full pointer-events-auto will-change-transform"
        >
          {/* Top Brand Identity Badge */}
          <div className="pt-20 sm:pt-24 flex items-center justify-between">
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#141414]/80 backdrop-blur-md border border-[#C5A15B]/30 shadow-lg">
              <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[#C5A15B]/40">
                <Image
                  src="/brand/logo.png"
                  alt="Heaven Interiors"
                  fill
                  sizes="20px"
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-[#C5A15B] font-medium">
                HEAVEN INTERIORS ATELIER
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#E9E5DE]/70 bg-[#141414]/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Compass className="w-3.5 h-3.5 text-[#C5A15B]" />
              <span>SPATIAL CHRONICLE</span>
            </div>
          </div>

          {/* Center-Bottom Dramatic Typography */}
          <div className="max-w-4xl space-y-5 pb-16 sm:pb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light text-[#F5F0E6] leading-[1.0] tracking-tight uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              WE TRANSFORM SPACES INTO EXPERIENCES.
            </h1>

            <p className="text-xs sm:text-sm md:text-base font-sans uppercase tracking-[0.24em] text-[#E9E5DE]/90 font-normal max-w-2xl leading-relaxed drop-shadow-md">
              Thoughtfully designed interiors. Beautifully crafted living.
            </p>

            {/* Interactive "SCROLL TO EXPLORE" trigger */}
            <div className="pt-3 flex items-center gap-4">
              <button
                onClick={handleScrollToExplore}
                className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#141414]/90 hover:bg-[#C5A15B] backdrop-blur-md border border-[#C5A15B]/50 hover:border-[#C5A15B] text-[#F5F0E6] hover:text-[#141414] transition-all duration-300 shadow-xl cursor-pointer"
                aria-label="Scroll to explore interior transformation"
              >
                <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center transition-transform group-hover:translate-y-0.5">
                  <ArrowDown className="w-3 h-3" />
                </div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-sans font-medium pr-1">
                  SCROLL TO EXPLORE
                </span>
              </button>

              <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-[#E9E5DE]/60 bg-black/40 px-3 py-1 rounded-full">
                SCROLL TO ADVANCE TRANSFORMATION
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            STAGE 2: EDITORIAL BEAT 1 (22% - 44% SCROLL)
           ======================================================== */}
        <div
          ref={beat1Ref}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute left-6 sm:left-12 md:left-20 bottom-24 sm:bottom-28 z-20 max-w-md pointer-events-none will-change-transform"
        >
          <div className="p-5 sm:p-6 rounded-xl bg-[#141414]/90 backdrop-blur-xl border border-[#C5A15B]/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A15B]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A15B] font-bold">
                01 / TACTILE MATERIALITY
              </span>
            </div>
            <p className="text-base sm:text-lg font-serif text-[#F5F0E6] leading-snug">
              From raw structural foundation to sculpted architectural sanctuary.
            </p>
            <p className="text-[11px] font-sans text-[#E5DEC9]/70 leading-relaxed tracking-wider uppercase pt-1 border-t border-white/10">
              Engineered substrates &bull; Bespoke veneers &bull; Precision masonry
            </p>
          </div>
        </div>

        {/* ========================================================
            STAGE 3: EDITORIAL BEAT 2 (48% - 70% SCROLL)
           ======================================================== */}
        <div
          ref={beat2Ref}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute right-6 sm:right-12 md:right-20 bottom-24 sm:bottom-28 z-20 max-w-md pointer-events-none will-change-transform"
        >
          <div className="p-5 sm:p-6 rounded-xl bg-[#141414]/90 backdrop-blur-xl border border-[#C5A15B]/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-2.5 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A15B] font-bold">
                02 / LIGHT & PROPORTION
              </span>
              <span className="w-2 h-2 rounded-full bg-[#C5A15B]" />
            </div>
            <p className="text-base sm:text-lg font-serif text-[#F5F0E6] leading-snug">
              Calibrated illumination and bespoke millwork crafted for human living.
            </p>
            <p className="text-[11px] font-sans text-[#E5DEC9]/70 leading-relaxed tracking-wider uppercase pt-1 border-t border-white/10">
              Custom cabinetry &bull; Architectural pendant lights &bull; Seamless finishes
            </p>
          </div>
        </div>

        {/* ========================================================
            STAGE 4: FINALE STAGE (74% - 100% SCROLL)
           ======================================================== */}
        <div
          ref={finaleRef}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-12 md:p-16 max-w-[1400px] mx-auto w-full pointer-events-none will-change-transform"
        >
          <div className="max-w-3xl pb-16 sm:pb-20 space-y-5">
            {/* Architectural Completion Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414]/90 backdrop-blur-md border border-[#C5A15B]/50 text-[#C5A15B] shadow-xl">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-semibold">
                HEAVEN INTERIORS &bull; COMPLETED RESIDENCE
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#F5F0E6] leading-[1.05] tracking-tight uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              YOUR DREAM SPACE. BEAUTIFULLY REALIZED.
            </h2>

            <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.24em] text-[#E9E5DE]/90 font-normal max-w-xl leading-relaxed drop-shadow-md">
              Bespoke turnkey interior architecture, master millwork, and end-to-end execution across India.
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4 pointer-events-auto">
              <button
                onClick={handleScrollToProjects}
                className="group px-6 py-3.5 rounded-full bg-[#C5A15B] hover:bg-[#d6b168] text-[#141414] font-sans font-semibold text-xs uppercase tracking-[0.2em] flex items-center gap-2.5 transition-all duration-300 shadow-2xl cursor-pointer"
              >
                <span>EXPLORE OUR PROJECTS</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <Link
                href="/contact"
                className="group px-6 py-3.5 rounded-full bg-[#141414]/90 hover:bg-[#141414] backdrop-blur-md border border-white/30 hover:border-[#C5A15B] text-[#F5F0E6] hover:text-[#C5A15B] font-sans font-medium text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-all duration-300 shadow-xl"
              >
                <span>CONSULT WITH ATELIER</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================
            CINEMATIC PROGRESS SCRUBBER BAR (BOTTOM)
           ======================================================== */}
        <div className="absolute bottom-6 left-6 right-6 sm:left-12 sm:right-12 z-20 flex items-center justify-between gap-6 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C5A15B] animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#E9E5DE]/80 bg-[#141414]/60 backdrop-blur-md px-2.5 py-1 rounded-full">
              CHRONICLE
            </span>
          </div>

          {/* Minimalist Progress Track */}
          <div className="flex-1 max-w-xs sm:max-w-md h-[2px] bg-white/20 rounded-full overflow-hidden relative shadow-md">
            <div
              ref={scrubberFillRef}
              style={{ width: '0%' }}
              className="h-full bg-gradient-to-r from-[#C5A15B]/60 to-[#C5A15B] rounded-full will-change-transform"
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-[#C5A15B] bg-[#141414]/60 backdrop-blur-md px-2.5 py-1 rounded-full">
            <span ref={scrubberLabelRef}>00%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
