'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  variant?: 'light' | 'dark';
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  variant = 'light',
  asLink = true
}) => {
  const sizeMap = {
    sm: { img: 36, text: 'text-sm', sub: 'text-[9px] tracking-[0.25em]' },
    md: { img: 48, text: 'text-lg', sub: 'text-[10px] tracking-[0.3em]' },
    lg: { img: 64, text: 'text-2xl', sub: 'text-xs tracking-[0.35em]' },
    xl: { img: 84, text: 'text-3xl', sub: 'text-sm tracking-[0.4em]' }
  };

  const current = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3.5 group select-none ${className}`}>
      {/* Official circular client logo */}
      <div 
        className="relative flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
        style={{ width: current.img, height: current.img }}
      >
        <Image
          src="/brand/logo.png"
          alt="Heaven Interiors Official Brand Mark"
          width={current.img}
          height={current.img}
          className="w-full h-full object-contain filter drop-shadow-md"
          priority
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-heading tracking-[0.15em] font-medium transition-colors ${
              variant === 'light' ? 'text-[#F5F0E6] group-hover:text-[#DFC488]' : 'text-[#202020] group-hover:text-[#C5A15B]'
            } ${current.text}`}
          >
            HEAVEN
          </span>
          <span
            className={`font-sans font-light uppercase opacity-75 ${
              variant === 'light' ? 'text-[#C5A15B]' : 'text-[#9E7B36]'
            } ${current.sub}`}
          >
            INTERIORS
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="Heaven Interiors — Home" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

