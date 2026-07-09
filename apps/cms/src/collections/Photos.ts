import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

/**
 * Gallery photo metadata. The image bytes live in Vercel Blob under `etc/`
 * (a private store); this collection only records each photo's `pathname`,
 * `alt`, and whether it is `sensitive`. The Hono `/api/site/photo` proxy reads
 * the bytes from Blob and gates sensitive photos behind the gallery session.
 */
export const Photos: CollectionConfig = {
  slug: 'photos',
  // Not publicly listable via REST — the public site reads photos through the
  // Hono /api/site/photos endpoint (which enforces the sensitive/session gate).
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['preview', 'alt', 'sensitive', 'pathname'],
    group: 'Gallery',
    // Fewer thumbnails per page → fewer concurrent proxy/DB hits.
    pagination: { defaultLimit: 12, limits: [12, 24, 48] },
  },
  fields: [
    {
      name: 'preview',
      type: 'ui',
      label: 'Preview',
      admin: {
        components: {
          // Thumbnail in the list view + full preview in the edit view.
          Cell: '@/components/PhotoThumb#PhotoThumbCell',
          Field: '@/components/PhotoThumb#PhotoPreviewField',
        },
      },
    },
    {
      name: 'pathname',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Blob object path, e.g. etc/photo.jpg', readOnly: true },
    },
    { name: 'alt', type: 'text' },
    {
      name: 'sensitive',
      type: 'checkbox',
      label: 'Sensitive (requires gallery password)',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'When enabled, this photo is only shown after the gallery password is entered.',
      },
    },
  ],
}
