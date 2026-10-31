import { Project } from '@/types/project.types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    title: 'The Skyward Penthouse',
    slug: 'the-skyward-penthouse',
    category: 'Residential',
    location: 'Worli Sea Face, Mumbai',
    year: '2025',
    shortDescription: 'A 6,800 sq.ft duplex penthouse celebrating warm minimalism, bespoke fluted walnut millwork, and panoramic Arabian Sea vistas.',
    fullDescription: 'The Skyward Penthouse balances monolithic architectural proportions with tactile intimacy. Conceived as a private sanctuary above Mumbai’s kinetic shoreline, the residence utilizes a restrained palette of travertine stone, oiled American walnut, brushed brass, and micro-cement plaster. Light flows uninterrupted through double-height floor-to-ceiling glass volumes, choreographed by custom motorized sheer drapery and concealed architectural linear luminaires.',
    designConcept: 'Biophilic luxury meets rectilinear clarity. The spatial sequence prioritizes uninterrupted sightlines to the sea while sculpting distinct acoustic and visual zones for entertaining, private repose, and an executive gallery.',
    challenges: 'Integrating central HVAC and smart building automation within structural concrete beams without compromising ceiling heights, while handling high coastal humidity for bespoke timber veneer elements.',
    solutions: 'Custom shadow-line acoustic ceiling coves housed the linear diffusers and Lutron sensor arrays. All bespoke woodwork was engineered with marine-grade calibrated core plywood and vacuum-pressed moisture-resistant veneer coatings.',
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        id: 'img-p1-1',
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
        caption: 'Double-height living atrium featuring custom monolithic bookmatched travertine wall',
        isCover: true,
        order: 1
      },
      {
        id: 'img-p1-2',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
        caption: 'Formal dining suite with floating fluted walnut credenza and sculptural brass chandelier',
        isCover: false,
        order: 2
      },
      {
        id: 'img-p1-3',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
        caption: 'Minimalist chef kitchen with cantilevered Nero Marquina marble island',
        isCover: false,
        order: 3
      },
      {
        id: 'img-p1-4',
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
        caption: 'Master bedroom suite with upholstered linen headboard and custom bronze reading sconces',
        isCover: false,
        order: 4
      },
      {
        id: 'img-p1-5',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
        caption: 'Spa-inspired primary ensuite clad in floor-to-ceiling honed silver travertine',
        isCover: false,
        order: 5
      }
    ],
    videos: [
      {
        id: 'vid-p1-1',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-with-a-view-of-the-city-43181-large.mp4',
        title: 'Skyward Penthouse Architectural Walkthrough',
        type: 'url',
        posterUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85'
      }
    ],
    isFeatured: true,
    displayOrder: 1,
    isPublished: true,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-02-10T14:30:00.000Z'
  },
  {
    id: 'proj-02',
    title: 'Aura Executive Headquarters',
    slug: 'aura-executive-headquarters',
    category: 'Commercial',
    location: 'BKC Financial District, Mumbai',
    year: '2024',
    shortDescription: 'A 14,000 sq.ft private wealth family office engineered for confidential collaboration, acoustic silence, and timeless stature.',
    fullDescription: 'Designed for a marquee private equity firm, Aura balances corporate diplomacy with boutique hospitality. The layout centers on an expansive curved timber gallery that guides visitors from an ivory marble reception to bespoke executive suites, high-tech boardroom pavilions, and a private whisky lounge for closed-door negotiations.',
    designConcept: 'Architectural permanence and acoustic discretion. Curvilinear fluted oak partitions paired with micro-perforated acoustic panels and bronze glass evoke quiet authority.',
    challenges: 'STC 55 sound insulation requirements for boardrooms directly beneath mechanical floor risers while maintaining continuous glass partitions.',
    solutions: 'Double-glazed laminated acoustic glass with argon gas filling, floating sub-flooring, and acoustic baffle drop ceilings wrapped in acoustically transparent Kvadrat fabric.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        id: 'img-p2-1',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85',
        caption: 'Reception foyer with monolithic fluted oak portal and custom recessed lighting',
        isCover: true,
        order: 1
      },
      {
        id: 'img-p2-2',
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85',
        caption: 'Executive boardroom with bespoke 20-seat saddle leather and walnut table',
        isCover: false,
        order: 2
      },
      {
        id: 'img-p2-3',
        url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1600&q=85',
        caption: 'Breakout discussion lounge with custom ribbed acoustic felt walls',
        isCover: false,
        order: 3
      },
      {
        id: 'img-p2-4',
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85',
        caption: 'Managing Partner private study with integrated library millwork',
        isCover: false,
        order: 4
      }
    ],
    videos: [
      {
        id: 'vid-p2-1',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-office-space-with-desks-and-computers-43184-large.mp4',
        title: 'Aura Headquarters Design Case Study',
        type: 'url',
        posterUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85'
      }
    ],
    isFeatured: true,
    displayOrder: 2,
    isPublished: true,
    createdAt: '2024-11-04T09:00:00.000Z',
    updatedAt: '2025-01-20T11:15:00.000Z'
  },
  {
    id: 'proj-03',
    title: 'Villa Terracotta',
    slug: 'villa-terracotta',
    category: 'Residential',
    location: 'Assagao, Goa',
    year: '2024',
    shortDescription: 'A sprawling 5-bedroom coastal estate blending Indo-Portuguese heritage masonry with Scandinavian minimalist interiors.',
    fullDescription: 'Villa Terracotta reinterprets tropical architecture through modern restraint. The 8,200 sq.ft villa frames views of ancient mango groves through soaring teak colonnades, handcrafted terracotta floor tiles, lime-washed walls, and cane-woven ceiling rafters. The interior transitions seamlessly into outdoor water bodies and open courtyard pavilions.',
    designConcept: 'Passive cooling, earthy material honesty, and celebrating historic Goan architectural vernacular with contemporary ergonomics.',
    challenges: 'High coastal monsoonal humidity and salt air requiring highly durable natural materials that age gracefully without degrading.',
    solutions: 'Selected BWP marine plywood core for all casework, kiln-dried reclaimed Burma teak, natural hydraulic lime plaster, and anti-corrosive marine bronze hardware.',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        id: 'img-p3-1',
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
        caption: 'Central open-air living pavilion opening to infinity reflection pool',
        isCover: true,
        order: 1
      },
      {
        id: 'img-p3-2',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
        caption: 'Dining verandah shaded by exposed reclaimed timber rafters',
        isCover: false,
        order: 2
      },
      {
        id: 'img-p3-3',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
        caption: 'Guest bedroom featuring hand-crafted cane weave wardrobe shutters',
        isCover: false,
        order: 3
      }
    ],
    videos: [],
    isFeatured: true,
    displayOrder: 3,
    isPublished: true,
    createdAt: '2024-09-18T14:00:00.000Z',
    updatedAt: '2024-12-05T16:45:00.000Z'
  },
  {
    id: 'proj-04',
    title: 'The Monolith Residence',
    slug: 'the-monolith-residence',
    category: 'Turnkey',
    location: 'Jubilee Hills, Hyderabad',
    year: '2025',
    shortDescription: 'Complete turnkey architectural interior transformation featuring brutalist concrete planes, charred yakisugi wood, and warm ambient light.',
    fullDescription: 'Constructed on a steep granite cliff, The Monolith Residence uses raw board-formed concrete and deep charcoal charred timber to craft an atmospheric fortress of serenity. Designed from structural civil modifications through custom furniture fabrication and art curation, every millimetric joint reflects bespoke turnkey execution.',
    designConcept: 'Contrast of brutalist masonry weight against ethereal diffused daylight and warm tactile timber millwork.',
    challenges: 'Delivering total turnkey scope across civil renovation, HVAC, MEP, Italian marble installation, and bespoke joinery within a tight 7-month handover schedule.',
    solutions: 'Prefabricated precision modular joinery offsite using calibrated multi-layer Birch plywood substrates, while parallel civil structural bracing took place on site.',
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        id: 'img-p4-1',
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
        caption: 'Monumental living hall featuring board-formed concrete and smoked oak',
        isCover: true,
        order: 1
      },
      {
        id: 'img-p4-2',
        url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85',
        caption: 'Cantilevered oak staircase suspended by slim structural steel cables',
        isCover: false,
        order: 2
      },
      {
        id: 'img-p4-3',
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
        caption: 'Courtyard lounge framing a sculptural 80-year-old bonsai olive tree',
        isCover: false,
        order: 3
      }
    ],
    videos: [
      {
        id: 'vid-p4-1',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-kitchen-in-a-luxurious-modern-apartment-43180-large.mp4',
        title: 'Turnkey Handover: The Monolith Residence',
        type: 'url',
        posterUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85'
      }
    ],
    isFeatured: true,
    displayOrder: 4,
    isPublished: true,
    createdAt: '2025-01-05T08:00:00.000Z',
    updatedAt: '2025-02-14T10:10:00.000Z'
  },
  {
    id: 'proj-05',
    title: 'Maison Lumière',
    slug: 'maison-lumiere',
    category: 'Residential',
    location: 'Boat Club Road, Chennai',
    year: '2024',
    shortDescription: 'Parisian Haussmannian elegance reinterpreted with understated Indian tropical craftsmanship and fluted glass partitions.',
    fullDescription: 'Maison Lumière pairs refined French boiserie molding with clean contemporary Indian lines. Creamy ivory walls, herringbone natural oak floors, and custom curved furniture create an airy atmosphere bathed in golden hour daylight.',
    designConcept: 'Neoclassical proportion translated into contemporary residential lightness.',
    challenges: 'Achieving pristine boiserie paneling that resists warping in Chennai’s tropical climate.',
    solutions: 'Engineered high-density moisture-resistant MDF core panels anchored on marine-grade plywood battens with precision CNC routing.',
    coverImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        id: 'img-p5-1',
        url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=85',
        caption: 'Living salon with neoclassical wall molding and custom bouclé curved sofa',
        isCover: true,
        order: 1
      },
      {
        id: 'img-p5-2',
        url: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1600&q=85',
        caption: 'Primary bedroom dressed in soft linen draperies and brass accents',
        isCover: false,
        order: 2
      }
    ],
    videos: [],
    isFeatured: false,
    displayOrder: 5,
    isPublished: true,
    createdAt: '2024-08-10T12:00:00.000Z',
    updatedAt: '2024-11-20T17:00:00.000Z'
  },
  {
    id: 'proj-06',
    title: 'The Nexus Innovation Lab',
    slug: 'the-nexus-innovation-lab',
    category: 'Commercial',
    location: 'Electronic City, Bengaluru',
    year: '2024',
    shortDescription: 'A dynamic 22,000 sq.ft agile research campus prioritizing creative serendipity, acoustic pods, and biophilic interior architecture.',
    fullDescription: 'Nexus re-imagines technological workspaces as an organic landscape. Stepped amphitheater seating, modular acoustic phone booths, living green moss walls, and warm Scandinavian timber workstations encourage natural cross-pollination among engineering teams.',
    designConcept: 'Workplace as ecosystem: circadian lighting rhythms and ergonomic freedom.',
    challenges: 'Providing acoustic privacy in an open-concept industrial concrete shell with 18-foot ceilings.',
    solutions: 'Faceted sound-absorbing PET felt ceiling clouds, perforated timber wall panels, and tuned white noise sound masking systems.',
    coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        id: 'img-p6-1',
        url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
        caption: 'Central town hall amphitheater with integrated power modules and live greenery',
        isCover: true,
        order: 1
      },
      {
        id: 'img-p6-2',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=85',
        caption: 'Collaborative war room with writeable back-painted glass panels',
        isCover: false,
        order: 2
      }
    ],
    videos: [],
    isFeatured: false,
    displayOrder: 6,
    isPublished: true,
    createdAt: '2024-06-12T10:00:00.000Z',
    updatedAt: '2024-10-18T13:30:00.000Z'
  }
];

