/* eslint-disable no-console */
/**
 * One-off: index existing Vercel Blob photos (under etc/) into the Payload
 * `photos` metadata collection. Bytes stay in Blob (private store); we only
 * record pathname/alt/sensitive. Existing photos default to sensitive: true
 * (preserving today's all-gated behaviour); flip to public in the admin.
 *
 *   DATABASE_URL=... BLOB_READ_WRITE_TOKEN=... pnpm --filter @maesela/cms seed:photos
 */
import { getPayload } from 'payload'
import { list } from '@vercel/blob'
import config from '../payload.config'

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i

async function run() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN required')
  const payload = await getPayload({ config })

  const { blobs } = await list({ prefix: 'etc/', token })
  const images = blobs.filter((b) => IMAGE_RE.test(b.pathname))
  console.log(`Found ${images.length} image(s) under etc/`)

  const existing = await payload.find({
    collection: 'photos',
    limit: 5000,
    overrideAccess: true,
    depth: 0,
  })
  const havePaths = new Set((existing.docs as any[]).map((d) => d.pathname))

  let created = 0
  for (const b of images) {
    if (havePaths.has(b.pathname)) continue
    const alt = b.pathname
      .replace(/^etc\//, '')
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
    await payload.create({
      collection: 'photos',
      data: { pathname: b.pathname, alt, sensitive: true },
      overrideAccess: true,
    })
    created++
  }

  console.log(`✅ Indexed ${created} new photo(s); ${images.length - created} already present.`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Photo index failed:', err)
  process.exit(1)
})
