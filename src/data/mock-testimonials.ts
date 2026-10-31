import { Testimonial } from '@/types/testimonial.types';

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-01',
    clientName: 'Vikram & Radhika Singhania',
    clientRole: 'Private Investors',
    projectAssociation: 'The Skyward Penthouse, Worli',
    quote: 'Heaven Interiors approached our duplex penthouse not as decorators, but as rigorous spatial sculptors. Their attention to flush shadow lines, custom marine-grade woodwork, and natural daylight management transformed our home into a serene sanctuary above Mumbai.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    displayOrder: 1,
    isPublished: true,
    createdAt: '2025-01-20T10:00:00.000Z'
  },
  {
    id: 'test-02',
    clientName: 'Arjun Mehta',
    clientRole: 'Managing Partner, Aura Capital',
    projectAssociation: 'Aura Executive Headquarters, BKC',
    quote: 'Our boardroom requires absolute acoustic privacy for sensitive cross-border M&A discussions. The team delivered STC 55 certified acoustic glass and fluted oak partitions that look breathtaking while performing with laboratory silence.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    displayOrder: 2,
    isPublished: true,
    createdAt: '2024-12-15T14:30:00.000Z'
  },
  {
    id: 'test-03',
    clientName: 'Ananya & Kabir Rao',
    clientRole: 'Tech Founders',
    projectAssociation: 'The Monolith Residence, Jubilee Hills',
    quote: 'Their turnkey execution is unmatched in India. Entrusting everything from civil structural modifications to custom furniture fabrication to a single studio eliminated all stress. Handover was executed precisely on schedule with zero compromises.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    displayOrder: 3,
    isPublished: true,
    createdAt: '2025-01-05T09:15:00.000Z'
  },
  {
    id: 'test-04',
    clientName: 'Dr. Siddharth Varma',
    clientRole: 'Collector & Surgeon',
    projectAssociation: 'Villa Terracotta, Assagao',
    quote: 'Finding architects who genuinely understand historic coastal masonry and sustainable timber joinery is rare. Heaven Interiors created an estate that breathes with the Goan monsoons while feeling deeply contemporary.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    displayOrder: 4,
    isPublished: true,
    createdAt: '2024-11-10T16:00:00.000Z'
  }
];

