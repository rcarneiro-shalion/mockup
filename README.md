# Shalion — Ecometry admin mockup

An interactive **UI mockup** of Shalion's internal **Ecometry** admin app. It exists
to validate the *data flow, navigation and business rules* of the platform with end
users before the supporting services are built — the design here is the reference
from which the real architecture and entities are derived. Its original focus is the
redesigned **Seeds API** (the new data‑extraction configuration model that replaces
the legacy Tasks area).

> This is a **prototype**: there is no backend. All data is seeded in-memory and
> persisted to the browser's `localStorage`, so changes are local to each browser.

## What it covers

The top bar switches between three product areas — **Ecometry**, **Data Collector**
and **IAM** — and each renders its own left-hand menu.

**Ecometry** (the main console):

- **Clients** and **Retailers** (Retailers / Stores / Region systems).
- **Seeds API** — the focus: **Projects**, **Scraping Plans**, **Seeds** (URL / API /
  KEYWORD), **Scraping options**, **Tags** and **Timeframes**.
- **Tasks** — the legacy operational area, being deprecated by the Seeds API.
- **Codification**, **Product** (client SKUs, assortments, …), **Bulk** and
  **Settings** (dashboard applications, targets, cubes, …).

**Data Collector** (the downstream extraction engine): **Projects**, **Tags**,
**Templates**, **Outputs** (Schemas / Data types), **Orders**, **Executions**,
**Tasks** and **Settings** (Proxy accounts / providers, Error indicators).

Every page carries a **(?) manual** in the top‑right that summarises that section's
business rules, recovered from the production service repositories.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (SSR) + React 19 + TypeScript
- Vite + Nitro (build), Tailwind CSS v4, shadcn/ui (Radix) components
- State persisted client-side via `localStorage` (no API/database)

## Local development

Requires **Node 22** (`engines.node = 22.x`). The repo's committed lockfile is
**`bun.lock`**, so [bun](https://bun.sh) is the canonical package manager:

```bash
bun install
bun dev
```

The dev server runs on **http://localhost:8080**.

npm also works — `package-lock.json` is gitignored so the two managers don't get
mixed:

```bash
npm install
npm run dev
```

Other scripts (run with `bun run <script>` or `npm run <script>`):

```bash
build       # production build (Vercel Build Output API — see Deploy below)
build:dev   # build in development mode
preview     # preview the production build locally
lint        # eslint
format      # prettier --write .
```

> Use **`dev`** (not `preview`) for day-to-day use: the dev server runs the
> TanStack **server functions** that power the optional live-data proxy. The app
> works fully offline on seeded data; to read **real** data, click the **🔑** in the
> top bar and paste a Visualization-API **Bearer + x-id-token** (prod is a public
> host, so no VPN is needed for prod; develop/staging do need VPN).

## Desktop launcher (macOS)

For a one-click experience without the terminal, double-click **`start-app.command`**
in the repo root. It runs `npm install` on first launch, starts the dev server, waits
for it, opens the app in your browser, and streams the logs — **close the window to
stop** the server. (Requires Node.js installed.)

To get an **app-style icon on your Desktop**, double-click **`scripts/make-mac-app.command`**
once. It builds **`Massive Update.app`** on your Desktop with the Shalion icon (a tiny
AppleScript wrapper that runs `start-app.command`). No paths to edit — it captures the
repo location automatically.

Then double-click **Massive Update** on your Desktop (or drag it onto the Dock to pin
it). First launch may need right-click → **Open** → **Open** once (Gatekeeper). The app
is tied to this repo folder — if you move the repo, just double-click
`scripts/make-mac-app.command` again to rebuild it. Other OSes: run `npm run dev`.

## Deploy (Vercel)

The build is configured for Vercel via the Nitro `vercel` preset in
`vite.config.ts` (`nitro: { preset: "vercel" }`), so the build emits the
**Build Output API** at `.vercel/output` and deploys with zero extra config.

**Dashboard (recommended):**

1. In [Vercel](https://vercel.com/new), **Import** this Git repository.
2. Configure:
   - **Framework Preset:** `Other`
   - **Build Command:** `bun run build` (or `npm run build`)
   - **Output Directory:** *leave blank* (the Build Output API is auto-detected)
   - **Install Command:** default (Vercel auto-detects `bun.lock`)
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
  reads/writes (e.g. `getClients()`, `getProjects()`, `getScrapingPlans()` in
  `src/lib/`) with API calls.
