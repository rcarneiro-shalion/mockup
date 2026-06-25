import { fetchLive, mutateLive } from "@/lib/api/live.functions";
import type { LiveEnv } from "@/lib/liveUsers";

// Maestro (external app) live permission grants, via the IAM API "authorities" endpoint
// (from the IAM Swagger /iam-api-docs; see live-api-endpoints memory). A user's authorities are
// scoped PER application:
//   GET  /v1.0/admin/users/{userId}/applications/{applicationId}/authorities -> {permissionsIds, rolesIds, groupsIds}
//   PUT  (same path) body {permissionsIds:[...]}  — REPLACE: the body is the FULL desired set.
// Because PUT replaces, writes are READ-MODIFY-WRITE: re-read, swap ONLY the 5 Maestro
// permissions we model to match the desired ticks, and preserve every other permission id.
// (The IAM user id === the visualization user-datagroups user.id — verified on develop.)

export const MAESTRO_APP_ID = "e5df294a-a6a0-34ed-aedc-d8d0bd2956c0";

// mockup grant key (`<resource>.<action>`) -> IAM permission id (matches the IAM permissions
// catalogue; both develop and prod share these ids).
export const MAESTRO_PERMISSION_ID: Record<string, string> = {
  "explorer.view": "19d8f290-ca23-3c9b-9979-2db47f70fca7",
  "conversation.manage": "7aa3bdeb-b70f-313f-bce6-b8c9d242da06",
  "conversation.unlimited": "7535fcf9-e522-3b6d-bc51-b2c652b52fe6",
  "slides.view": "b44eee46-913f-323d-8005-17e151bde3d6",
  "slides.manage": "8b6c9059-91a7-3037-bc4b-c3ef3c66b38b",
};
const KEY_BY_PERMISSION_ID: Record<string, string> = Object.fromEntries(
  Object.entries(MAESTRO_PERMISSION_ID).map(([k, v]) => [v, k]),
);
const MODELLED_IDS = new Set(Object.values(MAESTRO_PERMISSION_ID));

type Auth = { token?: string; idToken?: string; env: LiveEnv };
type AuthoritiesResource = { permissionsIds?: string[]; rolesIds?: string[]; groupsIds?: string[] };

const authoritiesPath = (userId: string) => `/v1.0/admin/users/${userId}/applications/${MAESTRO_APP_ID}/authorities`;

/** GET a user's Maestro authorities → raw resource + the mockup grant keys currently held. */
export async function readMaestroAuthorities(userId: string, auth: Auth): Promise<{ raw: AuthoritiesResource; keys: string[] } | null> {
  const res = await fetchLive({ data: { service: "iam", path: authoritiesPath(userId), token: auth.token, idToken: auth.idToken, env: auth.env } });
  if (!res.ok || !res.data || typeof res.data !== "object") return null;
  const raw = res.data as AuthoritiesResource;
  // REPLACE-semantics safety: a 200 whose body lacks a permissionsIds ARRAY (an envelope, `{}`, or
  // an error shape) must be a READ FAILURE — NOT "zero permissions" — otherwise the follow-up PUT
  // would wipe every grant the user actually holds. "absent" must never look like "empty".
  if (!Array.isArray(raw.permissionsIds)) return null;
  const keys = raw.permissionsIds.map((id) => KEY_BY_PERMISSION_ID[id]).filter((k): k is string => !!k);
  return { raw, keys };
}

/** Bulk-read Maestro grants for many users (bounded concurrency). userId -> granted mockup keys. */
export async function bulkReadMaestroGrants(
  userIds: string[],
  auth: Auth,
  onProgress?: (done: number, total: number) => void,
): Promise<Map<string, string[]>> {
  const out = new Map<string, string[]>();
  const CONC = 8;
  let done = 0;
  for (let i = 0; i < userIds.length; i += CONC) {
    const batch = userIds.slice(i, i + CONC);
    const results = await Promise.all(batch.map(async (uid) => [uid, await readMaestroAuthorities(uid, auth)] as const));
    for (const [uid, r] of results) out.set(uid, r ? r.keys : []);
    done += batch.length;
    onProgress?.(Math.min(done, userIds.length), userIds.length);
  }
  return out;
}

export type MaestroResult = { userId: string; status: "ok" | "error"; error?: string };

/**
 * Apply Maestro grant changes. Per user: re-read current authorities (authoritative), set the
 * 5 modelled permissions to exactly `desiredKeys`, PRESERVE all other permission ids, and PUT the
 * full permission-id list (replace). Read-modify-write so a stale view can't clobber, and
 * non-modelled permissions are never dropped.
 */
export async function applyMaestroGrants(opts: {
  env: LiveEnv;
  token: string;
  idToken: string;
  changes: { userId: string; desiredKeys: string[] }[];
  onProgress?: (done: number, total: number) => void;
}): Promise<MaestroResult[]> {
  const auth: Auth = { token: opts.token || undefined, idToken: opts.idToken || undefined, env: opts.env };
  const out: MaestroResult[] = [];
  let done = 0;
  for (const ch of opts.changes) {
    try {
      const cur = await readMaestroAuthorities(ch.userId, auth);
      if (!cur) {
        out.push({ userId: ch.userId, status: "error", error: "Could not read current authorities" });
        opts.onProgress?.(++done, opts.changes.length);
        continue;
      }
      const desiredIds = ch.desiredKeys.map((k) => MAESTRO_PERMISSION_ID[k]).filter(Boolean);
      const preserved = (cur.raw.permissionsIds ?? []).filter((id) => !MODELLED_IDS.has(id));
      const permissionsIds = [...new Set([...preserved, ...desiredIds])];
      const res = await mutateLive({ data: { service: "iam", path: authoritiesPath(ch.userId), method: "PUT", body: { permissionsIds }, token: auth.token, idToken: auth.idToken, env: opts.env } });
      out.push({ userId: ch.userId, status: res.ok ? "ok" : "error", error: res.ok ? undefined : (res.error ?? `PUT failed (${res.status})`) });
    } catch (e) {
      out.push({ userId: ch.userId, status: "error", error: `apply error: ${(e as Error).message}` });
    }
    opts.onProgress?.(++done, opts.changes.length);
  }
  return out;
}
