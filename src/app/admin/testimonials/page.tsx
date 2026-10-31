'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useTestimonials } from '@/hooks/useDataServices';
import { testimonialService } from '@/services/testimonial.service';
import { Testimonial, CreateTestimonialInput } from '@/types/testimonial.types';
import { compressImageFile } from '@/utils/image-compression';
import { Quote, Plus, Trash2, Edit, X, Star, AlertCircle } from 'lucide-react';

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
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Testimonials & Patron Commendations"
        subtitle="Manage client reflections, project associations, and verified ratings"
        actionButton={
          <button
            onClick={openCreateModal}
            className="btn-gold px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-sans flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Commendation</span>
          </button>
        }
      />

      <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-[#181818] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C5A15B]">
                    {Array.from({ length: test.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <button
                    onClick={() => handleTogglePublish(test.id)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      test.isPublished
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {test.isPublished ? 'Published' : 'Draft'}
                  </button>
                </div>

                <blockquote className="text-sm font-serif italic text-[#F5F0E6] leading-relaxed">
                  “{test.quote}”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {test.avatarUrl && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C5A15B]/40">
                      <Image
                        src={test.avatarUrl}
                        alt={test.clientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-medium text-[#F5F0E6]">{test.clientName}</div>
                    <div className="text-[10px] text-[#C5A15B] uppercase tracking-wider font-sans">
                      {test.projectAssociation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(test)}
                    className="p-1.5 text-white/50 hover:text-white rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-1.5 text-red-400/60 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#181818] border border-white/15 rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-serif text-[#F5F0E6]">
                {editingTestimonial ? 'Edit Commendation' : 'Add New Commendation'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Patron Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Vikram Singhania"
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F0E6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Project Association *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectAssociation}
                    onChange={(e) => setProjectAssociation(e.target.value)}
                    placeholder="e.g. The Skyward Penthouse"
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F0E6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                  Patron Title / Role (Optional)
                </label>
                <input
                  type="text"
                  value={clientRole}
                  onChange={(e) => setClientRole(e.target.value)}
                  placeholder="e.g. Private Investor / Managing Partner"
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F0E6]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                  Commendation Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Enter the client testimonial text..."
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F0E6]"
                />
              </div>

              {/* Portrait Upload */}
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B]">
                  Client Portrait Avatar
                </label>
                <div className="flex items-center gap-4">
                  {avatarUrl && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black flex-shrink-0 border border-white/15">
                      <Image
                        src={avatarUrl}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="text-xs text-white/70 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-white/10 file:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#C5A15B]"
                  />
                  <span className="text-xs text-[#F5F0E6]">Publish on Public Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-medium"
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

