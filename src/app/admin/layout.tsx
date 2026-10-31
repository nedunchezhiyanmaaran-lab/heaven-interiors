'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface AdminUIContextType {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
}

const AdminUIContext = createContext<AdminUIContextType>({
  mobileNavOpen: false,
  setMobileNavOpen: () => {},
  toggleMobileNav: () => {}
});

export const useAdminUI = () => useContext(AdminUIContext);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center text-[#C5A15B] font-admin text-xs">
        Initializing Atelier CMS...
      </div>
    );
  }

  // Login page layout without sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#F5F0E6] font-admin">{children}</div>;
  }

  const toggleMobileNav = () => setMobileNavOpen((prev) => !prev);

  // Protected admin layout
  return (
    <AdminUIContext.Provider
      value={{
        mobileNavOpen,
        setMobileNavOpen,
        toggleMobileNav
      }}
    >
      <div className="min-h-screen bg-[#F5F0E6] text-[#141414] font-admin flex antialiased">
        <AdminSidebar
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
          {children}
        </div>
      </div>
    </AdminUIContext.Provider>
  );
}
