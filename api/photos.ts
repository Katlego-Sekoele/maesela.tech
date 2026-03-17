import { list } from "@vercel/blob";
import { createHmac } from "crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { extractBearerToken, verifyGalleryToken } from "./_lib/auth";

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 60;
const TOKEN_TTL_SECONDS = 60 * 60 * 24;

function encodePhotoId(pathname: string): string {
  return Buffer.from(pathname, "utf8").toString("base64url");
}

function signPhotoToken(photoId: string, exp: number, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${photoId}.${exp}`)
    .digest("base64url");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Gallery auth: validate JWT
  const jwtSecret = process.env.GALLERY_JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: "Gallery auth not configured" });
  }
  const token = extractBearerToken(req.headers["authorization"]);
  if (!token || !verifyGalleryToken(token, jwtSecret)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const parsedOffset = parseInt(req.query.offset as string, 10);
    const parsedLimit = parseInt(req.query.limit as string, 10);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0);
    const limit = Number.isNaN(parsedLimit)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(parsedLimit, 1), MAX_LIMIT);

    const signingSecret =
      process.env.PHOTO_PROXY_SIGNING_SECRET ||
      process.env.BLOB_READ_WRITE_TOKEN;
    if (!signingSecret) {
      return res.status(500).json({ error: "Signing secret is not configured" });
    }

    const { blobs } = await list({ prefix: "etc/" });
    const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;

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
            .replace(/^etc\//, "")
            .replace(/\.[^.]+$/, "")
            .replace(/[-_]/g, " "),
        };
      });
    const photos = allPhotos.slice(offset, offset + limit);
    const hasMore = offset + photos.length < allPhotos.length;

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, noimageindex");
    return res.status(200).json({ photos, hasMore, total: allPhotos.length });
  } catch (err) {
    console.error("[/api/photos]", (err as Error).message);
    return res.status(500).json({ error: "Failed to list photos" });
  }
}
