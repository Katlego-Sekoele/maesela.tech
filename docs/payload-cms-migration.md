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
  public images render freely.
- **Admin auth:** **Payload native auth** (bcrypt/sessions/JWT/lockout/reset). The
  community better-auth↔Payload plugin only supports Payload 3.28, not our stable
  3.85, so better-auth is deferred until the plugin catches up (tracked follow-up).
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

## Status (deployed)
- **CMS** (backend): `https://maesela-cms.vercel.app` — Payload admin at `/admin`,
  REST/GraphQL, Hono gallery API at `/api/site/*`; Neon Postgres; project
  `maesela-cms`. Migrations are applied to Neon **locally before deploy**
  (`node <payload-bin> migrate`), not in the Vercel build.
- **Web** (frontend preview): `https://maesela-web.vercel.app` — redesigned SPA,
  content sourced from the CMS at build time; project `maesela-web`. **The live
  `maesela.tech` project is untouched.**
- Migrated into Payload/Neon: experiences (8), educations (4), certifications (1),
  talks (1), projects (10), globals; 58 gallery photos indexed (all `sensitive`).

### Remaining manual steps (owner actions)
1. **Create the first admin** at `https://maesela-cms.vercel.app/admin` (Payload
   create-first-user).
2. **Add a gallery password** (Gallery → Gallery Passwords → set a plaintext
   `password`) to unlock sensitive photos; flip individual **Photos** to public.
3. **Articles**: not migrated (this sandbox can't reach `maesela.tech`/Redis).
   Run from any network that can:
   `LEGACY_ARTICLES_URL=https://maesela.tech/api/articles DATABASE_URL=<neon> pnpm --filter @maesela/cms exec tsx src/seed/articles.ts`
   (or re-add in the admin).
4. **Promote**: when happy, point the `maesela.tech` Vercel project at `apps/web`
   (Root Directory) + set `VITE_CMS_URL`, and give the CMS a domain
   (e.g. `cms.maesela.tech`).
5. **Schema changes**: run `migrate:create` + `migrate` locally against Neon,
   commit the migration, then deploy.

### Deferred
- **better-auth**: its Payload plugin targets Payload 3.28, not our 3.85; revisit
  when it supports 3.85. Admin uses Payload native auth meanwhile.
- **CMS image uploads via admin**: the Blob store is private, so Payload's upload
  adapter is unused; gallery photos are indexed as metadata and streamed through
  the Hono proxy. Make the store public if you want admin uploads.

## Secret handling (hard rule)
Never read/print secret values. Use `vercel env pull` only into gitignored files and
never `cat` them; pipe new secrets via `vercel env add <NAME> <env> < file` or stdin.
Neon `DATABASE_URL` is provided by the installed Vercel Neon plugin.
