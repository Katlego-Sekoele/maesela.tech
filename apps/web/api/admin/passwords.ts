import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAdminAuthorized } from "../_lib/auth";
import { getRedis } from "../_lib/redis";
import type { GalleryPasswordEntry } from "../_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAdminAuthorized(req.headers["x-admin-password"])) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const redis = getRedis();

  if (req.method === "GET") {
    try {
      const raw = await redis.hgetall("gallery_passwords");
      if (!raw) return res.status(200).json({ passwords: [] });
      const passwords = Object.values(raw)
        .map((v) => {
          const e = JSON.parse(v as string) as GalleryPasswordEntry;
          return { id: e.id, label: e.label, createdAt: e.createdAt, revokedAt: e.revokedAt };
        })
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      return res.status(200).json({ passwords });
    } catch (err) {
      console.error("[GET /api/admin/passwords]", (err as Error).message);
      return res.status(500).json({ error: "Failed to load passwords" });
    }
  }

  if (req.method === "POST") {
    const { label } = req.body as { label?: string };
    if (!label) return res.status(400).json({ error: "label is required" });

    const plaintext = randomBytes(16).toString("base64url");
    const hash = await bcrypt.hash(plaintext, 12);
    const entry: GalleryPasswordEntry = {
      id: crypto.randomUUID(),
      label,
      hash,
      createdAt: new Date().toISOString(),
    };

    try {
      await redis.hset("gallery_passwords", entry.id, JSON.stringify(entry));
      return res.status(201).json({
        id: entry.id,
        label: entry.label,
        createdAt: entry.createdAt,
        password: plaintext,
      });
    } catch (err) {
      console.error("[POST /api/admin/passwords]", (err as Error).message);
      return res.status(500).json({ error: "Failed to create password" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body as { id?: string };
    if (!id) return res.status(400).json({ error: "id is required" });

    try {
      const raw = await redis.hget("gallery_passwords", id);
      if (!raw) return res.status(404).json({ error: "Password not found" });
      const entry = JSON.parse(raw as string) as GalleryPasswordEntry;
      entry.revokedAt = new Date().toISOString();
      await redis.hset("gallery_passwords", id, JSON.stringify(entry));
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[DELETE /api/admin/passwords]", (err as Error).message);
      return res.status(500).json({ error: "Failed to revoke password" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
