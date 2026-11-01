'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useProjects } from '@/hooks/useDataServices';
import { ArrowRight, ArrowLeft, Sparkles, Star, Layers, Compass, ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FeaturedProjects: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const imageElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(0);

  const { projects } = useProjects(true);

  // Take the 4 featured commissions (or first 4 published)
  const featured = projects.filter((p) => p.isFeatured).slice(0, 4);
  const displayProjects = featured.length >= 4 ? featured : projects.slice(0, 4);

  // GSAP Horizontal Scroll synchronized with native sticky frame
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!trackRef.current || !outerRef.current) return;

      const mm = gsap.matchMedia();

      // Desktop Only (>= 1024px): Scrub horizontal track across native sticky viewport
      mm.add('(min-width: 1024px)', () => {
        const track = trackRef.current;
        if (!track) return;

        ScrollTrigger.create({
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            const progress = self.progress;

            // 1. Calculate travel distance dynamically
            const maxTravel = track.scrollWidth - window.innerWidth + 96;
            const currentX = -progress * maxTravel;

            gsap.set(track, { x: currentX });

            // 2. Continuous scrub progress bar
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
            }

            // 3. Parallax internal image shifts
            imageElementsRef.current.forEach((imgWrap) => {
              if (imgWrap) {
                const imgShift = (progress - 0.5) * -40;
                gsap.set(imgWrap, { x: imgShift });
              }
            });

            // 4. Update active index indicator
            const total = displayProjects.length;
            const targetIdx = Math.min(
              total - 1,
              Math.max(0, Math.floor(progress * total))
            );
            if (targetIdx !== activeIndexRef.current) {
              activeIndexRef.current = targetIdx;
              setActiveIndex(targetIdx);
            }
          }
        });
      });

      return () => mm.revert();
    },
    { scope: outerRef, dependencies: [displayProjects] }
  );

  // Smooth jump to specific project by index
  const jumpToProject = (idx: number) => {
    if (idx < 0 || idx >= displayProjects.length) return;
    setActiveIndex(idx);
    activeIndexRef.current = idx;

    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024 && outerRef.current) {
        const rect = outerRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const start = rect.top + scrollTop;
        const totalScrollable = outerRef.current.offsetHeight - window.innerHeight;
        const targetScroll = start + (idx / Math.max(1, displayProjects.length - 1)) * totalScrollable;

        window.scrollTo({ top: targetScroll + 2, behavior: 'smooth' });
      } else {
        // Mobile smooth scroll within track
        const el = document.getElementById(`project-card-${idx}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }
  };

  return (
    <section
      id="projects"
      ref={outerRef}
      className="relative bg-[#F5F0E6] text-[#141414] font-sans w-full min-h-screen lg:h-[300vh] border-t border-[#141414]/10"
    >
      {/* Native Sticky Viewport Container */}
      <div
        ref={stickyFrameRef}
        className="lg:sticky lg:top-0 w-full min-h-screen lg:h-screen lg:max-h-[1050px] flex flex-col justify-between overflow-hidden bg-[#F5F0E6] pt-20 sm:pt-24 pb-4 sm:pb-6"
      >
        {/* ========================================================
            1. TOP HEADER BAR: Modern, Crisp & Clean
           ======================================================== */}
        <header className="w-full px-6 sm:px-10 lg:px-14 pb-4 shrink-0 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141414]/5">
          <div className="space-y-1.5">
            {/* Clean Modern Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A15B] font-semibold">
                02 / CURATED COMMISSIONS
              </span>
              <div className="w-8 h-[1px] bg-[#C5A15B]/50" />
              <span className="text-[11px] uppercase tracking-wider text-[#78726A] font-medium hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C5A15B]" />
                Spatial Architecture
              </span>
            </div>

            {/* Bold Modern Title in Plus Jakarta Sans */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] tracking-tight">
              Spaces in Story
            </h2>
          </div>

          {/* Subtitle & Direct Archive Link */}
          <div className="flex items-center gap-8 text-right">
            <p className="text-xs sm:text-sm text-[#78726A] font-normal leading-relaxed max-w-sm hidden xl:block">
              Thoughtfully crafted spaces where architecture, material and human living coalesce into enduring sanctuaries.
            </p>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#141414]/20 hover:border-[#C5A15B] hover:text-[#C5A15B] text-xs font-semibold uppercase tracking-wider transition-all duration-300 group shrink-0 bg-white/70 shadow-sm"
            >
              <span>Explore All Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </header>

        {/* ========================================================
            2. HORIZONTAL GSAP TRACK: Cinematic Project Exhibition
           ======================================================== */}
        <div className="flex-1 min-h-0 flex items-center px-6 sm:px-10 lg:px-14 py-4 sm:py-6 overflow-x-auto lg:overflow-x-visible no-scrollbar snap-x snap-mandatory lg:snap-none">
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-8 lg:gap-10 shrink-0 pr-12 sm:pr-20"
          >
            {/* Card 0: Studio Curatorial Lead Card */}
            <div className="w-[300px] sm:w-[360px] lg:w-[400px] shrink-0 h-[56vh] min-h-[440px] max-h-[540px] rounded-3xl bg-white border border-[#E5DEC9] p-8 sm:p-10 shadow-sm flex flex-col justify-between snap-start">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#C5A15B]/15 text-[#C5A15B] flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A15B] block">
                    Curatorial Approach
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight leading-snug">
                    Architectural Couture & Spatial Purity
                  </h3>
                  <p className="text-xs sm:text-sm text-[#78726A] font-normal leading-relaxed pt-1">
                    Every commission is sculpted as an individual architectural identity. We balance raw masonry, calibrated timber, and tailored daylight.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E5DEC9] text-[10px] uppercase font-semibold text-[#141414] tracking-wider">
                    Duplex Penthouses
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E5DEC9] text-[10px] uppercase font-semibold text-[#141414] tracking-wider">
                    Bespoke Villas
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E5DEC9] text-[10px] uppercase font-semibold text-[#141414] tracking-wider">
                    Executive Spaces
                  </span>
                </div>
              </div>

              {/* Scroll prompt guide */}
              <div className="pt-4 border-t border-[#E5DEC9]/80 flex items-center justify-between text-xs text-[#78726A]">
                <span className="font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A15B] animate-pulse" />
                  Scroll down to tour works
                </span>
                <ArrowRight className="w-4 h-4 text-[#C5A15B] animate-bounce" />
              </div>
            </div>

            {/* Cards 1 to N: Immersive Featured Architectural Project Cards */}
            {displayProjects.map((project, idx) => (
              <div
                key={project.id}
                id={`project-card-${idx}`}
                className="w-[84vw] sm:w-[680px] lg:w-[800px] xl:w-[900px] shrink-0 h-[56vh] min-h-[440px] max-h-[540px] rounded-3xl overflow-hidden border border-[#E5DEC9] shadow-xl relative bg-[#141414] group snap-start"
              >
                {/* Background Photograph with GSAP Parallax Depth */}
                <div
                  ref={(el) => {
                    imageElementsRef.current[idx] = el;
                  }}
                  className="absolute -inset-4 w-[108%] h-[108%] transition-transform duration-700 ease-out group-hover:scale-105"
                >
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 85vw, 900px"
                    className="object-cover object-center"
                  />
                  {/* Luxury Multi-Stop Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                </div>

                {/* Top Overlay Bar: Category, Location & Year Badges */}
                <div className="absolute top-5 left-5 right-5 sm:top-6 sm:left-6 sm:right-6 z-20 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15B]" />
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#DFC488]">
                      {project.category}
                    </span>
                    <span className="text-white/30 text-[10px]">•</span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-white/90">
                      {project.location}
                    </span>
                    <span className="text-white/30 text-[10px]">•</span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-white/70">
                      {project.year}
                    </span>
                  </div>

                  {project.isFeatured && (
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A15B]/20 backdrop-blur-md border border-[#C5A15B]/40 text-[#DFC488] text-[10px] font-bold uppercase tracking-wider">
                      <Star className="w-3 h-3 fill-[#C5A15B] text-[#C5A15B]" />
                      <span>Featured Work</span>
                    </div>
                  )}
                </div>

                {/* Bottom Overlay Area: Title, Description & Action */}
                <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-8 right-5 sm:right-8 z-20 space-y-2.5 sm:space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A15B] block">
                      0{idx + 1} / Commission
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#F5F0E6]/85 font-normal leading-relaxed line-clamp-2 max-w-2xl">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Actions & Spec Badges */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/15">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold text-white/75 bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                        Turnkey Execution
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-white/75 bg-white/10 px-2.5 py-1 rounded-md border border-white/10 hidden sm:inline-block">
                        Bespoke Millwork
                      </span>
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5A15B] hover:bg-[#DFC488] text-[#141414] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg group/btn"
                    >
                      <span>Explore Commission</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Final Card: Commission Invitation Card */}
            <div className="w-[280px] sm:w-[320px] shrink-0 h-[56vh] min-h-[440px] max-h-[540px] rounded-3xl bg-white border border-[#E5DEC9] p-8 sm:p-10 shadow-sm flex flex-col justify-between snap-start">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#141414] text-[#C5A15B] flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#141414] tracking-tight">
                  Have a bespoke residence in mind?
                </h3>
                <p className="text-xs sm:text-sm text-[#78726A] font-normal leading-relaxed">
                  We collaborate with selective homeowners and studio partners worldwide. Schedule a private architectural consultation.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#141414] hover:bg-[#C5A15B] text-white hover:text-[#141414] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  <span>Initiate Dialogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/projects"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-[#E5DEC9] text-[#78726A] hover:text-[#141414] text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <span>All Projects Archive</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. BOTTOM DOCK: Live Progress & Modern Interactive Tabs
           ======================================================== */}
        <footer className="w-full bg-[#F5F0E6] border-t border-[#141414]/10 px-6 sm:px-10 lg:px-14 py-3 shrink-0 z-20">
          <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Live Progress Bar & Numeric Indicator */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#141414] tracking-wider">
                  0{activeIndex + 1}
                </span>
                <span className="text-xs text-[#78726A]">/</span>
                <span className="text-xs font-semibold text-[#78726A]">
                  0{displayProjects.length}
                </span>
              </div>

              {/* Continuous GSAP Timeline Scrub Indicator */}
              <div className="w-28 sm:w-44 h-1.5 bg-[#141414]/10 rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-[#C5A15B] rounded-full transition-all duration-300"
                  style={{
                    width: `${((activeIndex + 1) / displayProjects.length) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Modern Clean Project Quick-Select Tabs */}
            <div className="hidden lg:grid grid-cols-4 gap-4 flex-1 max-w-3xl ml-8">
              {displayProjects.map((project, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={project.id}
                    onClick={() => jumpToProject(idx)}
                    className="text-left group transition-all duration-300 py-1 focus:outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold tracking-wider transition-colors ${
                          isActive
                            ? 'text-[#C5A15B]'
                            : 'text-[#78726A] group-hover:text-[#141414]'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span
                        className={`text-xs font-semibold truncate transition-colors ${
                          isActive
                            ? 'text-[#141414]'
                            : 'text-[#78726A] group-hover:text-[#141414]'
                        }`}
                      >
                        {project.title}
                      </span>
                    </div>
                    {/* Active highlight line */}
                    <div
                      className={`h-[2px] mt-1 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-[#C5A15B] w-full' : 'bg-transparent w-0 group-hover:bg-[#141414]/20 group-hover:w-1/2'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Navigation Arrows with Hover Physics */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                onClick={() => jumpToProject(activeIndex - 1)}
                disabled={activeIndex === 0}
                className={`w-9 h-9 rounded-full border border-[#141414]/20 flex items-center justify-center transition-all ${
                  activeIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-[#78726A]'
                    : 'bg-white hover:bg-[#141414] hover:text-white text-[#141414] shadow-sm'
                }`}
                aria-label="Previous project"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => jumpToProject(activeIndex + 1)}
                disabled={activeIndex === displayProjects.length - 1}
                className={`w-9 h-9 rounded-full border border-[#141414]/20 flex items-center justify-center transition-all ${
                  activeIndex === displayProjects.length - 1
                    ? 'opacity-30 cursor-not-allowed text-[#78726A]'
                    : 'bg-[#C5A15B] hover:bg-[#DFC488] text-[#141414] font-bold shadow-sm'
                }`}
                aria-label="Next project"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};
