import jwt from "jsonwebtoken";
import type { GalleryTokenPayload } from "./types";

const GALLERY_JWT_TTL_SECONDS = 8 * 60 * 60; // 8 hours

export function signGalleryToken(secret: string): string {
  return jwt.sign({ sub: "gallery" }, secret, {
    expiresIn: GALLERY_JWT_TTL_SECONDS,
  });
}

export function verifyGalleryToken(
  token: string,
  secret: string
): GalleryTokenPayload | null {
  try {
    return jwt.verify(token, secret) as GalleryTokenPayload;
  } catch {
    return null;
  }
}

export function extractBearerToken(
  authHeader: string | string[] | undefined
): string | null {
  const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7);
}

export function isAdminAuthorized(
  providedPassword: string | string[] | undefined
): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const provided = Array.isArray(providedPassword)
    ? providedPassword[0]
    : providedPassword;
  return provided === adminPassword;
}
