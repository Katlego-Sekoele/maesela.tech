import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  access: { read: anyone, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'acquiredDate', 'expiryDate', 'shown'], group: 'Portfolio' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'detailsLink', type: 'text' },
    { name: 'verificationLink', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'acquiredDate', type: 'date', required: true },
    { name: 'expiryDate', type: 'date' },
    { name: 'shown', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
