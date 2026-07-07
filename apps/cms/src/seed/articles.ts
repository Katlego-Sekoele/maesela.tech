/* eslint-disable no-console */
/**
 * Import reading-list articles into Payload. Prefers Redis (LEGACY via
 * REDIS_URL) but falls back to a public JSON endpoint (LEGACY_ARTICLES_URL,
 * e.g. https://maesela.tech/api/articles) which is reachable everywhere.
 *
 *   DATABASE_URL=... LEGACY_ARTICLES_URL=https://maesela.tech/api/articles \
 *     pnpm --filter @maesela/cms exec tsx src/seed/articles.ts
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const iso = (d: unknown): string | undefined => {
  if (!d) return undefined
  const date = new Date(d as string)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

async function run() {
  const url = process.env.LEGACY_ARTICLES_URL
  if (!url) throw new Error('LEGACY_ARTICLES_URL required')
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`)
  const json = await res.json()
  const articles: any[] = json.articles ?? json.docs ?? []
  console.log(`Fetched ${articles.length} article(s)`)

  const payload = await getPayload({ config })
  await payload.delete({ collection: 'articles', where: { id: { exists: true } }, overrideAccess: true })

  let created = 0
  for (const a of articles) {
    if (!a.title || !a.url) continue
    await payload.create({
      collection: 'articles',
      data: {
        title: a.title,
        url: a.url,
        description: a.description ?? undefined,
        readDate: iso(a.readDate),
      },
      overrideAccess: true,
    })
    created++
  }
  console.log(`✅ Imported ${created} article(s).`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Article import failed:', err)
  process.exit(1)
})
