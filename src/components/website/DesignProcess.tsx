'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, CheckCircle2, Compass, Layers, PenTool, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProcessStage {
  number: string;
  phase: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  type: 'sketch' | 'photo';
  figure: string;
  duration: string;
  narrative: string;
  deliverables: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export const DesignProcess: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);

  const stages: ProcessStage[] = [
    {
      number: '01',
      phase: 'PHASE 01',
      title: 'Consultation',
      subtitle: 'Listening & Brief Analysis',
      badge: 'ARCHITECTURAL BRIEF // DRAFTING',
      image: '/reference_assets/sketch_consultation_hd.jpg',
      type: 'sketch',
      figure: 'FIG. 01 — VOLUMETRIC SPACE & LIFE STUDY',
      duration: '2 – 3 Weeks',
      narrative:
        'Every commission begins with listening. We study your lifestyle rituals, acoustic sensibilities, and spatial habits to formulate an uncompromised brief before pencil touches paper.',
      deliverables: [
        'Spatial Brief & Lifestyle Matrix',
        'Site Topography & Solar Orientation Study',
        'Budget Architecture & Feasibility Matrix'
      ],
      icon: Compass
    },
    {
      number: '02',
      phase: 'PHASE 02',
      title: 'Concept & Planning',
      subtitle: 'Volumetric Layouts & Form',
      badge: 'SPATIAL WIREFRAME // PERSPECTIVE',
      image: '/reference_assets/sketch_concept_hd.jpg',
      type: 'sketch',
      figure: 'FIG. 02 — VAULTED ARCHWAY SIGHTLINE DRAFT',
      duration: '3 – 4 Weeks',
      narrative:
        'We choreograph the circulation of natural light, shadow lines, and volumetric sightlines. Multiple conceptual wireframes and hand-drawn perspective studies test spatial flow and vaulted portals.',
      deliverables: [
        'Volumetric Wireframe Studies',
        'Circulation Sightline Maps',
        'Hand-Drawn Spatial Perspectives'
      ],
      icon: PenTool
    },
    {
      number: '03',
      phase: 'PHASE 03',
      title: 'Design Development',
      subtitle: 'Precision Detailing & Specs',
      badge: 'JOINERY BLUEPRINT // SPECIFICATION',
      image: '/reference_assets/sketch_development_hd.jpg',
      type: 'sketch',
      figure: 'FIG. 03 — BESPOKE MILLWORK & CURVED SOFA SCHEMATIC',
      duration: '4 – 6 Weeks',
      narrative:
        'Resolving the millimeter. We draft bespoke millwork schematics, custom curved furniture joinery, fluted timber acoustic cladding, and exhaustive material specifications.',
      deliverables: [
        'Millwork Joinery Blueprints',
        'Material Moodboard & Complete BOQ',
        'Lighting & MEP Schematics'
      ],
      icon: Layers
    },
    {
      number: '04',
      phase: 'PHASE 04',
      title: 'Execution & Handover',
      subtitle: 'Craftsmanship & Final Polish',
      badge: 'COMPLETED COMMISSION // WHITE GLOVE',
      image: '/reference_assets/photo_handover_hd.jpg',
      type: 'photo',
      figure: 'FIG. 04 — TURNKEY ARCHITECTURAL LIVING SALON',
      duration: '8 – 16 Weeks',
      narrative:
        'The physical manifestation. Master woodworkers and stone artisans execute the design under strict tolerance standards, culminating in a defect-free, turnkey white-glove handover.',
      deliverables: [
        'Master Artisan Woodworking Execution',
        'Turnkey Quality & Tolerance Audit',
        'Defect-Free White Glove Handover'
      ],
      icon: Sparkles
    }
  ];

  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // 1. Central gold timeline progress line that traces down as user scrolls
      if (timelineProgressRef.current) {
        gsap.fromTo(
          timelineProgressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 65%',
              end: 'bottom 85%',
              scrub: 1.0
            }
          }
        );
      }

      // 2. Individual vertical loading reveal for each stage row
      const rows = gsap.utils.toArray<HTMLElement>('.process-stage-row');

      rows.forEach((row, idx) => {
        const info = row.querySelector('.process-stage-info');
        const img = row.querySelector('.process-stage-image');
        const marker = row.querySelector('.process-stage-marker');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        });

        // Stage marker node animation
        if (marker) {
          tl.fromTo(
            marker,
            { scale: 0.6, borderColor: 'rgba(20, 20, 20, 0.2)' },
            { scale: 1, borderColor: '#C5A15B', duration: 0.5, ease: 'back.out(1.7)' },
            0
          );
        }

        // Text information vertical entrance
        if (info) {
          const infoChildren = Array.from(info.children);
          tl.fromTo(
            infoChildren,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: 'power3.out'
            },
            0.1
          );
        }

        // Compact image vertical clip-path curtain loading wipe
        if (img) {
          tl.fromTo(
            img,
            {
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
              scale: 1.06,
              opacity: 0.3
            },
            {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              scale: 1,
              opacity: 1,
              duration: 0.95,
              ease: 'power3.inOut'
            },
            0.15
          );
        }

        // Special reality bloom on Phase 04 photo
        if (idx === 3) {
          const photo = row.querySelector('.process-stage-photo');
          if (photo) {
            tl.fromTo(
              photo,
              { filter: 'grayscale(100%) contrast(110%)' },
              {
                filter: 'grayscale(0%) contrast(100%)',
                duration: 1.2,
                ease: 'power2.out'
              },
              0.4
            );
          }
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative py-28 sm:py-36 lg:py-44 bg-[#F5F0E6] text-[#141414] overflow-hidden border-t border-[#141414]/10"
    >
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* ========================================================
            SECTION HEADER
           ======================================================== */}
        <div className="max-w-3xl mb-24 sm:mb-32 lg:mb-40">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#C5A15B]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              05 / PROCESS
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#141414] leading-[1.04] tracking-tight uppercase">
            FROM CONCEPT <br />
            TO REALITY
          </h2>

          <p className="text-sm sm:text-base text-[#555] font-sans font-light mt-6 leading-relaxed max-w-xl">
            A structured journey from architectural drafting to finished living spaces, guided by technical precision, handcrafted joinery, and material permanence.
          </p>
        </div>

        {/* ========================================================
            TRUE VERTICAL STAGE SEQUENCE (ONE BY ONE)
            One Side Text & Information — Other Side Compact Image
           ======================================================== */}
        <div className="relative">
          {/* Continuous Vertical Timeline Line down the center on desktop */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-4 bottom-8 w-[1px] bg-[#141414]/15 pointer-events-none">
            <div
              ref={timelineProgressRef}
              className="w-full h-full bg-[#C5A15B] origin-top scale-y-0"
            />
          </div>

          {/* Vertical Stages Stack with generous editorial whitespace */}
          <div className="space-y-32 sm:space-y-44 lg:space-y-52">
            {stages.map((stage, idx) => {
              // Alternate sides for visual rhythm:
              // Odd (0, 2): Text Left, Image Right
              // Even (1, 3): Image Left, Text Right
              const isEven = idx % 2 === 1;
              const StageIcon = stage.icon;

              return (
                <div
                  key={stage.number}
                  className="process-stage-row relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center"
                >
                  {/* Center Stage Number Marker Node (Desktop) */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 items-center justify-center">
                    <div className="process-stage-marker w-12 h-12 rounded-full border-2 border-[#141414]/20 bg-[#F5F0E6] flex items-center justify-center shadow-lg transition-colors">
                      <span className="text-xs font-mono font-bold text-[#141414]">
                        {stage.number}
                      </span>
                    </div>
                  </div>

                  {/* ================= INFORMATION COLUMN ================= */}
                  <div
                    className={`process-stage-info lg:col-span-6 space-y-6 ${
                      isEven ? 'lg:order-2 lg:pl-16' : 'lg:order-1 lg:pr-16'
                    }`}
                  >
                    {/* Phase Tag & Duration Capsule */}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#141414] text-[#C5A15B] text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-widest rounded-full">
                        <StageIcon className="w-3.5 h-3.5 text-[#C5A15B]" />
                        {stage.phase}
                      </span>
                      <span className="text-xs text-[#141414]/30">•</span>
                      <span className="text-xs font-mono text-[#141414]/70 uppercase tracking-wider">
                        Est. Duration: {stage.duration}
                      </span>
                    </div>

                    {/* Stage Title & Subtitle */}
                    <div className="space-y-1.5">
                      <h3 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-light text-[#141414] leading-tight">
                        {stage.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-[#C5A15B] uppercase tracking-wider font-medium">
                        {stage.subtitle}
                      </p>
                    </div>

                    {/* Editorial Narrative */}
                    <p className="text-sm sm:text-base text-[#3A3835] font-sans font-light leading-relaxed max-w-lg">
                      {stage.narrative}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="pt-2 space-y-3">
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#141414]/60 font-semibold block">
                        Key Phase Deliverables:
                      </span>
                      <div className="space-y-2.5">
                        {stage.deliverables.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-xs sm:text-sm text-[#141414] font-sans"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#C5A15B] shrink-0" />
                            <span className="font-light">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ================= COMPACT IMAGE COLUMN ================= */}
                  <div
                    className={`process-stage-image lg:col-span-6 flex flex-col items-center justify-center ${
                      isEven ? 'lg:order-1 lg:pr-12' : 'lg:order-2 lg:pl-12'
                    }`}
                  >
                    {/* 
                      Architectural presentation casing:
                      Aspect 4:3, max-w-[460px] to 480px, matte ivory backdrop,
                      fine architectural hairline border, zero neon glare.
                    */}
                    <div className="relative w-full max-w-[460px] xl:max-w-[480px] aspect-[4/3] rounded-sm bg-[#FAF7F2] p-3 sm:p-4 border border-[#141414]/15 shadow-xl group">
                      <div className="relative w-full h-full overflow-hidden rounded-[2px] bg-[#EFEAE0]">
                        <Image
                          src={stage.image}
                          alt={`${stage.title} - ${stage.subtitle}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 45vw"
                          priority
                          className={`object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${
                            stage.type === 'photo'
                              ? 'process-stage-photo'
                              : 'mix-blend-multiply opacity-95'
                          }`}
                        />

                        {/* Top Architectural Capsule Tag */}
                        <div className="absolute top-3 left-3 bg-[#141414]/90 backdrop-blur-md px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-[#C5A15B] border border-[#C5A15B]/30 shadow-md">
                          {stage.badge}
                        </div>

                        {/* Bottom Figure Label */}
                        <div className="absolute bottom-3 right-3 bg-[#141414]/85 backdrop-blur-md px-3 py-1 text-[9px] font-mono uppercase tracking-wider text-[#F5F0E6] border border-white/10 shadow-md">
                          {stage.figure}
                        </div>
                      </div>
                    </div>

                    {/* Architectural Caption below image */}
                    <div className="w-full max-w-[460px] xl:max-w-[480px] mt-3 flex items-center justify-between text-[11px] font-mono text-[#141414]/50">
                      <span>HEAVEN STUDIO // ARCHITECTURAL DOSSIER</span>
                      <span className="text-[#C5A15B] font-semibold">{stage.phase}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            SECTION BOTTOM INITIATION CTA
           ======================================================== */}
        <div className="mt-32 sm:mt-40 pt-12 border-t border-[#141414]/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-2xl sm:text-3xl font-serif font-light text-[#141414]">
              Ready to initiate your architectural brief?
            </h4>
            <p className="text-xs sm:text-sm text-[#666] font-sans font-light">
              We guide you from initial site consultation through white-glove turnkey handover.
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#141414] text-[#F5F0E6] hover:bg-[#C5A15B] hover:text-[#141414] transition-all duration-300 text-xs uppercase tracking-[0.2em] font-mono font-medium shadow-lg shrink-0"
          >
            <span>Discuss Your Project</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
