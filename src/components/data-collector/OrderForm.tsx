import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePersistentState } from "@/hooks/usePersistentState";
import { DC_SPECS } from "@/lib/dataCollectorEntities";
import type { ApproxRow } from "@/components/common/EntityListPage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Clock, Plus, X, MoreHorizontal } from "lucide-react";

// Orders live in the shared DC store (approx:dc-orders) so this bespoke form and the
// generic list stay consistent. DC pages are version-invariant (v1/v2/v3 alike).
const ORDERS_KEY = "approx:dc-orders:v3";
const NONE = "__none__";
const stamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

const EXTRACTION_TYPES = [
  "ecometrypdp", "ecometryplp", "ecometrysearch", "ecometryshelf", "ecometryad",
  "ecometrymedia", "ecometrypdp_marketplace", "ecometrypdp_reviews", "ecometryqca_plp",
];
const DELIVERY_METHODS = ["s3", "firehose", "rabbitmq", "none"];
const TIMEFRAMES = ["All Day (1 x day)", "content 30d", "geoloc", "media"];
const MACHINE_SIZES = [
  "XXS (CPU: 1 / Mem: 2048)", "XS (CPU: 1 / Mem: 4096)", "S (CPU: 2 / Mem: 4096)",
  "M (CPU: 2 / Mem: 8192)", "L (CPU: 4 / Mem: 8192)", "XL (CPU: 4 / Mem: 16384)",
];
const TIMEZONES = ["Europe/Amsterdam (offset: +02:00)", "Europe/Madrid (offset: +02:00)", "Europe/London (offset: +01:00)", "America/New_York (offset: -04:00)", "UTC"];
const ERROR_TYPES = ["Connection Error", "Seed Error", "Template Error", "Proxy Error", "Data Collector Error"];
// Delivery-method attribute shapes (as the console renders them).
const DELIVERY_ATTRS: Record<string, string[]> = {
  s3: ["bucket", "folder"],
  firehose: ["streamName"],
  rabbitmq: ["queue"],
  none: [],
};

// A single delivery destination. `conditionKey` empty = the default/unconditional output
// (today's behavior); a value routes the spider items the template tags with that case.
type DeliveryOutput = { oid: string; conditionKey: string; method: string; attrs: Record<string, string> };
const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

type V = string | number | boolean;

