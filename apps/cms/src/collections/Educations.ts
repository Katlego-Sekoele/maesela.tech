import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Educations: CollectionConfig = {
  slug: 'educations',
  labels: { singular: 'Education', plural: 'Education' },
  access: { read: anyone, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'position', 'graduationDate', 'shown'], group: 'Portfolio' },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'companyLink', type: 'text' },
    { name: 'position', type: 'text' },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    { name: 'graduationDate', type: 'date' },
    { name: 'grade', type: 'number', admin: { description: 'GPA / percentage. Leave empty for in-progress.' } },
    { name: 'current', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'shown', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'description', type: 'textarea' },
    { name: 'keyPoints', type: 'array', fields: [{ name: 'point', type: 'text', required: true }] },
  ],
}
