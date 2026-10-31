export interface HeroContent {
  headline: string;
  subheadline: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  backgroundImage: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  experienceYears: string;
  completedProjectsCount: string;
  awardsCount: string;
  primaryImage: string;
  secondaryImage: string;
  stats: AboutStat[];
}

export interface DesignProcessStage {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  order: number;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  cityState: string;
  workingHours: string;
  instagram: string;
  linkedin: string;
  pinterest: string;
  whatsapp: string;
}

export interface FooterContent {
  tagline: string;
  description: string;
  copyrightText: string;
}

export interface WebsiteContent {
  hero: HeroContent;
  about: AboutContent;
  process: DesignProcessStage[];
  contact: ContactInfo;
  footer: FooterContent;
  updatedAt: string;
}

