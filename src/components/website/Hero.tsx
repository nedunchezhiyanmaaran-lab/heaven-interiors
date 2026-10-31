'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useWebsiteContent } from '@/hooks/useDataServices';
import { ArrowDown, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const headlineWordsRef = useRef<HTMLSpanElement[]>([]);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const rightTaglineRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const exploreBtnRef = useRef<HTMLAnchorElement>(null);

  // Realistic Curtain References
  const curtainOverlayRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const curtainCenterRef = useRef<HTMLDivElement>(null);
  const curtainGlowRef = useRef<HTMLDivElement>(null);

  const { content } = useWebsiteContent();
  const hero = content.hero;

  const headline = hero.headline || 'SPACES THAT BREATHE';
  const words = headline.split(' ');

  // Smooth scroll trigger to unveil curtains on click
  const handleUnveilClick = () => {
    if (typeof window !== 'undefined' && outerWrapperRef.current) {
      const scrollDistance = window.innerHeight * 1.15;
      window.scrollTo({
        top: scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // ========================================================
      // 1. SCROLL-DRIVEN REALISTIC CURTAIN OPENING
      // ========================================================
      ScrollTrigger.create({
        trigger: outerWrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;

          // A. Center Emblem & Scroll Prompt fades out in first 25% of scroll
          if (curtainCenterRef.current) {
            const emblemOpacity = Math.max(0, 1 - progress * 4);
            const emblemScale = 1 - progress * 0.15;
            gsap.set(curtainCenterRef.current, {
              opacity: emblemOpacity,
              scale: emblemScale,
              visibility: emblemOpacity <= 0.02 ? 'hidden' : 'visible'
            });
          }

          // B. Left Curtain sweeps left with realistic fabric gathering scale
          if (leftCurtainRef.current) {
            const leftX = -progress * 105;
            const leftScale = 1 - progress * 0.18;
            gsap.set(leftCurtainRef.current, {
              xPercent: leftX,
              scaleX: leftScale,
              transformOrigin: 'left center'
            });
          }

          // C. Right Curtain sweeps right with realistic fabric gathering scale
          if (rightCurtainRef.current) {
            const rightX = progress * 105;
            const rightScale = 1 - progress * 0.18;
            gsap.set(rightCurtainRef.current, {
              xPercent: rightX,
              scaleX: rightScale,
              transformOrigin: 'right center'
            });
          }

          // D. Ambient light bloom flares open at the center crack
          if (curtainGlowRef.current) {
            const glowOpacity = Math.sin(progress * Math.PI) * 0.95;
            gsap.set(curtainGlowRef.current, { opacity: glowOpacity });
          }

          // E. Hero background photography subtle reveal zoom
          if (imageWrapRef.current) {
            const heroScale = 1.08 - progress * 0.08;
            gsap.set(imageWrapRef.current, {
              scale: Math.max(1, heroScale)
            });
          }

          // F. Pointer events toggle: fully allow Hero interactions once parted
          if (curtainOverlayRef.current) {
            if (progress >= 0.92) {
              gsap.set(curtainOverlayRef.current, {
                pointerEvents: 'none',
                visibility: 'hidden'
              });
            } else {
              gsap.set(curtainOverlayRef.current, {
                pointerEvents: 'auto',
                visibility: 'visible'
              });
            }
          }
        }
      });

      // ========================================================
      // 2. HERO INNER ENTRANCE ANIMATIONS
      // ========================================================
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Staggered word reveal for "SPACES THAT BREATHE"
      if (headlineWordsRef.current.length > 0) {
        heroTimeline.fromTo(
          headlineWordsRef.current,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.2
          }
        );
      }

      // Subheadline line reveal
      if (subheadlineRef.current) {
        heroTimeline.fromTo(
          subheadlineRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        );
      }

      // Right side vertical tagline
      if (rightTaglineRef.current) {
        heroTimeline.fromTo(
          rightTaglineRef.current,
          { opacity: 0, x: 20 },
          { opacity: 0.8, x: 0, duration: 0.8 },
          '-=0.6'
        );
      }

      // Explore button
      if (exploreBtnRef.current) {
        heroTimeline.fromTo(
          exploreBtnRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8 },
          '-=0.5'
        );
      }

      // Left scroll indicator
      if (scrollIndicatorRef.current) {
        heroTimeline.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );

        // Continuous subtle scroll pulsing
        gsap.to('.hero-scroll-dot', {
          y: 12,
          repeat: -1,
          yoyo: true,
          duration: 1.6,
          ease: 'sine.inOut'
        });
      }
    },
    { scope: outerWrapperRef, dependencies: [hero] }
  );

  return (
    <section
      id="home-hero"
      ref={outerWrapperRef}
      className="relative w-full h-[220vh] bg-[#141414]"
    >
      {/* 
        Native CSS Sticky Frame (top-0 h-screen).
        Pins the entire Hero viewport while the user scrolls through the curtain opening.
      */}
      <div
        ref={stickyFrameRef}
        className="sticky top-0 w-full h-screen min-h-[700px] flex items-end pb-16 sm:pb-20 overflow-hidden bg-[#141414]"
      >
        {/* ========================================================
            UNDERLYING HERO SECTION (REVEALED WHEN CURTAIN OPENS)
           ======================================================== */}
        <div
          ref={imageWrapRef}
          className="absolute inset-0 w-full h-full z-0 overflow-hidden origin-center will-change-transform"
        >
          <Image
            src={
              hero.backgroundImage ||
              'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90'
            }
            alt="Spaces That Breathe — Heaven Interiors"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transform"
          />
          {/* Cinematic lighting gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        </div>

        {/* Left Edge Vertical Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="hidden md:flex absolute left-8 lg:left-12 bottom-16 z-20 flex-col items-center gap-4 text-[#E9E5DE]/70"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans -rotate-90 origin-center translate-y-3">
            SCROLL
          </span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden mt-6">
            <div className="hero-scroll-dot w-full h-3 bg-[#C5A15B]" />
          </div>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#C5A15B]">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Right Edge Vertical Tagline */}
        <div
          ref={rightTaglineRef}
          className="hidden lg:block absolute right-12 top-1/3 z-20 text-right max-w-[140px]"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#E9E5DE]/70 font-sans leading-relaxed">
            WHERE MATERIALS<br />MEET LIFE
          </div>
          <span className="inline-block w-8 h-[1px] bg-[#C5A15B] mt-3" />
        </div>

        {/* Main Hero Content Container */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12 w-full pl-6 md:pl-28">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-4xl space-y-5">
              {/* Split-Word Dramatic Headline: SPACES THAT BREATHE */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light text-[#F5F0E6] leading-[0.95] tracking-tight uppercase">
                {words.map((word, idx) => (
                  <span
                    key={idx}
                    className="inline-block overflow-hidden mr-3 sm:mr-6 align-bottom"
                  >
                    <span
                      ref={(el) => {
                        if (el) headlineWordsRef.current[idx] = el;
                      }}
                      className="inline-block"
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h1>

              {/* Subheadline Pill Bar */}
              <p
                ref={subheadlineRef}
                className="text-xs sm:text-sm uppercase tracking-[0.28em] text-[#C5A15B] font-medium font-sans pt-3"
              >
                {hero.subheadline || 'INTERIOR ARCHITECTURE | MATERIALS | TIMELESS LIVING'}
              </p>
            </div>

            {/* Bottom Right: Circular "EXPLORE OUR WORK" Button */}
            <div className="flex items-center gap-4">
              <Link
                ref={exploreBtnRef}
                href="/projects"
                className="group flex items-center gap-3 bg-[#141414]/60 hover:bg-[#C5A15B] backdrop-blur-md border border-[#C5A15B]/50 hover:border-[#C5A15B] text-[#F5F0E6] hover:text-[#141414] px-5 py-3 rounded-full transition-all duration-300 shadow-xl"
              >
                <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-medium pr-1">
                  EXPLORE OUR WORK
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================
            REALISTIC ARCHITECTURAL CURTAIN OVERLAY (PARTED ON SCROLL)
           ======================================================== */}
        <div
          ref={curtainOverlayRef}
          className="absolute inset-0 w-full h-full z-40 overflow-hidden pointer-events-auto"
        >
          {/* Ambient Light Flare between parting seam */}
          <div
            ref={curtainGlowRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-48 bg-gradient-to-r from-transparent via-[#C5A15B]/40 to-transparent pointer-events-none opacity-0 blur-2xl z-25"
          />

          {/* LEFT CURTAIN PANEL */}
          <div
            ref={leftCurtainRef}
            className="absolute top-0 left-0 w-1/2 h-full overflow-hidden shadow-[25px_0_60px_rgba(0,0,0,0.9)] z-20 will-change-transform"
          >
            {/* Left half viewport mapping (0 to 100vw, clipped to left 50vw) */}
            <div className="relative w-[100vw] h-full">
              <Image
                src="/brand/curtain_texture.jpg"
                alt="Luxury Architectural Drapery"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Drapery shading overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
            </div>

            {/* Fine Architectural Gold Center Trim Seam */}
            <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#C5A15B]/20 via-[#C5A15B] to-[#C5A15B]/20 shadow-[0_0_12px_rgba(197,161,91,0.6)]" />
          </div>

          {/* RIGHT CURTAIN PANEL */}
          <div
            ref={rightCurtainRef}
            className="absolute top-0 right-0 w-1/2 h-full overflow-hidden shadow-[-25px_0_60px_rgba(0,0,0,0.9)] z-20 will-change-transform"
          >
            {/* Right half viewport mapping (0 to 100vw, clipped to right 50vw) */}
            <div className="absolute top-0 right-0 w-[100vw] h-full">
              <Image
                src="/brand/curtain_texture.jpg"
                alt="Luxury Architectural Drapery"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Drapery shading overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-black/30" />
            </div>

            {/* Fine Architectural Gold Center Trim Seam */}
            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#C5A15B]/20 via-[#C5A15B] to-[#C5A15B]/20 shadow-[0_0_12px_rgba(197,161,91,0.6)]" />
          </div>

          {/* CENTER ARCHITECTURAL SEAL & INTERACTIVE SCROLL PROMPT */}
          <div
            ref={curtainCenterRef}
            onClick={handleUnveilClick}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center text-center cursor-pointer select-none group px-4 w-full max-w-xl"
          >
            {/* Medium Architectural Monogram Seal */}
            <div className="relative mb-5 sm:mb-6">
              {/* Outer decorative gold halo ring with subtle gold glow */}
              <div className="absolute -inset-2 rounded-full border border-[#C5A15B]/30 pointer-events-none" />
              <div className="absolute -inset-1 rounded-full border border-[#C5A15B]/50 pointer-events-none" />

              {/* Balanced Medium Monogram Medal: 76px mobile, 88px desktop */}
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full border-2 border-[#C5A15B] p-1 shadow-[0_0_35px_rgba(197,161,91,0.45)] bg-[#1A1815]/95 backdrop-blur-md group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/brand/logo.png"
                    alt="Heaven Interiors Official Monogram"
                    fill
                    priority
                    sizes="88px"
                    className="object-contain p-1"
                  />
                </div>
              </div>

              {/* Subtle ambient pulse ring */}
              <div className="absolute inset-0 rounded-full border border-[#C5A15B]/40 animate-ping pointer-events-none opacity-40" />
            </div>

            {/* Studio Identity — Clean, Minimal, Medium Scale */}
            <div className="px-2 w-full flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-light text-[#F5F0E6] tracking-[0.22em] sm:tracking-[0.28em] uppercase leading-tight whitespace-nowrap">
                HEAVEN INTERIORS
              </h2>
            </div>

            {/* "SCROLL TO UNVEIL" Prompt Capsule */}
            <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#1A1815]/80 hover:bg-[#C5A15B] text-[#F5F0E6] hover:text-[#141414] border border-[#C5A15B]/40 hover:border-[#C5A15B] transition-all duration-300 shadow-xl group-hover:scale-105">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] font-medium text-[#E9E5DE]/90 group-hover:text-[#141414]">
                SCROLL TO UNVEIL
              </span>
              <ArrowDown className="w-3 h-3 text-[#C5A15B] animate-bounce group-hover:text-[#141414] transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
