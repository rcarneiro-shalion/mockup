# Shalion APIs — URL map (canonical) — Jun 2026

Source: Notion → Software → … → URL map → **"Shalion APIs"** database
(`collection://96842b51-89e8-4c01-9e43-67eef3c1cb71`). Columns: Application (area),
API, Slug, development_url, staging_url, prod_url.

## Deterministic base-URL pattern (per slug)
- **develop**: `https://<slug>-develop.develop.shalion.com`
- **staging**: `https://<slug>-staging.ondemand.shalion.com`
- **prod**:    `https://<slug>-prod.v2.shalion.com`

(Swagger docs live at `/<slug>-docs/swagger-ui/index.html`.)
Exception: Cube Download Dispatcher uses a `-pub` infix:
`cube-download-dispatcher-pub-<env>...`.

## Confirmed rows (Application · API · slug)
- Ecometry · Product API · `product-api`
- IAM · IAM API · `iam-api`
- Data Collector · Orders Management API · `orders-management-api`
- Data Collector · Instructions API · `data-collector-instructions-api`
- Data Collector · Proxies API · `data-collector-proxies-api`
- Data Collector · Data Extraction API · `data-extraction-api`
- Maestro · Maestro API · `maestro-api`
- Maestro · Maestro Alerts API · `maestro-alerts-api`
- Maestro · Audit API · `maestro-audit-api`
- Maestro · Maestro Cube Cache API · `maestro-cube-cache-api`
- Maestro · Slides API · `slides-api`
- Cube · Cube Download Dispatcher · `cube-download-dispatcher` (-pub infix)
- (other Ecometry rows follow the same pattern: `backoffice-api`, `codification-api`,
  `bulk-api`, `seeds-api`, `ecometry-tasks-api`, `snowflake-api`, `visualization-api`, …)

The **visualization-api** is the backend for Clients × Dashboards × Datagroups;
prod host (verified live) = `visualization-api-prod.v2.shalion.com`.

## Where this lives in the mockup
`src/lib/api/shalion.server.ts` is now grounded in this map:
- `ENV_SUFFIX` (develop/staging/prod) + `SERVICE_SLUGS` (service key → slug) +
  `baseUrlFor(service, env)` → `https://<slug><suffix>`.
- `fetchShalion`/`fetchLive` accept `env` (default "develop"). `LiveSpec` (LiveData.tsx)
  carries optional `env`.
- Massive update connects via service `visualization` + env `prod`.
- Auth: `Authorization: Bearer <access>` + (viz) `x-id-token: <id>`; tokens client-side
  only, never committed.
