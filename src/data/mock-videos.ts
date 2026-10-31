import { VideoItem } from '@/types/video.types';

export const VIDEO_CATEGORIES = [
  'Completed Projects',
  'Site Visits',
  'Construction Progress',
  'Design Walkthroughs',
  'Behind the Scenes'
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-01',
    title: 'The Skyward Penthouse — Architectural Tour',
    description: 'An intimate 4K walkthrough exploring the double-height spatial volumes, bespoke travertine installations, and sunset reflections over Worli Sea Face.',
    category: 'Design Walkthroughs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-with-a-view-of-the-city-43181-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    duration: '03:45',
    projectId: 'proj-01',
    projectTitle: 'The Skyward Penthouse',
    isFeatured: true,
    displayOrder: 1,
    isPublished: true,
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-02-12T11:00:00.000Z'
  },
  {
    id: 'vid-02',
    title: 'Aura Executive Headquarters — Turnkey Fitout',
    description: 'From initial 3D BIM spatial coordinates to the final placement of handcrafted acoustic oak baffles in the BKC financial center.',
    category: 'Completed Projects',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-space-with-desks-and-computers-43184-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    duration: '04:12',
    projectId: 'proj-02',
    projectTitle: 'Aura Executive Headquarters',
    isFeatured: true,
    displayOrder: 2,
    isPublished: true,
    createdAt: '2025-01-10T14:30:00.000Z',
    updatedAt: '2025-01-28T09:15:00.000Z'
  },
  {
    id: 'vid-03',
    title: 'The Monolith Residence — Concrete & Millwork Detail',
    description: 'Explore the dialogue between raw textured board-formed concrete and custom vacuum-pressed smoked oak cabinetry in Jubilee Hills.',
    category: 'Completed Projects',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-kitchen-in-a-luxurious-modern-apartment-43180-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    duration: '02:58',
    projectId: 'proj-04',
    projectTitle: 'The Monolith Residence',
    isFeatured: true,
    displayOrder: 3,
    isPublished: true,
    createdAt: '2025-01-25T16:00:00.000Z',
    updatedAt: '2025-02-01T12:00:00.000Z'
  },
  {
    id: 'vid-04',
    title: 'Bespoke Millwork & Timber Joinery Workshop',
    description: 'Behind the scenes at our specialized woodworking atelier: calibrating Birch core plywood and pressing exotic natural veneers.',
    category: 'Behind the Scenes',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-carpenter-measuring-a-wooden-plank-41982-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    duration: '03:15',
    isFeatured: false,
    displayOrder: 4,
    isPublished: true,
    createdAt: '2024-12-05T09:00:00.000Z',
    updatedAt: '2025-01-14T10:30:00.000Z'
  },
  {
    id: 'vid-05',
    title: 'Villa Terracotta — Site Inspection & Handover',
    description: 'Principal Architect walkthrough inspecting the lime plaster finishes and hand-carved teak rafters during monsoon testing in Assagao.',
    category: 'Site Visits',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-house-with-a-modern-interior-architecture-43182-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    duration: '04:40',
    projectId: 'proj-03',
    projectTitle: 'Villa Terracotta',
    isFeatured: false,
    displayOrder: 5,
    isPublished: true,
    createdAt: '2024-11-20T11:00:00.000Z',
    updatedAt: '2024-12-10T15:20:00.000Z'
  }
];

