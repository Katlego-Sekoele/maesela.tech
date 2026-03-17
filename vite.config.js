import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const BLOB_HOSTNAME_SUFFIX = '.blob.vercel-storage.com';
const MAX_WIDTH = 2400;


function apiRoutesPlugin(env) {
  return {
    name: 'api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const token = env.BLOB_READ_WRITE_TOKEN;

        if (url.pathname === '/api/photos') {
          try {
            const { list } = await import('@vercel/blob');
            const { blobs } = await list({ prefix: 'etc/', token });
            const photos = blobs
              .filter((b) => IMAGE_RE.test(b.pathname))
              .map((b, i) => ({
                id: i + 1,
                url: b.url,
                alt: b.pathname
                  .replace(/^etc\//, '')
                  .replace(/\.[^.]+$/, '')
                  .replace(/[-_]/g, ' '),
              }));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ photos }));
          } catch (err) {
            console.error('[dev /api/photos]', err.message);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to list photos' }));
          }
          return;
        }

        if (url.pathname === '/api/photo') {
          const blobUrl = url.searchParams.get('url');
          const w = url.searchParams.get('w');
          if (!blobUrl) { res.statusCode = 400; res.end(); return; }
          let parsed;
          try { parsed = new URL(blobUrl); } catch { res.statusCode = 400; res.end(); return; }
          if (!parsed.hostname.endsWith(BLOB_HOSTNAME_SUFFIX)) { res.statusCode = 400; res.end(); return; }

          try {
            const upstream = await fetch(blobUrl, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!upstream.ok) { res.statusCode = upstream.status; res.end(); return; }

            const buffer = Buffer.from(await upstream.arrayBuffer());
            const targetWidth = w ? Math.min(Math.max(parseInt(w, 10), 1), MAX_WIDTH) : null;

            res.setHeader('Content-Type', 'image/webp');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

            const { default: sharp } = await import('sharp');
            const pipeline = sharp(buffer).rotate();

            if (targetWidth && !isNaN(targetWidth)) {
              const result = await pipeline
                .resize({ width: targetWidth, withoutEnlargement: true })
                .webp({ quality: 82 })
                .toBuffer();
              res.end(result);
            } else {
              const result = await pipeline.webp({ quality: 92 }).toBuffer();
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