function Section({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder, allowNone }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; allowNone?: boolean;
}) {
  return (
    <Select value={value || NONE} onValueChange={(v) => onChange(v === NONE ? "" : v)}>
      <SelectTrigger><SelectValue placeholder={placeholder ?? "Select…"} /></SelectTrigger>
      <SelectContent>
        {allowNone && <SelectItem value={NONE}>—</SelectItem>}
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function OrderForm({ rowId, isNew }: { rowId?: string; isNew?: boolean }) {
  const spec = DC_SPECS["dc-orders"];
  const [rows, setRows] = usePersistentState<ApproxRow[]>(ORDERS_KEY, spec.rows);
  const navigate = useNavigate();
  const back = () => navigate({ to: "/data-collector/orders" } as never);
  const existing = !isNew ? rows.find((r) => r.id === rowId) : undefined;

  // Options that mirror what the real console derives from the catalog.
  const stores = useMemo(() => [...new Set(rows.map((r) => String(r.store)).filter(Boolean))].sort(), [rows]);
  const projects = useMemo(() => [...new Set(rows.map((r) => String(r.project)).filter(Boolean))].sort(), [rows]);

  const [f, setF] = useState<Record<string, V>>(() => {
    const r = existing ?? {};
    const cron = String(r.scheduling ?? "55 3 * * ?").split(/\s+/);
    return {
      name: String(r.name ?? ""),
      description: String(r.description ?? ""),
      store: String(r.store ?? ""),
      storeTimezone: String(r.storeTimezone ?? "Europe/Amsterdam (offset: +02:00)"),
      timezone: String(r.timezone ?? "Europe/Amsterdam (offset: +02:00)"),
      cMin: cron[0] ?? "55", cHour: cron[1] ?? "3", cMonthDay: cron[2] ?? "*", cMonth: cron[3] ?? "*", cWeekDay: cron[4] ?? "?",
      retryLimit: String(r.retryLimit ?? "3"),
      delayToExecution: String(r.delayToExecution ?? "45"),
      errorTypes: String(r.errorTypes ?? "Connection Error"),
      project: String(r.project ?? ""),
      machineSize: String(r.machineSizeLabel ?? "XXS (CPU: 1 / Mem: 2048)"),
      maxConcurrency: String(r.maxConcurrency ?? "10"),
      maxTasks: String(r.maxTasks ?? ""),
      numberOfPods: Number(r.numberOfPods ?? 1),
      inputsInstructionsType: String(r.inputsInstructionsType ?? "ecometrypdp"),
      storesOrRetailer: String(r.storesOrRetailer ?? "Stores"),
      timeframe: String(r.timeframe ?? "content 30d"),
      lastOfferDays: String(r.lastOfferDays ?? "30"),
      deliveryMethodType: String(r.deliveryMethodType ?? "s3"),
      bucket: String(r.bucket ?? ""),
      folder: String(r.folder ?? ""),
      streamName: String(r.streamName ?? ""),
      queue: String(r.queue ?? ""),
      cacheValidity: Number(r.cacheValidity ?? 0),
      isActive: r.isActive === undefined ? true : !!r.isActive,
    };
  });
  // Delivery outputs (multi/conditional). Parse the stored list, else migrate the legacy
  // single delivery method + attributes into one default (blank-condition) output.
  const [outputs, setOutputs] = useState<DeliveryOutput[]>(() => {
    const raw = existing?.deliveryOutputsJson;
    if (raw) {
      try {
        const p = JSON.parse(String(raw));
        if (Array.isArray(p) && p.length) {
          return p.map((o) => ({ oid: uid(), conditionKey: String(o.conditionKey ?? ""), method: String(o.method ?? "s3"), attrs: (o.attrs ?? {}) as Record<string, string> }));
        }
      } catch { /* fall through to legacy migration */ }
    }
    const method = String(existing?.deliveryMethodType ?? "s3");
    const attrs: Record<string, string> = {};
    for (const a of DELIVERY_ATTRS[method] ?? []) attrs[a] = String(existing?.[a] ?? "");
    return [{ oid: uid(), conditionKey: "", method, attrs }];
  });
  const [showDelete, setShowDelete] = useState(false);
  const set = (k: string, v: V) => setF((p) => ({ ...p, [k]: v }));
  const setOutputMethod = (oid: string, method: string) =>
    setOutputs((prev) => prev.map((o) => (o.oid === oid ? { ...o, method, attrs: Object.fromEntries((DELIVERY_ATTRS[method] ?? []).map((a) => [a, o.attrs[a] ?? ""])) } : o)));
  const setOutputCond = (oid: string, conditionKey: string) => setOutputs((prev) => prev.map((o) => (o.oid === oid ? { ...o, conditionKey } : o)));
  const setOutputAttr = (oid: string, a: string, v: string) => setOutputs((prev) => prev.map((o) => (o.oid === oid ? { ...o, attrs: { ...o.attrs, [a]: v } } : o)));
  const addOutput = () => setOutputs((prev) => [...prev, { oid: uid(), conditionKey: "", method: "s3", attrs: { bucket: "", folder: "" } }]);
  const removeOutput = (oid: string) => setOutputs((prev) => (prev.length > 1 ? prev.filter((o) => o.oid !== oid) : prev));

  if (!isNew && !existing) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Order not found.</p>
          <Button variant="outline" onClick={back}>Back to Orders</Button>
        </div>
      </AppShell>
    );
  }

  const errorList = String(f.errorTypes).split(",").map((s) => s.trim()).filter(Boolean);
  const toggleError = (e: string) =>
    set("errorTypes", (errorList.includes(e) ? errorList.filter((x) => x !== e) : [...errorList, e]).join(", "));

  const cron = `${f.cMin} ${f.cHour} ${f.cMonthDay} ${f.cMonth} ${f.cWeekDay}`;
  const schedHint = /^\d+$/.test(String(f.cMin)) && /^\d+$/.test(String(f.cHour)) && f.cMonthDay === "*" && f.cMonth === "*"
    ? `At ${String(f.cHour).padStart(2, "0")}:${String(f.cMin).padStart(2, "0")}, every day`
    : `Cron: ${cron}`;

  const condKeys = outputs.map((o) => o.conditionKey.trim()).filter(Boolean);
  const dupCond = condKeys.length !== new Set(condKeys).size;
  const canSave = String(f.name).trim() !== "" && String(f.store).trim() !== "" && String(f.project).trim() !== "" && String(f.inputsInstructionsType).trim() !== "" && outputs.length > 0 && outputs.every((o) => o.method) && !dupCond;

  const save = () => {
    if (!canSave) { toast.error("Please fill in the required fields"); return; }
    const base: ApproxRow = (existing ?? { id: crypto.randomUUID() }) as ApproxRow;
    const next: ApproxRow = {
      ...base,
      name: String(f.name), description: String(f.description), store: String(f.store),
      storeTimezone: String(f.storeTimezone), timezone: String(f.timezone),
      scheduling: cron, retryLimit: String(f.retryLimit), delayToExecution: String(f.delayToExecution),
      errorTypes: String(f.errorTypes), project: String(f.project), machineSizeLabel: String(f.machineSize),
      maxConcurrency: String(f.maxConcurrency), maxTasks: String(f.maxTasks), numberOfPods: Number(f.numberOfPods),
      inputsInstructionsType: String(f.inputsInstructionsType), storesOrRetailer: String(f.storesOrRetailer),
      timeframe: String(f.timeframe), lastOfferDays: String(f.lastOfferDays),
      deliveryMethodType: outputs[0]?.method ?? "none",
      deliveryOutputsJson: JSON.stringify(outputs.map((o) => ({ conditionKey: o.conditionKey.trim(), method: o.method, attrs: o.attrs }))),
      bucket: String(outputs[0]?.attrs.bucket ?? ""), folder: String(outputs[0]?.attrs.folder ?? ""),
      streamName: String(outputs[0]?.attrs.streamName ?? ""), queue: String(outputs[0]?.attrs.queue ?? ""),
      cacheValidity: Number(f.cacheValidity),
      isActive: !!f.isActive, updatedAt: stamp(),
    };
    if (isNew && !next.createdAt) next.createdAt = stamp();
    setRows((prev) => (isNew ? [next, ...prev] : prev.map((r) => (r.id === next.id ? next : r))));
    toast.success(`Order ${isNew ? "created" : "saved"} successfully`);
    back();
  };

  const cacheChips: { label: string; secs: number }[] = [
    { label: "5 min", secs: 300 }, { label: "1 hour", secs: 3600 }, { label: "1 day", secs: 86400 },
  ];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Orders
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {isNew ? "Add order" : String(f.name) || "Order"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-foreground/80">
              <Switch checked={!!f.isActive} onCheckedChange={(v) => set("isActive", v)} />
              {f.isActive ? "Active" : "Inactive"}
            </label>
            {!isNew && (
              <button type="button" onClick={() => setShowDelete(true)} className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Delete order">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            <Section title="Details">
              <div className="flex flex-col gap-4">
                <Field label="Name" required><Input value={String(f.name)} onChange={(e) => set("name", e.target.value)} /></Field>
                <Field label="Description">
                  <textarea value={String(f.description)} onChange={(e) => set("description", e.target.value)} rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </Field>
                <Field label="Store" required><SelectField value={String(f.store)} onChange={(v) => set("store", v)} options={stores} placeholder="Select store" /></Field>
              </div>
            </Section>

            <Section title="Target extraction window">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Store timezone">
                  <Input value={String(f.storeTimezone)} disabled className="bg-secondary/50 text-muted-foreground" />
                </Field>
                <Field label="Timezone" required><SelectField value={String(f.timezone)} onChange={(v) => set("timezone", v)} options={TIMEZONES} /></Field>
              </div>
            </Section>

            <Section title="Scheduling" right={<span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> UTC Timezone</span>}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {([["Minutes", "cMin"], ["Hours", "cHour"], ["Month days", "cMonthDay"], ["Months", "cMonth"], ["Weeks days", "cWeekDay"]] as const).map(([lbl, key]) => (
                  <Field key={key} label={lbl}><Input value={String(f[key])} onChange={(e) => set(key, e.target.value)} /></Field>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{schedHint}</p>
            </Section>

            <Section title="Re-execution">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Retry limit"><Input type="number" value={String(f.retryLimit)} onChange={(e) => set("retryLimit", e.target.value)} /></Field>
                <Field label="Delay to execution"><Input type="number" value={String(f.delayToExecution)} onChange={(e) => set("delayToExecution", e.target.value)} /></Field>
                <Field label="Error type">
                  <div className="flex flex-wrap gap-1.5">
                    {ERROR_TYPES.map((e) => (
                      <button key={e} type="button" onClick={() => toggleError(e)}
                        className={cn("rounded-full border px-2.5 py-1 text-xs", errorList.includes(e) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-secondary")}>
                        {e}{errorList.includes(e) && <X className="ml-1 inline h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            <Section title="Project">
              <Field label="Project" required className="mb-4"><SelectField value={String(f.project)} onChange={(v) => set("project", v)} options={projects} placeholder="Select project" /></Field>
              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Environment variables</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Field label="Machine size" required><SelectField value={String(f.machineSize)} onChange={(v) => set("machineSize", v)} options={MACHINE_SIZES} /></Field>
                  <Field label="Max concurrency"><Input value={String(f.maxConcurrency)} onChange={(e) => set("maxConcurrency", e.target.value)} /></Field>
                  <Field label="Max tasks"><Input value={String(f.maxTasks)} onChange={(e) => set("maxTasks", e.target.value)} /></Field>
                </div>
                <div className="mt-4">
                  <Label className="text-sm font-medium text-foreground/80">Number of pods <span className="text-destructive">*</span></Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input type="range" min={1} max={20} value={Number(f.numberOfPods)} onChange={(e) => set("numberOfPods", Number(e.target.value))} className="w-full accent-primary" />
                    <span className="w-8 text-right text-sm font-medium text-foreground">{Number(f.numberOfPods)}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>1</span><span>5</span><span>10</span><span>15</span><span>20</span></div>
                </div>
                <button type="button" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline" onClick={() => toast.info("Additional variables — coming soon")}>
                  <Plus className="h-4 w-4" /> Add variable
                </button>
              </div>
            </Section>

            <Section title="Extraction type">
              <div className="flex flex-col gap-4">
                <Field label="Extraction type" required><SelectField value={String(f.inputsInstructionsType)} onChange={(v) => set("inputsInstructionsType", v)} options={EXTRACTION_TYPES} /></Field>
                <Field label="Stores or retailer" required>
                  <div className="flex items-center gap-2">
                    <SelectField value={String(f.storesOrRetailer)} onChange={(v) => set("storesOrRetailer", v)} options={["Stores", "Retailer"]} />
                    <div className="flex-1 rounded-md border border-input px-3 py-2 text-sm">
                      <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs">{String(f.store) || "—"} <X className="h-3 w-3 text-muted-foreground" /></span>
                    </div>
                  </div>
                </Field>
                <Field label="Timeframe" required><SelectField value={String(f.timeframe)} onChange={(v) => set("timeframe", v)} options={TIMEFRAMES} /></Field>
                <Field label="Last offer days"><Input value={String(f.lastOfferDays)} onChange={(e) => set("lastOfferDays", e.target.value)} /></Field>
              </div>
            </Section>

            <Section title="Delivery method" right={outputs.length > 1 ? <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{outputs.length} outputs</span> : undefined}>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                Route the spider's results to one or more destinations. Leave <span className="font-medium">Condition</span> blank for the default (unconditional) output; set a condition — identified by the template, e.g. <code className="rounded bg-secondary px-1 py-0.5">quick_commerce</code> — to route only the items the template tags with that case.
              </p>
              <div className="flex flex-col gap-3">
                {outputs.map((o, i) => {
                  const oAttrs = DELIVERY_ATTRS[o.method] ?? [];
                  return (
                    <div key={o.oid} className="rounded-lg border border-border bg-secondary/20 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {o.conditionKey.trim() ? `Case: ${o.conditionKey.trim()}` : i === 0 ? "Default output" : "Output"}
                        </span>
                        {outputs.length > 1 && (
                          <button type="button" onClick={() => removeOutput(o.oid)} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Remove output">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <Field label="Condition (from template)">
                          <Input value={o.conditionKey} placeholder="default (leave blank)" onChange={(e) => setOutputCond(o.oid, e.target.value)} />
                        </Field>
                        <Field label="Delivery method" required>
                          <SelectField value={o.method} onChange={(v) => setOutputMethod(o.oid, v)} options={DELIVERY_METHODS} />
                        </Field>
                      </div>
                      {oAttrs.length > 0 && (
                        <div className="mt-3">
                          <Label className="text-sm font-medium text-foreground/80">Attributes</Label>
                          <div className="mt-2 flex flex-col gap-2">
                            {oAttrs.map((a) => (
                              <div key={a} className="grid grid-cols-[160px_1fr] gap-3">
                                <span className="flex items-center rounded-md bg-secondary/60 px-3 py-2 text-sm text-foreground/80">{a}</span>
                                <Input value={String(o.attrs[a] ?? "")} placeholder="string" onChange={(e) => setOutputAttr(o.oid, a, e.target.value)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button type="button" onClick={addOutput} className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <Plus className="h-4 w-4" /> Add delivery output
              </button>
              {dupCond && <p className="mt-2 text-xs text-destructive">Condition keys must be unique.</p>}
            </Section>

            <Section title="Cache validity time">
              <p className="mb-2 text-sm text-muted-foreground">{Number(f.cacheValidity) > 0 ? "Cache enabled" : "No cache"}</p>
              <div className="flex items-center gap-2">
                {cacheChips.map((c) => (
                  <button key={c.secs} type="button" onClick={() => set("cacheValidity", c.secs)}
                    className={cn("rounded-md border px-3 py-1.5 text-sm", Number(f.cacheValidity) === c.secs ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground/80 hover:bg-secondary")}>
                    {c.label}
                  </button>
                ))}
                <button type="button" onClick={() => set("cacheValidity", 0)} className="px-2 text-sm text-muted-foreground hover:text-foreground">Clear</button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Resources will not be scraped again if they were already scraped within this interval. Maximum is 1 day.</p>
            </Section>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={back}>Cancel</Button>
          <Button onClick={save} disabled={!canSave}>{isNew ? "Add order" : "Save order"}</Button>
        </div>
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete order</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setRows((prev) => prev.filter((r) => r.id !== rowId)); back(); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
