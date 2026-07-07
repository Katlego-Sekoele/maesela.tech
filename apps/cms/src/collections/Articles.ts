import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: { read: anyone, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'readDate', 'url'], group: 'Content' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'url', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'readDate', type: 'date', required: true },
  ],
}
