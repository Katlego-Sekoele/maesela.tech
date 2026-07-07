import bcrypt from "bcryptjs";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { signGalleryToken } from "../_lib/auth";
import { getRedis } from "../_lib/redis";
import type { GalleryPasswordEntry } from "../_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const jwtSecret = process.env.GALLERY_JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: "Gallery auth not configured" });
  }

  const { password } = req.body as { password?: string };
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "password is required" });
  }

  try {
    const redis = getRedis();
    const raw = await redis.hgetall("gallery_passwords");

    if (!raw) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const entries: GalleryPasswordEntry[] = Object.values(raw).map((v) =>
      JSON.parse(v as string)
    );
    const active = entries.filter((e) => !e.revokedAt);

    for (const entry of active) {
      const match = await bcrypt.compare(password, entry.hash);
      if (match) {
        const token = signGalleryToken(jwtSecret);
        return res.status(200).json({ token });
      }
    }

    return res.status(401).json({ error: "Invalid password" });
  } catch (err) {
    console.error("[/api/auth/gallery]", (err as Error).message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
