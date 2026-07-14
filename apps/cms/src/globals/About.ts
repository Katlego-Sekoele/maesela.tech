import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const About: GlobalConfig = {
  slug: 'about',
  access: { read: anyone, update: adminOnly },
  admin: { group: 'Portfolio' },
  hooks: {
    // Whatever photo is picked as the About portrait must be publicly visible
    // (the About page has no password gate), so force it off "sensitive" here
    // rather than relying on the admin to remember to flip it.
    beforeChange: [
      async ({ data, req }) => {
        const id = data?.portraitId ? Number(data.portraitId) : null
        if (id) {
          try {
            const photo = await req.payload.findByID({
              collection: 'photos',
              id,
              overrideAccess: true,
              depth: 0,
            })
            if (photo?.sensitive) {
              await req.payload.update({
                collection: 'photos',
                id,
                data: { sensitive: false },
                overrideAccess: true,
              })
            }
          } catch {
            // ignore — a bad id just won't render on the site
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'greeting', type: 'text' },
    { name: 'tldr', type: 'textarea' },
    { name: 'paragraphs', type: 'array', fields: [{ name: 'paragraph', type: 'textarea', required: true }] },
    {
      name: 'portraitId',
      type: 'text',
      admin: {
        description:
          'Photo to use as the About-page portrait. Upload/find it in Gallery → Photos, then paste its ID here (visible in that photo\'s edit URL, e.g. /admin/collections/photos/258 → 258). Automatically made public when set.',
        components: { Field: '@/components/PortraitIdField#PortraitIdField' },
      },
    },
    {
      name: 'portraitAlt',
      type: 'text',
      admin: { description: 'Alt text for the portrait image.' },
    },
  ],
}
