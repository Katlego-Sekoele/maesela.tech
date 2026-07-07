export interface Article {
  id: string;
  title: string;
  url: string;
  description: string;
  readDate: string; // "YYYY-MM-DD"
  addedAt: string; // ISO datetime
}

export interface GalleryPasswordEntry {
  id: string;
  label: string;
  hash: string; // bcrypt hash — never exposed via API
  createdAt: string;
  revokedAt?: string;
}

export interface GalleryTokenPayload {
  sub: "gallery";
  iat: number;
  exp: number;
}
