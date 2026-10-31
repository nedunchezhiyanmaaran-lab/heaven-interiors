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
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen">
      <AdminHeader
        title="Studio Settings"
        subtitle="Brand identity preservation, session management, and mock database parameters"
      />

      <div className="p-6 sm:p-10 space-y-6 max-w-4xl w-full mx-auto font-admin">
        {/* Brand Identity Verification */}
        <div className="bg-white border border-[#E5DEC9] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A15B] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Preserved Client Brand Identity</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#FAF7F0] rounded-xl border border-[#E5DEC9]">
            <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/brand/logo.png"
                alt="Heaven Interiors Official Brand Mark"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="font-bold text-xl text-[#141414] tracking-tight">
                HEAVEN INTERIORS
              </div>
              <p className="text-xs text-[#78726A] leading-relaxed font-normal">
                Official circular brand monogram featuring warm ivory core, dimensional architectural gold border, and blue-to-purple gradient detailing.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                <span className="text-[10px] bg-white text-[#C5A15B] px-2.5 py-0.5 rounded-full border border-[#E5DEC9] font-medium">
                  Gold: #C5A15B
                </span>
                <span className="text-[10px] bg-white text-[#141414] px-2.5 py-0.5 rounded-full border border-[#E5DEC9] font-medium">
                  Ivory: #F5F0E6
                </span>
                <span className="text-[10px] bg-white text-[#1265B3] px-2.5 py-0.5 rounded-full border border-[#E5DEC9] font-medium">
                  Royal Blue: #1265B3
                </span>
                <span className="text-[10px] bg-white text-[#492080] px-2.5 py-0.5 rounded-full border border-[#E5DEC9] font-medium">
                  Deep Purple: #492080
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Account Parameters */}
        <div className="bg-white border border-[#E5DEC9] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-[#141414] tracking-tight">
            Administrative Session
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E5DEC9] space-y-1">
              <span className="text-[#78726A] uppercase tracking-wider text-[10px] font-semibold">
                Authenticated User
              </span>
              <div className="text-[#141414] font-semibold">Studio Principal</div>
              <div className="text-[11px] text-[#C5A15B] font-medium">{DEMO_CREDENTIALS.email}</div>
            </div>

            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E5DEC9] space-y-1">
              <span className="text-[#78726A] uppercase tracking-wider text-[10px] font-semibold">
                Storage Repository
              </span>
              <div className="text-[#2E7D5A] font-semibold">LocalStorage Repository</div>
              <div className="text-[11px] text-[#78726A]">Client-Side Reactive Synchronization</div>
            </div>
          </div>
        </div>

        {/* Reset Database / Factory Restore */}
        <div className="bg-white border border-[#E5DEC9] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-[#B43A3A] tracking-tight flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Reset Database to Initial Mock Dataset</span>
          </h3>
          <p className="text-xs text-[#78726A] leading-relaxed font-normal">
            Restores all projects, films, materials, services, testimonials, and copy back to pristine initial demonstration state.
          </p>

          {resetDone ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#2E7D5A] text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Data restored! Reloading application...</span>
            </div>
          ) : resetConfirm ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
              <div className="text-xs text-[#B43A3A] font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Database Reset: This will overwrite any custom edits.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-4 py-2 bg-[#B43A3A] text-white rounded-full text-xs font-semibold shadow-sm hover:bg-red-700 transition-colors"
                >
                  Yes, Reset Everything
                </button>
                <button
                  type="button"
                  onClick={() => setResetConfirm(false)}
                  className="px-4 py-2 border border-[#E5DEC9] bg-white text-[#78726A] hover:text-[#141414] rounded-full text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 border border-red-200 text-[#B43A3A] hover:bg-red-50 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Default Mock Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
