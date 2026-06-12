import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, MoreHorizontal, Pencil, Plus, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DataGroupTabs } from "@/components/clients/DataGroupTabs";

type ParentRow = { id: string; name: string; createdAt: string };

const WAREHOUSE_OPTIONS = ["WH_CLT_LOOKER_XS_G001", "WH_CLT_LOOKER_XS_G002", "WH_CLT_LOOKER_M_G003"];
const SIZE_OPTIONS = ["XSMALL", "SMALL", "MEDIUM", "LARGE", "XLARGE", "X2LARGE"];
const ASSIGNABLE = ["Coca Cola Latam", "Coca Cola CCH", "Coca Cola EMEA", "Coca Cola APAC"];
// Snowflake hourly cost ≈ credits(size) × 4€ × max clusters.
const SIZE_CREDITS: Record<string, number> = { XSMALL: 1, SMALL: 2, MEDIUM: 4, LARGE: 8, XLARGE: 16, X2LARGE: 32 };
const snowflakeCost = (size: string, clusters: number) => (SIZE_CREDITS[size] ?? 0) * 4 * clusters;

function formatNow() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function DataGroupPage({
  clientId,
  clientName,
  initialName,
  dataGroupId,
  mode = "edit",
}: {
  clientId: string;
  clientName: string;
  initialName: string;
  dataGroupId?: string;
  mode?: "add" | "edit";
}) {
  const isAdd = mode === "add";
  const navigate = useNavigate();
  const goClient = () => navigate({ to: "/clients/$clientId", params: { clientId } });

  const [name, setName] = useState(initialName);
  const [dashboardType, setDashboardType] = useState<"Brand" | "Agency">("Brand");
  const [fsaSection, setFsaSection] = useState(isAdd ? "" : "Drinks");
  const [isParent, setIsParent] = useState(false);
  const [parents, setParents] = useState<ParentRow[]>(
    isAdd ? [] : [{ id: "pr1", name: "Coca Cola Latam", createdAt: "2026-04-23, 07:41:10" }],
  );

  const [lookerShared, setLookerShared] = useState(false);
  const [lookerWarehouseName, setLookerWarehouseName] = useState(WAREHOUSE_OPTIONS[0]);
  const [lookerSize, setLookerSize] = useState(isAdd ? "MEDIUM" : "X2LARGE");
  const [lookerClusters, setLookerClusters] = useState(isAdd ? 1 : 3);

  const [cubeShared, setCubeShared] = useState(false);
  const [cubeWarehouseName, setCubeWarehouseName] = useState(WAREHOUSE_OPTIONS[0]);
  const [cubeSize, setCubeSize] = useState(isAdd ? "MEDIUM" : "X2LARGE");
  const [cubeClusters, setCubeClusters] = useState(isAdd ? 1 : 5);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignChoice, setAssignChoice] = useState("");
  const [confirmDisableOpen, setConfirmDisableOpen] = useState(false);
  const [metaCollapsed, setMetaCollapsed] = useState(false);

  const availableToAssign = useMemo(() => ASSIGNABLE.filter((n) => !parents.some((p) => p.name === n)), [parents]);

  const handleParentToggle = (next: boolean) => {
    if (!next && parents.length > 0) { setConfirmDisableOpen(true); return; }
    setIsParent(next);
    if (next) setLookerShared(true);
  };
  const confirmDisableParent = () => { setIsParent(false); setParents([]); setConfirmDisableOpen(false); };
  const assignDatagroup = () => {
    if (!assignChoice) return;
    setParents((p) => [...p, { id: crypto.randomUUID(), name: assignChoice, createdAt: formatNow() }]);
    setAssignChoice("");
    setAssignOpen(false);
  };

  return (
    <AppShell>
      <div className="h-full overflow-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb + actions */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <nav className="flex flex-wrap items-center gap-1.5 text-sm">
              <span className="cursor-pointer text-[var(--sidebar-active-fg)] hover:underline" onClick={() => navigate({ to: "/clients" })}>Clients</span>
              <span className="text-muted-foreground">›</span>
              <span className="cursor-pointer text-[var(--sidebar-active-fg)] hover:underline" onClick={goClient}>{clientName}</span>
              <span className="text-muted-foreground">›</span>
              <span className="text-muted-foreground">Data groups</span>
              <span className="text-muted-foreground">›</span>
              <span className="text-muted-foreground">{isAdd ? "Add data group" : name || initialName}</span>
            </nav>
            <button type="button" className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-accent transition-colors" aria-label="More actions">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <button onClick={goClient} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" /> {clientName}
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-5">{isAdd ? "Add data group" : name || initialName}</h1>

          <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-6">
            {/* Name + dashboard type */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
              <Field label="Name">
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </Field>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Dashboard type <span className="text-destructive">*</span></label>
                <div className="inline-flex rounded-md border border-border bg-muted p-0.5">
                  {(["Brand", "Agency"] as const).map((t) => (
                    <button key={t} onClick={() => setDashboardType(t)} className={cn("px-4 py-1.5 text-sm rounded-[5px] transition-colors", dashboardType === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* FSA + Multicompset */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Field label="FSA section">
                <Select value={fsaSection} onChange={setFsaSection} options={["Drinks", "Snacks", "Dairy", "Other"]} placeholder="Select a section" />
              </Field>
              {!isAdd && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Multicompset datagroups</label>
                  <Checkbox checked={isParent} onChange={handleParentToggle} label="Is a Parent Datagroup" />
                </div>
              )}
            </div>

            {/* Parent datagroups */}
            {isParent && (
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Parent datagroups</h3>
                  <button onClick={() => setAssignOpen(true)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Assign datagroups
                  </button>
                </div>
                <div className="overflow-hidden rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-muted-foreground">
                        <th className="px-4 py-2 text-left font-medium">Name</th>
                        <th className="px-4 py-2 text-right font-medium">Created at</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {parents.length === 0 ? (
                        <tr><td colSpan={3} className="px-4 py-6 text-center text-sm text-muted-foreground">No parent datagroups assigned.</td></tr>
                      ) : (
                        parents.map((p) => (
                          <tr key={p.id} className="border-t border-border">
                            <td className="px-4 py-2.5 text-foreground">{p.name}</td>
                            <td className="px-4 py-2.5 text-right text-muted-foreground">{p.createdAt}</td>
                            <td className="px-2">
                              <button onClick={() => setParents((rows) => rows.filter((r) => r.id !== p.id))} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" aria-label={`Remove ${p.name}`}><X className="h-4 w-4" /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Meta properties */}
            <div className="rounded-lg border border-border">
              <div className="flex items-center justify-between p-3">
                <button onClick={() => setMetaCollapsed((c) => !c)} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className="grid place-items-center h-6 w-6 rounded bg-muted"><ChevronDown className={cn("h-4 w-4 transition-transform", metaCollapsed && "-rotate-90")} /></span>
                  Meta properties
                </button>
                <div className="flex items-center gap-3">
                  <button className="text-sm text-muted-foreground hover:text-foreground">Clear</button>
                  <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                </div>
              </div>
              {!metaCollapsed && (
                <div className="px-3 pb-3">
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-sm text-emerald-700">{`{}`}</div>
                </div>
              )}
            </div>

            {/* Looker */}
            <SectionCard title="Looker">
              <Checkbox checked={lookerShared} onChange={setLookerShared} label="Use shared Snowflake warehouse" hint="This field will allow to select between shared warehouse or a custom one." />
              {lookerShared ? (
                <div className="mt-4 max-w-xl"><Field label="Warehouse name"><Select value={lookerWarehouseName} onChange={setLookerWarehouseName} options={WAREHOUSE_OPTIONS} /></Field></div>
              ) : (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                  <Field label="Warehouse size"><Select value={lookerSize} onChange={setLookerSize} options={SIZE_OPTIONS} /></Field>
                  <Field label="Max clusters"><NumberInput value={lookerClusters} onChange={setLookerClusters} /></Field>
                  <p className="md:col-span-2 text-sm font-medium text-amber-600">Snowflake cost: {snowflakeCost(lookerSize, lookerClusters)}€/h</p>
                </div>
              )}
            </SectionCard>

            {/* Cube */}
            <SectionCard title="Cube">
              <Checkbox checked={cubeShared} onChange={setCubeShared} label="Use shared Snowflake warehouse" hint="This field will allow to select between shared warehouse or a custom one." />
              {cubeShared ? (
                <div className="mt-4 max-w-xl"><Field label="Warehouse name"><Select value={cubeWarehouseName} onChange={setCubeWarehouseName} options={WAREHOUSE_OPTIONS} /></Field></div>
              ) : (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                  <Field label="Warehouse size"><Select value={cubeSize} onChange={setCubeSize} options={SIZE_OPTIONS} /></Field>
                  <Field label="Max clusters"><NumberInput value={cubeClusters} onChange={setCubeClusters} /></Field>
                  <p className="md:col-span-2 text-sm font-medium text-amber-600">Snowflake cost: {snowflakeCost(cubeSize, cubeClusters)}€/h</p>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Tabs — only on an existing data group; reduced to Dashboard sections / Users / Cubes when parent */}
          {!isAdd && <DataGroupTabs isParent={isParent} dataGroupId={dataGroupId} />}

          {isAdd && (
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={goClient}>Cancel</Button>
              <Button onClick={() => { toast.success("Data group created"); goClient(); }} disabled={!name.trim()}>Add data group</Button>
            </div>
          )}
        </div>
      </div>

      {assignOpen && (
        <Modal onClose={() => setAssignOpen(false)} title="Assign datagroup">
          <div className="space-y-4">
            <Field label={<>Datagroup <span className="text-destructive">*</span></>}>
              <Select value={assignChoice} onChange={setAssignChoice} options={availableToAssign} placeholder="Select a datagroup" />
            </Field>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setAssignOpen(false)} className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">Cancel</button>
              <button onClick={assignDatagroup} disabled={!assignChoice} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Assign datagroup</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmDisableOpen && (
        <Modal onClose={() => setConfirmDisableOpen(false)} title="Multicompset datagroup" hideClose>
          <p className="text-center text-sm text-foreground mb-6">Disabling the checkbox option it will remove all datagroup added as children</p>
          <div className="flex justify-center gap-3">
            <button onClick={confirmDisableParent} className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Confirm</button>
            <button onClick={() => setConfirmDisableOpen(false)} className="rounded-md border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">Cancel</button>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />;
}

function Checkbox({ checked, onChange, label, hint }: { checked: boolean; onChange: (next: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <button type="button" role="checkbox" aria-checked={checked} onClick={() => onChange(!checked)} className={cn("mt-0.5 grid h-5 w-5 place-items-center rounded border transition-colors", checked ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border hover:border-primary/60")}>
        {checked && (<svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
      </button>
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Modal({ title, children, onClose, hideClose }: { title: string; children: React.ReactNode; onClose: () => void; hideClose?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-card shadow-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground w-full text-center">{title}</h2>
          {!hideClose && <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors -mr-2" aria-label="Close"><X className="h-4 w-4" /></button>}
        </div>
        {children}
      </div>
    </div>
  );
}
