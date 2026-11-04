'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isHome = pathname === '/' || pathname === '';
      let threshold = 60;
      if (isHome) {
        const heroEl = document.getElementById('home-hero');
        if (heroEl) {
          // Stay completely transparent throughout the hero scrollable transformation
          threshold = heroEl.offsetHeight - window.innerHeight - 80;
        } else {
          threshold = window.innerHeight * 2;
        }
      }
      setScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'PROJECTS', href: '/projects' },
    { label: 'SERVICES', href: '/#services' },
    { label: 'PROCESS', href: '/#process' },
    { label: 'MATERIALS', href: '/materials' },
    { label: 'FILMS', href: '/videos' },
    { label: 'STUDIO', href: '/#about' },
    { label: 'CONTACT', href: '/contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-4 bg-[#141414]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'py-5 sm:py-6 bg-transparent border-b border-transparent shadow-none'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Logo with official monogram */}
          <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            <Logo size="md" variant="light" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11px] font-sans font-medium tracking-[0.22em] text-[#F5F0E6] hover:text-[#C5A15B] transition-colors py-1 relative group drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#C5A15B] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA & Admin Link */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-wider text-[#C5A15B] hover:text-white border border-[#C5A15B]/40 hover:border-[#C5A15B] bg-black/40 backdrop-blur-md transition-all shadow-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              title="Open Atelier CMS"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Reference pill button: ENQUIRE ↗ */}
            <Link
              href="/contact"
              className="group px-5 py-2 rounded-full border border-[#C5A15B] text-[#C5A15B] hover:bg-[#C5A15B] hover:text-[#141414] bg-black/35 backdrop-blur-md transition-all duration-300 text-[11px] uppercase tracking-[0.2em] font-sans font-medium flex items-center gap-1.5 shadow-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              <span>ENQUIRE</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-[#F5F0E6] hover:text-[#C5A15B] bg-black/40 backdrop-blur-md rounded-full transition-colors focus:outline-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Full-Screen Independent Mobile Navigation Drawer */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[9999] w-screen h-[100dvh] bg-[#141414] text-[#F5F0E6] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Mobile Menu Header Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0 bg-[#141414]/95 backdrop-blur-md sticky top-0 z-10">
            <Logo size="md" variant="light" />
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-[#F5F0E6] hover:text-[#C5A15B] transition-colors focus:outline-none rounded-full hover:bg-white/5"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links List */}
          <div className="flex-1 px-6 py-6 sm:px-8 flex flex-col justify-start divide-y divide-white/5 overflow-y-auto">
            {navLinks.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center justify-between py-4 text-[#F5F0E6] hover:text-[#C5A15B] transition-colors"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[#C5A15B]/70 tracking-widest">
                    0{index + 1}
                  </span>
                  <span className="text-lg font-sans font-medium tracking-[0.16em] uppercase">
                    {item.label}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#C5A15B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            ))}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-6 sm:p-8 pb-10 sm:pb-8 border-t border-white/10 bg-[#181818] flex flex-col gap-3 shrink-0">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3.5 px-4 text-center border border-[#C5A15B]/40 text-[#C5A15B] uppercase text-xs tracking-widest font-sans font-medium flex items-center justify-center gap-2 rounded-sm hover:bg-[#C5A15B]/10 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Studio Administration CMS</span>
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3.5 px-4 text-center bg-[#C5A15B] text-[#141414] uppercase text-xs tracking-widest font-sans font-semibold rounded-sm hover:bg-[#d6b168] transition-colors shadow-lg"
            >
              Consult With Atelier
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
