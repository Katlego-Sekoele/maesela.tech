import sharp from 'sharp';

const BLOB_HOSTNAME_SUFFIX = '.blob.vercel-storage.com';
const MAX_WIDTH = 2400;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url, w, q } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid url' });
  }

  if (!parsed.hostname.endsWith(BLOB_HOSTNAME_SUFFIX)) {
    return res.status(400).json({ error: 'Invalid url' });
  }

  const targetWidth = w ? Math.min(Math.max(parseInt(w, 10), 1), MAX_WIDTH) : null;
  const requestedQuality = q ? parseInt(q, 10) : null;
  const targetQuality = Number.isNaN(requestedQuality) || requestedQuality === null
    ? (targetWidth ? 82 : 92)
    : Math.min(Math.max(requestedQuality, 20), 95);

  try {
    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });

    if (!upstream.ok) return res.status(upstream.status).end();

    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

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
      return res.send(result);
    }

    const result = await pipeline.webp({ quality: targetQuality }).toBuffer();
    return res.send(result);
  } catch (err) {
    console.error('[/api/photo]', err.message);
    return res.status(500).end();
  }
}
