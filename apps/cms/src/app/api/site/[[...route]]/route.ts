import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { getCookie, setCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import bcrypt from 'bcryptjs'
import sharp from 'sharp'
import { head, put } from '@vercel/blob'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { GALLERY_COOKIE, signGallerySession, verifyGallerySession } from '@/lib/gallery'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const MAX_WIDTH = 2400

let _payloadPromise: ReturnType<typeof getPayload> | null = null
const getPayloadClient = () => (_payloadPromise ??= getPayload({ config }))

// Allow the public web app (any origin) to read; credentials for the session cookie.
const app = new Hono().basePath('/api/site')
app.use(
  '*',
  cors({
    origin: (o) => o || '*',
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
)

// Accept the gallery token from a Bearer header (fetch), a `t` query param
// (so <img> tags work cross-origin without cookies), or the session cookie.
const tokenFromReq = (c: any): string | undefined => {
  const auth = c.req.header('authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  return c.req.query('t') || getCookie(c, GALLERY_COOKIE)
}
const hasSession = async (c: any) => verifyGallerySession(tokenFromReq(c))

// ---- Gallery auth ----
app.get('/gallery/status', async (c) => c.json({ authed: await hasSession(c) }))

app.post('/gallery/auth', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!password) return c.json({ error: 'password is required' }, 400)

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'gallery-passwords',
    where: { revokedAt: { exists: false } },
    limit: 100,
    overrideAccess: true,
    depth: 0,
  })
  for (const entry of docs as Array<{ hash?: string }>) {
    if (entry.hash && (await bcrypt.compare(password, entry.hash))) {
      const token = await signGallerySession()
      setCookie(c, GALLERY_COOKIE, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        maxAge: 8 * 60 * 60,
      })
      // Also return the token so the (cross-origin) web app can send it as a
      // Bearer header / image query param without relying on third-party cookies.
      return c.json({ ok: true, token })
    }
  }
  return c.json({ error: 'Invalid password' }, 401)
})

// ---- Admin photo upload (used by the Photos list dropzone in the admin) ----
app.post('/admin/photos', async (c) => {
  const payload = await getPayloadClient()
  let isAdmin = false
  try {
    const { user } = await payload.auth({ headers: c.req.raw.headers })
    isAdmin = Boolean(user)
  } catch {
    /* not an admin */
  }
  if (!isAdmin) return c.json({ error: 'Unauthorized' }, 401)

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return c.json({ error: 'Blob not configured' }, 500)

  const form = await c.req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) return c.json({ error: 'file required' }, 400)

  const altRaw = form?.get('alt')
  const alt =
    typeof altRaw === 'string' && altRaw.trim()
      ? altRaw.trim()
      : file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
  const sensitive = form?.get('sensitive') !== 'false'

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const pathname = `uploads/${Date.now()}-${safeName}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await put(pathname, buffer, {
    access: 'private',
    addRandomSuffix: false,
    contentType: file.type || 'application/octet-stream',
    token,
  })

  const doc = await payload.create({
    collection: 'photos',
    data: { pathname, alt, sensitive },
    overrideAccess: true,
  })

  return c.json({ photo: doc })
})

// ---- Photo listing (public always; sensitive only with a session) ----
app.get('/photos', async (c) => {
  const authed = await hasSession(c)
  const offset = Math.max(parseInt(c.req.query('offset') || '0', 10) || 0, 0)
  const limit = Math.min(Math.max(parseInt(c.req.query('limit') || '24', 10) || 24, 1), 60)

  const payload = await getPayloadClient()
  const where: Where = authed ? {} : { sensitive: { equals: false } }
  const result = await payload.find({
    collection: 'photos',
    where,
    sort: '-createdAt',
    limit,
    page: Math.floor(offset / limit) + 1,
    overrideAccess: true,
    depth: 0,
  })

  // The Blob store is private, so every image is streamed through the proxy.
  // The web app builds the proxy URL (adding the token for sensitive photos).
  const photos = (result.docs as any[]).map((p) => ({
    id: p.id,
    alt: p.alt || '',
    sensitive: !!p.sensitive,
  }))

  return c.json({
    photos,
    hasMore: result.hasNextPage,
    total: result.totalDocs,
    authed,
  })
})

// ---- Signed/gated photo proxy (sensitive requires a session) ----
app.get('/photo', async (c) => {
  const id = c.req.query('id')
  if (!id) return c.json({ error: 'id required' }, 400)
  const w = c.req.query('w')
  const q = c.req.query('q')

  const payload = await getPayloadClient()
  let photo: any
  try {
    photo = await payload.findByID({ collection: 'photos', id, overrideAccess: true, depth: 0 })
  } catch {
    return c.json({ error: 'not found' }, 404)
  }
  if (!photo?.pathname) return c.json({ error: 'not found' }, 404)
  if (photo.sensitive) {
    let allowed = await hasSession(c)
    if (!allowed) {
      // Logged-in CMS admins may preview any photo (used by the admin thumbnails).
      try {
        const { user } = await payload.auth({ headers: c.req.raw.headers })
        allowed = Boolean(user)
      } catch {
        /* not an admin */
      }
    }
    if (!allowed) return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  let blobUrl: string
  try {
    const meta = await head(photo.pathname, { token })
    blobUrl = meta.url
  } catch {
    return c.json({ error: 'not found' }, 404)
  }
  const upstream = await fetch(blobUrl, { headers: { Authorization: `Bearer ${token}` } })
  if (!upstream.ok) return c.body(null, upstream.status as any)
  const input = Buffer.from(await upstream.arrayBuffer())

  const targetWidth = w ? Math.min(Math.max(parseInt(w, 10) || 0, 1), MAX_WIDTH) : null
  const requestedQuality = q ? parseInt(q, 10) : NaN
  const quality = Number.isNaN(requestedQuality)
    ? targetWidth
      ? 82
      : 92
    : Math.min(Math.max(requestedQuality, 20), 95)

  let pipeline = sharp(input).rotate()
  if (targetWidth) pipeline = pipeline.resize({ width: targetWidth, withoutEnlargement: true })
  const out = await pipeline.webp({ quality }).toBuffer()

  return c.body(out as any, 200, {
    'Content-Type': 'image/webp',
    'Cache-Control': photo.sensitive
      ? 'private, max-age=3600'
      : 'public, max-age=31536000, immutable',
    'X-Robots-Tag': 'noindex, nofollow, noarchive, noimageindex',
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const OPTIONS = handle(app)
