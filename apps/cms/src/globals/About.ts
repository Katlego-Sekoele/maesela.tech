import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const About: GlobalConfig = {
  slug: 'about',
  access: { read: anyone, update: adminOnly },
  admin: { group: 'Portfolio' },
  fields: [
    { name: 'greeting', type: 'text' },
    { name: 'tldr', type: 'textarea' },
    { name: 'paragraphs', type: 'array', fields: [{ name: 'paragraph', type: 'textarea', required: true }] },
  ],
}
