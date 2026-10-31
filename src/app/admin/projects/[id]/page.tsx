'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { projectService } from '@/services/project.service';
import { Project } from '@/types/project.types';
import { ProjectEditorForm } from '@/components/admin/ProjectEditorForm';

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const p = await projectService.getById(id);
        setProject(p);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs font-admin font-medium text-[#C5A15B]">
        Loading commission details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-16 text-center text-sm font-admin text-[#78726A]">
        Project not found.
      </div>
    );
  }

  return <ProjectEditorForm initialProject={project} isNew={false} />;
}

