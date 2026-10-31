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
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen font-sans">
      <AdminHeader
        title="Plywood & Materials"
        subtitle="Curate technical timber substrates, calibrated ply, architectural veneers, and finishes"
        actionButton={
          <button
            onClick={openCreateModal}
            className="bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Material</span>
          </button>
        }
      />

      <div className="p-6 sm:p-10 space-y-6 max-w-[1500px] w-full mx-auto">
        {/* Table / Catalogue View */}
        <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5DEC9] text-[11px] uppercase tracking-wider text-[#78726A] bg-[#F5F0E6]/60 font-semibold">
                  <th className="py-3.5 px-5">Material & Brand</th>
                  <th className="py-3.5 px-5 hidden sm:table-cell">Category</th>
                  <th className="py-3.5 px-5 hidden md:table-cell">Thickness & Size</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DEC9]/70 text-xs font-sans">
                {materials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-[#F5F0E6]/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-[#F5F0E6] flex-shrink-0 border border-[#E5DEC9]">
                          <Image
                            src={mat.coverImage || '/brand/logo.png'}
                            alt={mat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-[#141414]">{mat.name}</div>
                          <div className="text-[11px] text-[#C5A15B] font-semibold uppercase tracking-wider">
                            {mat.brand}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 hidden sm:table-cell text-[#78726A]">
                      <span className="px-2.5 py-1 bg-[#F5F0E6] border border-[#E5DEC9] rounded-full text-[11px]">
                        {mat.category}
                      </span>
                    </td>

                    <td className="py-4 px-5 hidden md:table-cell text-[#78726A]">
                      <div>{mat.thickness}</div>
                      <div className="text-[11px] text-[#78726A]/70">{mat.dimensions}</div>
                    </td>

                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleTogglePublish(mat.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          mat.isPublished
                            ? 'bg-[#2E7D5A]/15 text-[#2E7D5A] border border-[#2E7D5A]/30 hover:bg-[#2E7D5A]/20'
                            : 'bg-[#C5A15B]/15 text-[#9E7B36] border border-[#C5A15B]/30 hover:bg-[#C5A15B]/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            mat.isPublished ? 'bg-[#2E7D5A]' : 'bg-[#C5A15B]'
                          }`}
                        />
                        <span>{mat.isPublished ? 'LIVE' : 'DRAFT'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/materials/${mat.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#78726A] hover:text-[#C5A15B] hover:bg-[#F5F0E6] rounded-lg transition-colors"
                          title="View Public Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openEditModal(mat)}
                          className="p-1.5 text-[#78726A] hover:text-[#C5A15B] hover:bg-[#F5F0E6] rounded-lg transition-colors"
                          title="Edit specification"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(mat.id)}
                          className="p-1.5 text-[#78726A] hover:text-[#B43A3A] hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {materials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-xs text-[#78726A]">
                      No materials found in the atelier catalogue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Material Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DEC9]">
              <h2 className="font-bold text-lg text-[#141414]">
                {editingMaterial ? 'Edit Material Specification' : 'Add Material Specification'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Material Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Gurjan Core Marine BWP 710"
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. CenturyPly / Greenlam"
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  >
                    {MATERIAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Thickness
                  </label>
                  <input
                    type="text"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder="e.g. 18mm / 19mm"
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                    Finish / Texture
                  </label>
                  <input
                    type="text"
                    value={finishType}
                    onChange={(e) => setFinishType(e.target.value)}
                    placeholder="e.g. Calibrated Sanded"
                    className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Summary / Technical Overview
                </label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Structural boiling-water-proof calibrated marine plywood engineered for coastal joinery..."
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Technical Specifications Key-Value */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider text-[#78726A] font-semibold">
                    Technical Specifications
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-xs text-[#C5A15B] hover:text-[#141414] flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Spec Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={row.key}
                        onChange={(e) => updateSpecRow(idx, 'key', e.target.value)}
                        placeholder="Feature / Metric (e.g. Glue Line)"
                        className="flex-1 bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-lg px-3 py-1.5 text-xs text-[#141414]"
                      />
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                        placeholder="Rating / Spec (e.g. Unextended Phenolic Resin)"
                        className="flex-1 bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-lg px-3 py-1.5 text-xs text-[#141414]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="p-1.5 text-[#78726A] hover:text-[#B43A3A]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Photo */}
              <div className="pt-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1.5">
                  Material Photographs
                </label>
                <ImageUploader
                  images={galleryImages}
                  onChange={setGalleryImages}
                  allowMultiple={false}
                  maxFiles={1}
                  label="Upload Material Sample"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#141414]">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A15B]"
                  />
                  <span>Published in Catalogue</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#141414]">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A15B]"
                  />
                  <span>Featured Material</span>
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
