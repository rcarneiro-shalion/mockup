import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pill } from "@/components/seeds/ListPrimitives";
import { DevTokensTrigger } from "@/components/common/DevTokensDialog";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  PATCH_SERVICES,
  PATCH_JUNCTIONS,
  patchUrl,
  csvHeaderHint,
  parseSuperUpdateCsv,
  parseJunctionCsv,
  parseRelationIds,
  buildRollbackCsv,
  junctionRollbackCsv,
  isJunctionBatch,
  jsonLeafField,
  JSON_SUBPATH_RE,
  type PatchService,
  type PatchTable,
  type PatchField,
  type PatchJunction,
  type PatchEnv,
  type JunctionOp,
  type SuperUpdateBatch,
  type SuperUpdateJunctionBatch,
  type AnyBatch,
} from "@/lib/superUpdate";
import { runSuperUpdate, restoreSuperUpdate, linkJunction, unlinkJunction, restoreJunction, type RunPhase } from "@/lib/superUpdateRun";
import { toast } from "sonner";
import { Upload, Wand2, Check, TriangleAlert, ArrowRight, Info, History, Download, RotateCcw, Loader2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SuperUpdateRun = {
  service: string;
  table: string;
  field: string;
  fileName: string;
  applied: number;
  failed: number;
  env: PatchEnv;
};

type Mode = "field" | "rel"; // field = single-column PATCH; rel = join-table link/unlink

// Keep the newest runs within a localStorage-safe row budget (always at least the newest),
// so a big run can't silently fail to persist. The Rollback CSV is the durable artifact.
const HISTORY_ROW_BUDGET = 5000;
function capHistory(list: AnyBatch[]): AnyBatch[] {
  const out: AnyBatch[] = [];
  let rows = 0;
  for (const b of list) {
    if (out.length > 0 && (rows + b.rows.length > HISTORY_ROW_BUDGET || out.length >= 20)) break;
    out.push(b);
    rows += b.rows.length;
  }
  return out;
}

const stamp = () => new Date().toLocaleString();

export function SuperUpdatePanel({ onRun }: { onRun: (r: SuperUpdateRun) => void }) {
  const [mode, setModeRaw] = useState<Mode>("field");
  // field mode
  const [serviceSlug, setServiceSlug] = useState("");
  const [tableName, setTableName] = useState("");
  const [fieldColumn, setFieldColumn] = useState("");
  const [subPath, setSubPath] = useState(""); // optional jsonb leaf path, for a `json` field
  // relationship mode
  const [junctionKey, setJunctionKey] = useState("");
  const [op, setOp] = useState<JunctionOp>("link");
  // shared
  const [csv, setCsv] = useState("");
  const [fileName, setFileName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [env, setEnv] = useState<PatchEnv>("dev"); // safe-mode default: target develop first
  const fileRef = useRef<HTMLInputElement>(null);

  const [token] = usePersistentState<string>("shalion:devToken", "");
  const [idToken] = usePersistentState<string>("shalion:devIdToken", "");
  const hasToken = !!(token && idToken);
  const [history, setHistory] = usePersistentState<AnyBatch[]>("bulk:superUpdateHistory:v1", []);
  const [busy, setBusy] = useState<null | { kind: "apply" | "restore"; id?: string }>(null);
  const [progress, setProgress] = useState<{ done: number; total: number; phase: RunPhase } | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<AnyBatch | null>(null);

  const setMode = (m: Mode) => { setModeRaw(m); setCsv(""); setFileName(""); };

  const service: PatchService | undefined = PATCH_SERVICES.find((s) => s.slug === serviceSlug);
  const table: PatchTable | undefined = service?.tables.find((t) => t.table === tableName);
  const baseField: PatchField | undefined = table?.fields.find((f) => f.column === fieldColumn);
  // A `json` (jsonb) field can be narrowed to ONE leaf via an optional dotted sub-path
  // (e.g. attributes.timeframeId). The run then read-modify-writes the whole column so the
  // untargeted siblings survive. Empty sub-path = replace the whole object (as before).
  // Excluded: fields whose READ key differs from the WRITE key (readPath) — the read-modify
  // -write would clone the wrong top-level object and drop siblings, so those stay whole-object
  // only (e.g. re_execution_rules: read reExecutionRules / write updateReExecutionRules).
  const canSubPath = baseField?.type === "json" && !baseField.readPath;
  const subPathTrim = subPath.trim();
  const subPathError = canSubPath && subPathTrim !== "" && !JSON_SUBPATH_RE.test(subPathTrim);
  const field: PatchField | undefined = useMemo(() => {
    if (!(canSubPath && subPathTrim !== "")) return baseField;
    return subPathError ? undefined : jsonLeafField(baseField!, subPathTrim);
  }, [baseField, canSubPath, subPathTrim, subPathError]);
  const junction: PatchJunction | undefined = PATCH_JUNCTIONS.find((j) => j.key === junctionKey);

  const parsed = useMemo(
    () => (mode === "field" && table && field && csv.trim() ? parseSuperUpdateCsv(csv, table, field) : null),
    [mode, csv, table, field],
  );
  // Link mode parses pairs; Unlink mode parses relation ids (DELETE /{resource}/{id}).
  const parsedJ = useMemo(
    () => (mode === "rel" && op === "link" && junction && csv.trim() ? parseJunctionCsv(csv, junction) : null),
    [mode, op, csv, junction],
  );
  const parsedR = useMemo(
    () => (mode === "rel" && op === "unlink" && junction && csv.trim() ? parseRelationIds(csv) : null),
    [mode, op, csv, junction],
  );
  const relParse = parsedJ ?? parsedR;

  const ready = mode === "field" ? !!field : !!junction;
  const validCount = mode === "field" ? parsed?.valid ?? 0 : relParse?.valid ?? 0;
  const running = busy !== null;
  const headerHint = mode === "field"
    ? (table && field ? csvHeaderHint(table, field) : "")
    : junction ? (op === "link" ? `${junction.leftCol},${junction.rightCol}` : "relation_id") : "";

  const onProgress = (done: number, total: number, phase: RunPhase) => setProgress({ done, total, phase });

  const pickService = (v: string) => { setServiceSlug(v); setTableName(""); setFieldColumn(""); setSubPath(""); };
  const pickTable = (v: string) => { setTableName(v); setFieldColumn(""); setSubPath(""); };
  const pickField = (v: string) => { setFieldColumn(v); setSubPath(""); };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setCsv(String(reader.result ?? "")); setFileName(file.name); };
    reader.readAsText(file);
  };

  const doRunField = async () => {
    if (!service || !table || !field || !parsed || parsed.valid === 0) return;
    const rows = parsed.rows.filter((r) => !r.error).map((r) => ({ pk: r.id, value: r.value }));
    setBusy({ kind: "apply" }); setProgress({ done: 0, total: rows.length, phase: "snapshot" });
    try {
      const results = await runSuperUpdate({ service, table, field, env, token, idToken, rows, onProgress });
      const applied = results.filter((r) => r.status === "ok").length;
      const failed = results.length - applied;
      const batch: SuperUpdateBatch = {
        id: crypto.randomUUID(), when: stamp(), kind: "apply", mode: "field", env,
        serviceSlug: service.slug, serviceLabel: service.label, table: table.table, resource: table.resource, pk: table.pk,
        fieldColumn: field.column, fieldPath: field.path ?? field.column, fieldType: field.type, rows: results, applied, failed,
      };
      setHistory((prev) => capHistory([batch, ...prev]));
      onRun({ service: `${service.label} · ${table.table}`, table: table.table, field: field.column, fileName: fileName || `super-update-${table.table}-${field.column}.csv`, applied, failed, env });
      reportRun(applied, failed, rows.length, results.some((r) => /Unauthorized/i.test(r.error ?? "")));
    } catch (e) {
      toast.error(`Run failed: ${(e as Error).message}`);
    } finally { setBusy(null); setProgress(null); }
  };

  const doRunJunction = async () => {
    if (!junction || !relParse || relParse.valid === 0) return;
    const total = relParse.valid;
    setBusy({ kind: "apply" }); setProgress({ done: 0, total, phase: "apply" });
    try {
      const results = op === "link"
        ? await linkJunction({ junction, env, token, idToken, pairs: parsedJ!.rows.filter((r) => !r.error).map((r) => ({ left: r.left, right: r.right })), onProgress })
        : await unlinkJunction({ junction, env, token, idToken, relationIds: parsedR!.rows.filter((r) => !r.error).map((r) => r.id), onProgress });
      const applied = results.filter((r) => r.status === "ok").length;
      const failed = results.length - applied;
      const batch: SuperUpdateJunctionBatch = {
        id: crypto.randomUUID(), when: stamp(), kind: "apply", mode: "junction", op, env,
        junctionKey: junction.key, junctionLabel: junction.label, resource: junction.resource,
        leftCol: junction.leftCol, rightCol: junction.rightCol, rows: results, applied, failed,
      };
      setHistory((prev) => capHistory([batch, ...prev]));
      onRun({ service: junction.label, table: junction.resource, field: op, fileName: fileName || `super-update-${junction.key}-${op}.csv`, applied, failed, env });
      reportRun(applied, failed, results.length, results.some((r) => /Unauthorized/i.test(r.error ?? "")), op);
    } catch (e) {
      toast.error(`Run failed: ${(e as Error).message}`);
    } finally { setBusy(null); setProgress(null); }
  };

  const reportRun = (applied: number, failed: number, total: number, unauth: boolean, verb = "update") => {
    const noun = verb === "link" ? "link" : verb === "unlink" ? "unlink" : "update";
    if (failed === 0) toast.success(`${applied} ${noun}${applied === 1 ? "" : "s"} on ${env}`);
    else if (applied === 0) toast.error(`All ${failed} ${noun}${failed === 1 ? "" : "s"} failed — see history`);
    else toast.warning(`${applied} ok, ${failed} failed — see history`);
    if (applied > 0 && total > 200) toast.info("Large run — download its Rollback CSV from the history to keep a reload-safe copy.");
    if (unauth) toast.error(`Unauthorized on ${env === "prod" ? "Prod" : "Dev"} — the token must match the environment (a develop token only works on Dev; a prod token only on Prod). Develop is also corporate-VPN only.`, { duration: 9000 });
  };

  const doRun = () => { setConfirmOpen(false); if (!hasToken) { toast.error("Paste your API tokens first"); return; } if (mode === "field") doRunField(); else doRunJunction(); };

  const restore = async (batch: AnyBatch) => {
    if (!hasToken) { toast.error("Paste your API tokens to restore"); return; }
    setBusy({ kind: "restore", id: batch.id }); setProgress({ done: 0, total: batch.rows.length, phase: "apply" });
    try {
      if (isJunctionBatch(batch)) {
        const j = PATCH_JUNCTIONS.find((x) => x.key === batch.junctionKey);
        const okRows = batch.rows.filter((r) => r.status === "ok");
        if (!j || !okRows.length) { toast.info("Nothing to restore"); return; }
        const results = await restoreJunction({ junction: j, op: batch.op, env: batch.env, token, idToken, rows: okRows, onProgress });
        const applied = results.filter((r) => r.status === "ok").length;
        const rb: SuperUpdateJunctionBatch = { ...batch, id: crypto.randomUUID(), when: stamp(), kind: "restore", op: batch.op === "link" ? "unlink" : "link", rows: results, applied, failed: results.length - applied };
        setHistory((prev) => capHistory([rb, ...prev]));
        toast[rb.failed ? "warning" : "success"](`Restore: ${applied} reverted${rb.failed ? `, ${rb.failed} failed` : ""}`);
      } else {
        const svc = PATCH_SERVICES.find((s) => s.slug === batch.serviceSlug);
        const tbl = svc?.tables.find((t) => t.table === batch.table);
        // Reconstruct the field from the batch's stored PATH (not just the base column) so a
        // jsonb sub-path batch restores that LEAF — otherwise the catalogue's base `json`
        // field would rewrite the whole column with a single leaf value. Keeps readPath etc.
        const found = tbl?.fields.find((f) => f.column === batch.fieldColumn);
        const fld: PatchField | undefined = found
          ? { ...found, path: batch.fieldPath }
          : tbl
            ? { column: batch.fieldColumn, type: "string", path: batch.fieldPath }
            : undefined;
        const okRows = batch.rows.filter((r) => r.status === "ok").map((r) => ({ pk: r.pk, oldValue: r.oldValue }));
        if (!svc || !tbl || !fld || !okRows.length) { toast.info("Nothing to restore"); return; }
        const results = await restoreSuperUpdate({ service: svc, table: tbl, field: fld, env: batch.env, token, idToken, rows: okRows, onProgress });
        const applied = results.filter((r) => r.status === "ok").length;
        const rb: SuperUpdateBatch = { ...batch, id: crypto.randomUUID(), when: stamp(), kind: "restore", rows: results, applied, failed: results.length - applied };
        setHistory((prev) => capHistory([rb, ...prev]));
        toast[rb.failed ? "warning" : "success"](`Restore: ${applied} reverted${rb.failed ? `, ${rb.failed} failed` : ""}`);
      }
    } catch (e) {
      toast.error(`Restore failed: ${(e as Error).message}`);
    } finally { setBusy(null); setProgress(null); }
  };

  const downloadRollback = (batch: AnyBatch) => {
    const csvText = isJunctionBatch(batch) ? junctionRollbackCsv(batch) : buildRollbackCsv(batch);
    const name = isJunctionBatch(batch)
      ? `rollback-${batch.junctionKey}-${batch.op}-${batch.id.slice(0, 8)}.csv`
      : `rollback-${batch.table}-${batch.fieldColumn}-${batch.id.slice(0, 8)}.csv`;
    const url = URL.createObjectURL(new Blob([csvText], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  const envPill = (e: PatchEnv) => cn("font-semibold", e === "prod" ? "text-rose-600" : "text-emerald-600");

  return (
    <div className="px-6 py-5">
      {/* Header: title + (i) hint + safe-mode environment switch */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-semibold text-foreground">Super Update</h2>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label="About Super Update" className="text-muted-foreground transition-colors hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="max-w-sm text-xs leading-relaxed">
                <span className="font-semibold">Field:</span> set one column across many records by primary key.{" "}
                <span className="font-semibold">Relationship:</span> link / unlink a join table (e.g. job↔location) from
                pairs of ids. Each run snapshots first so you can roll back from the history below.
                <span className="mt-1.5 block text-amber-300">Safe mode: defaults to Dev.</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Environment</span>
          <div className="inline-flex rounded-md border border-border p-0.5" role="group" aria-label="Target environment">
            {(["dev", "prod"] as const).map((e) => (
              <button key={e} type="button" onClick={() => setEnv(e)}
                className={cn("rounded px-2.5 py-1 text-xs font-semibold transition-colors", env === e ? (e === "dev" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white") : "text-muted-foreground hover:text-foreground")}>
                {e === "dev" ? "Dev" : "Prod"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="mb-3 inline-flex rounded-md border border-border p-0.5" role="group" aria-label="Update mode">
        {([["field", "Field update"], ["rel", "Relationship (join)"]] as const).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setMode(key)}
            className={cn("rounded px-3 py-1 text-xs font-semibold transition-colors", mode === key ? "bg-[var(--sidebar-active-fg)] text-white" : "text-muted-foreground hover:text-foreground")}>
            {label}
          </button>
        ))}
      </div>

      <div className={cn("mb-1 flex items-start gap-2 rounded-lg border px-4 py-2.5 text-sm", env === "prod" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-300 bg-amber-50 text-amber-900")}>
        <TriangleAlert className={cn("mt-0.5 h-4 w-4 shrink-0", env === "prod" ? "text-rose-600" : "text-amber-600")} />
        <span>
          <span className="font-semibold">Live write to {env === "prod" ? "PRODUCTION" : "the Dev environment"}.</span>{" "}
          {mode === "field"
            ? "Running applies a real PATCH to each record (the current value is snapshotted first)."
            : "Running creates/removes real associations via the junction endpoint (reversible from the history)."}{" "}
          Roll back any run below.
          {env === "dev" && (<span className="mt-0.5 block text-xs">Dev targets the develop host — reachable only on the corporate VPN; from a deployed instance use Prod.</span>)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: target selection */}
        <div className="space-y-4">
          {mode === "field" ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Ecometry section">
                  <Select value={serviceSlug} onValueChange={pickService}>
                    <SelectTrigger><SelectValue placeholder="Section" /></SelectTrigger>
                    <SelectContent>{PATCH_SERVICES.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Table">
                  <Select value={tableName} onValueChange={pickTable} disabled={!service}>
                    <SelectTrigger><SelectValue placeholder="Table" /></SelectTrigger>
                    <SelectContent>{service?.tables.map((t) => <SelectItem key={t.table} value={t.table}>{t.table}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Field to update">
                  <Select value={fieldColumn} onValueChange={pickField} disabled={!table}>
                    <SelectTrigger><SelectValue placeholder="Field" /></SelectTrigger>
                    <SelectContent>{table?.fields.map((f) => <SelectItem key={f.column} value={f.column}>{f.column}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              {/* jsonb sub-path — only for a `json` column: change ONE leaf (siblings kept). */}
              {canSubPath && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    jsonb sub-path <span className="font-normal">(optional — target one leaf)</span>
                  </Label>
                  <input
                    value={subPath}
                    onChange={(e) => setSubPath(e.target.value)}
                    placeholder="e.g. attributes.timeframeId — empty replaces the whole object"
                    spellCheck={false}
                    className={cn(
                      "h-9 rounded-md border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring",
                      subPathError ? "border-rose-400" : "border-input",
                    )}
                  />
                  {subPathError ? (
                    <p className="text-[11px] text-rose-600">Dotted keys only, e.g. <span className="font-mono">attributes.timeframeId</span> (letters, digits, _).</p>
                  ) : subPathTrim ? (
                    <p className="text-[11px] text-muted-foreground">Only this leaf changes — the rest of <span className="font-mono">{baseField?.column}</span> is preserved (read-modify-write).</p>
                  ) : null}
                </div>
              )}
              {field && table && service && (
                <div className="space-y-2 rounded-lg border border-border bg-card p-3 text-sm shadow-sm">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Pill tone="blue">{field.type}</Pill>
                    {field.leaf && <Pill tone="green">value: {field.leaf}</Pill>}
                    {field.nullable && <Pill tone="amber">nullable</Pill>}
                    {field.note && <span className="text-xs text-muted-foreground">{field.note}</span>}
                  </div>
                  {field.type === "jsonleaf" && (
                    <div className="rounded bg-blue-50 px-2 py-1 text-[11px] leading-relaxed text-blue-800">
                      Editing one leaf — body path <code className="font-mono">{field.path}</code>. The rest of <span className="font-mono">{baseField?.column}</span> is re-sent unchanged.
                      {field.leaf
                        ? <> The value is validated as <span className="font-semibold">{field.leaf}</span> before sending.</>
                        : <> Value type is unverified (unknown leaf) — quote it to force a string.</>}
                    </div>
                  )}
                  {field.options && (
                    <div className="flex flex-wrap gap-1">{field.options.map((o) => <span key={o} className="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">{o}</span>)}</div>
                  )}
                  <div className="pt-1">
                    <span className="text-xs font-medium text-muted-foreground">Endpoint <span className={cn("ml-1 rounded px-1 py-0.5 text-[10px] font-semibold", env === "prod" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700")}>{env.toUpperCase()}</span></span>
                    <code className="mt-0.5 block break-all rounded bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80"><span className="font-semibold text-emerald-600">PATCH</span> {patchUrl(service, table, "{id}", env)}</code>
                  </div>
                  <div className="pt-1">
                    <span className="text-xs font-medium text-muted-foreground">Expected columns <span className="font-normal">(comma or space separated)</span></span>
                    <code className="mt-0.5 block rounded bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80">{csvHeaderHint(table, field)}</code>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Join table">
                  <Select value={junctionKey} onValueChange={(v) => setJunctionKey(v)}>
                    <SelectTrigger><SelectValue placeholder="Junction" /></SelectTrigger>
                    <SelectContent>{PATCH_JUNCTIONS.map((j) => <SelectItem key={j.key} value={j.key}>{j.label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Operation">
                  <div className="inline-flex h-9 items-center rounded-md border border-input p-0.5">
                    {(["link", "unlink"] as const).map((o) => (
                      <button key={o} type="button" onClick={() => setOp(o)}
                        className={cn("rounded px-3 py-1 text-xs font-semibold capitalize transition-colors", op === o ? (o === "link" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white") : "text-muted-foreground hover:text-foreground")}>
                        {o}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              {junction && (
                <div className="space-y-2 rounded-lg border border-border bg-card p-3 text-sm shadow-sm">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Pill tone="blue">{junction.label}</Pill>
                    {!junction.confirmed && <Pill tone="amber">verify endpoint on Dev</Pill>}
                  </div>
                  <div className="pt-1">
                    <span className="text-xs font-medium text-muted-foreground">Endpoint <span className={cn("ml-1 rounded px-1 py-0.5 text-[10px] font-semibold", env === "prod" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700")}>{env.toUpperCase()}</span></span>
                    <code className="mt-0.5 block break-all rounded bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80">
                      {op === "link"
                        ? <><span className="font-semibold text-emerald-600">POST</span> /v1.0/admin/{junction.resource}/batch</>
                        : <><span className="font-semibold text-rose-600">DELETE</span> /v1.0/admin/{junction.resource}/{"{relationId}"}</>}
                    </code>
                  </div>
                  <div className="pt-1">
                    <span className="text-xs font-medium text-muted-foreground">Expected column{op === "link" ? "s" : ""} <span className="font-normal">(comma / tab / space)</span></span>
                    <code className="mt-0.5 block rounded bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80">{op === "link" ? `${junction.leftCol},${junction.rightCol}` : "relation_id"}</code>
                    {op === "unlink" && <p className="mt-1 text-[11px] text-muted-foreground">One <span className="font-mono">{junction.resource}</span> relation id per line (the row id, not the pair) — DELETE removes that association.</p>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: CSV input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground/80">CSV — upload or paste</Label>
            <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain,.tsv" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => fileRef.current?.click()} disabled={!ready}><Upload className="h-3.5 w-3.5" /> Upload</Button>
          </div>
          <textarea
            value={csv}
            onChange={(e) => { setCsv(e.target.value); if (fileName) setFileName(""); }}
            disabled={!ready}
            placeholder={ready ? `${headerHint}\n<id-1>,<value-1>\n<id-2> <value-2>` : mode === "field" ? "Select an Ecometry section, table and field first…" : "Select a join table first…"}
            spellCheck={false}
            className="h-44 w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />

          {parsed && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5">{parsed.errors === 0 ? <Check className="h-4 w-4 text-emerald-600" /> : <TriangleAlert className="h-4 w-4 text-amber-600" />}<span className="font-medium text-foreground">{parsed.total}</span><span className="text-muted-foreground">rows</span></span>
              <span className="text-emerald-700">{parsed.valid} valid</span>
              {parsed.nulls > 0 && <span className="text-amber-700">{parsed.nulls} set to NULL</span>}
              {parsed.errors > 0 && <span className="text-rose-600">{parsed.errors} with errors</span>}
              {parsed.headerSkipped && <span className="text-xs text-muted-foreground">(header skipped)</span>}
            </div>
          )}
          {relParse && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5">{relParse.errors === 0 ? <Check className="h-4 w-4 text-emerald-600" /> : <TriangleAlert className="h-4 w-4 text-amber-600" />}<span className="font-medium text-foreground">{relParse.total}</span><span className="text-muted-foreground">{op === "link" ? "pairs" : "relation ids"}</span></span>
              <span className="text-emerald-700">{relParse.valid} valid</span>
              {relParse.errors > 0 && <span className="text-rose-600">{relParse.errors} with errors</span>}
              {relParse.headerSkipped && <span className="text-xs text-muted-foreground">(header skipped)</span>}
            </div>
          )}

          {((parsed && parsed.errors > 0) || (relParse && relParse.errors > 0)) && (
            <ul className="max-h-24 overflow-auto rounded-md border border-rose-200 bg-rose-50/60 p-2 text-[11px] text-rose-700">
              {(parsed ? parsed.rows.filter((r) => r.error) : relParse!.rows.filter((r) => r.error)).slice(0, 8).map((r) => <li key={r.line}>Line {r.line}: {r.error}</li>)}
            </ul>
          )}
        </div>
      </div>

      {/* Run row */}
      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        {progress && <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />{progress.phase === "snapshot" ? "Snapshotting" : "Applying"} {progress.done}/{progress.total}…</span>}
        {!hasToken && <span className="inline-flex items-center gap-2 text-sm text-amber-700">API token required <DevTokensTrigger /></span>}
        {ready && validCount > 0 && !running && (
          <span className="text-sm text-muted-foreground">
            {mode === "field"
              ? <>PATCH <span className="font-medium text-foreground">{validCount}</span> {table?.table} record{validCount === 1 ? "" : "s"} · <span className="font-mono text-foreground">{field?.column}</span></>
              : <>{op === "link" ? "Link" : "Unlink"} <span className="font-medium text-foreground">{validCount}</span> {op === "link" ? "pair" : "relation"}{validCount === 1 ? "" : "s"} · <span className="font-mono text-foreground">{junction?.key}</span></>}
            {" "}on <span className={envPill(env)}>{env}</span>
          </span>
        )}
        <Button className="gap-1.5" disabled={!ready || validCount === 0 || running || !hasToken} onClick={() => setConfirmOpen(true)}>
          {mode === "field" ? <Wand2 className="h-4 w-4" /> : <Link2 className="h-4 w-4" />} Run Super Update <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Changes / rollback history (this session) */}
      {history.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-1.5"><History className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-semibold text-foreground">Changes this session</span><span className="text-xs text-muted-foreground">({history.length})</span></div>
          <div className="space-y-2">
            {history.map((b) => {
              const restoringThis = busy?.kind === "restore" && busy.id === b.id;
              const jb = isJunctionBatch(b) ? b : null;
              return (
                <div key={b.id} className="rounded-lg border border-border bg-card p-3 text-sm shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {isJunctionBatch(b)
                        ? <><span className="font-medium text-foreground">{b.junctionLabel}</span><Pill tone={b.op === "link" ? "green" : "red"}>{b.op}</Pill></>
                        : <><span className="font-medium text-foreground">{b.serviceLabel} · {b.table}</span><span className="font-mono text-xs text-foreground/80">{b.fieldColumn}</span>{b.fieldType === "jsonleaf" && <span className="font-mono text-[11px] text-muted-foreground">→ {b.fieldPath}</span>}</>}
                      <Pill tone={b.env === "prod" ? "red" : "green"}>{b.env}</Pill>
                      {b.kind === "restore" && <Pill tone="slate">restore</Pill>}
                    </div>
                    <span className="text-xs text-muted-foreground">{b.when}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-emerald-700">{b.applied} ok</span>
                    {b.failed > 0 && <span className="text-rose-600">{b.failed} failed</span>}
                    <span className="text-muted-foreground">{b.rows.length} {jb ? (jb.op === "link" ? "pair" : "relation") : "row"}{b.rows.length === 1 ? "" : "s"}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => downloadRollback(b)} disabled={b.applied === 0}><Download className="h-3.5 w-3.5" /> Rollback CSV</Button>
                    {b.kind === "apply" && (
                      <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => setRestoreTarget(b)} disabled={running || !hasToken || b.applied === 0}>
                        {restoringThis ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} {jb ? (jb.op === "link" ? "Unlink" : "Re-link") : "Restore"}
                      </Button>
                    )}
                  </div>
                  {b.failed > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-[11px] text-rose-600">{b.failed} failed</summary>
                      <ul className="mt-1 max-h-28 overflow-auto rounded border border-rose-200 bg-rose-50/60 p-2 text-[11px] text-rose-700">
                        {b.rows.filter((r) => r.status === "error").slice(0, 12).map((r, i) => {
                          const idText = isJunctionBatch(b)
                            ? (b.op === "unlink"
                                ? ((r as { relationId?: string }).relationId ?? `${(r as { left: string }).left}→${(r as { right: string }).right}`)
                                : `${(r as { left: string }).left}→${(r as { right: string }).right}`)
                            : (r as { pk: string }).pk;
                          return <li key={i}><span className="font-mono">{idText.slice(0, 24)}…</span> — {r.error}</li>;
                        })}
                      </ul>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Run confirm */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Run on {env === "prod" ? "PRODUCTION" : "Dev"}?</DialogTitle></DialogHeader>
          <div className="space-y-2 py-1 text-sm">
            <p className={cn("rounded-md border px-3 py-2", env === "prod" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-300 bg-amber-50 text-amber-900")}>
              {mode === "field"
                ? <>Sends a <span className="font-semibold">real PATCH</span> to {env === "prod" ? "PRODUCTION" : "Dev"}; current values are snapshotted first.</>
                : <>{op === "link" ? <>Creates <span className="font-semibold">real associations</span> (POST)</> : <>Removes <span className="font-semibold">real associations</span> (DELETE)</>} on {env === "prod" ? "PRODUCTION" : "Dev"}; reversible from the history.</>}
            </p>
            <ul className="space-y-1 rounded-md border border-border bg-secondary/40 p-3 text-[13px]">
              {mode === "field" ? (
                <>
                  <li>Target: <span className="font-medium text-foreground">{service?.label} · {table?.table}</span></li>
                  <li>Field: <span className="font-mono text-foreground">{field?.column}</span> → body key <span className="font-mono text-foreground">{field?.path ?? field?.column}</span></li>
                  <li>Records: <span className="font-medium text-foreground">{parsed?.valid ?? 0}</span></li>
                  {parsed && parsed.nulls > 0 && <li className="text-amber-700">Cleared to NULL: <span className="font-medium">{parsed.nulls}</span></li>}
                </>
              ) : (
                <>
                  <li>Junction: <span className="font-medium text-foreground">{junction?.label}</span> (<span className="font-mono">{junction?.resource}</span>)</li>
                  <li>Operation: <span className={cn("font-semibold capitalize", op === "link" ? "text-emerald-600" : "text-rose-600")}>{op}</span></li>
                  <li>{op === "link" ? "Pairs to link" : "Relations to unlink"}: <span className="font-medium text-foreground">{relParse?.valid ?? 0}</span></li>
                  {junction && !junction.confirmed && <li className="text-amber-700">Endpoint is by convention — verify on Dev first.</li>}
                </>
              )}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button className={cn("gap-1.5", env === "prod" && "bg-rose-600 text-white hover:bg-rose-700")} disabled={!hasToken} onClick={doRun}>
              <Wand2 className="h-4 w-4" /> {hasToken ? `Apply to ${env}` : "Token required"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore confirm */}
      <Dialog open={!!restoreTarget} onOpenChange={(v) => { if (!v) setRestoreTarget(null); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>Restore on {restoreTarget?.env === "prod" ? "PRODUCTION" : "Dev"}?</DialogTitle></DialogHeader>
          <div className="space-y-2 py-1 text-sm">
            <p className={cn("rounded-md border px-3 py-2", restoreTarget?.env === "prod" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-300 bg-amber-50 text-amber-900")}>
              {restoreTarget && isJunctionBatch(restoreTarget)
                ? <>Inverts this run ({restoreTarget.op === "link" ? "unlinks what was linked" : "re-links what was unlinked"}) with a real write to {restoreTarget.env === "prod" ? "PRODUCTION" : "Dev"}.</>
                : <>Re-applies the captured <span className="font-semibold">previous values</span> with a real PATCH to {restoreTarget?.env === "prod" ? "PRODUCTION" : "Dev"}.</>}
            </p>
            {restoreTarget && (
              <ul className="space-y-1 rounded-md border border-border bg-secondary/40 p-3 text-[13px]">
                <li>Records: <span className="font-medium text-foreground">{restoreTarget.rows.filter((r) => r.status === "ok").length}</span></li>
              </ul>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreTarget(null)}>Cancel</Button>
            <Button className={cn("gap-1.5", restoreTarget?.env === "prod" && "bg-rose-600 text-white hover:bg-rose-700")} onClick={() => { const t = restoreTarget; setRestoreTarget(null); if (t) restore(t); }}>
              <RotateCcw className="h-4 w-4" /> Restore on {restoreTarget?.env === "prod" ? "prod" : "dev"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
