import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // Public images are readable by anyone. Sensitive images are restricted to
    // admins (req.user) or a valid gallery session (req.context.gallerySession,
    // set by the Hono gallery middleware). Everyone else only sees public media.
    read: ({ req }) => {
      if (req.user) return true
      if (req.context?.gallerySession) return true
      return { sensitive: { equals: false } }
    },
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'sensitive', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'sensitive',
      type: 'checkbox',
      label: 'Sensitive (requires gallery password)',
      defaultValue: false,
      index: true,
      admin: {
        description:
          'When enabled, this image is hidden from the public site and only shown after the gallery password is entered.',
        position: 'sidebar',
      },
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
    },
  ],
  upload: true,
}
