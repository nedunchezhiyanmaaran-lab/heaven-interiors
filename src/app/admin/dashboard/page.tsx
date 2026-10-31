'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  useProjects,
  useVideos,
  useMaterials,
  useEnquiries
} from '@/hooks/useDataServices';
import { projectService } from '@/services/project.service';
import { enquiryService } from '@/services/enquiry.service';
import { useAdminUI } from '@/app/admin/layout';
import {
  Layers,
  PlayCircle,
  LayoutGrid,
  Mail,
  Plus,
  ArrowRight,
  ExternalLink,
  User,
  ChevronDown,
  Sliders,
  MoreHorizontal,
  Menu
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { toggleMobileNav } = useAdminUI();
  const { projects, refresh: refreshProjects } = useProjects();
  const { videos } = useVideos();
  const { materials } = useMaterials();
  const { enquiries, refresh: refreshEnquiries } = useEnquiries();

  // Dynamic calculations from LocalStorage
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.isPublished).length;
  const draftProjects = totalProjects - publishedProjects;
  const totalVideos = videos.length;
  const totalMaterials = materials.length;
  const totalEnquiries = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const handleEnquiryStatus = async (id: string, status: 'new' | 'contacted' | 'completed') => {
    await enquiryService.updateStatus(id, status);
    refreshEnquiries();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen relative overflow-x-hidden font-sans">
      {/* Subtle architectural ambient shadow at the top right */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] pointer-events-none opacity-20 overflow-hidden hidden md:block">
        <Image
          src="/reference_assets/photo_handover_hd.jpg"
          alt="Architectural Ambient Light"
          fill
          className="object-cover object-top filter blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#F5F0E6]/80 to-[#F5F0E6]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F5F0E6]/80 to-[#F5F0E6]" />
      </div>

      {/* Top Header / Welcome Bar */}
      <div className="relative z-10 px-6 sm:px-10 pt-8 pb-6 border-b border-[#E5DEC9] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobileNav}
            className="lg:hidden p-2 rounded-lg text-[#141414] hover:bg-[#E5DEC9]/50 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A15B] mb-1">
              STUDIO CMS
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141414] tracking-tight">
              Welcome back, Studio Principal
            </h1>
            <p className="text-xs sm:text-sm text-[#78726A] font-sans mt-1">
              Manage your projects, media, materials and client enquiries.
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <Link
            href="/admin/projects/new"
            className="bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="border border-[#E5DEC9] bg-[#FFFFFF] hover:border-[#C5A15B]/50 hover:text-[#C5A15B] text-[#141414] px-3.5 py-2.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#78726A]" />
          </Link>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5DEC9]">
            <div className="w-8 h-8 rounded-full bg-[#C5A15B]/15 text-[#C5A15B] flex items-center justify-center font-medium">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-[#141414] leading-tight">
                Studio Principal
              </div>
              <div className="text-[9px] text-[#78726A] uppercase font-semibold tracking-wider">
                STUDIO PRINCIPAL
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#78726A] hidden xl:block" />
          </div>
        </div>
      </div>

      {/* Main Dashboard Canvas */}
      <div className="p-6 sm:p-10 space-y-6 sm:space-y-7 max-w-[1500px] w-full mx-auto relative z-10">
        {/* ROW 1: 4 STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Portfolio Projects with warm architectural photo background */}
          <div className="relative rounded-2xl overflow-hidden p-5 shadow-sm min-h-[145px] flex flex-col justify-between text-[#FAF7F0] bg-[#141414] border border-[#222222]">
            <Image
              src="/brand/curtain_texture.jpg"
              alt="Architectural Portfolio"
              fill
              className="object-cover opacity-30 transform scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#141414]/60 to-black/40" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#FAF7F0]/90">
                <Layers className="w-4 h-4 text-[#DFC488]" />
                <span>Portfolio Projects</span>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-4xl font-extrabold tracking-tight text-[#FAF7F0]">
                {totalProjects}
              </div>
              <div className="text-xs text-[#FAF7F0]/75 font-sans mt-1">
                {publishedProjects} Published · {draftProjects} Drafts
              </div>
            </div>
          </div>

          {/* Card 2: Documentary Films */}
          <Link
            href="/admin/videos"
            className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[145px] group hover:border-[#C5A15B] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#141414]">
                <PlayCircle className="w-4 h-4 text-[#78726A]" />
                <span>Documentary Films</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#78726A] group-hover:translate-x-0.5 group-hover:text-[#C5A15B] transition-all" />
            </div>

            <div>
              <div className="text-4xl font-extrabold tracking-tight text-[#141414]">
                {totalVideos}
              </div>
              <div className="text-xs text-[#78726A] font-sans mt-1">
                {videos.filter((v) => v.isPublished).length} Active in Public Showcase
              </div>
            </div>
          </Link>

          {/* Card 3: Plywood & Materials */}
          <Link
            href="/admin/materials"
            className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[145px] group hover:border-[#C5A15B] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#141414]">
                <LayoutGrid className="w-4 h-4 text-[#78726A]" />
                <span>Plywood & Materials</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#78726A] group-hover:translate-x-0.5 group-hover:text-[#C5A15B] transition-all" />
            </div>

            <div>
              <div className="text-4xl font-extrabold tracking-tight text-[#141414]">
                {totalMaterials}
              </div>
              <div className="text-xs text-[#78726A] font-sans mt-1">
                Substrates & Veneer Catalogue
              </div>
            </div>
          </Link>

          {/* Card 4: Client Enquiries */}
          <Link
            href="/admin/enquiries"
            className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[145px] group hover:border-[#C5A15B] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#141414]">
                <Mail className="w-4 h-4 text-[#78726A]" />
                <span>Client Enquiries</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#78726A] group-hover:translate-x-0.5 group-hover:text-[#C5A15B] transition-all" />
            </div>

            <div>
              <div className="text-4xl font-extrabold tracking-tight text-[#141414]">
                {totalEnquiries}
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#C5A15B]/15 text-[#9E7B36] border border-[#C5A15B]/30 text-xs font-semibold">
                  {newEnquiriesCount} Pending Review
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* ROW 2: 4 QUICK ACTION BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/admin/projects/new"
            className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-xl p-3 sm:p-3.5 flex items-center justify-center gap-2.5 text-xs font-medium text-[#141414] hover:border-[#C5A15B] hover:text-[#C5A15B] hover:shadow-sm transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-[#F5F0E6] flex items-center justify-center text-[#141414] group-hover:bg-[#C5A15B]/20 group-hover:text-[#C5A15B] transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>New Project</span>
          </Link>

          <Link
            href="/admin/videos"
            className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-xl p-3 sm:p-3.5 flex items-center justify-center gap-2.5 text-xs font-medium text-[#141414] hover:border-[#C5A15B] hover:text-[#C5A15B] hover:shadow-sm transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-[#F5F0E6] flex items-center justify-center text-[#141414] group-hover:bg-[#C5A15B]/20 group-hover:text-[#C5A15B] transition-colors">
              <PlayCircle className="w-3.5 h-3.5" />
            </div>
            <span>Manage Films</span>
          </Link>

          <Link
            href="/admin/materials"
            className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-xl p-3 sm:p-3.5 flex items-center justify-center gap-2.5 text-xs font-medium text-[#141414] hover:border-[#C5A15B] hover:text-[#C5A15B] hover:shadow-sm transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-[#F5F0E6] flex items-center justify-center text-[#141414] group-hover:bg-[#C5A15B]/20 group-hover:text-[#C5A15B] transition-colors">
              <LayoutGrid className="w-3.5 h-3.5" />
            </div>
            <span>Add Material</span>
          </Link>

          <Link
            href="/admin/website-content"
            className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-xl p-3 sm:p-3.5 flex items-center justify-center gap-2.5 text-xs font-medium text-[#141414] hover:border-[#C5A15B] hover:text-[#C5A15B] hover:shadow-sm transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-[#F5F0E6] flex items-center justify-center text-[#141414] group-hover:bg-[#C5A15B]/20 group-hover:text-[#C5A15B] transition-colors">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span>Edit Copy / Hero</span>
          </Link>
        </div>

        {/* ROW 3: TWO MAIN SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
          {/* LEFT: Recent Commission Enquiries */}
          <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5DEC9]/80">
                <h2 className="font-bold text-base sm:text-lg text-[#141414] tracking-tight flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#78726A]" />
                  <span>Recent Commission Enquiries</span>
                </h2>
                <Link
                  href="/admin/enquiries"
                  className="text-xs text-[#78726A] hover:text-[#141414] flex items-center gap-1 font-medium transition-colors"
                >
                  <span>View All ({totalEnquiries})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Enquiry List */}
              <div className="divide-y divide-[#E5DEC9]/60">
                {enquiries.slice(0, 3).map((enquiry) => (
                  <div key={enquiry.id} className="py-4.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C5A15B]/20 text-[#9E7B36] font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {getInitials(enquiry.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#141414]">
                              {enquiry.name}
                            </span>
                            {enquiry.status === 'new' && (
                              <span className="bg-[#C5A15B]/20 text-[#9E7B36] border border-[#C5A15B]/30 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">
                                NEW
                              </span>
                            )}
                            {enquiry.status === 'contacted' && (
                              <span className="bg-[#E5DEC9]/80 text-[#78726A] px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">
                                CONTACTED
                              </span>
                            )}
                            {enquiry.status === 'completed' && (
                              <span className="bg-[#2E7D5A]/15 text-[#2E7D5A] border border-[#2E7D5A]/30 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">
                                COMPLETED
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#78726A] font-sans mt-0.5">
                            {enquiry.projectType || 'Interior Commission'} · {enquiry.budgetRange || 'Custom Budget'}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#78726A] font-sans flex-shrink-0">
                        {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    <p className="text-xs text-[#141414]/80 leading-relaxed font-sans line-clamp-2 pl-11">
                      {enquiry.message}
                    </p>

                    {/* Quick Status Buttons */}
                    <div className="flex items-center gap-2 pl-11 pt-1">
                      {(['new', 'contacted', 'completed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleEnquiryStatus(enquiry.id, st)}
                          className={`px-3 py-1 rounded-full text-[11px] font-sans capitalize transition-all ${
                            enquiry.status === st
                              ? 'bg-[#C5A15B] text-[#141414] border border-[#C5A15B] font-semibold shadow-xs'
                              : 'bg-white border border-[#E5DEC9] text-[#78726A] hover:text-[#141414] hover:border-[#C5A15B]/40'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {enquiries.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#78726A]">
                    No client enquiries yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Portfolio Works */}
          <div className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5DEC9]/80">
                <h2 className="font-bold text-base sm:text-lg text-[#141414] tracking-tight flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#78726A]" />
                  <span>Portfolio Works</span>
                </h2>
                <Link
                  href="/admin/projects"
                  className="text-xs text-[#78726A] hover:text-[#141414] flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Manage All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Project List */}
              <div className="divide-y divide-[#E5DEC9]/60">
                {projects.slice(0, 4).map((project) => (
                  <div key={project.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-16 h-12 rounded-lg overflow-hidden relative flex-shrink-0 border border-[#E5DEC9] bg-[#F5F0E6]">
                        <Image
                          src={project.coverImage || '/reference_assets/photo_handover_hd.jpg'}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="font-semibold text-sm text-[#141414] hover:text-[#C5A15B] transition-colors truncate block"
                        >
                          {project.title}
                        </Link>
                        <div className="text-xs text-[#78726A] font-sans truncate mt-0.5">
                          {project.category} · {project.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {project.isPublished ? (
                        <span className="bg-[#2E7D5A]/15 text-[#2E7D5A] border border-[#2E7D5A]/30 rounded-full px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5A]" />
                          <span>LIVE</span>
                        </span>
                      ) : (
                        <span className="bg-[#C5A15B]/15 text-[#9E7B36] border border-[#C5A15B]/30 rounded-full px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15B]" />
                          <span>DRAFT</span>
                        </span>
                      )}

                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-1.5 text-[#78726A] hover:text-[#C5A15B] hover:bg-[#F5F0E6] rounded transition-colors"
                        title="Edit project"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#78726A]">
                    No portfolio works found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
