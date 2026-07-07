import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: { singular: 'Experience', plural: 'Experience' },
  access: { read: anyone, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'position', 'startDate', 'shown'], group: 'Portfolio' },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'companyLink', type: 'text' },
    { name: 'position', type: 'text' },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', admin: { description: 'Leave empty for a current role.' } },
    { name: 'current', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'shown', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'description', type: 'textarea' },
    { name: 'keyPoints', type: 'array', fields: [{ name: 'point', type: 'text', required: true }] },
  ],
}
