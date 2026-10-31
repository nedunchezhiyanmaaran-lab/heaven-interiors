'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTestimonials } from '@/hooks/useDataServices';
import { ArrowLeft, ArrowRight, Star, Quote, BadgeCheck, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Project photography mapping based on project association
function getProjectImage(association?: string): { url: string; label: string } {
  const norm = (association || '').toLowerCase();
  if (norm.includes('skyward') || norm.includes('worli') || norm.includes('penthouse')) {
    return {
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      label: 'The Skyward Penthouse • Worli Sea Face'
    };
  }
  if (norm.includes('aura') || norm.includes('bkc') || norm.includes('boardroom')) {
    return {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85',
      label: 'Aura Executive Headquarters • BKC Mumbai'
    };
  }
  if (norm.includes('monolith') || norm.includes('jubilee') || norm.includes('hyderabad')) {
    return {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      label: 'The Monolith Residence • Jubilee Hills'
    };
  }
  if (norm.includes('terracotta') || norm.includes('assagao') || norm.includes('goa')) {
    return {
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      label: 'Villa Terracotta • Assagao Goa'
    };
  }
  return {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    label: association || 'Bespoke Turnkey Architecture'
  };
}

export const TestimonialsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const { testimonials } = useTestimonials(true);

  // Default fallback items if none loaded
  const items = testimonials.length > 0 ? testimonials : [
    {
      id: 'ref-test-1',
      clientName: 'Vikram & Radhika Singhania',
      clientRole: 'Private Investors',
      projectAssociation: 'The Skyward Penthouse, Worli',
      quote: "Heaven Interiors approached our duplex penthouse not as decorators, but as rigorous spatial sculptors. Their attention to flush shadow lines, custom woodwork, and daylight transformed our home into a sanctuary.",
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      displayOrder: 1,
      isPublished: true,
      createdAt: ''
    }
  ];

  const current = items[currentIdx] || items[0];
  const projectVisual = getProjectImage(current.projectAssociation);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIdx((prev) => {
        if (newDirection > 0) {
          return prev === items.length - 1 ? 0 : prev + 1;
        }
        return prev === 0 ? items.length - 1 : prev - 1;
      });
    },
    [items.length]
  );

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIdx ? 1 : -1);
    setCurrentIdx(idx);
  };

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 8500);
    return () => clearInterval(interval);
  }, [isPaused, items.length, paginate]);

  // GSAP ScrollTrigger Entrance Animations
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // 1. Watermark Parallax
      if (watermarkRef.current && containerRef.current) {
        gsap.to(watermarkRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // 2. Section Header Staggered Reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // 3. Right-side Architectural Visual Mask Entrance
      if (imageCardRef.current) {
        gsap.fromTo(
          imageCardRef.current,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            opacity: 0.8
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%)',
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageCardRef.current,
              start: 'top 85%'
            }
          }
        );
      }
    },
    { scope: containerRef, dependencies: [items] }
  );

  // Motion variants for slide transition
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 35 : -35,
      opacity: 0,
      filter: 'blur(6px)',
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.55,
        ease: 'easeOut'
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -35 : 35,
      opacity: 0,
      filter: 'blur(6px)',
      scale: 0.98,
      transition: {
        duration: 0.35,
        ease: 'easeIn'
      }
    })
  };

  return (
    <section
      id="testimonials"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative py-20 sm:py-24 lg:py-28 bg-[#F5F0E6] text-[#141414] overflow-hidden border-t border-[#141414]/10 select-none"
    >
      {/* GSAP Architectural Parallax Watermark Background */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 text-[14vw] font-serif font-light text-[#141414]/[0.03] tracking-widest uppercase whitespace-nowrap select-none"
      >
        COMMENDATIONS
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-12 z-10">
        {/* Header Block with GSAP Reveal */}
        <div ref={headerRef} className="space-y-3 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              08 / TESTIMONIALS
            </span>
            <div className="h-[1px] w-12 bg-[#C5A15B]/40" />
            <span className="text-[11px] uppercase tracking-wider text-[#78726A] font-sans flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C5A15B]" />
              Patron Reviews
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#141414] tracking-tight">
            Voices of Distinction
          </h2>
        </div>

        {/* Main Content Grid: Interactive Motion Review & Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Framer Motion Review Slider */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Gesture-aware Motion Container */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) {
                  paginate(1);
                } else if (info.offset.x > 40) {
                  paginate(-1);
                }
              }}
              className="relative min-h-[320px] sm:min-h-[360px] flex flex-col justify-between cursor-grab active:cursor-grabbing"
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id || currentIdx}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-8"
                >
                  {/* Luxury Animated Quote Icon & 5-Star Rating */}
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ rotate: -15, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="w-11 h-11 rounded-2xl bg-white/80 border border-[#E5DEC9] shadow-sm flex items-center justify-center text-[#C5A15B]"
                    >
                      <Quote className="w-5 h-5 fill-[#C5A15B]/20" />
                    </motion.div>

                    {/* Staggered Animated Stars */}
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 border border-[#E5DEC9] shadow-sm">
                      {[...Array(current.rating || 5)].map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.15 + i * 0.06,
                            type: 'spring',
                            stiffness: 320,
                            damping: 20
                          }}
                        >
                          <Star className="w-3.5 h-3.5 text-[#C5A15B] fill-[#C5A15B]" />
                        </motion.span>
                      ))}
                      <span className="text-[11px] font-semibold text-[#141414] ml-1.5">
                        5.0
                      </span>
                    </div>
                  </div>

                  {/* Main Commendation Quote */}
                  <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-[2.15rem] font-serif font-light text-[#141414] leading-[1.32] tracking-tight">
                    “{current.quote}”
                  </blockquote>

                  {/* Patron Identity & Project Association */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[#141414]/10">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#C5A15B] shadow-md flex-shrink-0 bg-[#EDE8DD]"
                    >
                      <Image
                        src={current.avatarUrl || '/reference_assets/testimonial_avatar.jpg'}
                        alt={current.clientName}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-serif font-medium text-[#141414]">
                          {current.clientName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-[#2E7D5A] bg-[#2E7D5A]/10 px-2 py-0.5 rounded-full">
                          <BadgeCheck className="w-3 h-3 text-[#2E7D5A]" />
                          Verified Patron
                        </span>
                      </div>

                      <div className="text-xs text-[#78726A] font-sans">
                        {current.clientRole}
                      </div>

                      {current.projectAssociation && (
                        <div className="text-[11px] text-[#C5A15B] font-mono font-medium pt-0.5">
                          Commission: {current.projectAssociation}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls, Timeline & Thumbnail Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-[#141414]/10 mt-8">
              {/* Numeric Indicator & Autoplay Progress Bar */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-medium text-[#141414]">
                  0{currentIdx + 1} / 0{items.length}
                </span>

                {/* Progress bar visualizing autoplay */}
                <div className="w-24 h-1 bg-[#141414]/10 rounded-full overflow-hidden">
                  <motion.div
                    key={currentIdx}
                    initial={{ width: '0%' }}
                    animate={{ width: isPaused ? '0%' : '100%' }}
                    transition={{
                      duration: isPaused ? 0 : 8.5,
                      ease: 'linear'
                    }}
                    className="h-full bg-[#C5A15B]"
                  />
                </div>
              </div>

              {/* Navigation Arrows with Framer Motion Physics */}
              <div className="flex items-center gap-3">
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5 mr-3">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to testimonial ${idx + 1}`}
                      className="relative p-1 focus:outline-none"
                    >
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentIdx
                            ? 'w-6 bg-[#C5A15B]'
                            : 'w-2 bg-[#141414]/20 hover:bg-[#141414]/40'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#141414', color: '#F5F0E6' }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => paginate(-1)}
                  className="w-10 h-10 rounded-full border border-[#141414]/25 bg-white/70 text-[#141414] flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Previous commendation"
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: '#141414', color: '#F5F0E6' }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => paginate(1)}
                  className="w-10 h-10 rounded-full border border-[#141414]/25 bg-white/70 text-[#141414] flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Next commendation"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography Synchronized with Commission */}
          <div className="lg:col-span-5 relative">
            <div
              ref={imageCardRef}
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-[#EDE8DD] border border-[#141414]/15"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id || currentIdx}
                  initial={{ opacity: 0, scale: 1.06, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={projectVisual.url}
                    alt={projectVisual.label}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center"
                    priority
                  />

                  {/* Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Bottom Image Caption Tag */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#DFC488] font-mono font-medium block">
                      Commission Showcase
                    </span>
                    <h4 className="text-sm sm:text-base font-serif text-white font-medium drop-shadow-md">
                      {projectVisual.label}
                    </h4>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
