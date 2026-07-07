import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

export const GalleryPasswords: CollectionConfig = {
  slug: 'gallery-passwords',
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: { useAsTitle: 'label', defaultColumns: ['label', 'revokedAt', 'createdAt'], group: 'Gallery' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'hash', type: 'text', required: true, access: { read: () => false }, admin: { hidden: true } },
    { name: 'revokedAt', type: 'date' },
  ],
}
