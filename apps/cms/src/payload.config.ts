import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Photos } from './collections/Photos'
import { Experiences } from './collections/Experiences'
import { Educations } from './collections/Educations'
import { Certifications } from './collections/Certifications'
import { Talks } from './collections/Talks'
import { Projects } from './collections/Projects'
import { Articles } from './collections/Articles'
import { GalleryPasswords } from './collections/GalleryPasswords'
import { ShortBio } from './globals/ShortBio'
import { About } from './globals/About'
import { Socials } from './globals/Socials'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Photos,
    Experiences,
    Educations,
    Certifications,
    Talks,
    Projects,
    Articles,
    GalleryPasswords,
  ],
  globals: [ShortBio, About, Socials],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
      // Keep per-instance connections low; runtime uses Neon's pooled endpoint
      // so many concurrent serverless invocations don't exhaust Postgres.
      max: Number(process.env.DB_POOL_MAX || 4),
    },
  }),
  sharp,
})
