// Super Update — real run orchestration (client side).
//
// Snapshots each PK's CURRENT field value (GET, via the read proxy) BEFORE applying the
// new value (PATCH, via the write proxy), so every change is reversible. Both calls go
// through the server-side proxy (live.functions → shalion.server), which attaches the
// bearer/id token server-side and avoids CORS. Dev maps to the develop host (VPN-only),
// prod to production. No request is made without a token.

import { fetchLive, mutateLive } from "./api/live.functions";
import {
  proxyServiceFor,
  getByPath,
  buildPayload,
  buildMergedBody,
  isNestedField,
  tableBasePath,
  junctionLinkBody,
  findRelation,
  relationSideId,
  unwrapRows,
  type PatchService,
  type PatchTable,
  type PatchField,
  type PatchEnv,
  type SuperUpdateRowResult,
  type PatchJunction,
  type JunctionRowResult,
} from "./superUpdate";

type LiveEnv = "develop" | "prod";
const toLiveEnv = (env: PatchEnv): LiveEnv => (env === "dev" ? "develop" : "prod");

const CONCURRENCY = 5;

// Run an async fn over items with a bounded concurrency pool (order preserved).
async function pool<T, R>(items: T[], fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));
  return out;
}

export type RunPhase = "snapshot" | "apply";

export type RunInput = {
  service: PatchService;
  table: PatchTable;
  field: PatchField;
  env: PatchEnv;
  token: string;
  idToken: string;
  /** Valid rows: PK + already-coerced JSON value (may be null). */
  rows: { pk: string; value: unknown }[];
  onProgress?: (done: number, total: number, phase: RunPhase) => void;
};

const path = (table: PatchTable, pk: string) => `${tableBasePath(table)}/${pk}`;

/**
 * Snapshot (GET current value) then apply (PATCH new value) for each row. Returns a
 * per-row result carrying the captured `oldValue` for rollback. A row whose snapshot
 * fails is NOT patched (we never change a value we couldn't first record).
 */
export async function runSuperUpdate(input: RunInput): Promise<SuperUpdateRowResult[]> {
  const { service, table, field, env, token, idToken, rows, onProgress } = input;
  const svc = proxyServiceFor(service);
  const liveEnv = toLiveEnv(env);
  // Read path may differ from the write path (e.g. read `reExecutionRules`, write
  // `updateReExecutionRules`) — snapshot by the read path, patch by field.path.
  const readWirePath = field.readPath ?? field.path ?? field.column;
  const nested = isNestedField(field);
  const auth = { token: token || undefined, idToken: idToken || undefined, env: liveEnv };

  // Phase 1 — snapshot the current value of each row (read-only). For a TOP-LEVEL field
  // a row is only "ok" when the value was actually present (an absent value can't be
  // rolled back). For a NESTED field the patch is read-modify-write (siblings preserved),
  // so an absent leaf is still recoverable — recorded as null; we also keep the full GET
  // record to merge against in phase 2. The pool callback never throws.
  let snapDone = 0;
  const snaps = await pool(rows, async (r) => {
    try {
      const res = await fetchLive({ data: { service: svc, path: path(table, r.pk), ...auth } });
      if (!res.ok) {
        // The admin API hides soft-deleted rows (deleted_at set), returning 404 — so a 404
        // means "deleted or absent on this environment"; we can't snapshot it → skip it.
        const why = res.status === 404
          ? `not found on ${env} — the row is deleted or absent (can't snapshot); skipped`
          : (res.error ?? `GET failed (${res.status})`);
        return { ok: false as const, error: why };
      }
      const found = getByPath(res.data, readWirePath);
      // A top-level field whose value isn't in the record can't be snapshotted → skip, EXCEPT
      // when it's a nullable field with an explicit readPath: there `undefined` means the mapped
      // read location is genuinely empty (e.g. a nested `parent` object is null), so treat it as
      // null and proceed (lets a nullable field be cleared even when it's already empty). Fields
      // WITHOUT a readPath still error on undefined — a useful signal the read key may be wrong.
      if (found === undefined && !nested && !(field.readPath && field.nullable))
        return { ok: false as const, error: "current value not found in record — not patched (no rollback snapshot)" };
      return { ok: true as const, oldValue: found === undefined ? null : found, record: res.data };
    } catch (e) {
      return { ok: false as const, error: `snapshot error: ${(e as Error).message}` };
    } finally {
      onProgress?.(++snapDone, rows.length, "snapshot");
    }
  });

  // Phase 2 — apply the new value (only where the snapshot succeeded). Never throws:
  // any transport rejection becomes an error row, so the batch (and the captured
  // oldValues for rows that DID apply) always survives for rollback.
  let applyDone = 0;
  return pool(rows, async (r, i) => {
    const snap = snaps[i];
    const base: SuperUpdateRowResult = { pk: r.pk, oldValue: snap.ok ? snap.oldValue : undefined, newValue: r.value, status: "error" };
    if (!snap.ok) {
      onProgress?.(++applyDone, rows.length, "apply");
      return { ...base, error: snap.error };
    }
    if (r.value === undefined) {
      onProgress?.(++applyDone, rows.length, "apply");
      return { ...base, error: "no value to write" };
    }
    try {
      // Nested fields read-modify-write the parent (from the snapshot record) to keep siblings.
      const body = nested ? buildMergedBody(field, r.value, snap.record) : buildPayload(field, r.value);
      const res = await mutateLive({
        data: { service: svc, path: path(table, r.pk), method: "PATCH", body, ...auth },
      });
      return res.ok ? { ...base, status: "ok" as const } : { ...base, error: res.error ?? `PATCH failed (${res.status})` };
    } catch (e) {
      return { ...base, error: `apply error: ${(e as Error).message}` };
    } finally {
      onProgress?.(++applyDone, rows.length, "apply");
    }
  });
}

