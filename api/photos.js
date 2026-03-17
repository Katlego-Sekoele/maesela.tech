import { list } from '@vercel/blob';

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 60;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const parsedOffset = parseInt(req.query.offset, 10);
    const parsedLimit = parseInt(req.query.limit, 10);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);
    const limit = Number.isNaN(parsedLimit)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(parsedLimit, 1), MAX_LIMIT);

    const { blobs } = await list({ prefix: 'etc/' });

    const allPhotos = blobs
      .filter((b) => IMAGE_RE.test(b.pathname))
      .map((b, i) => ({
        id: i + 1,
        url: b.url,
        alt: b.pathname
          .replace(/^etc\//, '')
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]/g, ' '),
      }));
    const photos = allPhotos.slice(offset, offset + limit);
    const hasMore = offset + photos.length < allPhotos.length;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json({ photos, hasMore, total: allPhotos.length });
  } catch (err) {
    console.error('[/api/photos]', err.message);
    return res.status(500).json({ error: 'Failed to list photos' });
  }
}
