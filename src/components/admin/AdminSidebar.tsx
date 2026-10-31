'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { authService } from '@/services/auth.service';
import { useEnquiries } from '@/hooks/useDataServices';
import {
  LayoutDashboard,
  Layers,
  PlayCircle,
  LayoutGrid,
  Sparkles,
  Quote,
  FileText,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen = false,
  onCloseMobile
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { enquiries } = useEnquiries();

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const handleLogout = () => {
    authService.logout();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Portfolio Projects', href: '/admin/projects', icon: Layers },
    { label: 'Video Showcase', href: '/admin/videos', icon: PlayCircle },
    { label: 'Plywood & Materials', href: '/admin/materials', icon: LayoutGrid },
    { label: 'Services', href: '/admin/services', icon: Sparkles },
    { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    { label: 'Website Content', href: '/admin/website-content', icon: FileText },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Mail, badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined },
    { label: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  const sidebarContent = (
    <aside className="w-[260px] bg-[#141414] border-r border-white/10 flex flex-col justify-between h-full min-h-screen text-[#FAF7F0] flex-shrink-0 relative overflow-hidden select-none">
      {/* Decorative architectural stone texture at the bottom left */}
      <div className="absolute -bottom-8 -left-12 w-48 h-48 opacity-15 pointer-events-none rounded-full overflow-hidden blur-[1px]">
        <Image
          src="/reference_assets/travertine_marble_hd.jpg"
          alt="Architectural Material Study"
          fill
          className="object-cover object-center transform rotate-12 scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#141414] via-[#141414]/70 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Brand Header */}
        <div className="px-6 pt-7 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" variant="light" asLink={false} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-widest text-[#DFC488] border border-[#C5A15B]/30 bg-[#C5A15B]/10 px-2 py-0.5 rounded-full uppercase">
              CMS
            </span>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-[#DFC488] hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="px-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-sans transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#C5A15B] text-[#141414] font-bold shadow-[0_2px_12px_rgba(197,161,91,0.25)]'
                    : 'text-[#E9E5DE]/75 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#141414]' : 'text-[#C5A15B]/80 group-hover:text-[#DFC488]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#141414] text-[#C5A15B]'
                        : 'bg-[#C5A15B] text-[#141414]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-white/10 space-y-1.5 relative z-10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 text-xs text-[#E9E5DE]/80 hover:text-white hover:bg-white/5 rounded-lg font-sans transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A15B]" />
            <span>View Public Website</span>
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-[#E9E5DE]/70 hover:text-red-300 hover:bg-red-950/20 rounded-lg font-sans transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:block h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer (Collapsible) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 max-w-[280px] w-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
