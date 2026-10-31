'use client';

import React from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { ExternalLink, User, Bell } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  actionButton
}) => {
  const user = authService.getCurrentUser() || {
    name: 'Studio Principal',
    email: 'admin@heaveninteriors.com',
    role: 'Studio Principal'
  };

  return (
    <header className="h-20 bg-[#161616] border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-serif text-[#F5F0E6] font-normal">{title}</h1>
        {subtitle && (
          <p className="text-xs text-[#E9E5DE]/60 font-sans mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {actionButton}

        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A15B]/30 hover:border-[#C5A15B] text-[#C5A15B] text-xs font-sans rounded transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User Badge */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#C5A15B]/20 border border-[#C5A15B]/50 text-[#C5A15B] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-[#F5F0E6]">{user.name}</div>
            <div className="text-[10px] text-[#C5A15B] uppercase tracking-wider font-sans">
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

