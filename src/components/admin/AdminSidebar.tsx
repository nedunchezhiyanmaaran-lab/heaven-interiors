'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { authService } from '@/services/auth.service';
import {
  LayoutDashboard,
  FolderKanban,
  Film,
  Layers,
  Wrench,
  Quote,
  FileText,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Portfolio Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Video Showcase', href: '/admin/videos', icon: Film },
    { label: 'Plywood & Materials', href: '/admin/materials', icon: Layers },
    { label: 'Services', href: '/admin/services', icon: Wrench },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    { label: 'Website Content', href: '/admin/website-content', icon: FileText },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Mail },
    { label: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#141414] border-r border-[#C5A15B]/20 flex flex-col justify-between min-h-screen text-[#F5F0E6] flex-shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Logo size="sm" variant="light" asLink={false} />
          <span className="text-[10px] bg-[#C5A15B]/20 text-[#C5A15B] border border-[#C5A15B]/40 px-2 py-0.5 rounded font-mono uppercase">
            CMS
          </span>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-sans tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#C5A15B] text-[#141414] font-medium shadow-md'
                    : 'text-[#E9E5DE]/75 hover:bg-white/5 hover:text-[#F5F0E6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 text-xs text-[#C5A15B] hover:bg-[#C5A15B]/10 rounded font-sans transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-950/30 rounded font-sans transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Studio CMS</span>
        </button>
      </div>
    </aside>
  );
};

