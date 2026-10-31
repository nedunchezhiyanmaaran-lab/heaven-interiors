'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { compressImageFile } from '@/utils/image-compression';
import { Upload, X, Star, ArrowUp, ArrowDown, Image as ImageIcon, Loader2 } from 'lucide-react';

export interface UploadedImageItem {
  id: string;
  url: string;
  caption?: string;
  isCover?: boolean;
  order: number;
}

interface ImageUploaderProps {
  images: UploadedImageItem[];
  onChange: (images: UploadedImageItem[]) => void;
  allowMultiple?: boolean;
  maxFiles?: number;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  allowMultiple = true,
  maxFiles = 20,
  label = 'Upload Photographs'
}) => {
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setCompressing(true);

    try {
      const newItems: UploadedImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        // Compress using Canvas client-side
        const compressedBase64 = await compressImageFile(file, {
          maxWidth: 1400,
          maxHeight: 1050,
          quality: 0.82
        });

        const isFirst = images.length === 0 && newItems.length === 0;

        newItems.push({
          id: `img-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          url: compressedBase64,
          caption: '',
          isCover: isFirst,
          order: images.length + newItems.length + 1
        });
      }

      if (allowMultiple) {
        onChange([...images, ...newItems].slice(0, maxFiles));
      } else {
        onChange(newItems.slice(0, 1));
      }
    } catch (err: any) {
      setError(err?.message || 'Error optimizing uploaded images.');
    } finally {
      setCompressing(false);
      e.target.value = '';
    }
  };

  const handleRemove = (id: string) => {
    const remaining = images.filter((img) => img.id !== id);
    if (images.find((img) => img.id === id)?.isCover && remaining.length > 0) {
      remaining[0].isCover = true;
    }
    onChange(remaining);
  };

  const handleSetCover = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isCover: img.id === id
    }));
    onChange(updated);
  };

  const handleCaptionChange = (id: string, caption: string) => {
    const updated = images.map((img) => (img.id === id ? { ...img, caption } : img));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    onChange(reordered);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Upload Dropzone */}
      <div className="relative border-2 border-dashed border-[#E5DEC9] hover:border-[#C5A15B] bg-[#F5F0E6]/40 hover:bg-[#F5F0E6]/70 rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          multiple={allowMultiple}
          onChange={handleFileChange}
          disabled={compressing || images.length >= maxFiles}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#C5A15B]/15 text-[#C5A15B] flex items-center justify-center group-hover:scale-105 transition-transform">
            {compressing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div className="text-xs font-semibold text-[#141414]">
            {compressing ? 'Optimizing photographs...' : label}
          </div>

          <p className="text-[11px] text-[#78726A] font-sans max-w-sm">
            Drag & drop architectural JPG, PNG, WebP up to 10MB. Images are compressed automatically for fast loading.
          </p>

          <span className="text-[10px] font-semibold text-[#C5A15B] uppercase tracking-wider pt-1">
            {images.length} of {maxFiles} images added
          </span>
        </div>
      </div>

      {error && (
        <div className="text-xs text-[#B43A3A] bg-red-50 border border-red-200 p-2.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Grid of Preview Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
          {images.map((item, idx) => (
            <div
              key={item.id}
              className={`bg-[#FFFFFF] border rounded-xl overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                item.isCover ? 'border-[#C5A15B] ring-2 ring-[#C5A15B]/20' : 'border-[#E5DEC9]'
              }`}
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] w-full bg-[#F5F0E6] overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.caption || 'Project visual'}
                  fill
                  className="object-cover"
                />

                {item.isCover && (
                  <div className="absolute top-2 left-2 bg-[#C5A15B] text-[#141414] text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Cover</span>
                  </div>
                )}

                {/* Quick Action Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-xs p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleSetCover(item.id)}
                    title={item.isCover ? 'Primary Cover' : 'Set as primary cover photo'}
                    className={`p-1 rounded transition-colors ${
                      item.isCover ? 'text-[#DFC488]' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.isCover ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    title="Remove photograph"
                    className="p-1 text-white/70 hover:text-red-300 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Ordering arrows */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-xs p-0.5 rounded-md">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-0.5 text-white/70 hover:text-white disabled:opacity-30"
                      title="Move left"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 text-white/70 hover:text-white disabled:opacity-30"
                      title="Move right"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Caption Input */}
              <div className="p-2.5 bg-[#FFFFFF]">
                <input
                  type="text"
                  value={item.caption || ''}
                  onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                  placeholder="Architectural caption / credit..."
                  className="w-full bg-[#F5F0E6]/60 border border-[#E5DEC9] rounded-lg px-2.5 py-1 text-xs text-[#141414] placeholder:text-[#78726A] focus:border-[#C5A15B] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
