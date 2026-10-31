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
  CheckCircle,
  XCircle,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

export default function AdminProjectsPage() {
  const { projects, loading, refresh } = useProjects();
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    if (filter === 'published') return p.isPublished;
    if (filter === 'draft') return !p.isPublished;
    return true;
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
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Portfolio Management"
        subtitle="Create, edit, curate photographic galleries, and publish atelier commissions"
        actionButton={
          <Link
            href="/admin/projects/new"
            className="btn-gold px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-sans flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Project</span>
          </Link>
        }
      />

      <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-colors ${
                filter === 'all'
                  ? 'bg-[#C5A15B] text-[#141414] font-medium'
                  : 'bg-[#1c1c1c] text-[#E9E5DE]/70 hover:text-white'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-colors ${
                filter === 'published'
                  ? 'bg-[#C5A15B] text-[#141414] font-medium'
                  : 'bg-[#1c1c1c] text-[#E9E5DE]/70 hover:text-white'
              }`}
            >
              Published ({projects.filter((p) => p.isPublished).length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans tracking-wide transition-colors ${
                filter === 'draft'
                  ? 'bg-[#C5A15B] text-[#141414] font-medium'
                  : 'bg-[#1c1c1c] text-[#E9E5DE]/70 hover:text-white'
              }`}
            >
              Drafts ({projects.filter((p) => !p.isPublished).length})
            </button>
          </div>

          <div className="text-xs text-[#E9E5DE]/50 font-sans">
            Syncs instantly with public portfolio
          </div>
        </div>

        {/* Project Table / Card List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-[#E9E5DE]/50 font-mono">
            Loading atelier database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#181818] rounded-xl border border-white/5 space-y-3">
            <p className="text-sm font-serif text-[#F5F0E6]">No projects found in this filter.</p>
            <Link
              href="/admin/projects/new"
              className="inline-block btn-gold px-4 py-2 rounded text-xs uppercase tracking-wider"
            >
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="bg-[#181818] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-[#C5A15B] bg-[#141414]/60">
                  <th className="py-3.5 px-4 font-medium">Cover & Title</th>
                  <th className="py-3.5 px-4 font-medium hidden sm:table-cell">Category</th>
                  <th className="py-3.5 px-4 font-medium hidden md:table-cell">Location & Year</th>
                  <th className="py-3.5 px-4 font-medium">Featured</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-sans">
                {filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Cover & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-[#242424] flex-shrink-0 border border-white/10">
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
                            className="font-medium text-[#F5F0E6] hover:text-[#C5A15B] transition-colors truncate block"
                          >
                            {proj.title}
                          </Link>
                          <span className="text-[10px] text-[#E9E5DE]/40 font-mono">
                            /{proj.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#E9E5DE]/80 border border-white/5">
                        {proj.category}
                      </span>
                    </td>

                    {/* Location & Year */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-[#E9E5DE]/70">
                      <div>{proj.location}</div>
                      <div className="text-[10px] text-[#E9E5DE]/40">{proj.year}</div>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(proj.id)}
                        className={`p-1.5 rounded transition-colors ${
                          proj.isFeatured
                            ? 'text-[#C5A15B] hover:text-amber-300'
                            : 'text-white/20 hover:text-white/60'
                        }`}
                        title={proj.isFeatured ? 'Featured on Homepage' : 'Mark as Featured'}
                      >
                        <Star className={`w-4 h-4 ${proj.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(proj.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          proj.isPublished
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        {proj.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {proj.isPublished && (
                          <Link
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            title="Preview on Public Website"
                            className="p-1.5 text-white/50 hover:text-[#C5A15B] rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}

                        <Link
                          href={`/admin/projects/${proj.id}`}
                          title="Edit Project"
                          className="p-1.5 text-white/50 hover:text-white rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteConfirmId(proj.id)}
                          title="Delete Project"
                          className="p-1.5 text-red-400/60 hover:text-red-400 rounded"
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
        )}
      </div>

      {/* Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#181818] border border-red-900/50 p-6 rounded-xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-medium">Delete Commission?</h3>
            </div>
            <p className="text-xs text-[#E9E5DE]/75 leading-relaxed">
              Are you sure you want to remove this project from the atelier archive? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded text-xs text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-medium"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

