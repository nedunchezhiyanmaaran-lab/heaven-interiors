'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { useWebsiteContent, useServices } from '@/hooks/useDataServices';
import { ArrowUp, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { content } = useWebsiteContent();
  const { services } = useServices(true);
  const { footer, contact } = content;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#141414] text-[#F5F0E6] pt-20 pb-12 border-t border-white/10 overflow-hidden font-sans">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-6">
            <Logo size="lg" variant="light" />

            <p className="text-xs sm:text-sm text-[#E9E5DE]/70 font-sans font-light leading-relaxed max-w-sm">
              {footer.description || 'Heaven Interiors is an architectural interior practice and bespoke woodworking atelier serving discerning residential and commercial clients across India and abroad.'}
            </p>

            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono">
              {footer.tagline || 'WHERE MATERIALS MEET LIFE'}
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#C5A15B]/40 rounded-full text-[10px] text-[#C5A15B] uppercase tracking-wider hover:bg-[#C5A15B]/10 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Client Administration CMS</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              Navigation
            </div>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider font-sans text-[#E9E5DE]/70">
              <li>
                <Link href="/projects" className="hover:text-[#C5A15B] transition-colors">
                  Portfolio Works
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-[#C5A15B] transition-colors">
                  Disciplines
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-[#C5A15B] transition-colors">
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-[#C5A15B] transition-colors">
                  Materials Catalogue
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-[#C5A15B] transition-colors">
                  Architectural Films
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C5A15B] transition-colors">
                  Private Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Services List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              Disciplines
            </div>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider font-sans text-[#E9E5DE]/70">
              {services.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <Link href="/#services" className="hover:text-[#C5A15B] transition-colors">
                    {srv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
              Our Studio
            </div>
            <p className="text-xs text-[#E9E5DE]/70 font-sans leading-relaxed">
              {contact.address}<br />
              {contact.cityState || 'Mumbai, Maharashtra, India'}
            </p>
            <div className="text-xs text-[#E9E5DE]/80 font-sans space-y-1">
              <div>T: {contact.phone || '+91 98765 43210'}</div>
              <div>E: {contact.email || 'hello@heaveninteriors.in'}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E9E5DE]/50 font-sans">
          <div>{footer.copyrightText || '© 2026 Heaven Interiors Atelier. All rights reserved.'}</div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] uppercase tracking-widest text-[#C5A15B]">
              Luxury Architecture & Millwork Atelier
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 border border-white/10 hover:border-[#C5A15B] hover:text-[#C5A15B] transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
