'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useServices } from '@/hooks/useDataServices';
import { serviceService } from '@/services/service.service';
import { ServiceItem, CreateServiceInput } from '@/types/service.types';
import { slugify } from '@/utils/slug';
import { compressImageFile } from '@/utils/image-compression';
import { Wrench, Plus, Trash2, Edit, X, AlertCircle } from 'lucide-react';

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
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Services Management"
        subtitle="Manage atelier disciplines, deliverables, and capability showcases"
        actionButton={
          <button
            onClick={openCreateModal}
            className="btn-gold px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-sans flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Discipline</span>
          </button>
        }
      />

      <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="bg-[#181818] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-[#C5A15B] bg-[#141414]/60">
                <th className="py-3.5 px-4 font-medium">No. & Discipline Title</th>
                <th className="py-3.5 px-4 font-medium hidden md:table-cell">Deliverables</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-sans">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-[#242424] flex-shrink-0 border border-white/10">
                        <Image
                          src={srv.imageUrl || '/brand/logo.png'}
                          alt={srv.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-[#C5A15B]">{srv.number}</div>
                        <div className="font-medium text-[#F5F0E6]">{srv.title}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 hidden md:table-cell text-[#E9E5DE]/70">
                    <div className="line-clamp-2 text-[11px]">
                      {srv.deliverables?.join(' • ') || '—'}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(srv.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        srv.isPublished
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {srv.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="p-1.5 text-white/50 hover:text-white rounded"
                        title="Edit Discipline"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="p-1.5 text-red-400/60 hover:text-red-400 rounded"
                        title="Delete Discipline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#181818] border border-white/15 rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-serif text-[#F5F0E6]">
                {editingService ? 'Edit Service' : 'Add New Service Discipline'}
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="01"
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F0E6]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Discipline Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Residential Interior Architecture"
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Concise overview..."
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                  Key Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder="Architectural 3D modeling&#10;Lighting & acoustic study&#10;Turnkey site execution"
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6]"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B]">
                  Supporting Showcase Image
                </label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <div className="relative w-20 h-16 rounded overflow-hidden bg-black flex-shrink-0 border border-white/15">
                      <Image
                        src={imageUrl}
                        alt="Service preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
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

