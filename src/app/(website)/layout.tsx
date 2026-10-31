import React from 'react';
import { Navbar } from '@/components/website/Navbar';
import { Footer } from '@/components/website/Footer';
import { SmoothScrollProvider } from '@/components/animations/SmoothScrollProvider';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col bg-[#141414] text-[#F5F0E6]">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}

