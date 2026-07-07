/* eslint-disable no-console */
/**
 * One-off migration: move portfolio content from apps/web/src/data.js and the
 * Redis-backed articles/gallery-passwords into Payload.
 *
 * Run:  DATABASE_URL=... [REDIS_URL=...] pnpm --filter @maesela/cms seed
 *
 * Idempotent: content collections are reset and re-inserted from data.js each run.
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const iso = (d: unknown): string | undefined => {
  if (!d) return undefined
  const date = d instanceof Date ? d : new Date(d as string)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}
const points = (arr: unknown): { point: string }[] =>
  Array.isArray(arr) ? arr.map((p) => ({ point: String(p) })) : []

async function loadPortfolio(): Promise<any> {
  const url = new URL('../../../web/src/data.js', import.meta.url).href
  return import(url)
}

async function resetCollection(payload: any, collection: string) {
  await payload.delete({ collection, where: { id: { exists: true } } })
}

async function run() {
  const payload = await getPayload({ config })
  const data = await loadPortfolio()

  // ---- Experiences ----
  await resetCollection(payload, 'experiences')
  for (const e of data.Experiences ?? []) {
    await payload.create({
      collection: 'experiences',
      data: {
        company: e.company,
        companyLink: e.companyLink ?? undefined,
        position: e.position ?? undefined,
        startDate: iso(e.startDate),
        endDate: iso(e.endDate),
        current: Boolean(e.current),
        shown: e.shown !== false,
        description: e.description ?? undefined,
        keyPoints: points(e.keyPoints),
      },
    })
  }

  // ---- Educations ----
  await resetCollection(payload, 'educations')
  for (const e of data.Educations ?? []) {
    await payload.create({
      collection: 'educations',
      data: {
        company: e.company,
        companyLink: e.companyLink ?? undefined,
        position: e.position ?? undefined,
        startDate: iso(e.startDate),
        endDate: iso(e.endDate),
        graduationDate: iso(e.graduationDate),
        grade: typeof e.grade === 'number' ? e.grade : undefined,
        current: Boolean(e.current),
        shown: e.shown !== false,
        description: e.description ?? undefined,
        keyPoints: points(e.keyPoints),
      },
    })
  }

  // ---- Certifications ----
  await resetCollection(payload, 'certifications')
  for (const c of data.Certifications ?? []) {
    await payload.create({
      collection: 'certifications',
      data: {
        name: c.name,
        detailsLink: c.detailsLink ?? undefined,
        verificationLink: c.verificationLink ?? undefined,
        description: c.description ?? undefined,
        acquiredDate: iso(c.acquiredDate),
        expiryDate: iso(c.expiryDate),
        shown: c.shown !== false,
      },
    })
  }

  // ---- Talks (videos) ----
  await resetCollection(payload, 'talks')
  for (const v of data.Videos ?? []) {
    await payload.create({
      collection: 'talks',
      data: {
        title: v.title,
        link: v.link,
        description: v.description ?? undefined,
        publishedDate: iso(v.publishedDate),
        thumbnail: v.thumbnail ?? undefined,
        shown: v.shown !== false,
      },
    })
  }

  // ---- Projects ----
  await resetCollection(payload, 'projects')
  let order = 0
  for (const p of data.Projects ?? []) {
    await payload.create({
      collection: 'projects',
      data: {
        name: p.name,
        descriptionParagraphs: (p.descriptionParagraphs ?? []).map((paragraph: string) => ({
          paragraph,
        })),
        links: (p.links ?? []).map((l: any) => ({ name: l.name, url: l.link })),
        primaryLink: p.primaryLink ?? undefined,
        order: order++,
        shown: p.shown !== false,
      },
    })
  }

  // ---- Globals ----
  const sb = data.ShortBio ?? {}
  await payload.updateGlobal({
    slug: 'short-bio',
    data: {
      bio: sb.bio ?? '',
      currentActivity: sb.current?.activity ?? undefined,
      currentPosition: sb.current?.position ?? undefined,
      currentCompany: sb.current?.company ?? undefined,
      interests: (sb.current?.interests ?? []).map((interest: string) => ({ interest })),
    },
  })

  const ab = data.About ?? {}
  await payload.updateGlobal({
    slug: 'about',
    data: {
      greeting: ab.greeting ?? undefined,
      tldr: ab.tldr ?? undefined,
      paragraphs: (ab.paragraphs ?? []).map((paragraph: string) => ({ paragraph })),
    },
  })

  const so = data.Socials ?? {}
  await payload.updateGlobal({
    slug: 'socials',
    data: {
      linkedin: so.linkedin,
      github: so.github,
      email: so.email,
      spotify: so.spotify,
      instagram: so.instagram,
    },
  })

  // ---- Articles + gallery passwords from Redis (optional, best-effort) ----
  if (process.env.REDIS_URL) {
    const { default: Redis } = await import('ioredis')
    const redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      connectTimeout: 8000,
      retryStrategy: () => null,
      lazyConnect: true,
    })
    redis.on('error', () => {})
    try {
      await redis.connect()
      const rawArticles = await redis.hgetall('articles')
      await resetCollection(payload, 'articles')
      for (const v of Object.values(rawArticles ?? {})) {
        const a = JSON.parse(v as string)
        await payload.create({
          collection: 'articles',
          data: {
            title: a.title,
            url: a.url,
            description: a.description ?? undefined,
            readDate: iso(a.readDate),
          },
        })
      }

      const rawPw = await redis.hgetall('gallery_passwords')
      await resetCollection(payload, 'gallery-passwords')
      for (const v of Object.values(rawPw ?? {})) {
        const p = JSON.parse(v as string)
        await payload.create({
          collection: 'gallery-passwords',
          data: {
            label: p.label,
            hash: p.hash,
            revokedAt: iso(p.revokedAt),
          },
        })
      }
      console.log('Imported articles + gallery-passwords from Redis.')
    } catch (err) {
      console.warn(
        'Redis import skipped (unreachable from this environment):',
        (err as Error).message,
      )
    } finally {
      redis.disconnect()
    }
  } else {
    console.log('REDIS_URL not set — skipping articles / gallery-passwords import.')
  }

  console.log('✅ Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
