import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "./_lib/redis";
import type { Article } from "./_lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const redis = getRedis();
    const raw = await redis.hgetall("articles");

    if (!raw) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ articles: [] });
    }

    const articles: Article[] = Object.values(raw)
      .map((v) => JSON.parse(v as string) as Article)
      .sort((a, b) => (a.readDate < b.readDate ? 1 : -1));

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ articles });
  } catch (err) {
    console.error("[/api/articles]", (err as Error).message);
    return res.status(500).json({ error: "Failed to load articles" });
  }
}
