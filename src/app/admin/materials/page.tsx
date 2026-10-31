'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useMaterials } from '@/hooks/useDataServices';
import { materialService } from '@/services/material.service';
import { MATERIAL_CATEGORIES } from '@/data/mock-materials';
import { Material, CreateMaterialInput, MaterialSpecification } from '@/types/material.types';
import { slugify } from '@/utils/slug';
import { ImageUploader, UploadedImageItem } from '@/components/admin/ImageUploader';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Eye,
  Star,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminMaterialsPage() {
  const { materials, loading, refresh } = useMaterials();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(MATERIAL_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [thickness, setThickness] = useState('');
  const [dimensions, setDimensions] = useState('8ft x 4ft (2440mm x 1220mm)');
  const [finishType, setFinishType] = useState('');
  const [color, setColor] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);

  // Specifications key-value pairs
  const [specs, setSpecs] = useState<MaterialSpecification[]>([
    { key: 'Standard Compliance', value: 'IS:710 Marine Certified' },
    { key: 'Core Timber', value: '100% Selected Hardwood' }
  ]);

  // Gallery Images
  const [galleryImages, setGalleryImages] = useState<UploadedImageItem[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingMaterial(null);
    setName('');
    setSlug('');
    setBrand('');
    setCategory(MATERIAL_CATEGORIES[0]);
    setCustomCategory('');
    setShortDesc('');
    setFullDesc('');
    setThickness('18mm / 19mm');
    setDimensions('8ft x 4ft (2440mm x 1220mm)');
    setFinishType('Calibrated Sanded');
    setColor('');
    setAdditionalNotes('');
    setIsFeatured(false);
    setIsPublished(true);
    setDisplayOrder(materials.length + 1);
    setSpecs([
      { key: 'Standard Compliance', value: 'IS:710 Marine Certified' },
      { key: 'Core Timber', value: '100% Selected Hardwood' }
    ]);
    setGalleryImages([
      {
        id: 'default-cover',
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80',
        caption: 'Material Sample',
        isCover: true,
        order: 1
      }
    ]);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (m: Material) => {
    setEditingMaterial(m);
    setName(m.name);
    setSlug(m.slug);
    setBrand(m.brand);
    setCategory(m.category);
    setShortDesc(m.shortDescription);
    setFullDesc(m.fullDescription);
    setThickness(m.thickness);
    setDimensions(m.dimensions);
    setFinishType(m.finishType);
    setColor(m.color || '');
    setAdditionalNotes(m.additionalNotes || '');
    setIsFeatured(m.isFeatured);
    setIsPublished(m.isPublished);
    setDisplayOrder(m.displayOrder);
    setSpecs(m.specifications && m.specifications.length > 0 ? m.specifications : []);
    setGalleryImages(
      m.galleryImages && m.galleryImages.length > 0
        ? m.galleryImages
        : [
            {
              id: 'cover',
              url: m.coverImage,
              caption: 'Material Cover',
              isCover: true,
              order: 1
            }
          ]
    );
    setError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingMaterial) {
      setSlug(slugify(val));
    }
  };

  const addSpecRow = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecRow = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const updateSpecRow = (idx: number, field: 'key' | 'value', text: string) => {
    const updated = [...specs];
    updated[idx][field] = text;
    setSpecs(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Material name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const finalCategory =
        category === 'Other' && customCategory.trim()
          ? customCategory.trim()
          : category;

      const coverItem = galleryImages.find((img) => img.isCover) || galleryImages[0];
      const coverUrl = coverItem
        ? coverItem.url
        : 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80';

      const input: CreateMaterialInput = {
        name: name.trim(),
        slug: slugify(slug || name),
        brand: brand.trim(),
        category: finalCategory,
        shortDescription: shortDesc.trim(),
        fullDescription: fullDesc.trim(),
        thickness: thickness.trim(),
        dimensions: dimensions.trim(),
        finishType: finishType.trim(),
        color: color.trim(),
        specifications: specs.filter((s) => s.key.trim() && s.value.trim()),
        additionalNotes: additionalNotes.trim(),
        coverImage: coverUrl,
        galleryImages,
        displayOrder: Number(displayOrder) || 1,
        isFeatured,
        isPublished
      };

      if (editingMaterial) {
        await materialService.update(editingMaterial.id, input);
      } else {
        await materialService.create(input);
      }

      setModalOpen(false);
      refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to save material specification.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this material from the catalogue?')) {
      await materialService.delete(id);
      refresh();
    }
  };

  const handleTogglePublish = async (id: string) => {
    await materialService.togglePublish(id);
    refresh();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Plywood & Materials Management"
        subtitle="Curate technical timber substrates, calibrated ply, architectural veneers, and finishes"
        actionButton={
          <button
            onClick={openCreateModal}
            className="btn-gold px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-sans flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Material</span>
          </button>
        }
      />

      <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Table / Catalogue View */}
        <div className="bg-[#181818] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-[#C5A15B] bg-[#141414]/60">
                <th className="py-3.5 px-4 font-medium">Material & Brand</th>
                <th className="py-3.5 px-4 font-medium hidden sm:table-cell">Category</th>
                <th className="py-3.5 px-4 font-medium hidden md:table-cell">Thickness & Size</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-sans">
              {materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-[#242424] flex-shrink-0 border border-white/10">
                        <Image
                          src={mat.coverImage || '/brand/logo.png'}
                          alt={mat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-[#F5F0E6] truncate">{mat.name}</div>
                        <div className="text-[10px] text-[#C5A15B] uppercase tracking-wider">
                          {mat.brand}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#E9E5DE]/80 border border-white/5">
                      {mat.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 hidden md:table-cell text-[#E9E5DE]/70">
                    <div>{mat.thickness}</div>
                    <div className="text-[10px] text-[#E9E5DE]/40">{mat.dimensions}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(mat.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        mat.isPublished
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {mat.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/materials/${mat.slug}`}
                        target="_blank"
                        className="p-1.5 text-white/50 hover:text-[#C5A15B] rounded"
                        title="View Public Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => openEditModal(mat)}
                        className="p-1.5 text-white/50 hover:text-white rounded"
                        title="Edit Material"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(mat.id)}
                        className="p-1.5 text-red-400/60 hover:text-red-400 rounded"
                        title="Delete Material"
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

      {/* Material Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#181818] border border-white/15 rounded-xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-serif text-[#F5F0E6]">
                {editingMaterial ? 'Edit Material Specification' : 'Add New Material Specification'}
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

            <form onSubmit={handleSave} className="space-y-6 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Material Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Platinum Calibrated BWP 710 Marine Ply"
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. CenturyPly / Club Platinum"
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                  >
                    {MATERIAL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>

                {category === 'Other' && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                      Custom Category Name
                    </label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Acoustic Insulation"
                      className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Thickness Options
                  </label>
                  <input
                    type="text"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder="18mm / 19mm"
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="8ft x 4ft"
                    className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                  Finish / Type
                </label>
                <input
                  type="text"
                  value={finishType}
                  onChange={(e) => setFinishType(e.target.value)}
                  placeholder="Double-Sided Calibrated Sanded Smooth (120 Grit)"
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                  Short Description (Catalogue Card)
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Concise overview of engineering density and applications..."
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B] mb-1">
                  Full Description & Specifications
                </label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Detailed architectural description..."
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
                />
              </div>

              {/* Specifications Matrix Builder */}
              <div className="space-y-3 p-4 bg-[#141414] rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#C5A15B] font-medium">
                    Technical Specifications Matrix
                  </span>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-[11px] text-[#C5A15B] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Spec Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sp.key}
                        onChange={(e) => updateSpecRow(idx, 'key', e.target.value)}
                        placeholder="Property (e.g. Density)"
                        className="flex-1 bg-[#1c1c1c] border border-white/15 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={sp.value}
                        onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. > 860 kg/m³)"
                        className="flex-1 bg-[#1c1c1c] border border-white/15 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <ImageUploader
                images={galleryImages}
                onChange={setGalleryImages}
                allowMultiple={true}
                maxFiles={10}
                label="Material Photographs & Swatches"
              />

              {/* Visibility */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#C5A15B]"
                  />
                  <span className="text-xs text-[#F5F0E6]">Publish in Catalogue</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#C5A15B]"
                  />
                  <span className="text-xs text-[#F5F0E6]">Feature in Showcase</span>
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
                  {saving ? 'Saving...' : 'Save Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

