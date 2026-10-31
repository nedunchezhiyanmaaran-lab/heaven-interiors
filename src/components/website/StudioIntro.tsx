'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useWebsiteContent } from '@/hooks/useDataServices';
import { ArrowRight } from 'lucide-react';

export const StudioIntro: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const primaryImgRef = useRef<HTMLDivElement>(null);
  const secondaryImgRef = useRef<HTMLDivElement>(null);
  const statNumbersRef = useRef<HTMLSpanElement[]>([]);

  const { content } = useWebsiteContent();
  const about = content.about;

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // 1. Text staggered entrance
      if (textContentRef.current && textContentRef.current.children.length > 0) {
        gsap.fromTo(
          Array.from(textContentRef.current.children),
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textContentRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // 2. Parallax on primary architectural image
      if (primaryImgRef.current) {
        gsap.fromTo(
          primaryImgRef.current,
          { clipPath: 'polygon(0% 15%, 100% 0%, 100% 100%, 0% 100%)', opacity: 0.8 },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: primaryImgRef.current,
              start: 'top 85%'
            }
          }
        );

        const pImg = primaryImgRef.current.querySelector('img');
        if (pImg) {
          gsap.to(pImg, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: primaryImgRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          });
        }
      }

      // 3. Secondary floating detail image
      if (secondaryImgRef.current) {
        gsap.fromTo(
          secondaryImgRef.current,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: secondaryImgRef.current,
              start: 'top 90%'
            }
          }
        );
      }

      // 4. Distinctive Number Count-Up Animation
      statNumbersRef.current.forEach((el) => {
        if (!el) return;
        const targetVal = parseInt(el.getAttribute('data-target') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: targetVal,
          duration: 2.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true
          },
          onUpdate: () => {
            el.innerText = `${Math.floor(counterObj.val)}${suffix}`;
          }
        });
      });
    },
    { scope: containerRef, dependencies: [about] }
  );

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-28 sm:py-36 bg-[#F5F0E6] text-[#141414] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Editorial Philosophy matching Section 02 */}
          <div ref={textContentRef} className="lg:col-span-6 space-y-8">
            {/* Eyebrow: 01 / STUDIO */}
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              {about.eyebrow || '01 / STUDIO'}
            </div>

            {/* Headline: A DEEPER APPROACH TO LIVING */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#141414] leading-[1.08] tracking-tight">
              {about.heading || 'A DEEPER APPROACH TO LIVING'}
            </h2>

            {/* Paragraph copy */}
            <p className="text-base sm:text-lg text-[#333333] font-sans font-light leading-relaxed max-w-xl">
              {about.paragraph1}
            </p>

            {/* CTA Link: OUR STORY with circular arrow icon */}
            <div className="pt-2">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#141414] hover:text-[#C5A15B] transition-colors"
              >
                <span>OUR STORY</span>
                <span className="w-8 h-8 rounded-full border border-[#141414]/30 group-hover:border-[#C5A15B] group-hover:bg-[#C5A15B] group-hover:text-[#141414] flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Staircase & Inset Detail */}
          <div className="lg:col-span-6 relative">
            {/* Main Tall Architectural Image */}
            <div
              ref={primaryImgRef}
              className="relative w-full aspect-[4/5] overflow-hidden bg-[#E9E5DE] shadow-2xl"
            >
              <Image
                src={about.primaryImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'}
                alt="A Deeper Approach to Living"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center scale-105"
              />
            </div>

            {/* Inset Secondary Detail Image matching reference layout: Architectural Concept Study */}
            <div
              ref={secondaryImgRef}
              className="hidden sm:block absolute -bottom-10 -left-12 w-2/5 aspect-[4/3] overflow-hidden shadow-2xl border-4 border-[#F5F0E6] bg-[#EFEAE0] group"
            >
              <Image
                src={about.secondaryImage || '/reference_assets/sketch_concept_hd.jpg'}
                alt="Architectural perspective study"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center mix-blend-multiply opacity-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-2 left-2 bg-[#141414]/85 backdrop-blur-md px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest text-[#C5A15B] border border-[#C5A15B]/30">
                STUDY // DRAFTING
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Statistics Row matching Reference */}
        <div className="mt-24 pt-12 border-t border-[#141414]/10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {about.stats.map((st, i) => {
            const num = parseInt(st.value, 10) || 0;
            const suffix = st.value.replace(/^[0-9]+/, '') || '+';

            return (
              <div
                key={i}
                className={`space-y-1 sm:pl-6 ${i !== 0 ? 'sm:border-l sm:border-[#141414]/15' : ''}`}
              >
                <div className="text-4xl sm:text-5xl font-serif text-[#141414] font-light">
                  <span
                    ref={(el) => {
                      if (el) statNumbersRef.current[i] = el;
                    }}
                    data-target={num}
                    data-suffix={suffix}
                  >
                    {st.value}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-[0.15em] text-[#666666] font-sans">
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
