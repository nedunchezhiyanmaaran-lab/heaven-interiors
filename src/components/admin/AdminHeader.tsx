'use client';

import React from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useAdminUI } from '@/app/admin/layout';
import { ExternalLink, User, ChevronDown, Menu } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actionButton?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  eyebrow = 'STUDIO CMS',
  actionButton
}) => {
  const { toggleMobileNav } = useAdminUI();
  const user = authService.getCurrentUser() || {
    name: 'Studio Principal',
    email: 'admin@heaveninteriors.com',
    role: 'STUDIO PRINCIPAL'
  };

  return (
    <header className="bg-[#F5F0E6]/90 backdrop-blur-md border-b border-[#E5DEC9] px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-30 transition-all font-sans">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-2 rounded-lg text-[#141414] hover:bg-[#E5DEC9]/50 transition-colors focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {eyebrow && (
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A15B] mb-0.5">
              {eyebrow}
            </div>
          )}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#141414] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#78726A] font-sans mt-0.5 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {actionButton}

        {/* Live Site Outlined Pill Button */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E5DEC9] bg-[#FFFFFF] hover:border-[#C5A15B]/50 hover:text-[#C5A15B] text-[#141414] text-xs font-sans font-medium shadow-sm transition-all"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#78726A]" />
        </Link>

        {/* Studio Principal Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E5DEC9]">
          <div className="w-8 h-8 rounded-full bg-[#C5A15B]/15 text-[#C5A15B] flex items-center justify-center font-medium">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-[#141414] leading-tight">
              {user.name}
            </div>
            <div className="text-[9px] text-[#78726A] uppercase font-semibold tracking-wider">
              {user.role}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#78726A] hidden lg:block" />
        </div>
      </div>
    </header>
  );
};
