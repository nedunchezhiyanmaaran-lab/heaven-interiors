import { ServiceItem } from '@/types/service.types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-01',
    number: '01',
    title: 'Residential Interior Architecture',
    slug: 'residential-interior-architecture',
    shortDescription: 'Tailored luxury residences, private villas, and penthouses designed around daily rituals and natural daylight.',
    fullDescription: 'From spatial reconfiguration and bespoke millwork detailing to museum-grade lighting schemes and acoustic zoning, our residential team designs sanctuary-grade homes that transcend fleeting decor trends.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Bespoke architectural layout & 3D visualization',
      'Custom millwork, wardrobe & kitchen design',
      'Lighting design & home automation planning',
      'Sanitaryware, stone & finishes curation',
      'Art advisory & interior styling'
    ],
    displayOrder: 1,
    isPublished: true
  },
  {
    id: 'srv-02',
    number: '02',
    title: 'Commercial & Workplace Interiors',
    slug: 'commercial-workplace-interiors',
    shortDescription: 'Executive headquarters, boutique family offices, and creative studios crafted for prestige and high productivity.',
    fullDescription: 'We merge brand identity with ergonomic spatial science. Every square foot is engineered for seamless executive collaboration, private acoustic discretion, and timeless corporate authority.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Agile spatial masterplanning & density analysis',
      'Acoustic STC engineering & sound isolation',
      'Boardroom & executive suite bespoke joinery',
      'Integrated MEP, HVAC & smart access control',
      'Regulatory compliance & statutory approvals'
    ],
    displayOrder: 2,
    isPublished: true
  },
  {
    id: 'srv-03',
    number: '03',
    title: 'Turnkey Project Execution',
    slug: 'turnkey-project-execution',
    shortDescription: 'Single-point accountability from raw structural shell to final art placement with rigorous cost and timeline governance.',
    fullDescription: 'Our turnkey service frees clients from the friction of coordinating dozens of independent sub-contractors. We oversee civil modifications, specialized woodworking fabrication, stone masonry, mechanical services, and final handover.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Comprehensive BOQ formulation & cost lock',
      'Dedicated site architects & project engineers',
      'Off-site CNC joinery fabrication & pre-assembly',
      'Rigorous 140-point quality audit before handover',
      'Post-completion warranty & structural maintenance'
    ],
    displayOrder: 3,
    isPublished: true
  },
  {
    id: 'srv-04',
    number: '04',
    title: 'Spatial Planning & 3D Visualization',
    slug: 'space-planning-visualization',
    shortDescription: 'Advanced volumetric analysis, BIM modeling, and photo-real virtual walkthroughs before physical ground is broken.',
    fullDescription: 'We interrogate spatial circulation, sun path angles, and functional adjacencies. High-fidelity CGI renders and immersive virtual tours allow you to experience materials, textures, and evening illumination with total certainty.',
    imageUrl: '/reference_assets/sketch_concept_hd.jpg',
    deliverables: [
      'Volumetric space zoning & traffic flow analysis',
      'Photorealistic 8K daylight & night CGI renderings',
      'BIM structural clash detection',
      'Detailed millwork shop drawings & elevation sheets',
      'Virtual walkthrough video sequences'
    ],
    displayOrder: 4,
    isPublished: true
  },
  {
    id: 'srv-05',
    number: '05',
    title: 'Bespoke Furniture & Architectural Millwork',
    slug: 'bespoke-furniture-architectural-millwork',
    shortDescription: 'One-of-a-kind furniture pieces, floating marble credenzas, and sculptural woodwork hand-built by master craftsmen.',
    fullDescription: 'In our dedicated atelier, furniture is treated as functional sculpture. We select seasoned hardwoods, rare architectural veneers, hand-patinated bronzes, and bookmatched marbles to create generational heirlooms.',
    imageUrl: '/reference_assets/sketch_development_hd.jpg',
    deliverables: [
      'One-off dining & conference table engineering',
      'Fluted timber acoustic wall cladding',
      'Walk-in wardrobe systems with concealed lighting',
      'Custom upholstered seating in Kvadrat & bouclé fabrics',
      'Architectural bronze door hardware fabrication'
    ],
    displayOrder: 5,
    isPublished: true
  },
  {
    id: 'srv-06',
    number: '06',
    title: 'Architectural Design & Facade Integration',
    slug: 'architectural-design-facade-integration',
    shortDescription: 'Cohesive architectural dialogue between external building envelope, landscape elements, and interior volumes.',
    fullDescription: 'We design residences and boutique pavilions from the inside out. By coordinating structural envelopes with internal floor plates, we ensure natural ventilation, deep shaded verandahs, and monumental frame views of nature.',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    deliverables: [
      'Architectural concept & spatial massing',
      'Facade fenestration & solar shading screens',
      'Landscape & interior water body integration',
      'Structural coordination with civil consultants',
      'Sustainable passive cooling design strategy'
    ],
    displayOrder: 6,
    isPublished: true
  }
];

