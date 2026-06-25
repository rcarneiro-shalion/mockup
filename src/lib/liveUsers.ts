import { fetchLive, mutateLive } from "@/lib/api/live.functions";

// Live integration for the client-level Users × data-groups section, against the REAL
// visualization-api (the user↔data-group N:M lives at /v1.0/admin/user-datagroups; data
// groups at /v1.0/admin/datagroups). Mirrors the Super Update / Massive update live model:
// reads via fetchLive, writes via mutateLive, all through the allow-listed server proxy.
//
// NOTE: these admin list endpoints IGNORE query filters + size (100/page fixed), but honor
// `?page=`, so we page and filter client-side. Assign body shape is by-convention (mirrors
// the job-seeds junction) and must be verified on Develop before any prod use.

export type LiveEnv = "develop" | "prod";

export type LiveUserGraph = {
  matchedClients: string[]; // distinct real client names whose data groups matched
  dataGroups: { id: string; name: string }[];
  users: { id: string; email: string; isActive: boolean }[];
  memberships: Set<string>; // `${userId}::${dataGroupId}`
  relationIdByPair: Map<string, string>; // `${userId}::${dataGroupId}` -> user-datagroup row id (for unassign)
  truncated: boolean; // true if we hit the page cap (graph may be partial)
};

export const pairKey = (userId: string, dataGroupId: string) => `${userId}::${dataGroupId}`;

/** Unwrap a list envelope (array / {data|content|items|results}). */
export function unwrapRows(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["data", "content", "items", "results"]) if (Array.isArray(o[k])) return o[k] as Record<string, unknown>[];
  }
  return [];
}

/** PURE: build the client's user↔data-group graph from raw datagroup + user-datagroup rows. */
export function reconstructLiveGraph(
  datagroupRows: Record<string, unknown>[],
  userDatagroupRows: Record<string, unknown>[],
  clientName: string,
  truncated = false,
): LiveUserGraph {
  const want = clientName.trim().toLowerCase();
  const matched = new Map<string, string>(); // dgId -> dgName
  const matchedClients = new Set<string>();
  for (const r of datagroupRows) {
    const client = r.client as { name?: string } | undefined;
    const cn = (client?.name ?? "").toString().trim().toLowerCase();
    // EXACT (case-insensitive) client-name match only. A substring match would fold a sibling
    // tenant's data groups in (e.g. "Coca Cola FEMSA" / "Coca Cola HBC"), and since the graph
    // drives REAL assign/unassign writes, that would let an operator write to the wrong tenant.
    if (cn && want && cn === want && typeof r.id === "string") {
      matched.set(r.id, (r.name as string) ?? r.id);
      if (client?.name) matchedClients.add(client.name);
    }
  }
  const users = new Map<string, { id: string; email: string; isActive: boolean }>();
  const memberships = new Set<string>();
  const relationIdByPair = new Map<string, string>();
  for (const r of userDatagroupRows) {
    const u = r.user as { id?: string; email?: string; isActive?: boolean } | undefined;
    const g = r.dataGroup as { id?: string } | undefined;
    if (!u?.id || !g?.id || !matched.has(g.id)) continue;
    users.set(u.id, { id: u.id, email: u.email ?? u.id, isActive: !!u.isActive });
    const k = pairKey(u.id, g.id);
    memberships.add(k);
    if (typeof r.id === "string") relationIdByPair.set(k, r.id);
  }
  return {
    matchedClients: [...matchedClients],
    dataGroups: [...matched].map(([id, name]) => ({ id, name })),
    users: [...users.values()].sort((a, b) => a.email.localeCompare(b.email)),
    memberships,
    relationIdByPair,
    truncated,
  };
}

type Auth = { token?: string; idToken?: string; env: LiveEnv };

async function pageAll(
  path: (page: number) => string,
  auth: Auth,
  maxPages: number,
  onProgress?: (msg: string) => void,
  label = "rows",
): Promise<{ rows: Record<string, unknown>[]; truncated: boolean }> {
  const out: Record<string, unknown>[] = [];
  let page = 0;
  for (; page < maxPages; page++) {
    const res = await fetchLive({ data: { service: "visualization", path: path(page), token: auth.token, idToken: auth.idToken, env: auth.env } });
    if (!res.ok) {
      if (page === 0) throw new Error(res.error || `fetch failed (${res.status})`);
      break; // partial; stop on a mid-stream error
    }
    const rows = unwrapRows(res.data);
    out.push(...rows);
    onProgress?.(`${out.length} ${label}…`);
    if (rows.length < 100) return { rows: out, truncated: false };
  }
  return { rows: out, truncated: page >= maxPages };
}

/** Pull this client's data groups + user memberships from the live visualization-api. */
export async function syncClientUsers(opts: {
  clientName: string;
  env: LiveEnv;
  token: string;
  idToken: string;
  onProgress?: (msg: string) => void;
}): Promise<LiveUserGraph> {
  const auth: Auth = { token: opts.token || undefined, idToken: opts.idToken || undefined, env: opts.env };
  opts.onProgress?.("Loading data groups…");
  const dg = await pageAll((p) => `/v1.0/admin/datagroups?size=100&page=${p}`, auth, 6, opts.onProgress, "data groups");
  opts.onProgress?.("Loading memberships…");
  // user-datagroups is unfiltered (server ignores ?dataGroupId=), so page all + filter client-side.
  const udg = await pageAll((p) => `/v1.0/admin/user-datagroups?size=100&page=${p}`, auth, 40, opts.onProgress, "memberships");
  return reconstructLiveGraph(dg.rows, udg.rows, opts.clientName, dg.truncated || udg.truncated);
}

