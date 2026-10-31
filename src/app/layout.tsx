import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Heaven Interiors | Luxury Interior Architecture & Bespoke Woodworking Atelier',
  description: 'Heaven Interiors crafts architectural spaces of quiet permanence, monolithic stone, and bespoke timber craftsmanship for luxury residences and corporate headquarters.',
  icons: {
    icon: '/brand/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#141414] text-[#F5F0E6] antialiased">
        {children}
      </body>
    </html>
  );
}

