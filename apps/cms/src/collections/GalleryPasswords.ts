import type { CollectionConfig } from 'payload'
import bcrypt from 'bcryptjs'
import { adminOnly } from '../access'

/**
 * Shared gallery passwords that unlock sensitive media on the public site.
 * Admins type a plaintext password; it is hashed (bcrypt) into `hash` and the
 * plaintext is discarded before persisting. Revoke by setting `revokedAt`.
 */
export const GalleryPasswords: CollectionConfig = {
  slug: 'gallery-passwords',
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'revokedAt', 'createdAt'],
    group: 'Gallery',
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data?.password) {
          data.hash = await bcrypt.hash(String(data.password), 12)
        }
        // never persist the plaintext
        delete data.password
        return data
      },
    ],
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'password',
      type: 'text',
      access: { read: () => false },
      admin: { description: 'Set/replace the password. Stored only as a bcrypt hash.' },
    },
    {
      name: 'hash',
      type: 'text',
      access: { read: () => false, update: () => false },
      admin: { hidden: true, readOnly: true },
    },
    { name: 'revokedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
