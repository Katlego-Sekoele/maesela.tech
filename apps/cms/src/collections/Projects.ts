import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: { read: anyone, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'primaryLink', 'shown'], group: 'Portfolio' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'descriptionParagraphs', type: 'array', labels: { singular: 'Paragraph', plural: 'Paragraphs' }, fields: [{ name: 'paragraph', type: 'textarea', required: true }] },
    { name: 'links', type: 'array', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'url', type: 'text', required: true },
    ] },
    { name: 'primaryLink', type: 'text' },
    { name: 'order', type: 'number', admin: { description: 'Lower numbers appear first.', position: 'sidebar' } },
    { name: 'shown', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
