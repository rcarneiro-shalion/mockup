import process from "node:process";

// Server-only helper for the "live data" proxy. The .server.ts suffix keeps this
// out of the client bundle — the bearer token and the upstream call never reach
// the browser. The mockup stays backendless; this is a thin read-only passthrough
// to Shalion's real develop APIs so we can validate flows against live data.

// Environments + base-URL pattern, from the canonical "Shalion APIs" URL map
// (Notion → URL map → Shalion APIs). Every service resolves to
//   https://<slug><ENV_SUFFIX[env]>
// Only allow-listed slugs can be proxied (anti-SSRF) and only GET is allowed.
export type LiveEnv = "develop" | "staging" | "prod";
const ENV_SUFFIX: Record<LiveEnv, string> = {
  develop: "-develop.develop.shalion.com",
  staging: "-staging.ondemand.shalion.com",
  prod: "-prod.v2.shalion.com",
};

// Caller service key → real API slug (from the URL map).
const SERVICE_SLUGS: Record<string, string> = {
  iam: "iam-api",
  backoffice: "backoffice-api",
  codification: "codification-api",
  "ecometry-tasks": "ecometry-tasks-api",
  product: "product-api",
  bulk: "bulk-api",
  "seeds-api": "seeds-api",
  visualization: "visualization-api",
  snowflake: "snowflake-api",
  "orders-management": "orders-management-api",
  "data-collector-instructions": "data-collector-instructions-api",
  "data-collector-extractions": "data-extraction-api",
  "data-collector-proxies": "data-collector-proxies-api",
  maestro: "maestro-api",
  "maestro-alerts": "maestro-alerts-api",
  "maestro-audit": "maestro-audit-api",
  "maestro-cube-cache": "maestro-cube-cache-api",
  slides: "slides-api",
};

export type LiveService = keyof typeof SERVICE_SLUGS;
export const LIVE_SERVICES = Object.keys(SERVICE_SLUGS);

/** Resolve a service + environment to its base host (or undefined if unknown). */
function baseUrlFor(service: string, env: LiveEnv): string | undefined {
  const slug = SERVICE_SLUGS[service];
  return slug ? `https://${slug}${ENV_SUFFIX[env]}` : undefined;
}

// Concrete JSON type so the server-fn return stays serializable for TanStack.
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type LiveResult = {
  ok: boolean;
  status: number;
  /** Parsed JSON body when the response was JSON, else null. */
  data: JsonValue;
  /** Human-readable error for the UI (auth, network, disallowed, …). */
  error?: string;
  /** Whether a token was available at all (client-supplied or server env). */
  hadToken: boolean;
  /** The resolved upstream URL (for display/debugging). */
  url?: string;
  /** Upstream X-Total-Count (total rows across pages), when present. */
  total?: number;
};

/** Resolve the token: prefer a client-supplied one, fall back to a server env. */
function resolveToken(clientToken?: string): string | undefined {
  const t = clientToken?.trim();
  if (t) return t;
  const env = process.env.SHALION_API_TOKEN?.trim();
  return env || undefined;
}

/** Resolve the Cognito id token (sent as x-id-token; required by the viz API). */
function resolveIdToken(clientIdToken?: string): string | undefined {
  const t = clientIdToken?.trim();
  if (t) return t;
  const env = process.env.SHALION_API_ID_TOKEN?.trim();
  return env || undefined;
}

// ---- assignment aggregator (server-side pagination) ----------------------
// The section-assignment lists are large (datagroup-dashboardsections ~3k rows,
// retailer-dashboardsections ~1.5k) and each row is a deeply-nested ~2KB object.
// Paginating them through the browser proxy (33 round-trips of ~250KB each) is
// slow and drops pages. Instead we paginate SERVER-SIDE (fast server-to-server,
// no per-page client serialization) and return only the compact
// {id, sectionId, targetId} triples the relationship map needs.
export type AssignmentPair = { id: string; sectionId: string; targetId: string };