/**
 * Restore a previous run: PATCH each successfully-changed row back to its captured
 * `oldValue`. Re-snapshots first so the restore is itself reversible.
 */
export async function restoreSuperUpdate(input: {
  service: PatchService;
  table: PatchTable;
  field: PatchField;
  env: PatchEnv;
  token: string;
  idToken: string;
  rows: { pk: string; oldValue: unknown }[];
  onProgress?: (done: number, total: number, phase: RunPhase) => void;
}): Promise<SuperUpdateRowResult[]> {
  return runSuperUpdate({
    service: input.service,
    table: input.table,
    field: input.field,
    env: input.env,
    token: input.token,
    idToken: input.idToken,
    rows: input.rows.map((r) => ({ pk: r.pk, value: r.oldValue })),
    onProgress: input.onProgress,
  });
}

// ---------- join tables (junctions): link / unlink ----------

const LINK_BATCH = 100;
const BARE_ID = /^[A-Za-z0-9_-]+$/;

type JAuth = { token?: string; idToken?: string; env: LiveEnv };
const jauth = (token: string, idToken: string, env: PatchEnv): JAuth => ({ token: token || undefined, idToken: idToken || undefined, env: toLiveEnv(env) });

// Link a single pair via POST /batch with a 1-element body — accurate per-pair result +
// relation-id capture. Used as the chunk fallback so a failed/409 chunk never orphans rows.
async function linkOne(svc: string, base: string, auth: JAuth, j: PatchJunction, p: { left: string; right: string }): Promise<JunctionRowResult> {
  try {
    const res = await mutateLive({ data: { service: svc, path: `${base}/batch`, method: "POST", body: junctionLinkBody(j, [p]), ...auth } });
    if (!res.ok) {
      // 409 = the pair already exists (not created by us) → leave it; never roll it back.
      if (res.status === 409) return { left: p.left, right: p.right, status: "ok", warn: "already linked (pre-existing) — not added; excluded from rollback" };
      return { left: p.left, right: p.right, status: "error", error: res.error ?? `link failed (${res.status})` };
    }
    const created = unwrapRows(res.data);
    const rel = findRelation(created, j, p.left, p.right) ?? (created.length === 1 ? created[0] : undefined);
    const relationId = rel && typeof rel.id === "string" ? rel.id : undefined;
    return relationId
      ? { left: p.left, right: p.right, relationId, status: "ok" }
      : { left: p.left, right: p.right, status: "ok", warn: "linked, but relation id not captured — in-tool unlink unavailable (keep the Rollback CSV)" };
  } catch (e) {
    return { left: p.left, right: p.right, status: "error", error: `link error: ${(e as Error).message}` };
  }
}

/** Link pairs via POST /{resource}/batch (chunks of 100). A failed/409 chunk falls back to
 *  per-pair POSTs so each pair gets an accurate result + captured id (no silent orphans). */
