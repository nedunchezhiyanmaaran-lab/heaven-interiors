'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useProjects } from '@/hooks/useDataServices';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FeaturedProjects: React.FC = () => {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const imageLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(0);

  const { projects } = useProjects(true);

  // Take the 4 featured commissions (or first 4 published)
  const featured = projects.filter((p) => p.isFeatured).slice(0, 4);
  const displayProjects = featured.length >= 4 ? featured : projects.slice(0, 4);

  // Core slide transition with sophisticated architectural clip-path wipe
  const transitionToSlide = useCallback(
    (targetIndex: number) => {
      const prevIndex = activeIndexRef.current;
      if (prevIndex === targetIndex) return;

      const currentLayer = imageLayersRef.current[targetIndex];
      const prevLayer = imageLayersRef.current[prevIndex];

      activeIndexRef.current = targetIndex;
      setActiveIndex(targetIndex);

      if (currentLayer) {
        // Bring new active layer to top
        imageLayersRef.current.forEach((layer, idx) => {
          if (layer) {
            if (idx === targetIndex) {
              gsap.set(layer, { zIndex: 10 });
            } else if (idx === prevIndex) {
              gsap.set(layer, { zIndex: 5 });
            } else {
              gsap.set(layer, { zIndex: 1 });
            }
          }
        });

        // Sophisticated clip-path reveal (wiping upwards smoothly from bottom)
        gsap.fromTo(
          currentLayer,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            scale: 1.05
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            scale: 1,
            duration: 0.95,
            ease: 'power3.inOut'
          }
        );
      }

      // Animate project typography independently
      if (textOverlayRef.current) {
        const textElements = Array.from(textOverlayRef.current.children);
        gsap.fromTo(
          textElements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.07,
            ease: 'power3.out',
            delay: 0.15
          }
        );
      }
    },
    []
  );

  // Smooth jump triggered by buttons or bottom index tabs
  const jumpToSlide = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= displayProjects.length) return;
    if (targetIndex === activeIndexRef.current) return;

    if (outerWrapperRef.current && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const rect = outerWrapperRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const start = rect.top + scrollTop;
      const totalScrollable = outerWrapperRef.current.offsetHeight - window.innerHeight;
      const progressTarget = targetIndex / (displayProjects.length - 1);
      const targetScroll = start + progressTarget * totalScrollable;

      window.scrollTo({ top: targetScroll + 2, behavior: 'smooth' });
    }

    transitionToSlide(targetIndex);
  };

  // Synchronize desktop scrolling with active slide using native-safe ScrollTrigger
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (displayProjects.length <= 1) return;

      const mm = gsap.matchMedia();

      // Desktop Only (>= 1024px): Synchronize slide transitions with scroll progress
      mm.add('(min-width: 1024px)', () => {
        const total = displayProjects.length;

        ScrollTrigger.create({
          trigger: outerWrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const nextIdx = Math.min(
              total - 1,
              Math.max(0, Math.floor(self.progress * total))
            );
            if (nextIdx !== activeIndexRef.current) {
              transitionToSlide(nextIdx);
            }
          }
        });
      });

      return () => mm.revert();
    },
    { scope: outerWrapperRef, dependencies: [displayProjects, transitionToSlide] }
  );

  const currentProject = displayProjects[activeIndex] || displayProjects[0];

  return (
    <section
      id="projects"
      ref={outerWrapperRef}
      className="relative bg-[#E8E1D7] text-[#1A1815] w-full min-h-screen lg:h-[320vh]"
    >
      {/* 
        Native CSS Sticky Frame (top-0 h-screen on desktop).
        This eliminates GSAP pin-spacer artifacts, prevents blank voids,
        and guarantees flawless synchronization with smooth scrolling.
      */}
      <div
        ref={stickyFrameRef}
        className="lg:sticky lg:top-0 w-full min-h-screen lg:h-screen lg:max-h-[1050px] flex flex-col justify-between overflow-hidden bg-[#E8E1D7]"
      >
        {/* ========================================================
            MAIN UPPER BODY: Split Screen
            Left: Minimal Editorial Heading & Generous Whitespace
            Right: Dominant Featured Project Image with Clip-Path Reveal
           ======================================================== */}
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Left Column (Approx 31-33% Width) */}
          <div className="lg:col-span-4 xl:col-span-4 bg-[#E8E1D7] p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-between z-20">
            {/* Eyebrow: 02 —— PORTFOLIO */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-[#1A1815]">02</span>
                <span className="w-10 h-[1px] bg-[#1A1815]/30" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#1A1815] font-mono font-medium">
                  PORTFOLIO
                </span>
              </div>

              {/* Dominant Editorial Heading: Spaces in Story */}
              <div className="space-y-6 pt-4">
                <h2 className="text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-serif font-light text-[#1A1815] leading-[0.98] tracking-tight">
                  Spaces <br />
                  in Story
                </h2>

                <p className="text-xs sm:text-sm text-[#4A453F] font-sans font-light leading-relaxed max-w-xs">
                  Thoughtfully crafted spaces where architecture, material and human living come together in harmony.
                </p>
              </div>
            </div>

            {/* Minimal Explore Button: Circular Outline + Arrow */}
            <div className="pt-10 lg:pt-0">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-full border border-[#1A1815]/35 group-hover:border-[#1A1815] group-hover:bg-[#1A1815] group-hover:text-[#F5F0E6] text-[#1A1815] flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1A1815] leading-snug">
                  EXPLORE <br />
                  ALL PROJECTS
                </div>
              </Link>
            </div>
          </div>

          {/* Right Dominant Featured Project Image (Approx 67-69% Width) */}
          <div className="lg:col-span-8 xl:col-span-8 relative w-full h-[480px] sm:h-[580px] lg:h-full min-h-0 bg-[#1c1815] overflow-hidden">
            {/* Layered Architectural Project Photographs */}
            {displayProjects.map((project, idx) => (
              <div
                key={project.id}
                ref={(el) => {
                  imageLayersRef.current[idx] = el;
                }}
                className={`absolute inset-0 w-full h-full ${
                  idx === activeIndex ? 'z-10' : 'z-0'
                }`}
                style={{
                  clipPath:
                    idx === 0
                      ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                      : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
                }}
              >
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover object-center"
                />
                {/* Soft architectural gradient vignette ensuring optimal contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              </div>
            ))}

            {/* Floating Project Metadata Overlay (Bottom-Left of Image) */}
            <div
              ref={textOverlayRef}
              className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 lg:left-14 right-28 sm:right-36 z-20 space-y-3 pointer-events-auto"
            >
              {/* Category / Location / Year Capsule */}
              <div className="inline-block bg-black/45 backdrop-blur-md px-3.5 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#F5F0E6] border border-white/10">
                {currentProject.category} &nbsp;/&nbsp;{' '}
                {currentProject.location.split(',')[0]} &nbsp;/&nbsp;{' '}
                {currentProject.year}
              </div>

              {/* Project Title */}
              <h3 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-light text-[#F5F0E6] leading-tight">
                {currentProject.title}
              </h3>

              {/* Project Description */}
              <p className="text-xs sm:text-sm font-sans font-light text-[#E9E5DE]/85 leading-relaxed max-w-lg">
                {currentProject.shortDescription}
              </p>

              {/* View Project Link */}
              <div className="pt-2">
                <Link
                  href={`/projects/${currentProject.slug}`}
                  className="group inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-[#C5A15B] hover:text-white transition-colors font-medium font-sans"
                >
                  <span>VIEW PROJECT</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Floating Navigation Controls (Bottom-Right of Image) */}
            <div className="absolute bottom-8 sm:bottom-12 right-6 sm:right-12 z-20 flex items-center gap-3">
              {/* Previous Project Button */}
              <button
                onClick={() => jumpToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                  activeIndex === 0
                    ? 'bg-black/20 text-white/20 cursor-not-allowed border border-white/5'
                    : 'bg-black/50 hover:bg-black/80 text-white border border-white/10 shadow-lg'
                }`}
                aria-label="Previous project"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Next Project Button (Architectural Gold Filled) */}
              <button
                onClick={() => jumpToSlide(activeIndex + 1)}
                disabled={activeIndex === displayProjects.length - 1}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  activeIndex === displayProjects.length - 1
                    ? 'bg-[#C5A15B]/40 text-[#141414]/40 cursor-not-allowed'
                    : 'bg-[#C5A15B] hover:bg-[#DFC488] text-[#141414]'
                }`}
                aria-label="Next project"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM BAR: Minimal Progress & Synchronized Index
            Matches Bottom Strip of Reference Board
           ======================================================== */}
        <div className="w-full bg-[#E8E1D7] border-t border-[#1A1815]/10 px-6 sm:px-10 lg:px-16 py-6 z-20 shrink-0">
          <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Active Number Indicator & Gold Progress Bar */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="space-y-1.5">
                <span className="text-sm font-mono text-[#1A1815] font-semibold tracking-wider">
                  0{activeIndex + 1}
                </span>
                {/* Minimal Progress Bar */}
                <div className="w-32 sm:w-44 h-[2px] bg-[#1A1815]/15 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[#C5A15B] transition-all duration-500 ease-out"
                    style={{
                      width: `${((activeIndex + 1) / displayProjects.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 4 Synchronized Project Columns Across Bottom */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 flex-1 md:ml-12 lg:ml-20">
              {displayProjects.map((project, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={project.id}
                    onClick={() => jumpToSlide(idx)}
                    className="text-left group transition-all duration-300 flex flex-col space-y-1 focus:outline-none"
                  >
                    <span
                      className={`text-[11px] font-mono tracking-widest transition-colors ${
                        isActive
                          ? 'text-[#C5A15B] font-semibold'
                          : 'text-[#1A1815]/45 group-hover:text-[#1A1815]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-serif truncate max-w-[200px] transition-colors ${
                        isActive
                          ? 'text-[#1A1815] font-medium'
                          : 'text-[#6B655E] group-hover:text-[#1A1815]'
                      }`}
                    >
                      {project.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
