import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

async function parseJsonBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
  });
}

let _redisClient = null;
async function getDevRedis(redisUrl) {
  if (!_redisClient) {
    const { default: Redis } = await import('ioredis');
    _redisClient = new Redis(redisUrl, { maxRetriesPerRequest: 3 });
  }
  return _redisClient;
}

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const MAX_WIDTH = 2400;
const TOKEN_TTL_SECONDS = 60 * 60 * 24;

function encodePhotoId(pathname) {
  return Buffer.from(pathname, 'utf8').toString('base64url');
}

function signPhotoToken(photoId, exp, secret) {
  return createHmac('sha256', secret)
    .update(`${photoId}.${exp}`)
    .digest('base64url');
}

function verifyPhotoToken(photoId, exp, sig, secret) {
  const expected = signPhotoToken(photoId, exp, secret);
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(sig ?? '');
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}


function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function checkAdminAuth(req, adminPassword) {
  return req.headers['x-admin-password'] === adminPassword;
}

function verifyGalleryJwt(req, secret) {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) return false;
  try {
    const jwt = require('jsonwebtoken');
    jwt.verify(authHeader.slice(7), secret);
    return true;
  } catch { return false; }
}

function apiRoutesPlugin(env) {
  return {
    name: 'api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const token = env.BLOB_READ_WRITE_TOKEN;

        // POST /api/auth/gallery
        if (url.pathname === '/api/auth/gallery' && req.method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.password) return sendJson(res, 400, { error: 'password is required' });
          try {
            const redis = await getDevRedis(env.REDIS_URL);
            const raw = await redis.hgetall('gallery_passwords');
            const { default: bcrypt } = await import('bcryptjs');
            const { default: jwt } = await import('jsonwebtoken');
            const entries = raw ? Object.values(raw).map((v) => JSON.parse(v)) : [];
            const active = entries.filter((e) => !e.revokedAt);
            for (const entry of active) {
              if (await bcrypt.compare(body.password, entry.hash)) {
                const tk = jwt.sign({ sub: 'gallery' }, env.GALLERY_JWT_SECRET, { expiresIn: 8 * 60 * 60 });
                return sendJson(res, 200, { token: tk });
              }
            }
            return sendJson(res, 401, { error: 'Invalid password' });
          } catch (err) {
            console.error('[dev /api/auth/gallery]', err.message);
            return sendJson(res, 500, { error: 'Internal server error' });
          }
        }

        // GET /api/articles
        if (url.pathname === '/api/articles' && req.method === 'GET') {
          try {
            const redis = await getDevRedis(env.REDIS_URL);
            const raw = await redis.hgetall('articles');
            const articles = raw
              ? Object.values(raw).map((v) => JSON.parse(v)).sort((a, b) => (a.readDate < b.readDate ? 1 : -1))
              : [];
            res.setHeader('Cache-Control', 'no-store');
            return sendJson(res, 200, { articles });
          } catch (err) {
            console.error('[dev /api/articles]', err.message);
            return sendJson(res, 500, { error: 'Failed to load articles' });
          }
        }

        // /api/admin/articles
        if (url.pathname === '/api/admin/articles') {
          if (!checkAdminAuth(req, env.ADMIN_PASSWORD)) return sendJson(res, 401, { error: 'Unauthorized' });
          try {
            const redis = await getDevRedis(env.REDIS_URL);
            if (req.method === 'GET') {
              const raw = await redis.hgetall('articles');
              const articles = raw ? Object.values(raw).map((v) => JSON.parse(v)).sort((a, b) => (a.readDate < b.readDate ? 1 : -1)) : [];
              return sendJson(res, 200, { articles });
            }
            if (req.method === 'POST') {
              const body = await parseJsonBody(req);
              if (!body.title || !body.url || !body.readDate) return sendJson(res, 400, { error: 'title, url, and readDate are required' });
              const article = { id: crypto.randomUUID(), title: body.title, url: body.url, description: body.description ?? '', readDate: body.readDate, addedAt: new Date().toISOString() };
              await redis.hset('articles', article.id, JSON.stringify(article));
              return sendJson(res, 201, { article });
            }
            if (req.method === 'DELETE') {
              const body = await parseJsonBody(req);
              if (!body.id) return sendJson(res, 400, { error: 'id is required' });
              await redis.hdel('articles', body.id);
              return sendJson(res, 200, { ok: true });
            }
          } catch (err) {
            console.error('[dev /api/admin/articles]', err.message);
            return sendJson(res, 500, { error: 'Failed' });
          }
          return sendJson(res, 405, { error: 'Method Not Allowed' });
        }

        // /api/admin/passwords
        if (url.pathname === '/api/admin/passwords') {
          if (!checkAdminAuth(req, env.ADMIN_PASSWORD)) return sendJson(res, 401, { error: 'Unauthorized' });
          try {
            const redis = await getDevRedis(env.REDIS_URL);
            if (req.method === 'GET') {
              const raw = await redis.hgetall('gallery_passwords');
              const passwords = raw
                ? Object.values(raw).map((v) => { const e = JSON.parse(v); return { id: e.id, label: e.label, createdAt: e.createdAt, revokedAt: e.revokedAt }; }).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                : [];
              return sendJson(res, 200, { passwords });
            }
            if (req.method === 'POST') {
              const body = await parseJsonBody(req);
              if (!body.label) return sendJson(res, 400, { error: 'label is required' });
              const { default: bcrypt } = await import('bcryptjs');
              const plaintext = randomBytes(16).toString('base64url');
              const hash = await bcrypt.hash(plaintext, 12);
              const entry = { id: crypto.randomUUID(), label: body.label, hash, createdAt: new Date().toISOString() };
              await redis.hset('gallery_passwords', entry.id, JSON.stringify(entry));
              return sendJson(res, 201, { id: entry.id, label: entry.label, createdAt: entry.createdAt, password: plaintext });
            }
            if (req.method === 'DELETE') {
              const body = await parseJsonBody(req);
              if (!body.id) return sendJson(res, 400, { error: 'id is required' });
              const raw = await redis.hget('gallery_passwords', body.id);
              if (!raw) return sendJson(res, 404, { error: 'Not found' });
              const entry = JSON.parse(raw);
              entry.revokedAt = new Date().toISOString();
              await redis.hset('gallery_passwords', body.id, JSON.stringify(entry));
              return sendJson(res, 200, { ok: true });
            }
          } catch (err) {
            console.error('[dev /api/admin/passwords]', err.message);
            return sendJson(res, 500, { error: 'Failed' });
          }
          return sendJson(res, 405, { error: 'Method Not Allowed' });
        }

        // /api/admin/upload — handled via multipart; skip heavy mock, respond with stub
        if (url.pathname === '/api/admin/upload' && req.method === 'POST') {
          if (!checkAdminAuth(req, env.ADMIN_PASSWORD)) return sendJson(res, 401, { error: 'Unauthorized' });
          try {
            const { default: Busboy } = await import('busboy');
            const { put } = await import('@vercel/blob');
            const result = await new Promise((resolve, reject) => {
              const bb = Busboy({ headers: req.headers });
              let filename = `upload-${Date.now()}`;
              const chunks = [];
              bb.on('file', (_field, stream, info) => {
                filename = info.filename || filename;
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('end', () => {});
              });
              bb.on('finish', () => resolve({ filename, buffer: Buffer.concat(chunks) }));
              bb.on('error', reject);
              req.pipe(bb);
            });
            const blob = await put(`etc/${result.filename}`, result.buffer, { access: 'public', addRandomSuffix: false, token });
            return sendJson(res, 200, { pathname: blob.pathname, url: blob.url });
          } catch (err) {
            console.error('[dev /api/admin/upload]', err.message);
            return sendJson(res, 500, { error: 'Upload failed' });
          }
        }

        if (url.pathname === '/api/photos') {
          // Validate gallery JWT
          if (!verifyGalleryJwt(req, env.GALLERY_JWT_SECRET)) return sendJson(res, 401, { error: 'Unauthorized' });
          try {
            const { list } = await import('@vercel/blob');
            const { blobs } = await list({ prefix: 'etc/', token });
            const signingSecret = env.PHOTO_PROXY_SIGNING_SECRET || token;
            const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
            const parsedOffset = parseInt(url.searchParams.get('offset') || '0', 10);
            const parsedLimit = parseInt(url.searchParams.get('limit') || '24', 10);
            const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);
            const limit = Number.isNaN(parsedLimit) ? 24 : Math.min(Math.max(parsedLimit, 1), 60);
            const allPhotos = blobs
              .filter((b) => IMAGE_RE.test(b.pathname))
              .map((b, i) => {
                const photoId = encodePhotoId(b.pathname);
                return {
                  id: i + 1,
                  photoId,
                  exp,
                  sig: signPhotoToken(photoId, exp, signingSecret),
                  alt: b.pathname
                    .replace(/^etc\//, '')
                    .replace(/\.[^.]+$/, '')
                    .replace(/[-_]/g, ' '),
                };
              });
            const photos = allPhotos.slice(offset, offset + limit);
            const hasMore = offset + photos.length < allPhotos.length;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, noimageindex');
            res.end(JSON.stringify({ photos, hasMore, total: allPhotos.length }));
          } catch (err) {
            console.error('[dev /api/photos]', err.message);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to list photos' }));
          }
          return;
        }

        if (url.pathname === '/api/photo') {
          const encodedId = url.searchParams.get('id');
          const exp = url.searchParams.get('exp');
          const sig = url.searchParams.get('sig');
          const w = url.searchParams.get('w');
          const q = url.searchParams.get('q');
          const parsedExp = parseInt(exp, 10);
          const signingSecret = env.PHOTO_PROXY_SIGNING_SECRET || token;
          if (!encodedId || !exp || !sig || Number.isNaN(parsedExp)) { res.statusCode = 400; res.end(); return; }
          if (parsedExp < Math.floor(Date.now() / 1000)) { res.statusCode = 401; res.end(); return; }
          if (!verifyPhotoToken(encodedId, parsedExp, sig, signingSecret)) { res.statusCode = 401; res.end(); return; }

          let pathname;
          try { pathname = Buffer.from(encodedId, 'base64url').toString('utf8'); } catch { res.statusCode = 400; res.end(); return; }
          if (!pathname.startsWith('etc/') || !IMAGE_RE.test(pathname)) { res.statusCode = 400; res.end(); return; }

          try {
            const { list } = await import('@vercel/blob');
            const { blobs } = await list({ prefix: 'etc/', token });
            const blob = blobs.find((item) => item.pathname === pathname);
            if (!blob?.url) { res.statusCode = 404; res.end(); return; }

            const upstream = await fetch(blob.url, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!upstream.ok) { res.statusCode = upstream.status; res.end(); return; }

            const buffer = Buffer.from(await upstream.arrayBuffer());
            const targetWidth = w ? Math.min(Math.max(parseInt(w, 10), 1), MAX_WIDTH) : null;
            const requestedQuality = q ? parseInt(q, 10) : null;
            const targetQuality = Number.isNaN(requestedQuality) || requestedQuality === null
              ? (targetWidth ? 82 : 92)
              : Math.min(Math.max(requestedQuality, 20), 95);

            res.setHeader('Content-Type', 'image/webp');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, noimageindex');

            const { default: sharp } = await import('sharp');
            const metadata = await sharp(buffer).metadata();
            let rotation = 0;
            if (metadata.orientation === 3) rotation = 180;
            if (metadata.orientation === 6) rotation = 90;
            if (metadata.orientation === 8) rotation = 270;
            const pipeline = sharp(buffer).rotate(rotation);

            if (targetWidth && !isNaN(targetWidth)) {
              const result = await pipeline
                .resize({ width: targetWidth, withoutEnlargement: true })
                .webp({ quality: targetQuality })
                .toBuffer();
              res.end(result);
            } else {
              const result = await pipeline.webp({ quality: targetQuality }).toBuffer();
              res.end(result);
            }
          } catch (err) {
            console.error('[dev /api/photo]', err.message);
            res.statusCode = 500;
            res.end();
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      svgr({
        svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
        include: '**/*.svg',
      }),
      apiRoutesPlugin(env),
    ],
  };
});
