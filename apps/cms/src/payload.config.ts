import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
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

// Only enable Vercel Blob when a real token is present (production / when pulled
// from Vercel). Locally we fall back to Payload's default disk storage.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const useBlob = Boolean(blobToken && blobToken.startsWith('vercel_blob_rw_'))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
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
    },
  }),
  sharp,
  plugins: [
    ...(useBlob
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: true,
            },
            token: blobToken as string,
          }),
        ]
      : []),
  ],
})
