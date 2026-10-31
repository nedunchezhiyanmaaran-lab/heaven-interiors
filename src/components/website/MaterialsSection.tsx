'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMaterials } from '@/hooks/useDataServices';
import { ArrowRight, Layers } from 'lucide-react';

export const MaterialsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const slabsStackRef = useRef<HTMLDivElement>(null);
  const { materials, loading } = useMaterials(true);

  const categories = [
    'PLYWOODS',
    'LAMINATES',
    'VENEERS',
    'MDF',
    'DECORATIVE PANELS',
    'NATURAL STONE'
  ];

  const [activeCategory, setActiveCategory] = useState<string>('PLYWOODS');

  // Featured material from list or first item
  const featured = materials.find((m) => m.isFeatured) || materials[0] || {
    name: 'Walnut Royale',
    category: 'Premium Plywood',
    thickness: '18mm',
    finishType: 'Natural Finish',
    slug: 'walnut-royale',
    coverImage: '/reference_assets/material_slabs_reference.jpg'
  };

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // 1. Left side text entrance
      if (leftContentRef.current) {
        gsap.fromTo(
          leftContentRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftContentRef.current,
              start: 'top 80%'
            }
          }
        );
      }

      // 2. Distinctive 3D Layered Slab Fan-Out Animation
      if (slabsStackRef.current) {
        const slabs = slabsStackRef.current.querySelectorAll('.material-slab-layer');
        gsap.fromTo(
          slabs,
          {
            opacity: 0,
            x: 60,
            rotateY: -20,
            scale: 0.95
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: slabsStackRef.current,
              start: 'top 75%'
            }
          }
        );
      }
    },
    { scope: containerRef, dependencies: [materials] }
  );

  return (
    <section
      id="materials"
      ref={containerRef}
      className="relative overflow-hidden border-t border-[#141414]/10"
    >
      {/* Split Section Layout matching Section 05 of Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
        {/* Left Side: Warm Ivory Background (#F5F0E6) */}
        <div className="lg:col-span-5 bg-[#F5F0E6] text-[#141414] p-8 sm:p-14 lg:p-20 flex flex-col justify-between">
          <div ref={leftContentRef} className="space-y-8 max-w-lg">
            {/* Eyebrow: 04 / MATERIALS */}
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              04 / MATERIALS
            </div>

            {/* Headline: THE ESSENCE OF NATURAL LIVING */}
            <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#141414] leading-[1.08] tracking-tight uppercase">
              THE ESSENCE <br />
              OF NATURAL <br />
              LIVING
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#444444] font-sans font-light leading-relaxed">
              A curated selection of premium plywoods, veneers and interior materials that bring warmth, texture and character to every space.
            </p>

            {/* Link: EXPLORE MATERIALS with circular arrow icon */}
            <div className="pt-2">
              <Link
                href="/materials"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#141414] hover:text-[#C5A15B] transition-colors"
              >
                <span>EXPLORE MATERIALS</span>
                <span className="w-8 h-8 rounded-full border border-[#141414]/30 group-hover:border-[#C5A15B] group-hover:bg-[#C5A15B] group-hover:text-[#141414] flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom Swatch Previews */}
          <div className="pt-12 border-t border-[#141414]/10 flex items-center gap-3 overflow-x-auto">
            {materials.slice(0, 4).map((m, idx) => (
              <Link
                key={m.id || idx}
                href={`/materials/${m.slug}`}
                className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-[#141414]/20 hover:border-[#C5A15B] transition-all group"
                title={m.name}
              >
                <Image
                  src={m.coverImage}
                  alt={m.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Deep Charcoal Background (#141414) with 3D Slabs Visual */}
        <div className="lg:col-span-7 bg-[#141414] text-[#F5F0E6] p-8 sm:p-14 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
            {/* Centerpiece 3D Layered Slabs Visual */}
            <div
              ref={slabsStackRef}
              className="md:col-span-8 flex items-center justify-center relative perspective-[1200px] py-8"
            >
              {/* Reference 3D Slab Composition */}
              <div className="material-slab-layer relative w-full max-w-[380px] aspect-[4/5] rounded-lg overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="/reference_assets/material_slabs_reference.jpg"
                  alt="Curated material slabs"
                  fill
                  sizes="40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right Category Column matching Reference */}
            <div className="md:col-span-4 flex flex-col justify-center space-y-4 text-right">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs uppercase tracking-[0.25em] font-sans transition-all text-right ${
                    activeCategory === cat
                      ? 'text-[#C5A15B] font-bold translate-x-[-4px]'
                      : 'text-[#E9E5DE]/50 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Featured Material Bar matching Reference */}
          <div className="pt-8 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#C5A15B] font-mono">
                FEATURED MATERIAL:
              </div>
              <div className="text-xl font-serif text-[#F5F0E6] font-light">
                {featured.name}
              </div>
              <div className="text-xs text-[#E9E5DE]/60 font-sans">
                {featured.category} • {featured.thickness || '18mm'} | {featured.finishType || 'Natural Finish'}
              </div>
            </div>

            <Link
              href={`/materials/${featured.slug}`}
              className="w-10 h-10 rounded-full border border-[#C5A15B] hover:bg-[#C5A15B] hover:text-[#141414] text-[#C5A15B] flex items-center justify-center transition-all group"
              aria-label="View material details"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
