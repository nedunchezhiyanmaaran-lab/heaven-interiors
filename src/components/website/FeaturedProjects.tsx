'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useProjects } from '@/hooks/useDataServices';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FeaturedProjects: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const { projects } = useProjects(true);

  // Take the 4 primary featured commissions
  const featured = projects.filter((p) => p.isFeatured).slice(0, 4);
  const displayProjects = featured.length >= 4 ? featured : projects.slice(0, 4);

  // GSAP 3D Stacking Cards Receding Scroll Animation
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const cards = gsap.utils.toArray<HTMLElement>('.portfolio-stack-card');
      if (cards.length <= 1) return;

      cards.forEach((card, index) => {
        // Last card doesn't need to scale down
        if (index === cards.length - 1) return;

        const nextCard = cards[index + 1];

        gsap.to(card, {
          scale: 0.92,
          opacity: 0.3,
          filter: 'blur(2px)',
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top bottom-=120',
            end: 'top top+=140',
            scrub: true
          }
        });
      });
    },
    { scope: outerRef, dependencies: [displayProjects] }
  );

  return (
    <section
      id="projects"
      ref={outerRef}
      className="relative bg-[#F5F0E6] text-[#141414] font-sans pt-28 sm:pt-36 pb-24 sm:pb-32 border-t border-[#141414]/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* ========================================================
            SECTION HEADER: Vast Whitespace, Calm & Clean
           ======================================================== */}
        <header className="mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#141414]/10">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-semibold block">
              02 / SELECTED COMMISSIONS
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#141414] tracking-tight">
              Spaces in Story
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:text-right">
            <p className="text-sm text-[#78726A] font-normal leading-relaxed max-w-sm">
              Architectural sanctuaries sculpted with tactile materiality, rectilinear purity, and natural daylight.
            </p>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#141414]/20 hover:border-[#141414] hover:bg-[#141414] hover:text-[#F5F0E6] text-xs font-semibold uppercase tracking-wider transition-all duration-300 group shrink-0 bg-white/60 shadow-sm"
            >
              <span>View All Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </header>

        {/* ========================================================
            STACKING ARCHITECTURAL CARDS: Immense Space, Pristine Imagery
           ======================================================== */}
        <div className="space-y-12 sm:space-y-20">
          {displayProjects.map((project, idx) => (
            <div
              key={project.id}
              className="portfolio-stack-card sticky top-24 sm:top-28 w-full rounded-3xl bg-white border border-[#E5DEC9] shadow-[0_20px_60px_rgba(20,20,20,0.06)] p-6 sm:p-10 lg:p-14 overflow-hidden origin-top group transition-shadow duration-500 hover:shadow-[0_25px_70px_rgba(20,20,20,0.1)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                {/* Left Column: Clean Modern Typography & Ample Breathing Room */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 order-2 lg:order-1">
                  <div className="space-y-4">
                    {/* Index & Category */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl font-bold text-[#C5A15B] tracking-tight">
                        0{idx + 1}
                      </span>
                      <div className="w-8 h-[1px] bg-[#E5DEC9]" />
                      <span className="text-xs uppercase tracking-[0.2em] text-[#78726A] font-semibold">
                        {project.category} &nbsp;•&nbsp; {project.location.split(',')[0]}
                      </span>
                    </div>

                    {/* Clean Modern Title */}
                    <h3 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#141414] tracking-tight leading-[1.15]">
                      {project.title}
                    </h3>

                    {/* Uncluttered Description */}
                    <p className="text-sm sm:text-base text-[#78726A] font-normal leading-relaxed pt-1 max-w-md">
                      {project.shortDescription}
                    </p>

                    {/* Subtle Specs Line */}
                    <div className="pt-2 text-xs text-[#141414]/60 font-medium">
                      <span>{project.location}</span>
                      <span className="mx-2">•</span>
                      <span>Handover {project.year}</span>
                    </div>
                  </div>

                  {/* Clean Minimalist Text Link */}
                  <div className="pt-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group/link inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold text-[#141414] hover:text-[#C5A15B] transition-colors"
                    >
                      <span>Explore Residence</span>
                      <div className="w-8 h-8 rounded-full border border-[#141414]/20 group-hover/link:border-[#C5A15B] group-hover/link:bg-[#C5A15B] group-hover/link:text-[#141414] flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Pristine Unobstructed Architectural Photography */}
                <div className="lg:col-span-7 order-1 lg:order-2">
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#EDE8DD] shadow-inner">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            SECTION FOOTER: Quiet Archive Invitation
           ======================================================== */}
        <div className="mt-20 sm:mt-28 pt-10 border-t border-[#141414]/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A15B] font-semibold block">
              Complete Portfolio
            </span>
            <p className="text-sm font-semibold text-[#141414]">
              Discover our complete body of work spanning residential and commercial architecture.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#141414] hover:bg-[#C5A15B] text-white hover:text-[#141414] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
          >
            <span>Explore All Projects Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
