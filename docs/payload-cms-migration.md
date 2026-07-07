# Payload CMS migration — architecture & plan

## Goal
Move portfolio content out of the in-memory `src/data.js` and the Redis-backed
serverless API into **Payload CMS 3** (Next.js) on **Neon Postgres**, restructure the
repo as an **NX + pnpm monorepo**, and deploy **frontend and backend separately on
Vercel**. Images stay on **Vercel Blob**. Certain images can be flagged **sensitive**
(password-gated) vs **public** (open on the site).

## Confirmed decisions
- **API layer:** Payload's built-in REST/GraphQL for content + a **Hono** router mounted
  inside the CMS (Next.js catch-all route handler) for custom endpoints (signed
  photo-proxy, sensitive-image gating, public content feed).
- **Sensitive images:** shared **gallery password → session** (managed in the CMS);
  public images render freely. **better-auth** handles **CMS admin** login only.
- **Deploy topology:** two Vercel projects. Existing project stays the **frontend**
  (prod domain `maesela.tech`); a **new project** hosts the **CMS** (e.g.
  `cms.maesela.tech`). Previews deployed first; prod promotion only on request.

## Target monorepo layout (pnpm workspaces + NX orchestration, native tooling per app)
```
apps/
  web/   → existing Vite React SPA (public site) — Vercel project #1 (prod domain)
  cms/   → Next.js 15 + Payload 3 (admin, REST/GraphQL, Hono custom API, better-auth)
           — Vercel project #2
packages/
  (optional) shared TS types consumed by web
nx.json · pnpm-workspace.yaml · tsconfig.base.json · package.json (root)
```

## Data model (Payload collections & globals)
Mirror `src/data.js` + migrate Redis/Blob data:
- **Collections:** `experiences`, `educations`, `certifications`, `talks` (videos),
  `projects`, `articles`, `media` (Blob-backed, with `sensitive: boolean` + `alt`),
  `users` (better-auth, admin), `gallery-passwords` (bcrypt, revocable).
- **Globals:** `short-bio`, `about`, `socials`.
- Each content collection keeps a `shown`/`status` flag mirroring today's `shown`.

## Access control
- `media.read`: `sensitive === false` → public; `sensitive === true` → requires a valid
  gallery session (shared-password JWT/cookie). Enforced in the Hono photo endpoints.
- Admin mutations: better-auth session (Payload `users`).

## Custom API (Hono, in CMS app)
- `POST /api/gallery/auth` — shared password (bcrypt) → signed session (replaces
  `api/auth/gallery.ts`).
- `GET  /api/photos` — lists public media always; sensitive media only with a valid
  session. Returns signed proxy tokens (replaces `api/photos.ts`).
- `GET  /api/photo` — signed, `sharp`-resized WebP proxy from Blob (replaces
  `api/photo.ts`), enforcing sensitive gating.
- `GET  /api/content/*` — public JSON feed of portfolio content for the Vite site
  (or the site reads Payload REST directly with `?where[shown][equals]=true`).

## Migration steps (staged, each verifiable)
1. **Monorepo skeleton** — relocate the Vite app to `apps/web` (keep it building; its
   current `api/` functions ride along temporarily so nothing breaks). ← _this stage_
2. **Scaffold `apps/cms`** — Next 15 + Payload 3 + `@payloadcms/db-postgres` + Blob
   storage adapter; boot against Neon (env pulled from Vercel, never printed).
3. **Collections/globals** + access control + `sensitive` on media.
4. **better-auth** admin via the Payload better-auth plugin; seed one admin (password
   piped to Vercel, never read).
5. **Hono custom API** — port gallery auth + photo proxy; add sensitive gating.
6. **Data migration scripts** — seed collections from `src/data.js`; import `articles`
   and `gallery_passwords` from Redis; backfill `media` from existing Blob `etc/*`
   (default existing → `sensitive: true`, matching today).
7. **Rewire `apps/web`** — fetch content/photos from the CMS; retire the local `api/`.
8. **Deploy** — CMS project (env: Neon `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`,
   `PAYLOAD_SECRET`, better-auth secret) → preview; then point web at the CMS URL →
   preview. Verify end-to-end. Promote to prod only on request.

## Secret handling (hard rule)
Never read/print secret values. Use `vercel env pull` only into gitignored files and
never `cat` them; pipe new secrets via `vercel env add <NAME> <env> < file` or stdin.
Neon `DATABASE_URL` is provided by the installed Vercel Neon plugin.
