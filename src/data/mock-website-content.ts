import { WebsiteContent } from '@/types/website-content.types';

export const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  hero: {
    headline: 'SPACES THAT BREATHE',
    subheadline: 'INTERIOR ARCHITECTURE | MATERIALS | TIMELESS LIVING',
    description: 'We orchestrate light, monolithic stone, and bespoke timber craftsmanship into sculptural spaces that evoke quiet luxury and timeless permanence.',
    primaryCtaText: 'EXPLORE OUR WORK',
    primaryCtaLink: '/projects',
    secondaryCtaText: 'ENQUIRE',
    secondaryCtaLink: '/contact',
    backgroundImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90'
  },
  about: {
    eyebrow: '01 / STUDIO',
    heading: 'A DEEPER APPROACH TO LIVING',
    paragraph1: 'We design spaces that feel grounded, quiet and enduring — balancing architectural precision with the warmth of natural materials.',
    paragraph2: 'Every commission begins with a study of light, acoustic resonance, and everyday human movement. We reject fleeting surface-level trends, selecting materials that age with grace — unsealed travertines, hand-rubbed Danish oils, and vacuum-pressed timber veneers engineered to withstand generations.',
    experienceYears: '17+',
    completedProjectsCount: '180+',
    awardsCount: '95%',
    primaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: '/reference_assets/sketch_concept_hd.jpg',
    stats: [
      { value: '17+', label: 'Years of Experience' },
      { value: '180+', label: 'Projects Completed' },
      { value: '95%', label: 'Client Satisfaction' }
    ]
  },
  process: [
    {
      id: 'proc-01',
      number: '01',
      title: 'Consultation',
      subtitle: 'Listening & Brief Analysis',
      description: 'Understanding your lifestyle rituals, aesthetic aspirations, and spatial possibilities.',
      deliverables: ['Spatial Brief Formulation', 'Site Analysis', 'Budget Architecture'],
      order: 1
    },
    {
      id: 'proc-02',
      number: '02',
      title: 'Concept & Planning',
      subtitle: 'Volumetric Layouts & Form',
      description: 'Developing spatial circulation, sightlines, natural light choreographies, and preliminary pencil sketches.',
      deliverables: ['Architectural Layouts', 'Circulation Studies', 'Concept Sketches'],
      order: 2
    },
    {
      id: 'proc-03',
      number: '03',
      title: 'Design Development',
      subtitle: 'Precision Detailing & Specs',
      description: 'Resolving every millimetric shadow line, custom millwork joint, and technical material specification.',
      deliverables: ['Detailed Millwork Schematics', 'Material Moodboard', 'Comprehensive BOQ'],
      order: 3
    },
    {
      id: 'proc-04',
      number: '04',
      title: 'Execution & Handover',
      subtitle: 'Craftsmanship & Final Polish',
      description: 'Artisanal atelier fabrication, dedicated site management, and turnkey white-glove handover.',
      deliverables: ['Site Supervision', 'Quality Certification', 'Turnkey Handover'],
      order: 4
    }
  ],
  contact: {
    phone: '+91 98765 43210',
    email: 'hello@heaveninteriors.in',
    address: 'Atelier House, Bandra West',
    cityState: 'Mumbai, Maharashtra, India',
    workingHours: 'Monday – Saturday: 10:00 AM – 7:00 PM',
    instagram: 'https://instagram.com/heaveninteriors',
    linkedin: 'https://linkedin.com/company/heaveninteriors',
    pinterest: 'https://pinterest.com/heaveninteriors',
    whatsapp: '+91 98765 43210'
  },
  footer: {
    tagline: 'WHERE MATERIALS MEET LIFE',
    description: 'Heaven Interiors is an architectural interior practice and bespoke woodworking atelier serving discerning residential and commercial clients across India and abroad.',
    copyrightText: '© 2026 Heaven Interiors Atelier. All rights reserved.'
  },
  updatedAt: '2026-02-15T12:00:00.000Z'
};

