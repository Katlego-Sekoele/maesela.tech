import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Socials: GlobalConfig = {
  slug: 'socials',
  access: { read: anyone, update: adminOnly },
  admin: { group: 'Portfolio' },
  fields: [
    { name: 'linkedin', type: 'text' },
    { name: 'github', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'spotify', type: 'text' },
    { name: 'instagram', type: 'text' },
  ],
}
