/* eslint-disable no-console */
/**
 * Bulk-upload gallery photos: push every image in a local folder to Vercel Blob
 * under etc/ (private access) and index each into the Payload `photos`
 * collection. New photos default to sensitive; flip them to public in the admin.
 *
 *   DATABASE_URL=... BLOB_READ_WRITE_TOKEN=... \
 *     pnpm --filter @maesela/cms exec tsx src/seed/upload-photos.ts <folder> [--public]
 *
 * Idempotent: existing pathnames are skipped (pass --overwrite to replace bytes).
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { put } from '@vercel/blob'
import { getPayload } from 'payload'
import config from '../payload.config'

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i
const MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', gif: 'image/gif', avif: 'image/avif',
}

async function run() {
  const args = process.argv.slice(2)
  const folder = args.find((a) => !a.startsWith('--'))
  const isPublic = args.includes('--public')
  const overwrite = args.includes('--overwrite')
  if (!folder) throw new Error('Usage: upload-photos <folder> [--public] [--overwrite]')

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN required')

  const files = (await readdir(folder)).filter((f) => IMAGE_RE.test(f)).sort()
  console.log(`Found ${files.length} image(s) in ${folder}`)

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'photos', limit: 5000, overrideAccess: true, depth: 0 })
  const havePaths = new Set((existing.docs as any[]).map((d) => d.pathname))

  let uploaded = 0
  let skipped = 0
  for (const file of files) {
    const pathname = `etc/${file}`
    if (havePaths.has(pathname) && !overwrite) {
      skipped++
      continue
    }
    const ext = (file.split('.').pop() || '').toLowerCase()
    const buffer = await readFile(path.join(folder, file))
    await put(pathname, buffer, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: MIME[ext] || 'application/octet-stream',
      token,
    })
    if (!havePaths.has(pathname)) {
      const alt = file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      await payload.create({
        collection: 'photos',
        data: { pathname, alt, sensitive: !isPublic },
        overrideAccess: true,
      })
    }
    uploaded++
    if (uploaded % 10 === 0) console.log(`  ...${uploaded} uploaded`)
  }

  console.log(`✅ Uploaded ${uploaded} photo(s) (${isPublic ? 'public' : 'sensitive'}); skipped ${skipped} existing.`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Upload failed:', err)
  process.exit(1)
})
