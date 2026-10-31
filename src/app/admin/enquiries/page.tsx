'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useEnquiries } from '@/hooks/useDataServices';
import { enquiryService } from '@/services/enquiry.service';
import { Enquiry, EnquiryStatus } from '@/types/enquiry.types';
import { Mail, Phone, Calendar, Trash2, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';

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

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Commission Enquiries"
        subtitle="Manage prospective patron inquiries submitted through the contact portal"
      />

      <div className="p-8 space-y-6 max-w-7xl w-full mx-auto font-sans">
        {/* Filters */}
        <div className="flex items-center gap-2">
          {(['all', 'new', 'contacted', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs tracking-wide uppercase transition-colors ${
                filter === st
                  ? 'bg-[#C5A15B] text-[#141414] font-medium'
                  : 'bg-[#1c1c1c] text-[#E9E5DE]/70 hover:text-white'
              }`}
            >
              {st} ({enquiries.filter((e) => (st === 'all' ? true : e.status === st)).length})
            </button>
          ))}
        </div>

        {/* Enquiries List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-[#E9E5DE]/50 font-mono">
            Loading enquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#181818] rounded-xl border border-white/5 space-y-2">
            <p className="text-sm font-serif text-[#F5F0E6]">No enquiries in this status filter.</p>
            <p className="text-xs text-[#E9E5DE]/50">
              New submissions on the public contact form will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((enq) => (
              <div
                key={enq.id}
                className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-[#C5A15B]/30 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-serif text-[#F5F0E6] font-medium">
                        {enq.name}
                      </h3>
                      <div className="text-[11px] text-[#C5A15B] font-mono mt-0.5">
                        {enq.projectType}
                      </div>
                    </div>

                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                        enq.status === 'new'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : enq.status === 'contacted'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  {enq.budgetRange && (
                    <div className="text-xs text-[#E9E5DE]/70 bg-white/5 px-2.5 py-1 rounded inline-block">
                      Budget: <span className="text-[#F5F0E6] font-medium">{enq.budgetRange}</span>
                    </div>
                  )}

                  <p className="text-xs text-[#E9E5DE]/75 leading-relaxed line-clamp-3 bg-[#141414] p-3 rounded border border-white/5">
                    {enq.message}
                  </p>

                  <div className="space-y-1 text-xs text-[#E9E5DE]/65 pt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C5A15B]" />
                      <a href={`mailto:${enq.email}`} className="hover:underline">
                        {enq.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C5A15B]" />
                      <a href={`tel:${enq.phone}`} className="hover:underline">
                        {enq.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 pt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(enq.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status Switcher & Delete */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {(['new', 'contacted', 'completed'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(enq.id, s)}
                        className={`text-[9px] uppercase px-2 py-0.5 rounded border transition-colors ${
                          enq.status === s
                            ? 'border-[#C5A15B] text-[#C5A15B] font-bold bg-[#C5A15B]/10'
                            : 'border-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-1.5 text-red-400/60 hover:text-red-400"
                    title="Delete Record"
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

