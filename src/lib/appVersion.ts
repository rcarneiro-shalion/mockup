// App-version core — the mockup is served as three PARALLEL, independently-evolving
// versions of the Seeds API console: /v1, /v2, /v3. Each version mounts the SAME route
// tree under its own basepath and persists to its OWN localStorage namespace, so all
// three start as clones of the current "As Is" (the shared INITIAL_* fixtures) and then
// diverge as version-specific changes land (code-gated on getAppVersion()).
//
// Isomorphic and dependency-free: the client derives the version from the URL; the
// server (SSR) receives it from the start.ts request middleware via setSsrAppVersion.

export type AppVersion = 1 | 2 | 3;

export const APP_VERSIONS: readonly AppVersion[] = [1, 2, 3] as const;
export const DEFAULT_APP_VERSION: AppVersion = 1;

export const versionLabel = (v: AppVersion): string => `Seeds API v.${v}`;
export const versionBasepath = (v: AppVersion): string => `/v${v}`;

const VERSION_RE = /^\/v([123])(?=\/|$)/;

/** Extract the version from a pathname ("/v2/clients" → 2), or null when unprefixed. */
export function parseAppVersion(pathname: string): AppVersion | null {
  const m = VERSION_RE.exec(pathname);
  return m ? (Number(m[1]) as AppVersion) : null;
}

/** Drop the "/vN" prefix ("/v2/clients" → "/clients"). No-op on unprefixed paths. */
export function stripVersionPrefix(pathname: string): string {
  return pathname.replace(VERSION_RE, "") || "/";
}

// SSR relay: the request middleware stamps the version of the request being rendered
// before the framework calls getRouter(). Module-scoped — fine for this mockup's
// traffic (the only consequence of a concurrent-request race is one SSR pass rendered
// under the wrong basepath, corrected on hydration).
let ssrVersion: AppVersion = DEFAULT_APP_VERSION;
export function setSsrAppVersion(v: AppVersion | null): void {
  ssrVersion = v ?? DEFAULT_APP_VERSION;
}

/** The version this page load runs under. Fixed per load — switching tabs is a full
 *  navigation, so everything derived from it (basepath, storage keys) stays coherent. */
export function getAppVersion(): AppVersion {
  if (typeof window === "undefined") return ssrVersion;
  return parseAppVersion(window.location.pathname) ?? DEFAULT_APP_VERSION;
}

// ---- router URL rewrite --------------------------------------------------------
// The version prefix is mounted via the router's `rewrite` option, NOT `basepath`:
// TanStack Start force-overrides the client basepath with the build-time
// TSS_ROUTER_BASEPATH on hydrate (see start-client-core hydrateStart), so a
// per-request basepath cannot survive. The rewrite pair is left intact by Start:
// input strips "/vN" before matching, output re-adds it to every generated href.
export type VersionRewrite = {
  input: (args: { url: URL }) => URL;
  output: (args: { url: URL }) => URL;
  /** The version this router instance serves — parsed from its own request URL. */
  getVersion: () => AppVersion;
};

/** Per-router rewrite factory. The version lives in the CLOSURE, seeded from the URL
 *  the router actually parses — one router per SSR request means concurrent requests
 *  can't bleed into each other (the module-level ssrVersion relay alone races: any
 *  concurrent request would repoint it mid-render and corrupt every generated href). */
export function makeVersionRewrite(): VersionRewrite {
  // Client: the address bar. Server: the middleware relay as a pre-parse fallback.
  let v: AppVersion = getAppVersion();
  return {
    input: ({ url }) => {
      const parsed = parseAppVersion(url.pathname);
      if (parsed) {
        v = parsed;
        // Keep the coarse relay aligned for non-router readers (no-op on the client).
        setSsrAppVersion(parsed);
      }
      url.pathname = stripVersionPrefix(url.pathname);
      return url;
    },
    output: ({ url }) => {
      // Return a NEW URL — router-core keeps a reference to the pre-rewrite object
      // when building locations, so mutating it in place desyncs the internal href
      // (breaking the same-URL fast-path: every re-click of the active link would
      // push a duplicate history entry).
      const out = new URL(url.href);
      out.pathname = `/v${v}${url.pathname === "/" ? "" : url.pathname}`;
      return out;
    },
    getVersion: () => v,
  };
}

// ---- versioned storage ---------------------------------------------------------
// Versioning forks MOCKUP data only. State that mirrors REAL external systems stays
// shared across versions: dev API tokens (shalion:*), the reset machinery's own
// bookkeeping (app:*), the live massive-update tooling (mu:* — env toggle + labels
// cached from the live API) and the Super-update rollback history of real Dev/Prod
// mutations (bulk:superUpdateHistory). bulk:processes stays versioned (fixture data).
const UNVERSIONED_PREFIXES = ["shalion:", "app:", "mu:", "bulk:superUpdateHistory"];

/** Namespace a persistence key under the current version ("clients" → "v2:clients")
 *  so each version keeps its own independent copy of the mockup data. */
export function versionedKey(key: string): string {
  if (UNVERSIONED_PREFIXES.some((p) => key.startsWith(p))) return key;
  return `v${getAppVersion()}:${key}`;
}
