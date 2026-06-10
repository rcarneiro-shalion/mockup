# Shalion — Seeds-API Mockup

An interactive **UI mockup** of the redesigned **Seeds-API** section of Shalion's
Ecometry admin app. It exists to validate the *data flow and navigation* of the
new data‑extraction configuration model with end users before the supporting
services are built — the design here is the reference from which the real
architecture and entities are derived.

> This is a **prototype**: there is no backend. All data is seeded in-memory and
> persisted to the browser's `localStorage`, so changes are local to each browser.

## What it covers

The app models how a data-extraction project is configured and what feeds the
**Data Collector** (the downstream extraction engine). Main sections (under **Seeds API**):

- **Projects** — the landing page. A project groups the configuration sold to a
  client. Lists show which **Clients** it belongs to and which **Subscriptions**
  are assigned. Full-page add/edit with an *Assigned subscriptions* table.
- **Subscriptions** — the job-like hub entity (placeholder name): ties a Project
  to a **list of Seeds**, a **Scrapping option**, and (when geolocation is
  `MANUAL`) a **Location set**, plus client-oriented options (geoloc, frequency).
- **Seeds** — 3 types (**URL / API / KEYWORD**). The type dropdown filters the
  grid and gates a type-aware *Add seed* form (Url / Keyword / API origin).
- **Scrapping options** — the extraction options layer: **Joints** (Multivariants,
  Pagination `max_page`, Limited discovery `max_rank`) and **Disjoints**
  (Modalities, Sorting), with multi-select **Timeframes** and an n:n relation to Stores.
- **Tags**, **Timeframes** — supporting lists.
- **Clients** — datagrid + full-page form, including the **client ↔ project** relationship.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (SSR) + React 19 + TypeScript
- Vite + Nitro (build), Tailwind CSS v4, shadcn/ui (Radix) components
- State persisted client-side via `localStorage` (no API/database)

## Local development

Requires **Node 22** (`engines.node = 22.x`).

```bash
npm install
npm run dev
```

The dev server runs on **http://localhost:8080**.

Other scripts:

```bash
npm run build     # production build (see Deploy below)
npm run preview   # preview the production build locally
npm run lint      # eslint
```

> The repo's lockfile is `bun.lock`; `package-lock.json` is gitignored. `npm install`
> works fine (no lockfile is created in the repo).

## Deploy (Vercel)

The build is configured for Vercel via the Nitro `vercel` preset in
`vite.config.ts` (`nitro: { preset: "vercel" }`), so `npm run build` emits the
**Build Output API** at `.vercel/output` and deploys with zero extra config.

**Dashboard (recommended):**

1. In [Vercel](https://vercel.com/new), **Import** this Git repository.
2. Configure:
   - **Framework Preset:** `Other`
   - **Build Command:** `npm run build`
   - **Output Directory:** *leave blank* (the Build Output API is auto-detected)
   - **Install Command:** default (`npm install`)
3. **Deploy.** Every push to the production branch auto-deploys.

**CLI:**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

SSR works out of the box (the build produces a serverless function plus static
assets). No environment variables are required.

### Deploying elsewhere

Change the Nitro preset in `vite.config.ts`:

| Target | `nitro.preset` | Output |
| --- | --- | --- |
| Vercel (default) | `vercel` | `.vercel/output` |
| Node host (Railway/Render/Heroku) | `node-server` | `.output/server/index.mjs` (listens on `$PORT`) |
| Cloudflare | `cloudflare-module` | Worker bundle |
| Netlify | `netlify` | Netlify functions |

## Notes

- Because data lives in `localStorage`, records created on an older build may be
  missing newer fields. The forms tolerate this, but for a clean, fully-seeded
  state, clear the site's Local Storage (DevTools → Application → Local Storage)
  and reload.
- Wiring this to a real backend later is a matter of replacing the `localStorage`
  reads/writes (e.g. `getClients()`, `getProjects()`, `getSubscriptions()` in
  `src/lib/`) with API calls.
