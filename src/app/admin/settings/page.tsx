'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Logo } from '@/components/shared/Logo';
import { authService, DEMO_CREDENTIALS } from '@/services/auth.service';
import { storageService } from '@/lib/storage/storage.service';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleResetData = () => {
    storageService.resetAllToDefaults();
    setResetConfirm(false);
    setResetDone(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Studio Settings & System Architecture"
        subtitle="Brand identity preservation, session management, and mock database parameters"
      />

      <div className="p-8 space-y-8 max-w-4xl w-full mx-auto font-sans">
        {/* Brand Identity Verification */}
        <div className="bg-[#181818] border border-[#C5A15B]/30 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A15B] font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Preserved Client Brand Identity</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#141414] rounded-lg border border-white/10">
            <div className="relative w-28 h-28 flex-shrink-0 bg-transparent flex items-center justify-center">
              <Image
                src="/brand/logo.png"
                alt="Heaven Interiors Official Brand Mark"
                width={112}
                height={112}
                className="object-contain"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="font-heading text-xl text-[#F5F0E6]">
                HEAVEN INTERIORS
              </div>
              <p className="text-xs text-[#E9E5DE]/70 leading-relaxed">
                Official circular brand monogram featuring warm ivory/marble core, dimensional architectural gold border, and blue-to-purple gradient detailing.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                <span className="text-[10px] bg-[#C5A15B]/20 text-[#C5A15B] px-2.5 py-0.5 rounded border border-[#C5A15B]/30 font-mono">
                  Gold: #C5A15B
                </span>
                <span className="text-[10px] bg-[#F5F0E6]/10 text-[#F5F0E6] px-2.5 py-0.5 rounded border border-white/20 font-mono">
                  Ivory: #F5F0E6
                </span>
                <span className="text-[10px] bg-[#1265B3]/20 text-blue-300 px-2.5 py-0.5 rounded border border-blue-500/30 font-mono">
                  Royal Blue: #1265B3
                </span>
                <span className="text-[10px] bg-[#492080]/30 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30 font-mono">
                  Deep Purple: #492080
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Account Parameters */}
        <div className="bg-[#181818] border border-white/10 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-[#C5A15B] font-medium">
            Active Administrative Session
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#141414] rounded-lg border border-white/5 space-y-1">
              <span className="text-[#E9E5DE]/50 uppercase tracking-widest text-[10px]">
                Authenticated User
              </span>
              <div className="text-[#F5F0E6] font-medium">Studio Principal</div>
              <div className="text-[11px] text-[#C5A15B]">{DEMO_CREDENTIALS.email}</div>
            </div>

            <div className="p-4 bg-[#141414] rounded-lg border border-white/5 space-y-1">
              <span className="text-[#E9E5DE]/50 uppercase tracking-widest text-[10px]">
                Storage Mode
              </span>
              <div className="text-emerald-400 font-medium">LocalStorage Service Repository</div>
              <div className="text-[11px] text-[#E9E5DE]/60">Client-Side Reactive Synchronization</div>
            </div>
          </div>
        </div>

        {/* Reset Database / Factory Restore */}
        <div className="bg-[#181818] border border-white/10 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-red-400 font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Reset Database to Initial Mock Dataset</span>
          </h3>
          <p className="text-xs text-[#E9E5DE]/70 leading-relaxed">
            Restores all projects, films, materials, services, testimonials, and copy back to pristine initial demonstration state.
          </p>

          {resetDone ? (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs rounded flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Data restored! Reloading application...</span>
            </div>
          ) : resetConfirm ? (
            <div className="p-4 bg-red-950/30 border border-red-800 rounded-lg space-y-3">
              <div className="text-xs text-red-200 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Confirm Database Reset: This will overwrite any custom edits.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 border border-red-800 text-red-400 hover:bg-red-950/30 rounded text-xs font-medium transition-colors"
            >
              Reset to Factory Demo State
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

