'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useMaterials } from '@/hooks/useDataServices';
import { Layers, ArrowUpRight } from 'lucide-react';

export default function MaterialsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { materials, loading } = useMaterials(true);

  const categories = ['All', ...Array.from(new Set(materials.map((m) => m.category)))];

  const filtered =
    selectedCategory === 'All'
      ? materials
      : materials.filter((m) => m.category === selectedCategory);

  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const items = gsap.utils.toArray<HTMLElement>('.material-card-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out'
        }
      );
    },
    { scope: containerRef, dependencies: [filtered] }
  );

  return (
    <div ref={containerRef} className="pt-36 pb-32 bg-[#141414] text-[#F5F0E6] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#C5A15B]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono">
              04 / MATERIALS ARCHIVE
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#F5F0E6] leading-[1.05] tracking-tight">
            THE ESSENCE OF NATURAL LIVING
          </h1>
          <p className="text-base text-[#E9E5DE]/75 font-sans font-light mt-5 leading-relaxed">
            A curated selection of premium plywoods, veneers and interior materials that bring warmth, texture and character to every space.
          </p>
        </div>

        {/* Categories Filter */}
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
            {filtered.length} {filtered.length === 1 ? 'SPECIFICATION' : 'SPECIFICATIONS'}
          </div>
        </div>

        {/* Materials List / Grid */}
        {loading ? (
          <div className="py-24 text-center text-[#E9E5DE]/50 font-serif">
            Loading materials catalogue...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="text-2xl font-serif text-[#F5F0E6]">No Materials Found</div>
            <p className="text-sm text-[#E9E5DE]/60 max-w-md mx-auto">
              No published materials found in the &ldquo;{selectedCategory}&rdquo; category.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-6 py-2 border border-[#C5A15B] text-[#C5A15B] text-xs uppercase tracking-wider hover:bg-[#C5A15B] hover:text-[#141414] transition-colors"
            >
              Show All Materials
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((mat) => (
              <div
                key={mat.id}
                className="material-card-item bg-[#1a1a1a] border border-white/5 hover:border-[#C5A15B]/40 transition-all duration-300 group flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div>
                  <Link
                    href={`/materials/${mat.slug}`}
                    className="relative block w-full aspect-[16/10] overflow-hidden bg-[#242424]"
                  >
                    <Image
                      src={mat.coverImage}
                      alt={mat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    <div className="absolute top-3 left-3 bg-[#141414]/90 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#C5A15B] border border-[#C5A15B]/30 font-mono">
                      {mat.category}
                    </div>

                    <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#C5A15B] text-[#141414] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>

                  <div className="p-6 space-y-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#C5A15B] font-mono">
                      {mat.brand}
                    </div>
                    <h3 className="text-xl font-serif text-[#F5F0E6] group-hover:text-[#DFC488] transition-colors leading-snug">
                      <Link href={`/materials/${mat.slug}`}>{mat.name}</Link>
                    </h3>
                    <p className="text-xs text-[#E9E5DE]/75 font-sans font-light leading-relaxed line-clamp-2">
                      {mat.shortDescription}
                    </p>

                    <div className="pt-3 border-t border-white/5 space-y-2 text-[11px] font-sans text-[#E9E5DE]/70">
                      <div className="flex justify-between">
                        <span className="text-[#E9E5DE]/50 font-mono text-[10px] uppercase">Thickness:</span>
                        <span className="text-[#F5F0E6] font-medium">{mat.thickness}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#E9E5DE]/50 font-mono text-[10px] uppercase">Dimensions:</span>
                        <span className="text-[#F5F0E6] font-medium">{mat.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#E9E5DE]/50 font-mono text-[10px] uppercase">Finish:</span>
                        <span className="text-[#F5F0E6] font-medium truncate max-w-[170px]">{mat.finishType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/materials/${mat.slug}`}
                    className="w-full py-2.5 rounded-full border border-[#C5A15B]/40 hover:bg-[#C5A15B] hover:text-[#141414] text-[#C5A15B] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] font-sans"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Technical Dossier</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
