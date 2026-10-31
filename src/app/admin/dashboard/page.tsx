'use client';

import React from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  useProjects,
  useVideos,
  useMaterials,
  useEnquiries
} from '@/hooks/useDataServices';
import { projectService } from '@/services/project.service';
import { enquiryService } from '@/services/enquiry.service';
import {
  FolderKanban,
  Film,
  Layers,
  Mail,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sliders
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { projects, refresh: refreshProjects } = useProjects();
  const { videos } = useVideos();
  const { materials } = useMaterials();
  const { enquiries, refresh: refreshEnquiries } = useEnquiries();

  // Dynamic calculations
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.isPublished).length;
  const draftProjects = totalProjects - publishedProjects;
  const totalVideos = videos.length;
  const totalMaterials = materials.length;
  const totalEnquiries = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const handleTogglePublish = async (id: string) => {
    await projectService.togglePublish(id);
    refreshProjects();
  };

  const handleEnquiryStatus = async (id: string, status: any) => {
    await enquiryService.updateStatus(id, status);
    refreshEnquiries();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Studio CMS Overview"
        subtitle="Real-time synchronized atelier content metrics and active client enquiries"
        actionButton={
          <Link
            href="/admin/projects/new"
            className="btn-gold px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-sans flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </Link>
        }
      />

      <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Projects Metric */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-[#C5A15B]">
              <span className="text-xs uppercase tracking-wider font-sans font-medium">
                Portfolio Projects
              </span>
              <FolderKanban className="w-4 h-4" />
            </div>
            <div className="text-3xl font-serif font-light text-[#F5F0E6]">
              {totalProjects}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#E9E5DE]/60 font-sans">
              <span className="text-emerald-400 font-medium">{publishedProjects} Published</span>
              <span>•</span>
              <span className="text-amber-400">{draftProjects} Drafts</span>
            </div>
          </div>

          {/* Videos Metric */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-[#C5A15B]">
              <span className="text-xs uppercase tracking-wider font-sans font-medium">
                Documentary Films
              </span>
              <Film className="w-4 h-4" />
            </div>
            <div className="text-3xl font-serif font-light text-[#F5F0E6]">
              {totalVideos}
            </div>
            <div className="text-[11px] text-[#E9E5DE]/60 font-sans">
              {videos.filter((v) => v.isPublished).length} Active in Public Showcase
            </div>
          </div>

          {/* Materials Metric */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-[#C5A15B]">
              <span className="text-xs uppercase tracking-wider font-sans font-medium">
                Plywood & Materials
              </span>
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-3xl font-serif font-light text-[#F5F0E6]">
              {totalMaterials}
            </div>
            <div className="text-[11px] text-[#E9E5DE]/60 font-sans">
              Substrates & Veneer Catalogue
            </div>
          </div>

          {/* Enquiries Metric */}
          <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-[#C5A15B]">
              <span className="text-xs uppercase tracking-wider font-sans font-medium">
                Client Enquiries
              </span>
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-3xl font-serif font-light text-[#F5F0E6]">
              {totalEnquiries}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-sans">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                {newEnquiriesCount} Pending Review
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/projects/new"
            className="p-4 bg-[#181818] border border-white/10 hover:border-[#C5A15B]/50 rounded-lg flex items-center gap-3 group transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#C5A15B]/20 text-[#C5A15B] flex items-center justify-center group-hover:bg-[#C5A15B] group-hover:text-[#141414] transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium text-[#F5F0E6]">New Project</div>
          </Link>

          <Link
            href="/admin/videos"
            className="p-4 bg-[#181818] border border-white/10 hover:border-[#C5A15B]/50 rounded-lg flex items-center gap-3 group transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#C5A15B]/20 text-[#C5A15B] flex items-center justify-center group-hover:bg-[#C5A15B] group-hover:text-[#141414] transition-colors">
              <Film className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium text-[#F5F0E6]">Manage Films</div>
          </Link>

          <Link
            href="/admin/materials"
            className="p-4 bg-[#181818] border border-white/10 hover:border-[#C5A15B]/50 rounded-lg flex items-center gap-3 group transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#C5A15B]/20 text-[#C5A15B] flex items-center justify-center group-hover:bg-[#C5A15B] group-hover:text-[#141414] transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium text-[#F5F0E6]">Add Material</div>
          </Link>

          <Link
            href="/admin/website-content"
            className="p-4 bg-[#181818] border border-white/10 hover:border-[#C5A15B]/50 rounded-lg flex items-center gap-3 group transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#C5A15B]/20 text-[#C5A15B] flex items-center justify-center group-hover:bg-[#C5A15B] group-hover:text-[#141414] transition-colors">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium text-[#F5F0E6]">Edit Copy / Hero</div>
          </Link>
        </div>

        {/* Two-Column Grid: Recent Enquiries & Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Enquiries (7 cols) */}
          <div className="lg:col-span-7 bg-[#181818] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A15B]" />
                <h3 className="text-sm font-sans uppercase tracking-wider text-[#F5F0E6] font-medium">
                  Recent Commission Enquiries
                </h3>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs text-[#C5A15B] hover:underline"
              >
                View All ({totalEnquiries}) →
              </Link>
            </div>

            {enquiries.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#E9E5DE]/50 font-sans">
                No client enquiries logged yet. Submissions on the contact form will appear here live.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {enquiries.slice(0, 4).map((enq) => (
                  <div key={enq.id} className="py-4 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-[#F5F0E6] flex items-center gap-2">
                          <span>{enq.name}</span>
                          <span
                            className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${
                              enq.status === 'new'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : enq.status === 'contacted'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#C5A15B] font-sans mt-0.5">
                          {enq.projectType} • {enq.budgetRange}
                        </div>
                      </div>

                      <div className="text-[11px] text-[#E9E5DE]/40 font-mono">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-xs text-[#E9E5DE]/75 font-sans line-clamp-2">
                      {enq.message}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-[#E9E5DE]/40">Quick Status:</span>
                      <button
                        onClick={() => handleEnquiryStatus(enq.id, 'new')}
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          enq.status === 'new'
                            ? 'border-amber-400 text-amber-300 font-bold'
                            : 'border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        New
                      </button>
                      <button
                        onClick={() => handleEnquiryStatus(enq.id, 'contacted')}
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          enq.status === 'contacted'
                            ? 'border-blue-400 text-blue-300 font-bold'
                            : 'border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => handleEnquiryStatus(enq.id, 'completed')}
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          enq.status === 'completed'
                            ? 'border-emerald-400 text-emerald-300 font-bold'
                            : 'border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio Projects (5 cols) */}
          <div className="lg:col-span-5 bg-[#181818] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#C5A15B]" />
                <h3 className="text-sm font-sans uppercase tracking-wider text-[#F5F0E6] font-medium">
                  Portfolio Works
                </h3>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs text-[#C5A15B] hover:underline"
              >
                Manage All →
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {projects.slice(0, 5).map((proj) => (
                <div
                  key={proj.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs font-sans"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[#F5F0E6] truncate hover:text-[#C5A15B]">
                      <Link href={`/admin/projects/${proj.id}`}>{proj.title}</Link>
                    </div>
                    <div className="text-[11px] text-[#E9E5DE]/50">
                      {proj.category} • {proj.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublish(proj.id)}
                      className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                        proj.isPublished
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {proj.isPublished ? 'Live' : 'Draft'}
                    </button>

                    <Link
                      href={`/projects/${proj.slug}`}
                      target="_blank"
                      className="p-1 text-white/50 hover:text-[#C5A15B]"
                      title="View on public site"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

