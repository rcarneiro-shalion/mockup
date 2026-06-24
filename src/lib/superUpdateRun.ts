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
  type PatchService,
  type PatchTable,
  type PatchField,
  type PatchEnv,
  type SuperUpdateRowResult,
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

const path = (table: PatchTable, pk: string) => `/v1.0/admin/${table.resource}/${pk}`;

/**
 * Snapshot (GET current value) then apply (PATCH new value) for each row. Returns a
 * per-row result carrying the captured `oldValue` for rollback. A row whose snapshot
 * fails is NOT patched (we never change a value we couldn't first record).
 */
export async function runSuperUpdate(input: RunInput): Promise<SuperUpdateRowResult[]> {
  const { service, table, field, env, token, idToken, rows, onProgress } = input;
  const svc = proxyServiceFor(service);
  const liveEnv = toLiveEnv(env);
  const wirePath = field.path ?? field.column;
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
      const found = getByPath(res.data, wirePath);
      if (found === undefined && !nested)
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
