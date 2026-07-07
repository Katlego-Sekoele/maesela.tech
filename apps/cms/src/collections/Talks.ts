import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Talks: CollectionConfig = {
  slug: 'talks',
  labels: { singular: 'Talk', plural: 'Talks' },
  access: { read: anyone, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publishedDate', 'shown'], group: 'Portfolio' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'link', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'publishedDate', type: 'date', required: true },
    { name: 'thumbnail', type: 'text', admin: { description: 'Optional; auto-derived from YouTube link when empty.' } },
    { name: 'shown', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
