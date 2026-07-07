// Base URL of the Payload CMS (backend). Override with VITE_CMS_URL at build time.
export const CMS_URL = (
  import.meta.env.VITE_CMS_URL || 'https://maesela-cms.vercel.app'
).replace(/\/$/, '');