export async function aggregateAssignments(args: {
  kind: "brand" | "agency";
  token?: string;
  idToken?: string;
  env?: LiveEnv;
}): Promise<{ ok: boolean; complete: boolean; error?: string; pairs: AssignmentPair[] }> {
  const env: LiveEnv = args.env ?? "prod";
  const base = baseUrlFor("visualization", env);
  const token = resolveToken(args.token);
  const idToken = resolveIdToken(args.idToken);
  if (!base) return { ok: false, complete: false, error: "Unknown service.", pairs: [] };
  if (!token) return { ok: false, complete: false, error: "No token.", pairs: [] };

  const path = args.kind === "agency"
    ? "/v1.0/admin/retailer-dashboardsections"
    : "/v1.0/admin/datagroup-dashboardsections";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "x-caller-id": "console",
    ...(idToken ? { "x-id-token": idToken } : {}),
  };
  const rec = (r: Record<string, unknown>): AssignmentPair => {
    const sec = (r.dashboardSection ?? {}) as Record<string, unknown>;
    const tgt = (args.kind === "agency" ? r.retailer : r.dataGroup) as Record<string, unknown> | undefined;
    return { id: String(r.id ?? ""), sectionId: String(sec.id ?? ""), targetId: String(tgt?.id ?? "") };
  };
  const getPage = async (page: number): Promise<{ ok: boolean; rows: Record<string, unknown>[]; total?: number }> => {
    try {
      const res = await fetch(`${base}${path}?page=${page}&size=100`, { headers, signal: AbortSignal.timeout(25000) });
      if (!res.ok) return { ok: false, rows: [] };
      const totalH = res.headers.get("x-total-count");
      const total = totalH ? Number(totalH) : undefined;
      const data = (await res.json().catch(() => [])) as unknown;
      return { ok: true, rows: Array.isArray(data) ? (data as Record<string, unknown>[]) : [], total: Number.isFinite(total) ? total : undefined };
    } catch {
      return { ok: false, rows: [] };
    }
  };

  const first = await getPage(0);
  if (!first.ok) return { ok: false, complete: false, error: "Request failed (check token / network).", pairs: [] };
  const pairs: AssignmentPair[] = [];
  const push = (rows: Record<string, unknown>[]) => {
    for (const r of rows) {
      const p = rec(r);
      if (p.id && p.sectionId && p.targetId) pairs.push(p);
    }
  };
  push(first.rows);
  const pages = Math.min(Math.ceil((first.total ?? first.rows.length) / 100), 80);
  let complete = true;
  // Fetch the remaining pages concurrently. This is server→prod directly (not via
  // our dev proxy), so high concurrency is safe and keeps the whole load to a few
  // seconds instead of ~25s sequential.
  const rest = Array.from({ length: Math.max(0, pages - 1) }, (_, i) => i + 1);
  const CONC = 10;
  for (let i = 0; i < rest.length; i += CONC) {
    const batch = rest.slice(i, i + CONC);
    const results = await Promise.all(
      batch.map(async (p) => {
        let r = await getPage(p);
        if (!r.ok) r = await getPage(p); // one retry
        return r;
      }),
    );
    for (const r of results) {
      if (r.ok) push(r.rows);
      else complete = false;
    }
  }
  return { ok: true, complete, pairs };
}

// ---- write proxy (mutations) ---------------------------------------------
// Mutations are far more dangerous than reads, so they are double-gated: only
// these exact path prefixes may be written, and only with POST/DELETE. This is
// what the "Massive update" tool uses to insert/remove dashboard-section
// assignments (mirrors the bulks_scripts: datagroup-dashboardsections,
// datagroup-retailer-dashboardsections, retailer-dashboardsections,
// datagroup-retailers). Everything else is rejected before any network call.
const WRITE_PATH_PREFIXES = [
  "/v1.0/admin/datagroup-dashboardsections",
  "/v1.0/admin/datagroup-retailer-dashboardsections",
  "/v1.0/admin/retailer-dashboardsections",
  "/v1.0/admin/datagroup-retailers",
];

export type LiveMethod = "POST" | "DELETE";

/**
 * Allow-listed write proxy to a Shalion API. Only POST/DELETE to the dashboard
 * assignment endpoints are permitted (anti-SSRF + blast-radius control). The
 * token, id token and x-caller-id are attached server-side.
 */
