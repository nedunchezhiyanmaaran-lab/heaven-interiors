'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, LayoutGroup } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useServices } from '@/hooks/useDataServices';
import { ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const doorwayImgRef = useRef<HTMLDivElement>(null);
  // Default first service open matching luxury reference board Section 08
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const { services } = useServices(true);

  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // 1. Doorway image entrance
      if (doorwayImgRef.current) {
        gsap.fromTo(
          doorwayImgRef.current,
          { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: doorwayImgRef.current,
              start: 'top 85%'
            }
          }
        );
      }

      // 2. Service rows staggered reveal
      const items = gsap.utils.toArray<HTMLElement>('.service-editorial-row');
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, x: 25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%'
            }
          }
        );
      }
    },
    { scope: containerRef, dependencies: [services] }
  );

  const toggleService = (idx: number) => {
    setActiveIdx((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative py-28 sm:py-36 bg-[#F5F0E6] text-[#141414] overflow-hidden border-t border-[#141414]/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Eyebrow, Headline & Tall Architectural Doorway Image */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#C5A15B]" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
                  07 / SERVICES
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-serif font-light text-[#141414] leading-[1.08] tracking-tight uppercase">
                SPATIAL <br />
                EXPERIENCES <br />
                TAILORED <br />
                TO YOU
              </h2>
            </div>

            {/* Tall Doorway Image matching Reference Section 08 */}
            <div
              ref={doorwayImgRef}
              className="relative w-full max-w-[340px] aspect-[9/16] rounded-sm overflow-hidden shadow-2xl bg-[#EDE8DD] border border-[#141414]/10"
            >
              <Image
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=85"
                alt="Architectural portal"
                fill
                sizes="(max-width: 1024px) 100vw, 340px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Numbered List with Buttery Smooth motion.div Accordion Expansion */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full pt-4">
            <LayoutGroup id="services-accordion">
              <div className="divide-y divide-[#141414]/10">
                {services.map((srv, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <motion.div
                      layout
                      key={srv.id || idx}
                      transition={{
                        layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                      }}
                      className="service-editorial-row py-6 cursor-pointer select-none group"
                      onClick={() => toggleService(idx)}
                    >
                      {/* Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <span
                            className={`text-xs font-mono transition-colors duration-300 ${
                              isActive ? 'text-[#C5A15B] font-bold' : 'text-[#C5A15B]/70'
                            }`}
                          >
                            {srv.number || `0${idx + 1}`}
                          </span>
                          <h3
                            className={`text-xl sm:text-2xl font-serif transition-colors duration-300 ${
                              isActive
                                ? 'text-[#C5A15B] font-medium'
                                : 'text-[#141414] group-hover:text-[#C5A15B]'
                            }`}
                          >
                            {srv.title}
                          </h3>
                        </div>

                        {/* Animated Rotational Arrow */}
                        <motion.span
                          animate={{ rotate: isActive ? 90 : 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className={`text-sm font-mono inline-block transition-colors duration-300 ${
                            isActive
                              ? 'text-[#C5A15B]'
                              : 'text-[#141414]/40 group-hover:text-[#C5A15B]'
                          }`}
                        >
                          →
                        </motion.span>
                      </div>

                      {/* Smooth motion.div Content Expansion with FLIP layout gliding */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: isActive ? 'auto' : 0,
                          opacity: isActive ? 1 : 0
                        }}
                        transition={{
                          height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                          opacity: {
                            duration: 0.3,
                            ease: 'easeOut',
                            delay: isActive ? 0.08 : 0
                          }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pb-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                          <div className="relative w-full sm:w-64 aspect-[16/10] rounded-sm overflow-hidden shadow-lg flex-shrink-0 bg-[#EDE8DD] border border-[#141414]/10 group/img">
                            <Image
                              src={srv.imageUrl}
                              alt={srv.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 260px"
                              className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <div className="space-y-3">
                            <p className="text-xs sm:text-sm text-[#555555] font-sans leading-relaxed">
                              {srv.shortDescription}
                            </p>
                            <Link
                              href="/contact"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#C5A15B] hover:text-[#141414] transition-colors"
                            >
                              <span>Enquire Scope</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </LayoutGroup>

            {/* Bottom CTA Button matching Reference */}
            <div className="pt-10">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#141414] hover:text-[#C5A15B] transition-colors"
              >
                <span>DISCUSS YOUR PROJECT</span>
                <span className="w-8 h-8 rounded-full border border-[#141414]/30 group-hover:border-[#C5A15B] group-hover:bg-[#C5A15B] group-hover:text-[#141414] flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
