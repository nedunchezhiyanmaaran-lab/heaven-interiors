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
      setError(err?.message || 'Error processing images.');
    } finally {
      setCompressing(false);
      // reset file input
      e.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    const remaining = images.filter((img) => img.id !== id);
    // If cover was removed, make first remaining item cover
    if (remaining.length > 0 && !remaining.some((img) => img.isCover)) {
      remaining[0].isCover = true;
    }
    onChange(remaining.map((img, idx) => ({ ...img, order: idx + 1 })));
  };

  const setCover = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isCover: img.id === id
    }));
    onChange(updated);
  };

  const updateCaption = (id: string, caption: string) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, caption } : img
    );
    onChange(updated);
  };

  const moveOrder = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const copy = [...images];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;

    onChange(copy.map((img, i) => ({ ...img, order: i + 1 })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-[#C5A15B] font-medium font-sans">
          {label} ({images.length}/{maxFiles})
        </label>
        <span className="text-[11px] text-[#E9E5DE]/50 font-sans">
          Auto-compressed WebP/JPEG for browser performance
        </span>
      </div>

      {/* Upload Drop Zone */}
      <label className="relative border-2 border-dashed border-white/20 hover:border-[#C5A15B]/60 transition-colors p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-[#181818] group">
        <input
          type="file"
          accept="image/*"
          multiple={allowMultiple}
          onChange={handleFileChange}
          disabled={compressing || images.length >= maxFiles}
          className="sr-only"
        />

        {compressing ? (
          <div className="flex flex-col items-center gap-2 text-[#C5A15B]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-sans">Compressing & optimizing image...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#C5A15B]/20 text-[#C5A15B] flex items-center justify-center transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs text-[#F5F0E6] font-medium">
              Click to select or drag and drop photographs
            </div>
            <div className="text-[11px] text-[#E9E5DE]/50">
              Supports JPEG, PNG, WebP up to 15MB (automatically compressed)
            </div>
          </div>
        )}
      </label>

      {error && (
        <div className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded border border-red-900">
          {error}
        </div>
      )}

      {/* Uploaded Previews List */}
      {images.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-[11px] text-[#E9E5DE]/60 uppercase tracking-wider">
            Uploaded Photos (Star marks Cover Photo):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`relative bg-[#1c1c1c] border rounded-lg p-2.5 space-y-2 transition-all ${
                  img.isCover ? 'border-[#C5A15B] shadow-lg' : 'border-white/10'
                }`}
              >
                {/* Image preview */}
                <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-[#242424]">
                  <Image
                    src={img.url}
                    alt={img.caption || 'Project photograph'}
                    fill
                    className="object-cover"
                  />

                  {/* Badges */}
                  {img.isCover && (
                    <div className="absolute top-2 left-2 bg-[#C5A15B] text-[#141414] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded">
                      Cover Photo
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm p-1 rounded">
                    <button
                      type="button"
                      onClick={() => setCover(img.id)}
                      title={img.isCover ? 'Cover Photo' : 'Set as Cover Photo'}
                      className={`p-1 rounded ${
                        img.isCover ? 'text-[#C5A15B]' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => moveOrder(idx, 'up')}
                      disabled={idx === 0}
                      title="Move up"
                      className="p-1 text-white/70 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => moveOrder(idx, 'down')}
                      disabled={idx === images.length - 1}
                      title="Move down"
                      className="p-1 text-white/70 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      title="Remove image"
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Caption input */}
                <div>
                  <input
                    type="text"
                    value={img.caption || ''}
                    onChange={(e) => updateCaption(img.id, e.target.value)}
                    placeholder="Photo caption (e.g. Master ensuite travertine vanity)"
                    className="w-full bg-[#141414] border border-white/10 px-2 py-1 text-xs text-[#F5F0E6] rounded focus:border-[#C5A15B] focus:outline-none placeholder:text-white/20"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

