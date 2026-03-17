import Busboy from "busboy";
import { put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAdminAuthorized } from "../_lib/auth";

export const config = { api: { bodyParser: false } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  if (!isAdminAuthorized(req.headers["x-admin-password"])) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { filename, buffer } = await parseUpload(req);
    if (!buffer.length) {
      return res.status(400).json({ error: "No file provided" });
    }

    const blob = await put(`etc/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: false,
    });

    return res.status(200).json({ pathname: blob.pathname, url: blob.url });
  } catch (err) {
    console.error("[POST /api/admin/upload]", (err as Error).message);
    return res.status(500).json({ error: "Upload failed" });
  }
}

function parseUpload(req: VercelRequest): Promise<{ filename: string; buffer: Buffer }> {
  return new Promise((resolve, reject) => {
    const contentType = req.headers["content-type"] ?? "";
    const bb = Busboy({ headers: { "content-type": contentType } });
    let filename = `upload-${Date.now()}`;
    const chunks: Buffer[] = [];

    bb.on("file", (_field, stream, info) => {
      filename = info.filename || filename;
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("end", () => {});
    });

    bb.on("finish", () => resolve({ filename, buffer: Buffer.concat(chunks) }));
    bb.on("error", reject);

    req.pipe(bb);
  });
}
