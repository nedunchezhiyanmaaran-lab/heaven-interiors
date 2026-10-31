export const STORAGE_VERSION = 'v2.0';

export const STORAGE_KEYS = {
  VERSION: `heaven_storage_version`,
  PROJECTS: `heaven_projects_${STORAGE_VERSION}`,
  VIDEOS: `heaven_videos_${STORAGE_VERSION}`,
  MATERIALS: `heaven_materials_${STORAGE_VERSION}`,
  SERVICES: `heaven_services_${STORAGE_VERSION}`,
  TESTIMONIALS: `heaven_testimonials_${STORAGE_VERSION}`,
  ENQUIRIES: `heaven_enquiries_${STORAGE_VERSION}`,
  WEBSITE_CONTENT: `heaven_website_content_${STORAGE_VERSION}`,
  AUTH_SESSION: `heaven_admin_session_${STORAGE_VERSION}`,
  SYNC_EVENT: `heaven_sync_event`
} as const;

