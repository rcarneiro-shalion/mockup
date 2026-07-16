// One-time, version-gated localStorage reset.
//
// This mockup is fixture-driven: every entity reader (getClients/getSeeds/…) returns
// the persisted localStorage list when it is non-empty, else the INITIAL_* fixtures.
// So when the data model or the seed fixtures change, an EXISTING user's stale
// localStorage shadows the new fixtures — they keep seeing the old, smaller/old-shaped
// data while a brand-new user gets the current experience. Read-time shims
// (subProjects/subRotation/…) prevent crashes but cannot inject the new fixtures.
//
// The fix: stamp a schema version. On boot, if the stored version differs from the
// current one, clear the mockup's own localStorage keys so EVERY user — new and old —
// repopulates from the current INITIAL_* fixtures. New users have nothing to clear and
// are simply stamped. Dev API tokens (`shalion:*`) are preserved so a live-connect
// session survives the reset.
//
// ⇒ BUMP APP_SCHEMA_VERSION whenever you change a persisted shape or an INITIAL_*
//   fixture (new seed bulk, new entity fields, renamed keys, …).
export const APP_SCHEMA_VERSION = 27;

const VERSION_KEY = "app:schemaVersion";

// Dev API credentials survive a data reset (no need to re-paste tokens to reconnect).
const PRESERVE_PREFIXES = ["shalion:"];
// Every namespace the mockup writes data/prefs under (see the storage map). "approx:"
// = the dynamic EntityListPage/IAM/DC specs; "pref:" = per-table sort prefs; "bulk:" /
// "mu:" = bulk + massive-update tooling.
const APP_KEY_PREFIXES = [
  "seeds-api:",
  "settings:",
  "retailers:",
  "product:",
  "codification:",
  "approx:",
  "pref:",
  "bulk:",
  "mu:",
];
// The lone un-namespaced data key (CLIENTS_KEY) — a prefix sweep would miss it.
const APP_EXACT_KEYS = ["clients"];

const isAppDataKey = (k: string): boolean => {
  if (PRESERVE_PREFIXES.some((p) => k.startsWith(p))) return false;
  // Data keys live under a per-app-version namespace ("v2:clients" — see
  // lib/appVersion). Strip it before the prefix sweep so all three versions'
  // copies (and any legacy unprefixed key) are reset together.
  const base = k.replace(/^v[123]:/, "");
  return APP_EXACT_KEYS.includes(base) || APP_KEY_PREFIXES.some((p) => base.startsWith(p));
};

/**
 * Run ONCE on the client, before any reader touches localStorage. If the stored schema
 * version differs from {@link APP_SCHEMA_VERSION}, wipe the mockup's persisted data so
 * both new and existing users land on the current INITIAL_* fixtures, then stamp the
 * new version. No-op on the server and when the version already matches.
 */
export function ensureStorageVersion(): void {
  if (typeof window === "undefined") return;
  try {
    const ls = window.localStorage;
    if (ls.getItem(VERSION_KEY) === String(APP_SCHEMA_VERSION)) return;
    // Collect first, then delete — removeItem while iterating by index shifts indices.
    const doomed: string[] = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (k && isAppDataKey(k)) doomed.push(k);
    }
    doomed.forEach((k) => ls.removeItem(k));
    ls.setItem(VERSION_KEY, String(APP_SCHEMA_VERSION));
  } catch {
    /* localStorage blocked/unavailable — the app still runs off INITIAL_* fixtures */
  }
}
