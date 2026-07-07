import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAdminAuthorized } from "../_lib/auth";
import { getRedis } from "../_lib/redis";
import type { Article } from "../_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAdminAuthorized(req.headers["x-admin-password"])) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const redis = getRedis();

  if (req.method === "GET") {
    try {
      const raw = await redis.hgetall("articles");
      if (!raw) return res.status(200).json({ articles: [] });
      const articles: Article[] = Object.values(raw)
        .map((v) => JSON.parse(v as string) as Article)
        .sort((a, b) => (a.readDate < b.readDate ? 1 : -1));
      return res.status(200).json({ articles });
    } catch (err) {
      console.error("[GET /api/admin/articles]", (err as Error).message);
      return res.status(500).json({ error: "Failed to load articles" });
    }
  }

  if (req.method === "POST") {
    const { title, url, description, readDate } = req.body as Partial<Article>;
    if (!title || !url || !readDate) {
      return res.status(400).json({ error: "title, url, and readDate are required" });
    }
    const article: Article = {
      id: crypto.randomUUID(),
      title,
      url,
      description: description ?? "",
      readDate,
      addedAt: new Date().toISOString(),
    };
    try {
      await redis.hset("articles", article.id, JSON.stringify(article));
      return res.status(201).json({ article });
    } catch (err) {
      console.error("[POST /api/admin/articles]", (err as Error).message);
      return res.status(500).json({ error: "Failed to save article" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body as { id?: string };
    if (!id) return res.status(400).json({ error: "id is required" });
    try {
      await redis.hdel("articles", id);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[DELETE /api/admin/articles]", (err as Error).message);
      return res.status(500).json({ error: "Failed to delete article" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
