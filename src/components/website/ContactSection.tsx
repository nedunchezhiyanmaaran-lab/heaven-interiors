'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useWebsiteContent } from '@/hooks/useDataServices';
import { enquiryService } from '@/services/enquiry.service';
import { MapPin, Phone, Mail, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { content } = useWebsiteContent();
  const contact = content.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const fields = formRef.current?.querySelectorAll('.contact-field');
      if (fields && fields.length > 0) {
        gsap.fromTo(
          fields,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%'
            }
          }
        );
      }
    },
    { scope: containerRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email, and project message.');
      return;
    }

    setSubmitting(true);
    try {
      await enquiryService.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '+91 98765 00000',
        projectType: formData.projectType.trim() || 'Residential Interior',
        message: formData.message.trim()
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: ''
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to submit enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-28 sm:py-36 bg-[#F5F0E6] text-[#141414] overflow-hidden border-t border-[#141414]/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Eyebrow, Headline & Minimalist Form matching Reference Section 10 */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
                09 / CONTACT
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#141414] leading-[1.08] tracking-tight uppercase">
                LET&apos;S CREATE <br />
                SOMETHING <br />
                MEANINGFUL
              </h2>
            </div>

            {success ? (
              <div className="p-8 bg-[#EDE8DD] border border-[#C5A15B]/40 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-[#C5A15B]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-serif text-lg font-medium text-[#141414]">
                    Enquiry Logged with Atelier
                  </span>
                </div>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
                  Thank you for initiating a dialogue. Your brief has been transmitted to our Principal Architects and logged into the Studio CMS. We will connect within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-xs uppercase tracking-wider text-[#C5A15B] underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6 pt-4 max-w-2xl font-sans"
              >
                {error && (
                  <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="contact-field w-full block bg-transparent border-0 border-b border-[#141414]/20 focus:border-[#C5A15B] py-3 text-sm text-[#141414] placeholder:text-[#888888] focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email Address"
                      className="contact-field w-full block bg-transparent border-0 border-b border-[#141414]/20 focus:border-[#C5A15B] py-3 text-sm text-[#141414] placeholder:text-[#888888] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Row 2: Phone & Project Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone Number"
                      className="contact-field w-full block bg-transparent border-0 border-b border-[#141414]/20 focus:border-[#C5A15B] py-3 text-sm text-[#141414] placeholder:text-[#888888] focus:outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      placeholder="Project Type"
                      className="contact-field w-full block bg-transparent border-0 border-b border-[#141414]/20 focus:border-[#C5A15B] py-3 text-sm text-[#141414] placeholder:text-[#888888] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Row 3: Message with natural harmonious height & auto-expansion */}
                <div>
                  <textarea
                    rows={2}
                    required
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.max(44, Math.min(e.target.scrollHeight, 160))}px`;
                    }}
                    placeholder="Your Message"
                    className="contact-field w-full block bg-transparent border-0 border-b border-[#141414]/20 focus:border-[#C5A15B] pt-3 pb-2 text-sm text-[#141414] placeholder:text-[#888888] focus:outline-none transition-colors duration-300 resize-none min-h-[44px]"
                  />
                </div>

                {/* Gold Filled Button matching Reference: SEND ENQUIRY ↗ */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] font-sans font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>{submitting ? 'TRANSMITTING...' : 'SEND ENQUIRY'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Architectural Texture & Coordinates matching Section 10 */}
          <div className="lg:col-span-4 space-y-8 lg:pl-6">
            {/* Architectural Material Slabs: Travertine Limestone & Charcoal Marble */}
            <div className="relative w-full aspect-[16/9] rounded-sm overflow-hidden shadow-lg border border-[#141414]/15 bg-[#EDE8DD] group">
              <Image
                src="/reference_assets/travertine_marble_hd.jpg"
                alt="Architectural stone materials - Travertine limestone & Nero Marquina marble"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#141414]/85 backdrop-blur-md px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-[#C5A15B] border border-[#C5A15B]/30">
                MATERIAL STUDY // TRAVERTINE & MARBLE
              </div>
            </div>

            {/* Coordinates */}
            <div className="space-y-6 pt-2 font-sans text-xs">
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#C5A15B] font-mono font-medium">
                  OUR STUDIO
                </div>
                <div className="text-[#141414] font-medium leading-relaxed">
                  {contact.cityState || 'Mumbai, Maharashtra, India'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[#141414] font-medium">
                  <a href={`tel:${contact.phone || '+91 98765 43210'}`} className="hover:text-[#C5A15B]">
                    {contact.phone || '+91 98765 43210'}
                  </a>
                </div>
                <div className="text-[#666666]">
                  <a href={`mailto:${contact.email || 'hello@heaveninteriors.in'}`} className="hover:text-[#C5A15B]">
                    {contact.email || 'hello@heaveninteriors.in'}
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#C5A15B] font-mono mb-2">
                  FOLLOW US
                </div>
                <div className="flex items-center gap-4 text-xs text-[#141414]">
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A15B]">
                    Instagram
                  </a>
                  <span>•</span>
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A15B]">
                    LinkedIn
                  </a>
                  <span>•</span>
                  <a href={contact.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A15B]">
                    Pinterest
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
