'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useTestimonials } from '@/hooks/useDataServices';
import { testimonialService } from '@/services/testimonial.service';
import { Testimonial, CreateTestimonialInput } from '@/types/testimonial.types';
import { compressImageFile } from '@/utils/image-compression';
import { Quote, Plus, Trash2, Edit, X, Star, AlertCircle, Upload } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const { testimonials, loading, refresh } = useTestimonials();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [projectAssociation, setProjectAssociation] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setClientName('');
    setClientRole('Private Residence Patron');
    setProjectAssociation('Worli Penthouse');
    setQuote('');
    setRating(5);
    setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setDisplayOrder(testimonials.length + 1);
    setIsPublished(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setClientName(t.clientName);
    setClientRole(t.clientRole || '');
    setProjectAssociation(t.projectAssociation);
    setQuote(t.quote);
    setRating(t.rating);
    setAvatarUrl(t.avatarUrl || '');
    setDisplayOrder(t.displayOrder);
    setIsPublished(t.isPublished);
    setError(null);
    setModalOpen(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 400, maxHeight: 400, quality: 0.85 });
      setAvatarUrl(compressed);
    } catch (err: any) {
      setError(err?.message || 'Error processing portrait image');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !quote.trim()) {
      setError('Client name and testimonial quote are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const input: CreateTestimonialInput = {
        clientName: clientName.trim(),
        clientRole: clientRole.trim(),
        projectAssociation: projectAssociation.trim(),
        quote: quote.trim(),
        rating: Number(rating) || 5,
        avatarUrl: avatarUrl.trim() || undefined,
        displayOrder: Number(displayOrder) || 1,
        isPublished
      };

      if (editingTestimonial) {
        await testimonialService.update(editingTestimonial.id, input);
      } else {
        await testimonialService.create(input);
      }

      setModalOpen(false);
      refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this commendation?')) {
      await testimonialService.delete(id);
      refresh();
    }
  };

  const handleTogglePublish = async (id: string) => {
    await testimonialService.togglePublish(id);
    refresh();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen font-sans">
      <AdminHeader
        title="Patron Testimonials"
        subtitle="Manage client commendations, architectural reviews, and studio testimonials"
        actionButton={
          <button
            onClick={openCreateModal}
            className="bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Testimonial</span>
          </button>
        }
      />

      <div className="p-6 sm:p-10 space-y-6 max-w-[1500px] w-full mx-auto font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#C5A15B] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C5A15B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating ? 'fill-current' : 'text-[#E5DEC9]'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleTogglePublish(item.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                      item.isPublished
                        ? 'bg-[#2E7D5A]/15 text-[#2E7D5A] border border-[#2E7D5A]/30'
                        : 'bg-[#C5A15B]/15 text-[#9E7B36] border border-[#C5A15B]/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isPublished ? 'bg-[#2E7D5A]' : 'bg-[#C5A15B]'
                      }`}
                    />
                    <span>{item.isPublished ? 'LIVE' : 'DRAFT'}</span>
                  </button>
                </div>

                <p className="text-xs text-[#141414] leading-relaxed italic font-sans">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5DEC9]/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#F5F0E6] border border-[#E5DEC9] flex-shrink-0">
                    <Image
                      src={item.avatarUrl || '/reference_assets/testimonial_avatar.jpg'}
                      alt={item.clientName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#141414]">{item.clientName}</div>
                    <div className="text-[10px] text-[#78726A]">{item.clientRole}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-[#78726A] hover:text-[#C5A15B] hover:bg-[#F5F0E6] rounded-lg transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-[#78726A] hover:text-[#B43A3A] hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <div className="col-span-full py-16 text-center bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl">
              <p className="text-sm font-semibold text-[#141414]">No testimonials found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Testimonial Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 my-8 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DEC9]">
              <h2 className="font-bold text-lg text-[#141414]">
                {editingTestimonial ? 'Edit Commendation' : 'Add Commendation'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#78726A] hover:text-[#141414] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#B43A3A] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Patron Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singhania"
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-3.5 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    placeholder="e.g. Penthouse Resident"
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-3.5 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Commission Project
                </label>
                <input
                  type="text"
                  value={projectAssociation}
                  onChange={(e) => setProjectAssociation(e.target.value)}
                  placeholder="e.g. Worli Penthouse, Mumbai"
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-3.5 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Commendation Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Heaven Interiors brought a profound sense of restraint and material warmth..."
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-3.5 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Portrait Avatar (URL or File Upload)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-3.5 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none mb-2"
                />

                <label className="block border border-dashed border-[#E5DEC9] hover:border-[#C5A15B] bg-[#F5F0E6]/30 rounded-xl p-2 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <span className="text-xs text-[#78726A] flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#C5A15B]" />
                    <span>Upload Patron Portrait</span>
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#141414]">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A15B]"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E5DEC9] text-[#78726A] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#141414] hover:bg-[#C5A15B] text-white hover:text-[#141414] px-5 py-2 rounded-full text-xs font-semibold shadow-sm transition-all"
                >
                  {saving ? 'Saving...' : 'Save Commendation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
