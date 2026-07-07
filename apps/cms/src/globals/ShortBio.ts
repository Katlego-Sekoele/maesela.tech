import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const ShortBio: GlobalConfig = {
  slug: 'short-bio',
  access: { read: anyone, update: adminOnly },
  admin: { group: 'Portfolio' },
  fields: [
    { name: 'bio', type: 'textarea', required: true },
    { name: 'currentActivity', type: 'text', admin: { description: 'e.g. "working as a"' } },
    { name: 'currentPosition', type: 'text' },
    { name: 'currentCompany', type: 'text' },
    { name: 'interests', type: 'array', fields: [{ name: 'interest', type: 'text', required: true }] },
  ],
}