export async function mutateShalion(args: {
  service: string;
  path: string;
  method: LiveMethod;
  body?: JsonValue;
  token?: string;
  idToken?: string;
  env?: LiveEnv;
}): Promise<LiveResult> {
  const env: LiveEnv = args.env ?? "prod";
  const base = baseUrlFor(args.service, env);
  const hadToken = !!resolveToken(args.token);

  if (!base) return { ok: false, status: 0, data: null, hadToken, error: `Unknown service "${args.service}".` };
  if (args.method !== "POST" && args.method !== "DELETE")
    return { ok: false, status: 0, data: null, hadToken, error: `Method ${args.method} not allowed.` };
  if (!args.path.startsWith("/"))
    return { ok: false, status: 0, data: null, hadToken, error: "Path must start with '/'." };
  // Strip any query string before checking the allow-list.
  const pathOnly = args.path.split("?")[0];
  if (!WRITE_PATH_PREFIXES.some((p) => pathOnly === p || pathOnly.startsWith(`${p}/`)))
    return { ok: false, status: 0, data: null, hadToken, error: `Path "${pathOnly}" is not a writable endpoint.` };

  const token = resolveToken(args.token);
  if (!token)
    return { ok: false, status: 401, data: null, hadToken: false, error: "No token. Paste a bearer token to write." };
  const idToken = resolveIdToken(args.idToken);
  const url = `${base}${args.path}`;

  try {
    const res = await fetch(url, {
      method: args.method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "x-caller-id": "console",
        ...(idToken ? { "x-id-token": idToken } : {}),
        ...(args.method === "POST" ? { "Content-Type": "application/json" } : {}),
      },
      body: args.method === "POST" ? JSON.stringify(args.body ?? {}) : undefined,
      signal: AbortSignal.timeout(20000),
    });
    const text = await res.text();
    let data: JsonValue = null;
    try {
      data = text ? (JSON.parse(text) as JsonValue) : null;
    } catch {
      data = null;
    }
    return {
      ok: res.ok,
      status: res.status,
      data,
      hadToken: true,
      url,
      error: res.ok
        ? undefined
        : res.status === 401 || res.status === 403
          ? "Unauthorized — token missing/expired or lacks permission."
          : res.status === 409
            ? "Already exists (409)."
            : `Upstream responded ${res.status}${text ? ` — ${text.slice(0, 200)}` : ""}.`,
    };
  } catch (e) {
    return { ok: false, status: 0, data: null, hadToken: true, url, error: `Could not reach ${base} — ${(e as Error).message}.` };
  }
}

/**
 * Read-only GET proxy to a Shalion develop API. Validates the service against the
 * allow-list, requires a relative path, attaches the bearer token server-side,
 * and returns a normalised result the client can render.
 */
export async function fetchShalion(args: {
  service: string;
  path: string;
  token?: string;
  idToken?: string;
  env?: LiveEnv;
}): Promise<LiveResult> {
  // Default to prod: it's public, and the tokens people paste are prod tokens.
  // Develop hosts (*.develop.shalion.com) are internal/VPN-only and fail to connect
  // from a browser-hosted server fn / Vercel.
  const env: LiveEnv = args.env ?? "prod";
  const base = baseUrlFor(args.service, env);
  const hadToken = !!resolveToken(args.token);

  if (!base) {
    return { ok: false, status: 0, data: null, hadToken, error: `Unknown service "${args.service}".` };
  }
  if (!args.path.startsWith("/")) {
    return { ok: false, status: 0, data: null, hadToken, error: "Path must start with '/'." };
  }
  const token = resolveToken(args.token);
  if (!token) {
    return {
      ok: false,
      status: 401,
      data: null,
      hadToken: false,
      error: "No token. Paste a bearer token to connect, or set SHALION_API_TOKEN on the server.",
    };
  }

  const idToken = resolveIdToken(args.idToken);
  const url = `${base}${args.path}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(idToken ? { "x-id-token": idToken } : {}),
      },
      signal: AbortSignal.timeout(20000),
    });
    const text = await res.text();
    let data: JsonValue = null;
    try {
      data = text ? (JSON.parse(text) as JsonValue) : null;
    } catch {
      data = null;
    }
    const totalHeader = res.headers.get("x-total-count");
    const total = totalHeader != null && totalHeader !== "" ? Number(totalHeader) : undefined;
    return {
      ok: res.ok,
      status: res.status,
      data,
      hadToken: true,
      url,
      total: Number.isFinite(total) ? total : undefined,
      error: res.ok
        ? undefined
        : res.status === 401 || res.status === 403
          ? "Unauthorized — the token is missing, expired or lacks permission for this resource."
          : `Upstream responded ${res.status}.`,
    };
  } catch (e) {
    const internal = /\.develop\.shalion\.com|\.ondemand\.shalion\.com/.test(base);
    return {
      ok: false,
      status: 0,
      data: null,
      hadToken: true,
      url,
      error:
        `Could not reach ${base} — ${(e as Error).message}.` +
        (internal
          ? " This is an internal (develop/staging) host — it needs the corporate VPN. Use the prod environment instead."
          : " Check the network / VPN can reach this host."),
    };
  }
}
