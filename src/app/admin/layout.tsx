'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authStatus = authService.isAuthenticated();
    setIsAuth(authStatus);

    if (!authStatus && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // Don't render anything until client mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#C5A15B] font-mono text-xs">
        Initializing Atelier CMS...
      </div>
    );
  }

  // Login page layout without sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#121212]">{children}</div>;
  }

  // Protected admin layout
  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F0E6] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {children}
      </div>
    </div>
  );
}

