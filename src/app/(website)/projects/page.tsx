'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProjects } from '@/hooks/useDataServices';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { projects, loading } = useProjects(true);

  // Derive dynamic categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const items = gsap.utils.toArray<HTMLElement>('.project-grid-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );
    },
    { scope: containerRef, dependencies: [filteredProjects] }
  );

  return (
    <div ref={containerRef} className="pt-36 pb-32 bg-[#141414] text-[#F5F0E6] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#C5A15B]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono">
              02 / PORTFOLIO ARCHIVE
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#F5F0E6] leading-[1.05] tracking-tight">
            SPACES IN — STORY
          </h1>
          <p className="text-base text-[#E9E5DE]/75 font-sans font-light mt-5 leading-relaxed">
            Each project is an architectural dialogue between place, people, and material permanence. Explore our curated commissions across residences, penthouses, and commercial headquarters.
          </p>
        </div>

        {/* Dynamic Category Filters */}
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

          <div className="text-xs uppercase tracking-[0.2em] text-[#E9E5DE]/45 font-mono">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'COMMISSION' : 'COMMISSIONS'}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-24 text-center text-[#E9E5DE]/50 font-serif">
            Loading atelier portfolio...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="text-2xl font-serif text-[#F5F0E6]">
              No Projects Found
            </div>
            <p className="text-sm text-[#E9E5DE]/60 max-w-md mx-auto">
              There are no published projects currently categorized under &ldquo;{selectedCategory}&rdquo;.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-6 py-2 border border-[#C5A15B] text-[#C5A15B] text-xs uppercase tracking-wider hover:bg-[#C5A15B] hover:text-[#141414] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProjects.map((project, idx) => {
              const formattedIndex = String(idx + 1).padStart(2, '0');
              const totalCount = String(filteredProjects.length).padStart(2, '0');

              return (
                <div
                  key={project.id}
                  className="project-grid-item group flex flex-col justify-between space-y-4"
                >
                  <div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="relative block w-full aspect-[4/3] overflow-hidden bg-[#202020] shadow-xl border border-white/5"
                    >
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors duration-500" />

                      {/* Editorial category tag */}
                      <div className="absolute top-3 left-3 bg-[#141414]/90 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#C5A15B] border border-[#C5A15B]/30 font-mono">
                        {project.category}
                      </div>

                      {/* Reference 01 / 04 style badge */}
                      <div className="absolute bottom-3 left-3 bg-[#141414]/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono text-[#E9E5DE]/80 border border-white/10">
                        <span className="text-[#C5A15B]">{formattedIndex}</span> / {totalCount}
                      </div>

                      {/* Circular arrow button */}
                      <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#C5A15B] text-[#141414] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </Link>

                    <div className="space-y-2 pt-4">
                      <div className="flex items-center justify-between text-[11px] text-[#E9E5DE]/60 uppercase tracking-[0.2em] font-mono">
                        <span>{project.location}</span>
                        <span>{project.year}</span>
                      </div>

                      <h2 className="text-2xl font-serif text-[#F5F0E6] group-hover:text-[#DFC488] transition-colors leading-snug">
                        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                      </h2>

                      <p className="text-xs text-[#E9E5DE]/75 font-sans font-light leading-relaxed line-clamp-2">
                        {project.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#C5A15B] hover:text-[#DFC488] transition-colors font-sans"
                    >
                      <span>Explore Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
