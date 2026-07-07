import { sign, verify } from 'hono/jwt'

const SECRET = process.env.GALLERY_JWT_SECRET || ''
const TTL_SECONDS = 8 * 60 * 60 // 8 hours
export const GALLERY_COOKIE = 'gallery_session'

export async function signGallerySession(): Promise<string> {
  return sign(
    { sub: 'gallery', exp: Math.floor(Date.now() / 1000) + TTL_SECONDS },
    SECRET,
    'HS256',
  )
}

export async function verifyGallerySession(token?: string): Promise<boolean> {
  if (!token || !SECRET) return false
  try {
    await verify(token, SECRET, 'HS256')
    return true
  } catch {
    return false
  }
}