export async function linkJunction(input: {
  junction: PatchJunction; env: PatchEnv; token: string; idToken: string;
  pairs: { left: string; right: string }[]; onProgress?: (d: number, t: number, p: RunPhase) => void;
}): Promise<JunctionRowResult[]> {
  const { junction: j, env, token, idToken, pairs, onProgress } = input;
  const svc = j.serviceSlug.replace(/-api$/, "");
  const base = `/v1.0/admin/${j.resource}`;
  const auth = jauth(token, idToken, env);
  const out: JunctionRowResult[] = [];
  let done = 0;
  for (let i = 0; i < pairs.length; i += LINK_BATCH) {
    const chunk = pairs.slice(i, i + LINK_BATCH);
    let res: Awaited<ReturnType<typeof mutateLive>> | null = null;
    try { res = await mutateLive({ data: { service: svc, path: `${base}/batch`, method: "POST", body: junctionLinkBody(j, chunk), ...auth } }); } catch { res = null; }
    if (res && res.ok) {
      const created = unwrapRows(res.data);
      for (const p of chunk) {
        const rel = findRelation(created, j, p.left, p.right);
        const relationId = rel && typeof rel.id === "string" ? rel.id : undefined;
        out.push(relationId
          ? { left: p.left, right: p.right, relationId, status: "ok" }
          : { left: p.left, right: p.right, status: "ok", warn: "linked, but relation id not captured — in-tool unlink unavailable (keep the Rollback CSV)" });
      }
    } else {
      // The chunk failed (or returned 409) and MAY have partially applied — retry per pair
      // so each is definitively attempted and its created id captured. No blanket orphaning.
      for (const p of chunk) out.push(await linkOne(svc, base, auth, j, p));
    }
    done += chunk.length;
    onProgress?.(done, pairs.length, "apply");
  }
  return out;
}

/** Unlink BY RELATION ID (mirrors removeJobSeeds.js): GET /{resource}/{id} to snapshot the
 *  pair (for re-link rollback) — skip if it can't be read — then DELETE /{resource}/{id}. */
export async function unlinkJunction(input: {
  junction: PatchJunction; env: PatchEnv; token: string; idToken: string;
  relationIds: string[]; onProgress?: (d: number, t: number, p: RunPhase) => void;
}): Promise<JunctionRowResult[]> {
  const { junction: j, env, token, idToken, relationIds, onProgress } = input;
  const svc = j.serviceSlug.replace(/-api$/, "");
  const base = `/v1.0/admin/${j.resource}`;
  const auth = jauth(token, idToken, env);
  let done = 0;
  return pool(relationIds, async (id) => {
    try {
      if (!BARE_ID.test(id)) return { left: "", right: "", relationId: id, status: "error" as const, error: "invalid relation id" };
      const got = await fetchLive({ data: { service: svc, path: `${base}/${id}`, ...auth } });
      if (!got.ok) return { left: "", right: "", relationId: id, status: "error" as const, error: got.status === 404 ? "relation not found (already unlinked)" : got.error ?? `lookup failed (${got.status})` };
      const left = relationSideId(got.data, j.leftKey) ?? "";
      const right = relationSideId(got.data, j.rightKey) ?? "";
      const del = await mutateLive({ data: { service: svc, path: `${base}/${id}`, method: "DELETE", ...auth } });
      return del.ok
        ? { left, right, relationId: id, status: "ok" as const }
        : { left, right, relationId: id, status: "error" as const, error: del.error ?? `unlink failed (${del.status})` };
    } catch (e) {
      return { left: "", right: "", relationId: id, status: "error" as const, error: `unlink error: ${(e as Error).message}` };
    } finally {
      onProgress?.(++done, relationIds.length, "apply");
    }
  });
}

/** Invert a junction run: undo a Link by unlinking its captured relation ids; undo an
 *  Unlink by re-linking the snapshotted pairs. */
export async function restoreJunction(input: {
  junction: PatchJunction; op: "link" | "unlink"; env: PatchEnv; token: string; idToken: string;
  rows: JunctionRowResult[]; onProgress?: (d: number, t: number, p: RunPhase) => void;
}): Promise<JunctionRowResult[]> {
  const { junction, op, env, token, idToken, rows, onProgress } = input;
  if (op === "link") {
    const relationIds = rows.map((r) => r.relationId).filter((x): x is string => !!x);
    return unlinkJunction({ junction, env, token, idToken, relationIds, onProgress });
  }
  return linkJunction({ junction, env, token, idToken, pairs: rows.filter((r) => r.left && r.right).map((r) => ({ left: r.left, right: r.right })), onProgress });
}
