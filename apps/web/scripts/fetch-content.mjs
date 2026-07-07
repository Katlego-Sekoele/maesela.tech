/* eslint-disable no-console */
/**
 * Build-time content fetch: pulls portfolio content from the Payload CMS and
 * writes src/content.generated.json, which src/data.js consumes. The committed
 * JSON is the offline fallback, so builds never break if the CMS is unreachable.
 *
 *   CMS_URL=https://maesela-cms.vercel.app node scripts/fetch-content.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../src/content.generated.json')
const CMS = (process.env.CMS_URL || process.env.VITE_CMS_URL || 'https://maesela-cms.vercel.app').replace(/\/$/, '')

const strip = (arr, key) => (Array.isArray(arr) ? arr.map((x) => x[key]).filter(Boolean) : [])

async function getDocs(collection, query = 'limit=200&depth=0') {
  const res = await fetch(`${CMS}/api/${collection}?${query}`)
  if (!res.ok) throw new Error(`${collection} -> ${res.status}`)
  const json = await res.json()
  return json.docs ?? []
}
async function getGlobal(slug) {
  const res = await fetch(`${CMS}/api/globals/${slug}?depth=0`)
  if (!res.ok) throw new Error(`global ${slug} -> ${res.status}`)
  return res.json()
}

async function main() {
  console.log(`[content] fetching from ${CMS}`)
  const [experiences, educations, certifications, talks, projects, articles] = await Promise.all([
    getDocs('experiences'),
    getDocs('educations'),
    getDocs('certifications'),
    getDocs('talks'),
    getDocs('projects', 'limit=200&depth=0&sort=order'),
    getDocs('articles', 'limit=200&depth=0&sort=-readDate').catch(() => []),
  ])
  const [shortBio, about, socials] = await Promise.all([
    getGlobal('short-bio'),
    getGlobal('about'),
    getGlobal('socials'),
  ])

  const content = {
    experiences: experiences.map((e) => ({
      company: e.company,
      companyLink: e.companyLink ?? null,
      position: e.position ?? '',
      startDate: e.startDate ?? null,
      endDate: e.endDate ?? null,
      description: e.description ?? '',
      current: !!e.current,
      shown: e.shown !== false,
      keyPoints: strip(e.keyPoints, 'point'),
    })),
    educations: educations.map((e) => ({
      company: e.company,
      companyLink: e.companyLink ?? null,
      position: e.position ?? '',
      startDate: e.startDate ?? null,
      endDate: e.endDate ?? null,
      graduationDate: e.graduationDate ?? null,
      grade: typeof e.grade === 'number' ? e.grade : null,
      current: !!e.current,
      shown: e.shown !== false,
      keyPoints: strip(e.keyPoints, 'point'),
    })),
    certifications: certifications.map((c) => ({
      name: c.name,
      detailsLink: c.detailsLink ?? null,
      verificationLink: c.verificationLink ?? null,
      description: c.description ?? '',
      acquiredDate: c.acquiredDate ?? null,
      expiryDate: c.expiryDate ?? null,
      shown: c.shown !== false,
    })),
    videos: talks.map((v) => ({
      title: v.title,
      link: v.link,
      description: v.description ?? '',
      publishedDate: v.publishedDate ?? null,
      thumbnail: v.thumbnail ?? null,
      shown: v.shown !== false,
    })),
    projects: projects.map((p) => ({
      name: p.name,
      descriptionParagraphs: strip(p.descriptionParagraphs, 'paragraph'),
      links: (p.links ?? []).map((l) => ({ name: l.name, link: l.url })),
      primaryLink: p.primaryLink ?? null,
      shown: p.shown !== false,
    })),
    articles: articles.map((a) => ({
      title: a.title,
      url: a.url,
      description: a.description ?? '',
      readDate: a.readDate ?? null,
    })),
    shortBio: {
      bio: shortBio.bio ?? '',
      current: {
        activity: shortBio.currentActivity ?? '',
        position: shortBio.currentPosition ?? '',
        company: shortBio.currentCompany ?? '',
        interests: strip(shortBio.interests, 'interest'),
      },
    },
    about: {
      greeting: about.greeting ?? '',
      tldr: about.tldr ?? '',
      paragraphs: strip(about.paragraphs, 'paragraph'),
    },
    socials: {
      linkedin: socials.linkedin ?? '',
      github: socials.github ?? '',
      email: socials.email ?? '',
      spotify: socials.spotify ?? '',
      instagram: socials.instagram ?? '',
    },
  }

  writeFileSync(OUT, JSON.stringify(content, null, 2) + '\n')
  console.log(
    `[content] wrote ${path.relative(process.cwd(), OUT)} — ` +
      `${content.experiences.length} exp, ${content.educations.length} edu, ` +
      `${content.projects.length} projects, ${content.videos.length} talks, ` +
      `${content.certifications.length} certs, ${content.articles.length} articles`,
  )
}

main().catch((err) => {
  console.error('[content] fetch failed:', err.message)
  if (existsSync(OUT)) {
    console.warn('[content] keeping existing committed snapshot as fallback.')
    // read to validate it parses; exit 0 so the build proceeds offline
    JSON.parse(readFileSync(OUT, 'utf8'))
    process.exit(0)
  }
  process.exit(1)
})