export type AssignResult = { kind: "assign" | "unassign"; userId: string; dataGroupId: string; status: "ok" | "error"; error?: string; relationId?: string };

/** Body for an assign batch — flat `{userId, dataGroupId}` (mirrors the job-seeds junction; verify on Dev). */
export const assignBatchBody = (pairs: { userId: string; dataGroupId: string }[]) =>
  pairs.map((p) => ({ userId: p.userId, dataGroupId: p.dataGroupId }));

const CHUNK = 100;

/** Apply real assignment changes: POST /user-datagroups/batch (adds) + DELETE /user-datagroups/{id} (removes). */
export async function applyLiveAssignments(opts: {
  env: LiveEnv;
  token: string;
  idToken: string;
  adds: { userId: string; dataGroupId: string }[];
  removes: { relationId: string; userId: string; dataGroupId: string }[];
  onProgress?: (done: number, total: number) => void;
}): Promise<AssignResult[]> {
  const { env, token, idToken } = opts;
  const auth = { token: token || undefined, idToken: idToken || undefined, env };
  const base = "/v1.0/admin/user-datagroups";
  const out: AssignResult[] = [];
  const total = opts.adds.length + opts.removes.length;
  let done = 0;

  // adds — chunked batch POST, with per-pair fallback so one bad pair can't sink the chunk.
  for (let i = 0; i < opts.adds.length; i += CHUNK) {
    const chunk = opts.adds.slice(i, i + CHUNK);
    let ok = false;
    try {
      const res = await mutateLive({ data: { service: "visualization", path: `${base}/batch`, method: "POST", body: assignBatchBody(chunk), token: auth.token, idToken: auth.idToken, env } });
      ok = res.ok;
      if (!ok && chunk.length === 1) out.push({ kind: "assign", ...chunk[0], status: "error", error: res.error ?? `assign failed (${res.status})` });
    } catch (e) {
      if (chunk.length === 1) out.push({ kind: "assign", ...chunk[0], status: "error", error: `assign error: ${(e as Error).message}` });
    }
    if (ok) {
      for (const p of chunk) out.push({ kind: "assign", ...p, status: "ok" });
    } else if (chunk.length > 1) {
      for (const p of chunk) {
        try {
          const r = await mutateLive({ data: { service: "visualization", path: `${base}/batch`, method: "POST", body: assignBatchBody([p]), token: auth.token, idToken: auth.idToken, env } });
          out.push({ kind: "assign", ...p, status: r.ok ? "ok" : "error", error: r.ok ? undefined : (r.error ?? `assign failed (${r.status})`) });
        } catch (e) {
          out.push({ kind: "assign", ...p, status: "error", error: `assign error: ${(e as Error).message}` });
        }
        opts.onProgress?.(++done, total);
      }
      continue;
    }
    done += chunk.length;
    opts.onProgress?.(done, total);
  }

  // removes — DELETE by relation id.
  for (const r of opts.removes) {
    try {
      const res = await mutateLive({ data: { service: "visualization", path: `${base}/${r.relationId}`, method: "DELETE", token: auth.token, idToken: auth.idToken, env } });
      out.push({ kind: "unassign", userId: r.userId, dataGroupId: r.dataGroupId, relationId: r.relationId, status: res.ok ? "ok" : "error", error: res.ok ? undefined : (res.error ?? `unassign failed (${res.status})`) });
    } catch (e) {
      out.push({ kind: "unassign", userId: r.userId, dataGroupId: r.dataGroupId, relationId: r.relationId, status: "error", error: `unassign error: ${(e as Error).message}` });
    }
    opts.onProgress?.(++done, total);
  }
  return out;
}

/**
 * PURE: diff a desired membership set against the synced graph → adds + removes (by relation id).
 * `skipped` = desired removals whose relation id wasn't captured (can't DELETE) — surfaced, not silently dropped.
 */
export function diffMemberships(
  graph: LiveUserGraph,
  desired: Set<string>,
): {
  adds: { userId: string; dataGroupId: string }[];
  removes: { relationId: string; userId: string; dataGroupId: string }[];
  skipped: { userId: string; dataGroupId: string }[];
} {
  const adds: { userId: string; dataGroupId: string }[] = [];
  const removes: { relationId: string; userId: string; dataGroupId: string }[] = [];
  const skipped: { userId: string; dataGroupId: string }[] = [];
  for (const k of desired) {
    if (!graph.memberships.has(k)) {
      const [userId, dataGroupId] = k.split("::");
      adds.push({ userId, dataGroupId });
    }
  }
  for (const k of graph.memberships) {
    if (!desired.has(k)) {
      const [userId, dataGroupId] = k.split("::");
      const relationId = graph.relationIdByPair.get(k);
      if (relationId) removes.push({ relationId, userId, dataGroupId });
      else skipped.push({ userId, dataGroupId });
    }
  }
  return { adds, removes, skipped };
}
