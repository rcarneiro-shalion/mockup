import process from "node:process";

// Server-only helper for the "live data" proxy. The .server.ts suffix keeps this
// out of the client bundle — the bearer token and the upstream call never reach
// the browser. The mockup stays backendless; this is a thin read-only passthrough
// to Shalion's real develop APIs so we can validate flows against live data.

// Allow-list of services → develop base URLs (recovered from console-frontend's
// VITE_API_ENDPOINT_* config). Only these hosts can be proxied (anti-SSRF), and
// only GET is allowed.
const DEVELOP_BASES: Record<string, string> = {
  iam: "https://iam-api-develop.develop.shalion.com",
  backoffice: "https://backoffice-api-develop.develop.shalion.com",
  codification: "https://codification-api-develop.develop.shalion.com",
  "ecometry-tasks": "https://ecometry-tasks-api-develop.develop.shalion.com",
  "orders-management": "https://orders-management-api-develop.develop.shalion.com",
  "data-collector-instructions": "https://data-collector-instructions-api-develop.develop.shalion.com",
  "data-collector-extractions": "https://data-extraction-api-develop.develop.shalion.com",
  "data-collector-proxies": "https://data-collector-proxies-api-develop.develop.shalion.com",
  snowflake: "https://snowflake-api-develop.develop.shalion.com",
  visualization: "https://visualization-api-develop.develop.shalion.com",
  // Production visualization API (Clients × Dashboards × Datagroups). Requires the
  // dual-token auth: Authorization: Bearer <access> + x-id-token: <id>.
  "visualization-prod": "https://visualization-api-prod.v2.shalion.com",
  product: "https://product-api-develop.develop.shalion.com",
  bulk: "https://bulk-api-develop.develop.shalion.com",
  "seeds-api": "https://seeds-api-develop.develop.shalion.com",
};

export type LiveService = keyof typeof DEVELOP_BASES;
export const LIVE_SERVICES = Object.keys(DEVELOP_BASES);

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
}): Promise<LiveResult> {
  const base = DEVELOP_BASES[args.service];
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
      error: "No token. Paste a develop bearer token to connect, or set SHALION_API_TOKEN on the server.",
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
    return {
      ok: res.ok,
      status: res.status,
      data,
      hadToken: true,
      url,
      error: res.ok
        ? undefined
        : res.status === 401 || res.status === 403
          ? "Unauthorized — the token is missing, expired or lacks permission for this resource."
          : `Upstream responded ${res.status}.`,
    };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      data: null,
      hadToken: true,
      url,
      error: `Could not reach the API: ${(e as Error).message}`,
    };
  }
}
