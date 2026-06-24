import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pill } from "@/components/seeds/ListPrimitives";
import {
  PATCH_SERVICES,
  patchUrl,
  csvHeaderHint,
  parseSuperUpdateCsv,
  buildPayload,
  type PatchService,
  type PatchTable,
  type PatchField,
  type PatchEnv,
} from "@/lib/superUpdate";
import { toast } from "sonner";
import { Upload, Wand2, Check, TriangleAlert, Copy, ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type SuperUpdateRun = {
  service: string;
  table: string;
  field: string;
  fileName: string;
  valid: number;
  errors: number;
  env: PatchEnv;
};

export function SuperUpdatePanel({ onRun }: { onRun: (r: SuperUpdateRun) => void }) {
  const [serviceSlug, setServiceSlug] = useState("");
  const [tableName, setTableName] = useState("");
  const [fieldColumn, setFieldColumn] = useState("");
  const [csv, setCsv] = useState("");
  const [fileName, setFileName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [env, setEnv] = useState<PatchEnv>("dev"); // safe-mode default: target develop first
  const fileRef = useRef<HTMLInputElement>(null);

  const service: PatchService | undefined = PATCH_SERVICES.find((s) => s.slug === serviceSlug);
  const table: PatchTable | undefined = service?.tables.find((t) => t.table === tableName);
  const field: PatchField | undefined = table?.fields.find((f) => f.column === fieldColumn);

  const parsed = useMemo(
    () => (table && field && csv.trim() ? parseSuperUpdateCsv(csv, table, field) : null),
    [csv, table, field],
  );

  const firstValid = parsed?.rows.find((r) => !r.error);
  const preview = useMemo(() => {
    if (!service || !table || !field) return null;
    const id = firstValid?.id ?? "{" + table.pk + "}";
    const value = firstValid ? firstValid.value : (field.nullable ? null : "<value>");
    return { url: patchUrl(service, table, id, env), body: buildPayload(field, value) };
  }, [service, table, field, firstValid, env]);

  const pickService = (v: string) => { setServiceSlug(v); setTableName(""); setFieldColumn(""); };
  const pickTable = (v: string) => { setTableName(v); setFieldColumn(""); };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setCsv(String(reader.result ?? "")); setFileName(file.name); };
    reader.readAsText(file);
  };

  const run = () => {
    setConfirmOpen(false);
    if (!service || !table || !field || !parsed) return;
    if (parsed.valid === 0) { toast.error("No valid rows to update"); return; }
    onRun({
      service: `${service.label} · ${table.table}`,
      table: table.table,
      field: field.column,
      fileName: fileName || `super-update-${table.table}-${field.column}.csv`,
      valid: parsed.valid,
      errors: parsed.errors,
      env,
    });
  };

  const copyPayload = () => {
    if (!preview) return;
    navigator.clipboard?.writeText(`PATCH ${preview.url}\n${JSON.stringify(preview.body, null, 2)}`);
    toast.success("PATCH payload copied");
  };

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
                microservice → table → field, paste a two-column CSV (PK, value), and Super Update prepares the
                relative PATCH payload (an empty value clears the column to NULL where allowed).
                <span className="mt-1.5 block text-amber-300">
                  Safe mode: defaults to the Dev environment — switch to Prod only to target production hosts.
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
          <span className="font-semibold">Preview only.</span> Builds the real PATCH payload for{" "}
          <span className="font-semibold">{env === "prod" ? "PRODUCTION" : "the Dev environment"}</span> and validates
          your CSV, but <span className="font-semibold">sends no request</span> — copy it into the live admin API or a
          patch script to apply it.
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

      {/* Payload preview */}
      {preview && (
        <div className="mt-5 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">PATCH payload preview {firstValid && <span className="font-normal text-muted-foreground">(first row)</span>}</span>
            <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={copyPayload}><Copy className="h-3.5 w-3.5" /> Copy</Button>
          </div>
          <code className="block break-all rounded bg-secondary/60 px-2 py-1 text-[11px] text-foreground/80">
            <span className="font-semibold text-emerald-600">PATCH</span> {preview.url}
          </code>
          <pre className="mt-2 overflow-x-auto rounded bg-secondary/60 p-3 text-[11px] leading-relaxed text-foreground/90">{JSON.stringify(preview.body, null, 2)}</pre>
          {parsed && parsed.nulls > 0 && (
            <p className="mt-2 text-[11px] text-amber-700">
              <span className="font-medium">{parsed.nulls}</span> of {parsed.valid} record{parsed.valid === 1 ? "" : "s"} will clear <span className="font-mono">{field?.column}</span> to <span className="font-mono">null</span>.
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-end gap-3">
        {parsed && parsed.valid > 0 && (
          <span className="text-sm text-muted-foreground">
            Will PATCH <span className="font-medium text-foreground">{parsed.valid}</span> {table?.table} record{parsed.valid === 1 ? "" : "s"} · field <span className="font-mono text-foreground">{field?.column}</span>
          </span>
        )}
        <Button className="gap-1.5" disabled={!parsed || parsed.valid === 0} onClick={() => setConfirmOpen(true)}>
          <Wand2 className="h-4 w-4" /> Run Super Update <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Confirm Super Update</DialogTitle></DialogHeader>
          <div className="space-y-2 py-1 text-sm">
            <p className="text-muted-foreground">
              Preview only — this builds the payload and a process record;{" "}
              <span className="font-medium text-foreground">no request is sent to production</span>.
            </p>
            <ul className="space-y-1 rounded-md border border-border bg-secondary/40 p-3 text-[13px]">
              <li>Environment: <span className={cn("font-semibold", env === "prod" ? "text-rose-600" : "text-emerald-600")}>{env === "prod" ? "Production" : "Dev"}</span></li>
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
            <Button className="gap-1.5" onClick={run}><Wand2 className="h-4 w-4" /> Confirm — build payload</Button>
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
