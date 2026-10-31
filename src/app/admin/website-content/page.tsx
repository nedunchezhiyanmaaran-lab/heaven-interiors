'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useWebsiteContent } from '@/hooks/useDataServices';
import { websiteContentService } from '@/services/website-content.service';
import { compressImageFile } from '@/utils/image-compression';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';

export default function AdminWebsiteContentPage() {
  const { content, refresh } = useWebsiteContent();

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'process' | 'contact' | 'footer'>('hero');

  // Form States
  const [heroState, setHeroState] = useState(content.hero);
  const [aboutState, setAboutState] = useState(content.about);
  const [processState, setProcessState] = useState(content.process);
  const [contactState, setContactState] = useState(content.contact);
  const [footerState, setFooterState] = useState(content.footer);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHeroState(content.hero);
    setAboutState(content.about);
    setProcessState(content.process);
    setContactState(content.contact);
    setFooterState(content.footer);
  }, [content]);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1920, quality: 0.82 });
      setHeroState({ ...heroState, backgroundImage: compressed });
    } catch (err: any) {
      setError(err?.message || 'Error uploading hero image');
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1400, quality: 0.82 });
      if (isPrimary) {
        setAboutState({ ...aboutState, primaryImage: compressed });
      } else {
        setAboutState({ ...aboutState, secondaryImage: compressed });
      }
    } catch (err: any) {
      setError(err?.message || 'Error uploading image');
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await websiteContentService.updateContent({
        hero: heroState,
        about: aboutState,
        process: processState,
        contact: contactState,
        footer: footerState
      });
      setSuccess('Website content updated and synchronized across all active visitors!');
      refresh();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save website content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F0E6] min-h-screen font-sans">
      <AdminHeader
        title="Website Content Management"
        subtitle="Edit hero typography, design philosophy copy, workflow stages, and atelier contact info"
        actionButton={
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-[#141414] hover:bg-[#C5A15B] text-[#FAF7F0] hover:text-[#141414] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        }
      />

      <div className="p-6 sm:p-10 space-y-6 max-w-5xl w-full mx-auto font-sans">
        {/* Feedback banners */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-[#B43A3A] text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#2E7D5A] text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5DEC9] pb-3 overflow-x-auto">
          {(['hero', 'about', 'process', 'contact', 'footer'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-sans rounded-full transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#141414] text-[#FAF7F0] font-semibold shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#E5DEC9] text-[#78726A] hover:text-[#141414] hover:border-[#C5A15B]/40'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Section
            </button>
          ))}
        </div>

        {/* TAB 1: HERO */}
        {activeTab === 'hero' && (
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-[#141414] tracking-tight">
              Hero Section Copy & Imagery
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Subheadline / Eyebrow Text
              </label>
              <input
                type="text"
                value={heroState.subheadline}
                onChange={(e) => setHeroState({ ...heroState, subheadline: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Main Editorial Headline
              </label>
              <input
                type="text"
                value={heroState.headline}
                onChange={(e) => setHeroState({ ...heroState, headline: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-sm text-[#141414] font-semibold focus:border-[#C5A15B] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Supporting Description
              </label>
              <textarea
                rows={3}
                value={heroState.description}
                onChange={(e) => setHeroState({ ...heroState, description: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414] focus:border-[#C5A15B] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Primary CTA Text
                </label>
                <input
                  type="text"
                  value={heroState.primaryCtaText}
                  onChange={(e) => setHeroState({ ...heroState, primaryCtaText: e.target.value })}
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={heroState.secondaryCtaText}
                  onChange={(e) => setHeroState({ ...heroState, secondaryCtaText: e.target.value })}
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
                />
              </div>
            </div>

            {/* Hero Background Image */}
            <div className="space-y-3 pt-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold">
                Hero Background Architectural Photography
              </label>
              <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-[#F5F0E6] border border-[#E5DEC9]">
                <Image
                  src={heroState.backgroundImage}
                  alt="Hero background preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="text-xs text-[#78726A] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-[#141414] file:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT / STUDIO */}
        {activeTab === 'about' && (
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-[#141414] tracking-tight">
              Studio Introduction & Philosophy
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={aboutState.eyebrow}
                onChange={(e) => setAboutState({ ...aboutState, eyebrow: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={aboutState.heading}
                onChange={(e) => setAboutState({ ...aboutState, heading: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-sm text-[#141414] font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Philosophy Paragraph
              </label>
              <textarea
                rows={4}
                value={aboutState.paragraph1}
                onChange={(e) => setAboutState({ ...aboutState, paragraph1: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold">
                  Primary Studio Visual
                </label>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E5DEC9] bg-[#F5F0E6]">
                  <Image
                    src={aboutState.primaryImage}
                    alt="Primary about preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAboutImageUpload(e, true)}
                  className="text-xs text-[#78726A] file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-xs file:bg-[#141414] file:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold">
                  Secondary Architectural Study
                </label>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E5DEC9] bg-[#F5F0E6]">
                  <Image
                    src={aboutState.secondaryImage}
                    alt="Secondary about preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAboutImageUpload(e, false)}
                  className="text-xs text-[#78726A] file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-xs file:bg-[#141414] file:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROCESS */}
        {activeTab === 'process' && (
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-6">
            <h2 className="font-bold text-lg text-[#141414] tracking-tight">
              Design Process Stages
            </h2>

            <div className="space-y-4">
              {processState.map((stage, idx) => (
                <div
                  key={stage.id || idx}
                  className="p-4 bg-[#F5F0E6]/40 border border-[#E5DEC9] rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#C5A15B] font-semibold">
                      Phase {stage.number || idx + 1}
                    </span>
                    <span className="text-[11px] text-[#78726A]">{stage.subtitle}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={stage.title}
                      onChange={(e) => {
                        const newProcess = [...processState];
                        newProcess[idx] = { ...newProcess[idx], title: e.target.value };
                        setProcessState(newProcess);
                      }}
                      className="bg-white border border-[#E5DEC9] rounded-lg px-3 py-1.5 text-xs text-[#141414]"
                      placeholder="Phase Title"
                    />
                    <input
                      type="text"
                      value={stage.subtitle}
                      onChange={(e) => {
                        const newProcess = [...processState];
                        newProcess[idx] = { ...newProcess[idx], subtitle: e.target.value };
                        setProcessState(newProcess);
                      }}
                      className="bg-white border border-[#E5DEC9] rounded-lg px-3 py-1.5 text-xs text-[#141414]"
                      placeholder="Phase Subtitle / Duration"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={stage.description}
                    onChange={(e) => {
                      const newProcess = [...processState];
                      newProcess[idx] = { ...newProcess[idx], description: e.target.value };
                      setProcessState(newProcess);
                    }}
                    className="w-full bg-white border border-[#E5DEC9] rounded-lg px-3 py-1.5 text-xs text-[#141414]"
                    placeholder="Phase scope description..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT */}
        {activeTab === 'contact' && (
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-[#141414] tracking-tight">
              Atelier Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Primary Email
                </label>
                <input
                  type="email"
                  value={contactState.email}
                  onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                  Direct Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={contactState.phone}
                  onChange={(e) => setContactState({ ...contactState, phone: e.target.value })}
                  className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Studio Physical Address
              </label>
              <textarea
                rows={2}
                value={contactState.address}
                onChange={(e) => setContactState({ ...contactState, address: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
              />
            </div>
          </div>
        )}

        {/* TAB 5: FOOTER */}
        {activeTab === 'footer' && (
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-[#141414] tracking-tight">
              Footer Slogan & Copyright
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Footer Tagline
              </label>
              <input
                type="text"
                value={footerState.tagline}
                onChange={(e) => setFooterState({ ...footerState, tagline: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#78726A] font-semibold mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={footerState.copyrightText}
                onChange={(e) => setFooterState({ ...footerState, copyrightText: e.target.value })}
                className="w-full bg-[#F5F0E6]/50 border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs text-[#141414]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
