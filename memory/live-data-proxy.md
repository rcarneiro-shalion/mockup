# Live data proxy — consult real develop APIs (Jun 2026)

The mockup stays backendless, but list pages can optionally fetch **real, read-only**
records from Shalion's develop APIs via a server-side proxy (token + CORS stay
server-side; server-to-server call, so browser CORS is irrelevant).

## Reachability (verified)
- `*.develop.shalion.com` Spring services are reachable. `/actuator/health` → 200 `{"status":"UP"}` (open).
- Data routes (e.g. `/v1.0/admin/applications`) → **401**, need a Cognito/IAM bearer token.
- Base URLs recovered from console-frontend `VITE_API_ENDPOINT_*` → allow-list in `shalion.server.ts`.

## How it works
- `src/lib/api/shalion.server.ts` (server-only): `fetchShalion({service,path,token})`. Allow-listed services → develop base URL (anti-SSRF), **GET only**, `Authorization: Bearer <token>`, 15s timeout. Returns `{ok,status,data,error,hadToken,url}` with a `JsonValue` body (concrete type so the server-fn return is serializable for TanStack).
- `src/lib/api/live.functions.ts`: `fetchLive` = `createServerFn({method:"POST"})` validating `{service,path,token?}`, calls `fetchShalion`.
- `src/components/common/LiveData.tsx`: `LiveDataControls` + `LiveSpec` type `{service,path,map}`. A "Connect live data" bar: paste a develop bearer token (stored in localStorage `shalion:devToken`, sent only to our proxy), fetch, map JSON → rows, push up. Green LIVE badge + count + Refresh/Disconnect; amber error on 401/network; falls back to seeded rows when off.
- `EntityListPage` gained optional `live?: LiveSpec`. In live mode rows are **read-only** (no edit-link, no row actions, no Add — the edit pages are localStorage-backed), and the paginator total = live count.

## Token
- Client-supplied token (in-app paste) OR server env `SHALION_API_TOKEN` (read in `shalion.server.ts`). `.env`/`.env.*` are now gitignored (except `.env.example`). **Never commit a token.** Dev tokens are short-lived (≈1h) → re-paste on 401.

## Pilot
- IAM → **Applications** (`/iam/applications`) wired: `service:"iam", path:"/v1.0/admin/applications"`, mapper tolerant of array or `{data|content|items|results|applications}`.
- Verified end-to-end: dummy token → real 401 surfaced in the UI. A valid token returns real records. To extend: pass a `live` spec to any other list route (e.g. DC Orders → `orders-management` `/v1.0/admin/orders`).

## Update (global Dev tokens saver)
A 🔑 **Dev API tokens** button in the TopBar (`DevTokensDialog.tsx`, rendered in
`TopBar.tsx`) lets you paste the bearer access token + x-id-token ONCE and Save them
to `localStorage` (`shalion:devToken` / `shalion:devIdToken`) — the same keys the live
features read on mount, so they're reused by IAM "Connect live data" and Massive-update
"Connect live clients" without re-pasting. Shows the decoded token user + expiry (and
flags expired), Clear button, emerald dot when set. Tokens stay client-side / sent only
to our server proxy / never committed.
