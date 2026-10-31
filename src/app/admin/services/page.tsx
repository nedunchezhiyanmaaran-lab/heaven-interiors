'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useServices } from '@/hooks/useDataServices';
import { serviceService } from '@/services/service.service';
import { ServiceItem, CreateServiceInput } from '@/types/service.types';
import { slugify } from '@/utils/slug';
import { compressImageFile } from '@/utils/image-compression';
import { Sparkles, Plus, Trash2, Edit, X, AlertCircle, Upload } from 'lucide-react';

export default function AdminServicesPage() {
  const { services, loading, refresh } = useServices();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('01');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle('');
    setNumber(`0${services.length + 1}`);
    setShortDesc('');
    setFullDesc('');
    setImageUrl('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80');
    setDeliverablesText('Bespoke architectural layouts\nLighting & spatial planning\nTurnkey project supervision');
    setDisplayOrder(services.length + 1);
    setIsPublished(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setTitle(s.title);
    setNumber(s.number);
    setShortDesc(s.shortDescription);
    setFullDesc(s.fullDescription);
    setImageUrl(s.imageUrl);
    setDeliverablesText(s.deliverables ? s.deliverables.join('\n') : '');
    setDisplayOrder(s.displayOrder);
    setIsPublished(s.isPublished);
    setError(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1200, quality: 0.8 });
      setImageUrl(compressed);
    } catch (err: any) {
      setError(err?.message || 'Error processing image');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Service title is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const deliverables = deliverablesText
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean);

      const input: CreateServiceInput = {
        title: title.trim(),
        number: number.trim(),
        slug: slugify(title),
        shortDescription: shortDesc.trim(),
        fullDescription: fullDesc.trim(),
        imageUrl: imageUrl.trim(),
        deliverables,
        displayOrder: Number(displayOrder) || 1,
        isPublished
      };

      if (editingService) {
        await serviceService.update(editingService.id, input);
      } else {
        await serviceService.create(input);
      }

      setModalOpen(false);
      refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await serviceService.delete(id);
      refresh();
    }
  };

  const handleTogglePublish = async (id: string) => {
    await serviceService.togglePublish(id);
    refresh();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen font-sans">
      <AdminHeader
        title="Services & Capabilities"
        subtitle="Manage atelier disciplines, deliverables, and turnkey capability showcases"
        actionButton={
          <button
            onClick={openCreateModal}
            className="bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Discipline</span>
          </button>
        }
      />

      <div className="p-6 sm:p-10 space-y-6 max-w-[1500px] w-full mx-auto font-sans">
        <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5DEC9] text-[11px] uppercase tracking-wider text-[#78726A] bg-[#F5F0E6]/60 font-semibold">
                  <th className="py-3.5 px-5">No. & Discipline Title</th>
                  <th className="py-3.5 px-5 hidden md:table-cell">Key Deliverables</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DEC9]/70 text-xs font-sans">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-[#F5F0E6]/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-[#F5F0E6] flex-shrink-0 border border-[#E5DEC9]">
                          <Image
                            src={srv.imageUrl || '/brand/logo.png'}
                            alt={srv.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-[10px] text-[#C5A15B] font-semibold uppercase tracking-wider">
                            PHASE {srv.number}
                          </div>
                          <div className="font-semibold text-sm text-[#141414]">{srv.title}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 hidden md:table-cell text-[#78726A]">
                      <div className="line-clamp-2 text-xs">
                        {srv.deliverables?.join(' · ') || '—'}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleTogglePublish(srv.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          srv.isPublished
                            ? 'bg-[#2E7D5A]/15 text-[#2E7D5A] border border-[#2E7D5A]/30 hover:bg-[#2E7D5A]/20'
                            : 'bg-[#C5A15B]/15 text-[#9E7B36] border border-[#C5A15B]/30 hover:bg-[#C5A15B]/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            srv.isPublished ? 'bg-[#2E7D5A]' : 'bg-[#C5A15B]'
                          }`}
                        />
                        <span>{srv.isPublished ? 'LIVE' : 'DRAFT'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-1.5 text-[#78726A] hover:text-[#C5A15B] hover:bg-[#F5F0E6] rounded-lg transition-colors"
                          title="Edit Discipline"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(srv.id)}
                          className="p-1.5 text-[#78726A] hover:text-[#B43A3A] hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Discipline"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {services.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-xs text-[#78726A]">
                      No services configured in atelier database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DEC9]">
              <h2 className="font-bold text-lg text-[#141414]">
                {editingService ? 'Edit Discipline' : 'Add Discipline'}
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
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Discipline Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Residential Interior Architecture"
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Phase Number
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="01"
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Brief Summary
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Turnkey residential interiors tailored with bespoke joinery..."
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Key Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder="Architectural Joinery Drawings&#10;MEP & Lighting Layouts&#10;BOQ Material Dossier"
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Reference Photograph (URL or File Upload)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none mb-2"
                />

                <label className="block border border-dashed border-[#E5DEC9] hover:border-[#C5A15B] bg-[#F5F0E6]/30 rounded-xl p-2.5 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-xs text-[#78726A] flex items-center justify-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-[#C5A15B]" />
                    <span>Upload Discipline Photograph</span>
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#141414]">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A15B]"
                  />
                  <span>Published on Public Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5DEC9]">
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
                  {saving ? 'Saving...' : 'Save Discipline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
