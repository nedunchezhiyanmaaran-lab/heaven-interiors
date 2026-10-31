'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useWebsiteContent } from '@/hooks/useDataServices';
import { websiteContentService } from '@/services/website-content.service';
import { compressImageFile } from '@/utils/image-compression';
import { WebsiteContent } from '@/types/website-content.types';
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
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      <AdminHeader
        title="Website Content Management"
        subtitle="Edit hero typography, design philosophy copy, workflow stages, and atelier contact info"
        actionButton={
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="btn-gold px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-sans flex items-center gap-1.5 shadow-lg"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Save All Changes'}</span>
          </button>
        }
      />

      <div className="p-8 space-y-8 max-w-5xl w-full mx-auto font-sans">
        {/* Feedback banners */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs rounded flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          {(['hero', 'about', 'process', 'contact', 'footer'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-sans rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#C5A15B] text-[#141414] font-medium shadow-md'
                  : 'text-[#E9E5DE]/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Section
            </button>
          ))}
        </div>

        {/* TAB 1: HERO */}
        {activeTab === 'hero' && (
          <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
            <h2 className="text-sm uppercase tracking-wider text-[#C5A15B] font-medium">
              Hero Section Copy & Imagery
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Subheadline / Eyebrow Text
              </label>
              <input
                type="text"
                value={heroState.subheadline}
                onChange={(e) => setHeroState({ ...heroState, subheadline: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Main Editorial Headline
              </label>
              <input
                type="text"
                value={heroState.headline}
                onChange={(e) => setHeroState({ ...heroState, headline: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-sm text-[#F5F0E6] font-serif focus:border-[#C5A15B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Supporting Description
              </label>
              <textarea
                rows={3}
                value={heroState.description}
                onChange={(e) => setHeroState({ ...heroState, description: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  Primary CTA Text
                </label>
                <input
                  type="text"
                  value={heroState.primaryCtaText}
                  onChange={(e) => setHeroState({ ...heroState, primaryCtaText: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={heroState.secondaryCtaText}
                  onChange={(e) => setHeroState({ ...heroState, secondaryCtaText: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6]"
                />
              </div>
            </div>

            {/* Hero Background Image */}
            <div className="space-y-3 pt-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B]">
                Hero Background Architectural Photography
              </label>
              <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden bg-black border border-white/10">
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
                  className="text-xs text-white/70 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#C5A15B] file:text-[#141414]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT / STUDIO */}
        {activeTab === 'about' && (
          <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
            <h2 className="text-sm uppercase tracking-wider text-[#C5A15B] font-medium">
              Studio Philosophy & Experience Metrics
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Philosophy Heading
              </label>
              <input
                type="text"
                value={aboutState.heading}
                onChange={(e) => setAboutState({ ...aboutState, heading: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-sm text-[#F5F0E6] font-serif"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Introduction Paragraph 1
              </label>
              <textarea
                rows={3}
                value={aboutState.paragraph1}
                onChange={(e) => setAboutState({ ...aboutState, paragraph1: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Introduction Paragraph 2
              </label>
              <textarea
                rows={3}
                value={aboutState.paragraph2}
                onChange={(e) => setAboutState({ ...aboutState, paragraph2: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-[#F5F0E6]"
              />
            </div>

            {/* Experience Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#141414] rounded-lg border border-white/10">
              {aboutState.stats.map((st, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="text-[10px] text-[#C5A15B] uppercase block">
                    Metric {idx + 1}
                  </label>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => {
                      const updated = [...aboutState.stats];
                      updated[idx].value = e.target.value;
                      setAboutState({ ...aboutState, stats: updated });
                    }}
                    className="w-full bg-[#1c1c1c] border border-white/10 px-2.5 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const updated = [...aboutState.stats];
                      updated[idx].label = e.target.value;
                      setAboutState({ ...aboutState, stats: updated });
                    }}
                    className="w-full bg-[#1c1c1c] border border-white/10 px-2.5 py-1 text-[11px] text-[#E9E5DE]/70"
                  />
                </div>
              ))}
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B]">
                  Primary Architectural Photo
                </label>
                <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-black border border-white/10">
                  <Image src={aboutState.primaryImage} alt="Primary" fill className="object-cover" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAboutImageUpload(e, true)}
                  className="text-xs text-white/70"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A15B]">
                  Secondary Floating Detail Photo
                </label>
                <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-black border border-white/10">
                  <Image src={aboutState.secondaryImage} alt="Secondary" fill className="object-cover" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAboutImageUpload(e, false)}
                  className="text-xs text-white/70"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DESIGN PROCESS */}
        {activeTab === 'process' && (
          <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
            <h2 className="text-sm uppercase tracking-wider text-[#C5A15B] font-medium">
              Architectural Workflow Phases
            </h2>

            <div className="space-y-6">
              {processState.map((stage, idx) => (
                <div key={stage.id || idx} className="p-4 bg-[#141414] rounded-lg border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#C5A15B]">
                    <span>Stage {stage.number || `0${idx + 1}`}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-[#E9E5DE]/60 uppercase mb-1">
                        Stage Title
                      </label>
                      <input
                        type="text"
                        value={stage.title}
                        onChange={(e) => {
                          const updated = [...processState];
                          updated[idx].title = e.target.value;
                          setProcessState(updated);
                        }}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#E9E5DE]/60 uppercase mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={stage.subtitle}
                        onChange={(e) => {
                          const updated = [...processState];
                          updated[idx].subtitle = e.target.value;
                          setProcessState(updated);
                        }}
                        className="w-full bg-[#1c1c1c] border border-white/15 rounded px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#E9E5DE]/60 uppercase mb-1">
                      Stage Description
                    </label>
                    <textarea
                      rows={2}
                      value={stage.description}
                      onChange={(e) => {
                        const updated = [...processState];
                        updated[idx].description = e.target.value;
                        setProcessState(updated);
                      }}
                      className="w-full bg-[#1c1c1c] border border-white/15 rounded px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT INFO */}
        {activeTab === 'contact' && (
          <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
            <h2 className="text-sm uppercase tracking-wider text-[#C5A15B] font-medium">
              Atelier Contact Coordinates & Social Media
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  Studio Phone
                </label>
                <input
                  type="text"
                  value={contactState.phone}
                  onChange={(e) => setContactState({ ...contactState, phone: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  Studio Email
                </label>
                <input
                  type="email"
                  value={contactState.email}
                  onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={contactState.address}
                  onChange={(e) => setContactState({ ...contactState, address: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  City, State, Postal Code
                </label>
                <input
                  type="text"
                  value={contactState.cityState}
                  onChange={(e) => setContactState({ ...contactState, cityState: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  Instagram Link
                </label>
                <input
                  type="text"
                  value={contactState.instagram}
                  onChange={(e) => setContactState({ ...contactState, instagram: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  LinkedIn Link
                </label>
                <input
                  type="text"
                  value={contactState.linkedin}
                  onChange={(e) => setContactState({ ...contactState, linkedin: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                  Pinterest Link
                </label>
                <input
                  type="text"
                  value={contactState.pinterest}
                  onChange={(e) => setContactState({ ...contactState, pinterest: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FOOTER */}
        {activeTab === 'footer' && (
          <div className="bg-[#181818] p-6 rounded-xl border border-white/10 space-y-6">
            <h2 className="text-sm uppercase tracking-wider text-[#C5A15B] font-medium">
              Footer Description & Copyright
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Footer Tagline
              </label>
              <input
                type="text"
                value={footerState.tagline}
                onChange={(e) => setFooterState({ ...footerState, tagline: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Footer Bio Description
              </label>
              <textarea
                rows={3}
                value={footerState.description}
                onChange={(e) => setFooterState({ ...footerState, description: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#E9E5DE]/80 mb-1">
                Copyright Notice Text
              </label>
              <input
                type="text"
                value={footerState.copyrightText}
                onChange={(e) => setFooterState({ ...footerState, copyrightText: e.target.value })}
                className="w-full bg-[#121212] border border-white/15 rounded-lg px-4 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

