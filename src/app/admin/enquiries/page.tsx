'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useEnquiries } from '@/hooks/useDataServices';
import { enquiryService } from '@/services/enquiry.service';
import { Enquiry, EnquiryStatus } from '@/types/enquiry.types';
import { Mail, Phone, Calendar, Trash2, CheckCircle2, Clock, AlertCircle, X, ExternalLink } from 'lucide-react';

export default function AdminEnquiriesPage() {
  const { enquiries, loading, refresh } = useEnquiries();
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const filtered = enquiries.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    await enquiryService.updateStatus(id, status);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status });
    }
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this enquiry record?')) {
      await enquiryService.delete(id);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      refresh();
    }
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
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen font-sans">
      <AdminHeader
        title="Commission Enquiries"
        subtitle="Review, categorize, and follow up with prospective clients and interior patrons"
      />

      <div className="p-6 sm:p-10 space-y-6 max-w-[1500px] w-full mx-auto font-sans">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'new', 'contacted', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-1.5 rounded-full text-xs font-sans capitalize transition-all ${
                filter === st
                  ? 'bg-[#141414] text-[#FAF7F0] font-semibold shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#E5DEC9] text-[#78726A] hover:text-[#141414] hover:border-[#C5A15B]/40'
              }`}
            >
              {st} ({enquiries.filter((e) => (st === 'all' ? true : e.status === st)).length})
            </button>
          ))}
        </div>

        {/* Enquiries Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-[#78726A]">
            Loading commission enquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#FFFFFF] rounded-2xl border border-[#E5DEC9] p-8 space-y-2">
            <p className="text-base font-semibold text-[#141414]">No enquiries in this filter.</p>
            <p className="text-xs text-[#78726A]">
              New submissions on the public contact form will automatically arrive here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filtered.map((enq) => (
              <div
                key={enq.id}
                className="bg-[#FFFFFF] border border-[#E5DEC9] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#C5A15B] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#C5A15B]/20 text-[#9E7B36] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {getInitials(enq.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-[#141414] leading-snug">
                          {enq.name}
                        </h3>
                        <div className="text-[11px] text-[#C5A15B] font-semibold">
                          {enq.projectType}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                        enq.status === 'new'
                          ? 'bg-[#C5A15B]/20 text-[#9E7B36] border border-[#C5A15B]/30'
                          : enq.status === 'contacted'
                          ? 'bg-[#E5DEC9]/80 text-[#78726A]'
                          : 'bg-[#2E7D5A]/15 text-[#2E7D5A] border border-[#2E7D5A]/30'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  {enq.budgetRange && (
                    <div className="text-xs text-[#78726A] bg-[#F5F0E6] border border-[#E5DEC9] px-2.5 py-1 rounded-lg inline-block">
                      Budget: <span className="text-[#141414] font-semibold">{enq.budgetRange}</span>
                    </div>
                  )}

                  <p className="text-xs text-[#141414]/80 leading-relaxed line-clamp-3 bg-[#F5F0E6]/50 p-3 rounded-xl border border-[#E5DEC9]/60">
                    {enq.message}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#78726A] pt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C5A15B]" />
                      <a href={`mailto:${enq.email}`} className="hover:text-[#141414] transition-colors truncate">
                        {enq.email}
                      </a>
                    </div>
                    {enq.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#C5A15B]" />
                        <a href={`tel:${enq.phone}`} className="hover:text-[#141414] transition-colors">
                          {enq.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-[#78726A]/80">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status Switcher & Delete */}
                <div className="pt-3 border-t border-[#E5DEC9]/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['new', 'contacted', 'completed'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(enq.id, st)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans capitalize transition-all ${
                          enq.status === st
                            ? 'bg-[#C5A15B] text-[#141414] border border-[#C5A15B] font-semibold'
                            : 'bg-white border border-[#E5DEC9] text-[#78726A] hover:text-[#141414]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-1.5 text-[#78726A] hover:text-[#B43A3A] hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
