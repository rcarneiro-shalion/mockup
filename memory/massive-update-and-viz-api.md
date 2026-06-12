# Massive update + Visualization API (live) — Jun 2026

## Feature: "Visual massive updates — Clients × Dashboard × Datagroups" (TECH-14795)
Route: **/settings/dashboard-applications/massive-update** (button "Massive update" on the
Dashboard applications list header, next to Manual). Component `MassiveUpdatePage.tsx`,
data in `src/lib/massiveUpdate.ts`.

Solves the slow, Tech-scripted process of pushing a new dashboard **section** into every
client's datagroups one-by-one (the scripts in ~/Desktop/bulks_scripts, e.g.
`dashboardSection.js` POSTing `/v1.0/admin/datagroup-dashboardsections`).

UI (per spec): pick a dashboard application → left pane filters dashboard **groups** +
selects many **sections** (with "select all filtered"); right pane filters **clients** by
name + selects many **datagroups** (grouped by client, BRAND/AGENCY badge, "select all
filtered"); **► Insert / ◄ Remove** stage changes; a **matrix** (sections × datagroups)
shows assigned ✓ / pending-add + / pending-remove − / none; **Apply** runs a SIMULATED
sequential POST/DELETE (progress + toast). Verified: 2×2 → Insert staged 4 → matrix 4 "+"
→ Apply → 4 turned green.

**Writes are always simulated** (no real prod writes) — consistent with the "validate the
behavior" principle.

## Visualization API (prod) — live, read-only
The Visualization API is the backend for Clients × Dashboards × Datagroups
(`https://visualization-api-prod.v2.shalion.com`, swagger at `/visualization-api-docs`).
**Auth needs TWO headers** (confirmed from the bulk scripts + verified live):
`Authorization: Bearer <accessToken>` **and** `x-id-token: <idToken>` (both Cognito).

Real shapes captured:
- `GET /v1.0/admin/dashboardapplications` → `[{id,label,slug,isMaestroEnabled,position,...}]` (7 apps: Market Share Maestro/msm, Digital Shelf Maestro, …).
- `GET /v1.0/admin/dashboardgroups` → `[{id,label,icon,dashboardApplication:{id,label}}]` (groups belong to an app).
- `GET /v1.0/admin/dashboardsections` → `[{id,label,labelTranslation,path,type,definition:{looker_id,hide_filter,...}}]` (NO group ref in payload — group→section link is via filter param, unconfirmed).
- `GET /v1.0/admin/datagroups` → `[{id,name,client:{id,name},dashboardType:BRAND|AGENCY,countries:[{code,name}],...}]` (100/page).
- `GET /v1.0/admin/datagroup-dashboardsections` → the join `[{id,dataGroup:{...,client},dashboardSection,position,...}]` (the matrix data).

## Proxy changes (extends the live-data proxy)
- `shalion.server.ts`: added `"visualization-prod"` to the allow-list; `fetchShalion` now accepts `idToken` and sends `x-id-token` (client-supplied or `SHALION_API_ID_TOKEN` env). Timeout 20s.
- `live.functions.ts`: `fetchLive` validator gained optional `idToken`.
- MassiveUpdatePage "Connect live clients" pulls real **clients + datagroups** from
  `visualization-prod /v1.0/admin/datagroups?size=200` (access + id token pasted in-app,
  stored localStorage `shalion:devToken`/`shalion:devIdToken`, sent only to our proxy).
  **Verified live against prod**: 36 real clients (Affinity, Bacardi, Beam Suntory, Bimbo,
  Coca Cola, Danone, Diageo, Heineken, JDE, Kelloggs, L'Oréal…) across 100 datagroups.
  Catalog apps/groups/sections stay seeded (representative); assignment state simulated.

Tokens are short-lived Cognito JWTs — never committed (.env / .env.* gitignored). The
provided demo tokens were used only for live verification, not stored in the repo.
