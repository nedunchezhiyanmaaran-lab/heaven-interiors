import { Material } from '@/types/material.types';

export const MATERIAL_CATEGORIES = [
  'Plywood',
  'Laminates',
  'Veneers',
  'MDF',
  'Particle Board',
  'Decorative Panels',
  'Other Interior Materials'
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-01',
    name: 'Platinum Calibrated BWP 710 Marine Plywood',
    slug: 'platinum-calibrated-bwp-710-marine-plywood',
    brand: 'CenturyPly / Club Platinum',
    category: 'Plywood',
    shortDescription: 'High-density Gurjan timber core marine plywood calibrated to 0.1mm tolerance with unplasticized PF resin.',
    fullDescription: 'Engineered specifically for luxury coastal residences, master kitchen carcases, and high-load architectural joinery. Manufactured using selected tropical hardwood veneers treated with proprietary Boron-Free preservation formulations. Quadruple-pressed through state-of-the-art hydraulic calibrators to ensure zero surface undulation before veneer application.',
    thickness: '18mm / 19mm (Also available in 12mm & 25mm)',
    dimensions: '8ft x 4ft (2440mm x 1220mm)',
    finishType: 'Double-Sided Calibrated Sanded Smooth (120 Grit)',
    color: 'Natural Amber Core',
    specifications: [
      { key: 'Standard Compliance', value: 'IS:710 Marine Grade Certified' },
      { key: 'Core Timber', value: '100% Selected Gurjan & Keruing Hardwood' },
      { key: 'Adhesive Matrix', value: 'Unextended Phenol Formaldehyde Resin' },
      { key: 'Borer & Termite Resistance', value: 'Nanotechnology Micro-Pore Impregnation (Lifetime)' },
      { key: 'Boiling Water Resistance', value: 'Over 120 Hours Continuous Boiling Test Pass' },
      { key: 'Screw Holding Strength', value: '> 2,800 N Face / > 2,200 N Edge' }
    ],
    additionalNotes: 'Recommended for all wet area joinery, vanity carcases, walk-in closets, and heavy architectural sliding doors.',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      {
        id: 'img-m1-1',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        caption: 'Uniform calibrated ply cross-section displaying void-free multi-layer core',
        order: 1
      },
      {
        id: 'img-m1-2',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Bespoke joinery skeleton constructed with 18mm BWP calibrated ply',
        order: 2
      }
    ],
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-02-15T12:00:00.000Z'
  },
  {
    id: 'mat-02',
    name: 'Smoked American Crown Walnut Natural Veneer',
    slug: 'smoked-american-crown-walnut-natural-veneer',
    brand: 'Decowood Luxury Naturals',
    category: 'Veneers',
    shortDescription: '0.55mm premium sliced crown-cut architectural timber veneer thermo-treated for rich chocolate and hazelnut depth.',
    fullDescription: 'Hand-selected from sustainably managed old-growth Appalachian forests. The thermo-smoking process alters the natural sugars within the timber without artificial chemical stains, ensuring that the warm charcoal and dark chocolate undertones permeate the entire cell structure. Bookmatched by master artisans for monumental feature walls and dining tables.',
    thickness: '0.55mm nominal face on fleece backing (Total 3.8mm on ply panel)',
    dimensions: '10ft x 4ft (3050mm x 1220mm) & 8ft x 4ft',
    finishType: 'Open Pore Deep Wire-Brushed / Polyurethane Ultra-Matte (5% Gloss)',
    color: 'Smoked Dark Charcoal / Espresso Brown',
    specifications: [
      { key: 'Flitch Cut', value: 'Quarter Sawn Crown Architectural Cut' },
      { key: 'Matching Pattern', value: 'Precision Bookmatched / Slipmatched on Request' },
      { key: 'Substrate Compatibility', value: 'BWP Marine Ply, Calibrated MDF, Fire-Retardant Boards' },
      { key: 'Eco Certification', value: 'FSC 100% Certified Sustainable Forestry' },
      { key: 'UV Resistance', value: 'High Resistance with Non-Yellowing Topcoat' }
    ],
    additionalNotes: 'Requires breathable micro-porous polyurethane or organic hard-wax oil finishing to preserve tactile grain texture.',
    coverImage: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      {
        id: 'img-m2-1',
        url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=80',
        caption: 'Monolithic bookmatched walnut wall panel in penthouse gallery',
        order: 1
      }
    ],
    displayOrder: 2,
    isFeatured: true,
    isPublished: true,
    createdAt: '2025-01-12T11:00:00.000Z',
    updatedAt: '2025-02-08T15:30:00.000Z'
  },
  {
    id: 'mat-03',
    name: 'Silk Touch Anti-Fingerprint Matte Laminate',
    slug: 'silk-touch-anti-fingerprint-matte-laminate',
    brand: 'Fenix NTM / Merino SuperMatte',
    category: 'Laminates',
    shortDescription: 'Nanotech ultra-opaque architectural laminate featuring thermal micro-scratch healing and zero specular reflection.',
    fullDescription: 'Created with next-generation acrylic resins cured through Electron Beam Curing. The low light reflectivity produces an exceptionally matte, velvety tactile touch that repels sebum, grease, and fingerprints. Minor superficial micro-scratches can be thermally healed with a standard household iron over a damp cloth.',
    thickness: '1.0mm decorative sheet / 12mm solid compact panel',
    dimensions: '8ft x 4ft (2440mm x 1220mm) & 10ft x 4.25ft',
    finishType: 'Ultra-Matte Soft Velvet Texture',
    color: 'Cast Iron Charcoal (#202020) & Warm Travertine Ivory',
    specifications: [
      { key: 'Surface Reflexion', value: 'Specularity < 3 at 60° angle' },
      { key: 'Thermal Scratch Healing', value: 'Self-repairable with heat contact' },
      { key: 'Hygiene & Food Contact', value: 'Certified Food Safe & Antibacterial (ISO 22196)' },
      { key: 'Impact Resistance', value: 'EN 438-2 Class 3 High Impact Rating' }
    ],
    additionalNotes: 'Ideal for luxury kitchen cabinet fronts, touch-sensitive wardrobe doors, and executive conference desks.',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      {
        id: 'img-m3-1',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        caption: 'Matte charcoal cabinetry paired with brass edge profiles',
        order: 1
      }
    ],
    displayOrder: 3,
    isFeatured: true,
    isPublished: true,
    createdAt: '2025-01-18T14:00:00.000Z',
    updatedAt: '2025-02-05T09:45:00.000Z'
  },
  {
    id: 'mat-04',
    name: 'Acoustic Fluted Oak Wall Slats with Recycled Felt',
    slug: 'acoustic-fluted-oak-wall-slats',
    brand: 'AcoustiWood Studio Series',
    category: 'Decorative Panels',
    shortDescription: 'Prefabricated acoustic architectural slat wall panels engineered for NRC 0.85 sound absorption with real wood veneers.',
    fullDescription: 'Designed to solve echo issues in double-height living halls, listening rooms, and executive boardrooms while introducing rich architectural rhythm. Comprises precision-milled MDF core slats wrapped in authentic Scandinavian white oak or smoked oak veneer, permanently heat-bonded to a 9mm sound-absorbing black PET felt backing crafted from recycled ocean plastics.',
    thickness: '21mm total (12mm slat depth + 9mm acoustic felt backing)',
    dimensions: '8ft x 2ft (2400mm x 600mm modules)',
    finishType: 'Precision Micro-Chamfered Slat Slit with Matte Natural Lacquer',
    color: 'Natural Nordic Oak on Charcoal Black Felt',
    specifications: [
      { key: 'Noise Reduction Coefficient (NRC)', value: '0.85 (Direct mount) / 0.95 (with 50mm air gap)' },
      { key: 'Acoustic Felt Substrate', value: '100% Recycled PET Felt (Oeko-Tex Standard 100)' },
      { key: 'Fire Rating', value: 'Class B-s1, d0 Flame Retardant' },
      { key: 'Installation Method', value: 'Concealed screw through felt or high-grab MS polymer adhesive' }
    ],
    additionalNotes: 'Effortlessly integrates with concealed linear LED lighting channels for evening mood illumination.',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      {
        id: 'img-m4-1',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Fluted acoustic panel installation behind master bed headboard',
        order: 1
      }
    ],
    displayOrder: 4,
    isFeatured: true,
    isPublished: true,
    createdAt: '2025-01-22T16:00:00.000Z',
    updatedAt: '2025-02-12T14:10:00.000Z'
  },
  {
    id: 'mat-05',
    name: 'HDHMR High Density Moisture Resistant Board',
    slug: 'hdhmr-high-density-moisture-resistant-board',
    brand: 'Action TESA Ultra-Dense HDHMR',
    category: 'MDF',
    shortDescription: 'Solid homogeneous density of > 850 kg/m³ with exceptional water resistance for complex CNC routed architectural screens.',
    fullDescription: 'High Density High Moisture Resistance (HDHMR) board manufactured through high-pressure continuous pressing using eucalyptus hardwood fibers. Its uniform core composition without knots or grain voids makes it the premier substrate for precision 3D wave boards, jaali screens, fluted wall cladding, and high-gloss PU lacquering.',
    thickness: '12mm / 18mm / 25mm',
    dimensions: '8ft x 4ft (2440mm x 1220mm)',
    finishType: 'Ultra-Smooth Sanded (Zero grain print-through)',
    color: 'Characteristic Emerald Green Core (Moisture Indicator)',
    specifications: [
      { key: 'Density', value: '> 860 kg/m³' },
      { key: 'Moisture Resistance', value: 'Water absorption < 7% after 24 hrs submersion' },
      { key: 'Modulus of Rupture (MOR)', value: '> 36 N/mm²' },
      { key: 'Internal Bond Strength', value: '> 0.85 N/mm²' }
    ],
    additionalNotes: 'Optimal substrate for automated CNC architectural carving, membrane pressing, and automotive-grade PU coatings.',
    coverImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      {
        id: 'img-m5-1',
        url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
        caption: 'CNC routed geometric jaali screen fabricated from 18mm HDHMR',
        order: 1
      }
    ],
    displayOrder: 5,
    isFeatured: false,
    isPublished: true,
    createdAt: '2025-01-28T09:30:00.000Z',
    updatedAt: '2025-02-10T16:00:00.000Z'
  }
];

