'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { materialService } from '@/services/material.service';
import { Material } from '@/types/material.types';
import { ArrowLeft, ArrowUpRight, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function MaterialDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const item = await materialService.getBySlug(slug);
        setMaterial(item);
        if (item) {
          setActiveImage(item.coverImage);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex items-center justify-center bg-[#F5F0E6] text-[#666] font-serif">
        Loading material technical dossier...
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center bg-[#F5F0E6] text-center px-6">
        <h1 className="text-3xl font-serif text-[#202020] mb-4">Material Not Found</h1>
        <p className="text-sm text-[#666] max-w-md mb-8">
          The requested material specification is currently unavailable in the atelier catalogue.
        </p>
        <Link
          href="/materials"
          className="px-6 py-3 rounded-full bg-[#C5A15B] text-[#141414] font-medium text-xs uppercase tracking-widest hover:bg-[#DFC488] transition-colors"
        >
          Return to Material Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-[#F5F0E6] text-[#202020] min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-8">
        <Link
          href="/materials"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A15B] hover:text-[#202020] transition-colors font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Materials Archive</span>
        </Link>
      </div>

      {/* Main Dossier Presentation */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Photography & Swatches */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#E9E5DE] shadow-xl border border-black/5">
              <Image
                src={activeImage || material.coverImage}
                alt={material.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#141414]/90 backdrop-blur-md px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#C5A15B] border border-[#C5A15B]/30 font-mono">
                {material.category}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {material.galleryImages && material.galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3 pt-2">
                <button
                  onClick={() => setActiveImage(material.coverImage)}
                  className={`relative aspect-video overflow-hidden border-2 transition-all ${
                    activeImage === material.coverImage ? 'border-[#C5A15B]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={material.coverImage}
                    alt={material.name}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </button>
                {material.galleryImages.map((gImg, idx) => (
                  <button
                    key={gImg.id || idx}
                    onClick={() => setActiveImage(gImg.url)}
                    className={`relative aspect-video overflow-hidden border-2 transition-all ${
                      activeImage === gImg.url ? 'border-[#C5A15B]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={gImg.url}
                      alt={gImg.caption || material.name}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Technical Spec Sheet */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-[1px] bg-[#C5A15B]" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A15B] font-mono">
                  {material.brand}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#202020] leading-tight">
                {material.name}
              </h1>
            </div>

            <p className="text-sm text-[#555] font-sans font-light leading-relaxed">
              {material.shortDescription}
            </p>

            {/* Quick Specs Table */}
            <div className="bg-[#EFEAE0] p-6 border border-black/5 space-y-3.5 text-xs font-sans">
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-[#777] uppercase tracking-[0.15em] font-mono text-[11px]">Brand / Atelier:</span>
                <span className="text-[#202020] font-medium">{material.brand}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-[#777] uppercase tracking-[0.15em] font-mono text-[11px]">Category:</span>
                <span className="text-[#C5A15B] font-medium">{material.category}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-[#777] uppercase tracking-[0.15em] font-mono text-[11px]">Thickness Calibre:</span>
                <span className="text-[#202020] font-medium">{material.thickness}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-[#777] uppercase tracking-[0.15em] font-mono text-[11px]">Sheet Dimensions:</span>
                <span className="text-[#202020] font-medium">{material.dimensions}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-black/5">
                <span className="text-[#777] uppercase tracking-[0.15em] font-mono text-[11px]">Surface Texture:</span>
                <span className="text-[#202020] font-medium">{material.finishType}</span>
              </div>
              {material.color && (
                <div className="flex justify-between">
                  <span className="text-[#777] uppercase tracking-[0.15em] font-mono text-[11px]">Core Tone:</span>
                  <span className="text-[#202020] font-medium">{material.color}</span>
                </div>
              )}
            </div>

            {/* Inquire Action Button */}
            <div className="pt-2">
              <Link
                href="/contact"
                className="w-full py-4 rounded-full bg-[#141414] hover:bg-[#C5A15B] text-[#F5F0E6] hover:text-[#141414] transition-all duration-300 text-center block text-xs uppercase tracking-[0.2em] font-sans font-medium shadow-lg"
              >
                Inquire About Specifying This Material ↗
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Narrative & Technical Matrix */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 border-t border-black/10">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono">
              Architectural Narrative & Joinery Fit
            </h2>
            <div className="text-sm text-[#444] font-sans font-light leading-relaxed space-y-4">
              <p>{material.fullDescription}</p>
              {material.additionalNotes && (
                <div className="p-5 bg-[#EFEAE0] border-l-2 border-[#C5A15B] text-xs text-[#555] leading-relaxed italic mt-4">
                  <span className="font-semibold text-[#C5A15B] not-italic block mb-1 uppercase tracking-wider font-mono">
                    Atelier Joinery Directive:
                  </span>
                  {material.additionalNotes}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono">
              Technical Testing Matrix
            </h2>
            {material.specifications && material.specifications.length > 0 ? (
              <div className="border border-black/10 divide-y divide-black/5 bg-[#EFEAE0]">
                {material.specifications.map((spec, i) => (
                  <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="text-[#777] uppercase tracking-wider font-mono">
                      {spec.key}
                    </span>
                    <span className="text-[#202020] font-medium font-sans">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#777] italic">
                Standard IS:710 Marine & IS:303 grade compliance data sheets are furnished upon architectural specification.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
