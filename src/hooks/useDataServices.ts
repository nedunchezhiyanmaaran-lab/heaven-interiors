'use client';

import { useState, useEffect, useCallback } from 'react';
import { projectService } from '@/services/project.service';
import { videoService } from '@/services/video.service';
import { materialService } from '@/services/material.service';
import { serviceService } from '@/services/service.service';
import { testimonialService } from '@/services/testimonial.service';
import { enquiryService } from '@/services/enquiry.service';
import { websiteContentService } from '@/services/website-content.service';
import { storageService } from '@/lib/storage/storage.service';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { Project } from '@/types/project.types';
import { VideoItem } from '@/types/video.types';
import { Material } from '@/types/material.types';
import { ServiceItem } from '@/types/service.types';
import { Testimonial } from '@/types/testimonial.types';
import { Enquiry } from '@/types/enquiry.types';
import { WebsiteContent } from '@/types/website-content.types';
import { INITIAL_WEBSITE_CONTENT } from '@/data/mock-website-content';
import { INITIAL_PROJECTS } from '@/data/mock-projects';
import { INITIAL_VIDEOS } from '@/data/mock-videos';
import { INITIAL_MATERIALS } from '@/data/mock-materials';
import { INITIAL_SERVICES } from '@/data/mock-services';
import { INITIAL_TESTIMONIALS } from '@/data/mock-testimonials';

// Hook for Projects
export function useProjects(publishedOnly: boolean = false) {
  const [projects, setProjects] = useState<Project[]>(() =>
    publishedOnly ? INITIAL_PROJECTS.filter((p) => p.isPublished) : INITIAL_PROJECTS
  );
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const data = publishedOnly
        ? await projectService.getPublished()
        : await projectService.getAll();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchProjects();

    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.PROJECTS) {
        fetchProjects();
      }
    });

    const handleCustom = (e: any) => {
      if (e.detail?.key === STORAGE_KEYS.PROJECTS) {
        fetchProjects();
      }
    };
    window.addEventListener('heaven-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('heaven-storage-update', handleCustom);
    };
  }, [fetchProjects]);

  return { projects, loading, refresh: fetchProjects };
}

// Hook for Videos
export function useVideos(publishedOnly: boolean = false) {
  const [videos, setVideos] = useState<VideoItem[]>(() =>
    publishedOnly ? INITIAL_VIDEOS.filter((v) => v.isPublished) : INITIAL_VIDEOS
  );
  const [loading, setLoading] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      const data = publishedOnly
        ? await videoService.getPublished()
        : await videoService.getAll();
      setVideos(data);
    } finally {
      setLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchVideos();

    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.VIDEOS) {
        fetchVideos();
      }
    });

    const handleCustom = (e: any) => {
      if (e.detail?.key === STORAGE_KEYS.VIDEOS) {
        fetchVideos();
      }
    };
    window.addEventListener('heaven-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('heaven-storage-update', handleCustom);
    };
  }, [fetchVideos]);

  return { videos, loading, refresh: fetchVideos };
}

// Hook for Materials
export function useMaterials(publishedOnly: boolean = false) {
  const [materials, setMaterials] = useState<Material[]>(() =>
    publishedOnly ? INITIAL_MATERIALS.filter((m) => m.isPublished) : INITIAL_MATERIALS
  );
  const [loading, setLoading] = useState(false);

  const fetchMaterials = useCallback(async () => {
    try {
      const data = publishedOnly
        ? await materialService.getPublished()
        : await materialService.getAll();
      setMaterials(data);
    } finally {
      setLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchMaterials();

    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.MATERIALS) {
        fetchMaterials();
      }
    });

    const handleCustom = (e: any) => {
      if (e.detail?.key === STORAGE_KEYS.MATERIALS) {
        fetchMaterials();
      }
    };
    window.addEventListener('heaven-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('heaven-storage-update', handleCustom);
    };
  }, [fetchMaterials]);

  return { materials, loading, refresh: fetchMaterials };
}

// Hook for Services
export function useServices(publishedOnly: boolean = false) {
  const [services, setServices] = useState<ServiceItem[]>(() =>
    publishedOnly ? INITIAL_SERVICES.filter((s) => s.isPublished) : INITIAL_SERVICES
  );
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      const data = publishedOnly
        ? await serviceService.getPublished()
        : await serviceService.getAll();
      setServices(data);
    } finally {
      setLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchServices();

    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.SERVICES) {
        fetchServices();
      }
    });

    const handleCustom = (e: any) => {
      if (e.detail?.key === STORAGE_KEYS.SERVICES) {
        fetchServices();
      }
    };
    window.addEventListener('heaven-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('heaven-storage-update', handleCustom);
    };
  }, [fetchServices]);

  return { services, loading, refresh: fetchServices };
}

// Hook for Testimonials
export function useTestimonials(publishedOnly: boolean = false) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    publishedOnly ? INITIAL_TESTIMONIALS.filter((t) => t.isPublished) : INITIAL_TESTIMONIALS
  );
  const [loading, setLoading] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      const data = publishedOnly
        ? await testimonialService.getPublished()
        : await testimonialService.getAll();
      setTestimonials(data);
    } finally {
      setLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    fetchTestimonials();

    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.TESTIMONIALS) {
        fetchTestimonials();
      }
    });

    const handleCustom = (e: any) => {
      if (e.detail?.key === STORAGE_KEYS.TESTIMONIALS) {
        fetchTestimonials();
      }
    };
    window.addEventListener('heaven-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('heaven-storage-update', handleCustom);
    };
  }, [fetchTestimonials]);

  return { testimonials, loading, refresh: fetchTestimonials };
}

// Hook for Website Content
export function useWebsiteContent() {
  const [content, setContent] = useState<WebsiteContent>(INITIAL_WEBSITE_CONTENT);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const data = await websiteContentService.getContent();
      setContent(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.WEBSITE_CONTENT) {
        fetchContent();
      }
    });

    const handleCustom = (e: any) => {
      if (e.detail?.key === STORAGE_KEYS.WEBSITE_CONTENT) {
        fetchContent();
      }
    };
    window.addEventListener('heaven-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('heaven-storage-update', handleCustom);
    };
  }, [fetchContent]);

  return { content, loading, refresh: fetchContent };
}

// Hook for Enquiries
export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = useCallback(async () => {
    try {
      const data = await enquiryService.getAll();
      setEnquiries(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();

    const unsubscribe = storageService.subscribe((key) => {
      if (key === STORAGE_KEYS.ENQUIRIES) {
        fetchEnquiries();
      }
    });

    const handleCustom = (e: any) => {
      if (e.detail?.key === STORAGE_KEYS.ENQUIRIES) {
        fetchEnquiries();
      }
    };
    window.addEventListener('heaven-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('heaven-storage-update', handleCustom);
    };
  }, [fetchEnquiries]);

  return { enquiries, loading, refresh: fetchEnquiries };
}

