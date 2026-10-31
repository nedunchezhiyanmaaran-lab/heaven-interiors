'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useProjects } from '@/hooks/useDataServices';
import { projectService } from '@/services/project.service';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Search,
  ExternalLink,
  AlertTriangle,
  X
} from 'lucide-react';

export default function AdminProjectsPage() {
  const { projects, loading, refresh } = useProjects();
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'published'
        ? p.isPublished
        : !p.isPublished;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleTogglePublish = async (id: string) => {
    await projectService.togglePublish(id);
    refresh();
  };

  const handleToggleFeatured = async (id: string) => {
    await projectService.toggleFeatured(id);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await projectService.delete(id);
    setDeleteConfirmId(null);
    refresh();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen font-sans">
      <AdminHeader
        title="Portfolio Projects"
        subtitle="Create, curate architectural photographs, and publish commissions to the public showcase"
        actionButton={
          <Link
            href="/admin/projects/new"
            className="bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </Link>
        }
      />

      <div className="p-6 sm:p-10 space-y-6 max-w-[1500px] w-full mx-auto">
        {/* Controls Bar: Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all ${
                filter === 'all'
                  ? 'bg-[#141414] text-[#FAF7F0] font-semibold shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#E5DEC9] text-[#78726A] hover:text-[#141414] hover:border-[#C5A15B]/40'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all ${
                filter === 'published'
                  ? 'bg-[#141414] text-[#FAF7F0] font-semibold shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#E5DEC9] text-[#78726A] hover:text-[#141414] hover:border-[#C5A15B]/40'
              }`}
            >
              Published ({projects.filter((p) => p.isPublished).length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all ${
                filter === 'draft'
                  ? 'bg-[#141414] text-[#FAF7F0] font-semibold shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#E5DEC9] text-[#78726A] hover:text-[#141414] hover:border-[#C5A15B]/40'
              }`}
            >
              Drafts ({projects.filter((p) => !p.isPublished).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, category, city..."
              className="w-full bg-[#FFFFFF] border border-[#E5DEC9] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#141414] placeholder:text-[#78726A] focus:border-[#C5A15B] focus:outline-none shadow-xs transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#78726A] absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#78726A] hover:text-[#141414]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Project Table List */}
        {loading ? (
          <div className="py-24 text-center text-xs text-[#78726A] font-sans">
            Loading architectural portfolio...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#FFFFFF] rounded-2xl border border-[#E5DEC9] p-8 space-y-3">
            <p className="text-base font-semibold text-[#141414]">No projects found matching your query.</p>
            <p className="text-xs text-[#78726A]">Try clearing your search or filter.</p>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5DEC9] text-[11px] uppercase tracking-wider text-[#78726A] bg-[#F5F0E6]/60 font-semibold">
                    <th className="py-3.5 px-5">Project Details</th>
                    <th className="py-3.5 px-5 hidden sm:table-cell">Category</th>
                    <th className="py-3.5 px-5 hidden md:table-cell">Location & Year</th>
                    <th className="py-3.5 px-5">Featured</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DEC9]/70 text-xs font-sans">
                  {filtered.map((proj) => (
                    <tr key={proj.id} className="hover:bg-[#F5F0E6]/40 transition-colors">
                      {/* Cover & Title */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-[#F5F0E6] flex-shrink-0 border border-[#E5DEC9]">
                            <Image
                              src={proj.coverImage || '/brand/logo.png'}
                              alt={proj.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/projects/${proj.id}`}
                              className="font-semibold text-sm text-[#141414] hover:text-[#C5A15B] transition-colors truncate block"
                            >
                              {proj.title}
                            </Link>
                            <span className="text-[11px] text-[#78726A]">
                              /{proj.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-5 hidden sm:table-cell text-[#78726A]">
                        <span className="px-2.5 py-1 bg-[#F5F0E6] border border-[#E5DEC9] rounded-full text-[11px]">
                          {proj.category}
                        </span>
                      </td>

                      {/* Location & Year */}
                      <td className="py-4 px-5 hidden md:table-cell text-[#78726A]">
                        <div>{proj.location}</div>
                        <div className="text-[11px] text-[#78726A]/70">{proj.year || '2024'}</div>
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleToggleFeatured(proj.id)}
                          className={`p-1.5 rounded-full transition-colors ${
                            proj.isFeatured
                              ? 'text-[#C5A15B] bg-[#C5A15B]/15'
                              : 'text-[#78726A]/40 hover:text-[#C5A15B]'
                          }`}
                          title={proj.isFeatured ? 'Featured on home' : 'Mark as featured'}
                        >
                          <Star className={`w-4 h-4 ${proj.isFeatured ? 'fill-[#C5A15B]' : ''}`} />
                        </button>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleTogglePublish(proj.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            proj.isPublished
                              ? 'bg-[#2E7D5A]/15 text-[#2E7D5A] border border-[#2E7D5A]/30 hover:bg-[#2E7D5A]/25'
                              : 'bg-[#C5A15B]/15 text-[#9E7B36] border border-[#C5A15B]/30 hover:bg-[#C5A15B]/25'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              proj.isPublished ? 'bg-[#2E7D5A]' : 'bg-[#C5A15B]'
                            }`}
                          />
                          <span>{proj.isPublished ? 'LIVE' : 'DRAFT'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#78726A] hover:text-[#C5A15B] hover:bg-[#F5F0E6] rounded-lg transition-colors"
                            title="Preview on live site"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/projects/${proj.id}`}
                            className="p-1.5 text-[#78726A] hover:text-[#C5A15B] hover:bg-[#F5F0E6] rounded-lg transition-colors"
                            title="Edit project"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeleteConfirmId(proj.id)}
                            className="p-1.5 text-[#78726A] hover:text-[#B43A3A] hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete project"
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
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#B43A3A] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#141414]">Delete Project</h3>
                <p className="text-xs text-[#78726A] mt-1">
                  Are you sure you want to delete this commission? This action removes it from the public portfolio.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-full border border-[#E5DEC9] text-[#78726A] hover:text-[#141414] text-xs font-sans"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-full bg-[#B43A3A] text-white hover:bg-red-700 text-xs font-sans font-semibold shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
