import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

/**
 * Admin users for the Payload panel. Uses Payload's native auth (bcrypt,
 * sessions, JWT, lockout, password reset). better-auth can replace this later
 * once its Payload plugin supports Payload 3.85+.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  versions: false,
}
