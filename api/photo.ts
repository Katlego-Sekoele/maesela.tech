import sharp from "sharp";
import { list } from "@vercel/blob";
import { createHmac, timingSafeEqual } from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const MAX_WIDTH = 2400;
const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const BLOB_INDEX_TTL_MS = 5 * 60 * 1000;

let blobIndexCache: { expiresAt: number; map: Map<string, string> } = {
  expiresAt: 0,
  map: new Map(),
};

function signPhotoToken(photoId: string, exp: number, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${photoId}.${exp}`)
    .digest("base64url");
}

function verifyPhotoToken(
  photoId: string,
  exp: number,
  sig: string,
  secret: string
): boolean {
  const expected = signPhotoToken(photoId, exp, secret);
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(sig ?? "");
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

async function getBlobUrlForPathname(
  pathname: string
): Promise<string | undefined> {
  const now = Date.now();
  if (blobIndexCache.expiresAt < now || !blobIndexCache.map.size) {
    const { blobs } = await list({ prefix: "etc/" });
    blobIndexCache = {
      expiresAt: now + BLOB_INDEX_TTL_MS,
      map: new Map(blobs.map((blob) => [blob.pathname, blob.url])),
    };
  }
  return blobIndexCache.map.get(pathname);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id, exp, sig, w, q } = req.query as Record<string, string>;
  if (!id || !exp || !sig) {
    return res.status(400).json({ error: "Missing id/exp/sig parameters" });
  }
  const parsedExp = parseInt(exp, 10);
  if (Number.isNaN(parsedExp) || parsedExp < Math.floor(Date.now() / 1000)) {
    return res.status(401).json({ error: "Token expired" });
  }
  const signingSecret =
    process.env.PHOTO_PROXY_SIGNING_SECRET || process.env.BLOB_READ_WRITE_TOKEN;
  if (!signingSecret) {
    return res.status(500).json({ error: "Signing secret is not configured" });
  }
  if (!verifyPhotoToken(id, parsedExp, sig, signingSecret)) {
    return res.status(401).json({ error: "Invalid token" });
  }

  let pathname: string;
  try {
    pathname = Buffer.from(id, "base64url").toString("utf8");
  } catch {
    return res.status(400).json({ error: "Invalid id" });
  }
  if (!pathname.startsWith("etc/") || !IMAGE_RE.test(pathname)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const targetWidth = w ? Math.min(Math.max(parseInt(w, 10), 1), MAX_WIDTH) : null;
  const requestedQuality = q ? parseInt(q, 10) : null;
  const targetQuality =
    Number.isNaN(requestedQuality) || requestedQuality === null
      ? targetWidth
        ? 82
        : 92
      : Math.min(Math.max(requestedQuality, 20), 95);

  try {
    const blobUrl = await getBlobUrlForPathname(pathname);
    if (!blobUrl) return res.status(404).json({ error: "Photo not found" });

    const upstream = await fetch(blobUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!upstream.ok) return res.status(upstream.status).end();

    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, noimageindex");

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
    console.error("[/api/photo]", (err as Error).message);
    return res.status(500).end();
  }
}
