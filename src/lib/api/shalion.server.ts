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
