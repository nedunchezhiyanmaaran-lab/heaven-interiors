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
      const threshold = isHome ? window.innerHeight * 1.5 : 50;
      setScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-[#141414]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'py-5 sm:py-6 bg-transparent border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand Logo with official monogram */}
        <Logo size="md" variant="light" />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-9">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[11px] font-sans font-medium tracking-[0.22em] text-[#E9E5DE]/80 hover:text-[#C5A15B] transition-colors py-1 relative group"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-wider text-[#C5A15B]/80 hover:text-[#C5A15B] border border-[#C5A15B]/30 hover:border-[#C5A15B] transition-all"
            title="Open Atelier CMS"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          {/* Reference pill button: ENQUIRE ↗ */}
          <Link
            href="/contact"
            className="group px-5 py-2 rounded-full border border-[#C5A15B] text-[#C5A15B] hover:bg-[#C5A15B] hover:text-[#141414] transition-all duration-300 text-[11px] uppercase tracking-[0.2em] font-sans font-medium flex items-center gap-1.5 shadow-sm"
          >
            <span>ENQUIRE</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-[#F5F0E6] hover:text-[#C5A15B] transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[76px] bg-[#141414]/98 backdrop-blur-2xl border-t border-[#C5A15B]/20 p-8 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col space-y-6 pt-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xl font-heading tracking-widest text-[#F5F0E6] hover:text-[#C5A15B] transition-colors border-b border-white/5 pb-3"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
            <Link
              href="/admin"
              className="w-full py-3 text-center border border-[#C5A15B]/40 text-[#C5A15B] uppercase text-xs tracking-widest font-sans flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Studio Administration CMS</span>
            </Link>

            <Link
              href="/contact"
              className="w-full py-3.5 btn-gold text-center uppercase text-xs tracking-widest font-sans"
            >
              Consult With Atelier
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
