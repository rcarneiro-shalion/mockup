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
  patchUrl,
  csvHeaderHint,
  parseSuperUpdateCsv,
  buildRollbackCsv,
  type PatchService,
  type PatchTable,
  type PatchField,
  type PatchEnv,
  type SuperUpdateBatch,
} from "@/lib/superUpdate";
import { runSuperUpdate, restoreSuperUpdate, type RunPhase } from "@/lib/superUpdateRun";
import { toast } from "sonner";
import { Upload, Wand2, Check, TriangleAlert, ArrowRight, Info, History, Download, RotateCcw, Loader2 } from "lucide-react";
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

// Keep the newest runs within a localStorage-safe row budget (always at least the newest),
// so a big run can't silently fail to persist. The Rollback CSV is the durable artifact.
const HISTORY_ROW_BUDGET = 5000;
function capHistory(list: SuperUpdateBatch[]): SuperUpdateBatch[] {
  const out: SuperUpdateBatch[] = [];
  let rows = 0;
  for (const b of list) {
    if (out.length > 0 && (rows + b.rows.length > HISTORY_ROW_BUDGET || out.length >= 20)) break;
    out.push(b);
    rows += b.rows.length;
  }
  return out;
}

export function SuperUpdatePanel({ onRun }: { onRun: (r: SuperUpdateRun) => void }) {
  const [serviceSlug, setServiceSlug] = useState("");
  const [tableName, setTableName] = useState("");
  const [fieldColumn, setFieldColumn] = useState("");
  const [csv, setCsv] = useState("");
  const [fileName, setFileName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [env, setEnv] = useState<PatchEnv>("dev"); // safe-mode default: target develop first
  const fileRef = useRef<HTMLInputElement>(null);

  const [token] = usePersistentState<string>("shalion:devToken", "");
  const [idToken] = usePersistentState<string>("shalion:devIdToken", "");
  const hasToken = !!(token && idToken);
  const [history, setHistory] = usePersistentState<SuperUpdateBatch[]>("bulk:superUpdateHistory:v1", []);
  const [busy, setBusy] = useState<null | { kind: "apply" | "restore"; id?: string }>(null);
  const [progress, setProgress] = useState<{ done: number; total: number; phase: RunPhase } | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<SuperUpdateBatch | null>(null);

  const service: PatchService | undefined = PATCH_SERVICES.find((s) => s.slug === serviceSlug);
  const table: PatchTable | undefined = service?.tables.find((t) => t.table === tableName);
  const field: PatchField | undefined = table?.fields.find((f) => f.column === fieldColumn);

  const parsed = useMemo(
    () => (table && field && csv.trim() ? parseSuperUpdateCsv(csv, table, field) : null),
    [csv, table, field],
  );

  const pickService = (v: string) => { setServiceSlug(v); setTableName(""); setFieldColumn(""); };
  const pickTable = (v: string) => { setTableName(v); setFieldColumn(""); };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setCsv(String(reader.result ?? "")); setFileName(file.name); };
    reader.readAsText(file);
  };

  const onProgress = (done: number, total: number, phase: RunPhase) => setProgress({ done, total, phase });

  const doRun = async () => {
    setConfirmOpen(false);
    if (!service || !table || !field || !parsed || parsed.valid === 0) return;
    if (!hasToken) { toast.error("Paste your API tokens first"); return; }
    const rows = parsed.rows.filter((r) => !r.error).map((r) => ({ pk: r.id, value: r.value }));
    setBusy({ kind: "apply" }); setProgress({ done: 0, total: rows.length, phase: "snapshot" });
    try {
      const results = await runSuperUpdate({ service, table, field, env, token, idToken, rows, onProgress });
      const applied = results.filter((r) => r.status === "ok").length;
      const failed = results.length - applied;
      const batch: SuperUpdateBatch = {
        id: crypto.randomUUID(),
        when: new Date().toLocaleString(),
        kind: "apply",
        env,
        serviceSlug: service.slug,
        serviceLabel: service.label,
        table: table.table,
        resource: table.resource,
        pk: table.pk,
        fieldColumn: field.column,
        fieldPath: field.path ?? field.column,
        rows: results,
        applied,
        failed,
      };
      setHistory((prev) => capHistory([batch, ...prev]));
      onRun({ service: `${service.label} · ${table.table}`, table: table.table, field: field.column, fileName: fileName || `super-update-${table.table}-${field.column}.csv`, applied, failed, env });
      if (failed === 0) toast.success(`Applied ${applied} update${applied === 1 ? "" : "s"} on ${env}`);
      else if (applied === 0) toast.error(`All ${failed} update${failed === 1 ? "" : "s"} failed — see history`);
      else toast.warning(`${applied} applied, ${failed} failed — see history`);
      if (applied > 0 && rows.length > 200) toast.info("Large run — download its Rollback CSV from the history to keep a reload-safe copy.");
      if (results.some((r) => /Unauthorized/i.test(r.error ?? "")))
        toast.error(`Unauthorized on ${env === "prod" ? "Prod" : "Dev"} — the token must match the environment (a develop token only works on Dev; a prod token only on Prod). Develop is also corporate-VPN only.`, { duration: 9000 });
    } catch (e) {
      toast.error(`Run failed: ${(e as Error).message}`);
    } finally {
      setBusy(null); setProgress(null);
    }
  };

  const restore = async (batch: SuperUpdateBatch) => {
    const svc = PATCH_SERVICES.find((s) => s.slug === batch.serviceSlug);
    const tbl = svc?.tables.find((t) => t.table === batch.table);
    const fld = tbl?.fields.find((f) => f.column === batch.fieldColumn);
    if (!svc || !tbl || !fld) { toast.error("Cannot restore — unknown target"); return; }
    if (!hasToken) { toast.error("Paste your API tokens to restore"); return; }
    const rows = batch.rows.filter((r) => r.status === "ok").map((r) => ({ pk: r.pk, oldValue: r.oldValue }));
    if (!rows.length) { toast.info("Nothing to restore in this run"); return; }
    setBusy({ kind: "restore", id: batch.id }); setProgress({ done: 0, total: rows.length, phase: "snapshot" });
    try {
      const results = await restoreSuperUpdate({ service: svc, table: tbl, field: fld, env: batch.env, token, idToken, rows, onProgress });
      const applied = results.filter((r) => r.status === "ok").length;
      const failed = results.length - applied;
      const rb: SuperUpdateBatch = { ...batch, id: crypto.randomUUID(), when: new Date().toLocaleString(), kind: "restore", rows: results, applied, failed };
      setHistory((prev) => capHistory([rb, ...prev]));
      if (failed === 0) toast.success(`Restored ${applied} record${applied === 1 ? "" : "s"}`);
      else toast.warning(`Restore: ${applied} reverted, ${failed} failed`);
    } catch (e) {
      toast.error(`Restore failed: ${(e as Error).message}`);
    } finally {
      setBusy(null); setProgress(null);
    }
  };

  const downloadRollback = (batch: SuperUpdateBatch) => {
    const blob = new Blob([buildRollbackCsv(batch)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rollback-${batch.table}-${batch.fieldColumn}-${batch.id.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const running = busy !== null;

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
                Update a single column across many records by primary key — no full-row file required. Pick the
                microservice → table → field, paste a two-column CSV (PK, value), and Super Update applies the
                relative PATCH (an empty value clears the column to NULL where allowed).
                <span className="mt-1.5 block text-amber-300">
                  Safe mode: defaults to Dev. Every run snapshots each record's current value first, so you can roll
                  back from the history below.
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Environment</span>
          <div className="inline-flex rounded-md border border-border p-0.5" role="group" aria-label="Target environment">
            {(["dev", "prod"] as const).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEnv(e)}
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-semibold transition-colors",
                  env === e
                    ? e === "dev" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {e === "dev" ? "Dev" : "Prod"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(
        "mb-1 flex items-start gap-2 rounded-lg border px-4 py-2.5 text-sm",
        env === "prod" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-300 bg-amber-50 text-amber-900",
      )}>
        <TriangleAlert className={cn("mt-0.5 h-4 w-4 shrink-0", env === "prod" ? "text-rose-600" : "text-amber-600")} />
        <span>
          <span className="font-semibold">Live write to {env === "prod" ? "PRODUCTION" : "the Dev environment"}.</span>{" "}
          Running applies a real PATCH to each record. The current value is{" "}
          <span className="font-semibold">snapshotted first</span> — roll back any run from the history below.
          {env === "dev" && (
            <span className="mt-0.5 block text-xs">
              Dev targets the develop host — reachable only on the corporate VPN; from a deployed instance use Prod.
            </span>
          )}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: target selection */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Microservice">
              <Select value={serviceSlug} onValueChange={pickService}>
                <SelectTrigger><SelectValue placeholder="Service" /></SelectTrigger>
                <SelectContent>
                  {PATCH_SERVICES.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Table">
              <Select value={tableName} onValueChange={pickTable} disabled={!service}>
                <SelectTrigger><SelectValue placeholder="Table" /></SelectTrigger>
                <SelectContent>
                  {service?.tables.map((t) => <SelectItem key={t.table} value={t.table}>{t.table}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Field to update">
              <Select value={fieldColumn} onValueChange={setFieldColumn} disabled={!table}>
                <SelectTrigger><SelectValue placeholder="Field" /></SelectTrigger>
                <SelectContent>
                  {table?.fields.map((f) => <SelectItem key={f.column} value={f.column}>{f.column}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {field && table && service && (
            <div className="space-y-2 rounded-lg border border-border bg-card p-3 text-sm shadow-sm">
              <div className="flex flex-wrap items-center gap-1.5">
                <Pill tone="blue">{field.type}</Pill>
                {field.nullable && <Pill tone="amber">nullable</Pill>}
                {field.note && <span className="text-xs text-muted-foreground">{field.note}</span>}
              </div>
              {field.options && (
                <div className="flex flex-wrap gap-1">
                  {field.options.map((o) => (
                    <span key={o} className="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">{o}</span>
                  ))}
                </div>
              )}
              <div className="pt-1">
                <span className="text-xs font-medium text-muted-foreground">Endpoint <span className={cn("ml-1 rounded px-1 py-0.5 text-[10px] font-semibold", env === "prod" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700")}>{env.toUpperCase()}</span></span>
                <code className="mt-0.5 block break-all rounded bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80">
                  <span className="font-semibold text-emerald-600">PATCH</span> {patchUrl(service, table, "{id}", env)}
                </code>
              </div>
              <div className="pt-1">
                <span className="text-xs font-medium text-muted-foreground">Expected CSV columns</span>
                <code className="mt-0.5 block rounded bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80">{csvHeaderHint(table, field)}</code>
              </div>
            </div>
          )}
        </div>

        {/* Right: CSV input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground/80">CSV — upload or paste</Label>
            <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => fileRef.current?.click()} disabled={!field}>
              <Upload className="h-3.5 w-3.5" /> Upload .csv
            </Button>
          </div>
          <textarea
            value={csv}
            onChange={(e) => { setCsv(e.target.value); if (fileName) setFileName(""); }}
            disabled={!field}
            placeholder={table && field ? `${csvHeaderHint(table, field)}\n<id-1>,<value-1>\n<id-2>,<value-2>` : "Select a microservice, table and field first…"}
            spellCheck={false}
            className="h-44 w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />

          {parsed && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5">
                {parsed.errors === 0
                  ? <Check className="h-4 w-4 text-emerald-600" />
                  : <TriangleAlert className="h-4 w-4 text-amber-600" />}
                <span className="font-medium text-foreground">{parsed.total}</span>
                <span className="text-muted-foreground">rows</span>
              </span>
              <span className="text-emerald-700">{parsed.valid} valid</span>
              {parsed.nulls > 0 && <span className="text-amber-700">{parsed.nulls} set to NULL</span>}
              {parsed.errors > 0 && <span className="text-rose-600">{parsed.errors} with errors</span>}
              {parsed.headerSkipped && <span className="text-xs text-muted-foreground">(header row skipped)</span>}
            </div>
          )}

          {parsed && parsed.errors > 0 && (
            <ul className="max-h-24 overflow-auto rounded-md border border-rose-200 bg-rose-50/60 p-2 text-[11px] text-rose-700">
              {parsed.rows.filter((r) => r.error).slice(0, 8).map((r) => (
                <li key={r.line}>Line {r.line}: {r.error}</li>
              ))}
              {parsed.errors > 8 && <li className="text-rose-500">…and {parsed.errors - 8} more</li>}
            </ul>
          )}
        </div>
      </div>

      {/* Run row */}
      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        {progress && (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {progress.phase === "snapshot" ? "Snapshotting" : "Applying"} {progress.done}/{progress.total}…
          </span>
        )}
        {!hasToken && (
          <span className="inline-flex items-center gap-2 text-sm text-amber-700">
            API token required <DevTokensTrigger />
          </span>
        )}
        {parsed && parsed.valid > 0 && !running && (
          <span className="text-sm text-muted-foreground">
            PATCH <span className="font-medium text-foreground">{parsed.valid}</span> {table?.table} record{parsed.valid === 1 ? "" : "s"} · <span className="font-mono text-foreground">{field?.column}</span> on <span className={cn("font-semibold", env === "prod" ? "text-rose-600" : "text-emerald-600")}>{env}</span>
          </span>
        )}
        <Button className="gap-1.5" disabled={!parsed || parsed.valid === 0 || running || !hasToken} onClick={() => setConfirmOpen(true)}>
          <Wand2 className="h-4 w-4" /> Run Super Update <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Changes / rollback history (this session) */}
      {history.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-1.5">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Changes this session</span>
            <span className="text-xs text-muted-foreground">({history.length})</span>
          </div>
          <div className="space-y-2">
            {history.map((b) => {
              const restoringThis = busy?.kind === "restore" && busy.id === b.id;
              return (
                <div key={b.id} className="rounded-lg border border-border bg-card p-3 text-sm shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">{b.serviceLabel} · {b.table}</span>
                      <span className="font-mono text-xs text-foreground/80">{b.fieldColumn}</span>
                      <Pill tone={b.env === "prod" ? "red" : "green"}>{b.env}</Pill>
                      {b.kind === "restore" && <Pill tone="slate">restore</Pill>}
                    </div>
                    <span className="text-xs text-muted-foreground">{b.when}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-emerald-700">{b.applied} applied</span>
                    {b.failed > 0 && <span className="text-rose-600">{b.failed} failed</span>}
                    <span className="text-muted-foreground">{b.rows.length} row{b.rows.length === 1 ? "" : "s"}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => downloadRollback(b)} disabled={b.applied === 0}>
                      <Download className="h-3.5 w-3.5" /> Rollback CSV
                    </Button>
                    {b.kind === "apply" && (
                      <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => setRestoreTarget(b)} disabled={running || !hasToken || b.applied === 0}>
                        {restoringThis ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Restore
                      </Button>
                    )}
                  </div>
                  {b.failed > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-[11px] text-rose-600">{b.failed} failed row{b.failed === 1 ? "" : "s"}</summary>
                      <ul className="mt-1 max-h-28 overflow-auto rounded border border-rose-200 bg-rose-50/60 p-2 text-[11px] text-rose-700">
                        {b.rows.filter((r) => r.status === "error").slice(0, 12).map((r) => (
                          <li key={r.pk}><span className="font-mono">{r.pk.slice(0, 12)}…</span> — {r.error}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Run Super Update on {env === "prod" ? "PRODUCTION" : "Dev"}?</DialogTitle></DialogHeader>
          <div className="space-y-2 py-1 text-sm">
            <p className={cn("rounded-md border px-3 py-2", env === "prod" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-300 bg-amber-50 text-amber-900")}>
              This sends a <span className="font-semibold">real PATCH</span> to {env === "prod" ? "PRODUCTION" : "the Dev environment"}. Each record's current value is snapshotted first, so you can roll back from the history.
            </p>
            <ul className="space-y-1 rounded-md border border-border bg-secondary/40 p-3 text-[13px]">
              <li>Target: <span className="font-medium text-foreground">{service?.label} · {table?.table}</span></li>
              <li>Field: <span className="font-mono text-foreground">{field?.column}</span> → body key <span className="font-mono text-foreground">{field?.path ?? field?.column}</span></li>
              <li>Records: <span className="font-medium text-foreground">{parsed?.valid ?? 0}</span></li>
              {parsed && parsed.nulls > 0 && (
                <li className="text-amber-700">Cleared to NULL: <span className="font-medium">{parsed.nulls}</span></li>
              )}
            </ul>
            {service && table && (
              <code className="block break-all rounded bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80">
                <span className="font-semibold text-emerald-600">PATCH</span> {patchUrl(service, table, "{id}", env)}
              </code>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              className={cn("gap-1.5", env === "prod" && "bg-rose-600 text-white hover:bg-rose-700")}
              disabled={!hasToken}
              onClick={doRun}
            >
              <Wand2 className="h-4 w-4" /> {hasToken ? `Apply to ${env}` : "Token required"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!restoreTarget} onOpenChange={(v) => { if (!v) setRestoreTarget(null); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>Restore on {restoreTarget?.env === "prod" ? "PRODUCTION" : "Dev"}?</DialogTitle></DialogHeader>
          <div className="space-y-2 py-1 text-sm">
            <p className={cn("rounded-md border px-3 py-2", restoreTarget?.env === "prod" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-300 bg-amber-50 text-amber-900")}>
              Re-applies the captured <span className="font-semibold">previous values</span> with a real PATCH to{" "}
              {restoreTarget?.env === "prod" ? "PRODUCTION" : "the Dev environment"}. Any record changed by someone else since the run will be overwritten back.
            </p>
            {restoreTarget && (
              <ul className="space-y-1 rounded-md border border-border bg-secondary/40 p-3 text-[13px]">
                <li>Target: <span className="font-medium text-foreground">{restoreTarget.serviceLabel} · {restoreTarget.table}</span> · <span className="font-mono text-foreground">{restoreTarget.fieldColumn}</span></li>
                <li>Records to revert: <span className="font-medium text-foreground">{restoreTarget.rows.filter((r) => r.status === "ok").length}</span></li>
              </ul>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreTarget(null)}>Cancel</Button>
            <Button
              className={cn("gap-1.5", restoreTarget?.env === "prod" && "bg-rose-600 text-white hover:bg-rose-700")}
              onClick={() => { const t = restoreTarget; setRestoreTarget(null); if (t) restore(t); }}
            >
              <RotateCcw className="h-4 w-4" /> Restore to {restoreTarget?.env === "prod" ? "prod" : "dev"}
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
