'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTestimonials } from '@/hooks/useDataServices';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const { testimonials, loading } = useTestimonials(true);

  // Default to reference content if list is empty
  const items = testimonials.length > 0 ? testimonials : [
    {
      id: 'ref-test-1',
      clientName: 'Priya Mehta',
      clientRole: 'Homeowner, Mumbai',
      projectAssociation: 'Worli Duplex',
      quote: "They didn't just design our home, they understood how we live.",
      rating: 5,
      avatarUrl: '/reference_assets/testimonial_avatar.jpg',
      displayOrder: 1,
      isPublished: true,
      createdAt: ''
    }
  ];

  const current = items[currentIdx] || items[0];

  const prev = () => {
    setCurrentIdx((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIdx((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
      }
    },
    { scope: containerRef, dependencies: [currentIdx] }
  );

  return (
    <section
      ref={containerRef}
      className="relative py-28 sm:py-36 bg-[#F7F4EE] text-[#141414] overflow-hidden border-t border-[#141414]/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Eyebrow, Huge Quote, Client Avatar & Pagination */}
          <div className="lg:col-span-7 space-y-10">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              08 / TESTIMONIALS
            </div>

            {/* Huge Quote matching Section 09 of Reference */}
            <blockquote
              ref={quoteRef}
              className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-[#141414] leading-[1.15] tracking-tight"
            >
              “{current.quote}”
            </blockquote>

            {/* Client Avatar & Details */}
            <div className="flex items-center gap-4 pt-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#C5A15B] bg-[#EDE8DD]">
                <Image
                  src={current.avatarUrl || '/reference_assets/testimonial_avatar.jpg'}
                  alt={current.clientName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="text-sm font-serif font-medium text-[#141414]">
                  {current.clientName}
                </div>
                <div className="text-xs text-[#777777] font-sans">
                  {current.clientRole || current.projectAssociation}
                </div>
              </div>
            </div>

            {/* Pagination Controls matching Reference: 02 / 05 with arrows */}
            <div className="flex items-center gap-6 pt-4">
              <span className="text-xs font-mono text-[#777777]">
                0{currentIdx + 1} / 0{items.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-8 h-8 rounded-full border border-[#141414]/20 hover:border-[#C5A15B] hover:text-[#C5A15B] flex items-center justify-center transition-colors"
                  aria-label="Previous commendation"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={next}
                  className="w-8 h-8 rounded-full border border-[#141414]/20 hover:border-[#C5A15B] hover:text-[#C5A15B] flex items-center justify-center transition-colors"
                  aria-label="Next commendation"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Serene Living Room Corner Photo matching Reference */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-2xl bg-[#EDE8DD] border border-[#141414]/10">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                alt="Architectural living room corner"
                fill
                sizes="40vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
