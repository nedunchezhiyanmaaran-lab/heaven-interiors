import React from 'react';
import { Hero } from '@/components/website/Hero';
import { StudioIntro } from '@/components/website/StudioIntro';
import { FeaturedProjects } from '@/components/website/FeaturedProjects';
import { ServicesSection } from '@/components/website/ServicesSection';
import { DesignProcess } from '@/components/website/DesignProcess';
import { MaterialsSection } from '@/components/website/MaterialsSection';
import { VideoShowcase } from '@/components/website/VideoShowcase';
import { TestimonialsSection } from '@/components/website/TestimonialsSection';
import { ContactSection } from '@/components/website/ContactSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StudioIntro />
      <FeaturedProjects />
      <MaterialsSection />
      <DesignProcess />
      <VideoShowcase />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}

