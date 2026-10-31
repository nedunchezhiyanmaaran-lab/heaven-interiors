'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center text-xs text-[#C5A15B] font-admin font-medium">
      Redirecting to Studio CMS...
    </div>
  );
}

