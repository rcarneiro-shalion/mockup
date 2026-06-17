import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { usePersistentState } from "@/hooks/usePersistentState";
import { Pill } from "@/components/seeds/ListPrimitives";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, GripVertical, Plus, X, Store, Building2, Layers, Tags } from "lucide-react";
import { FilterChip } from "@/components/seeds/FilterChip";
import { LABEL_COLOR_CLASSES, SEED_RETAILER_LABELS, labelForRetailer, type RetailerLabel } from "@/lib/retailerLabels";
import { getDashboardApps } from "@/lib/dashboardApps";
import {
  POSITION_TARGETS,
  SECTION_POSITIONS_KEY,
  SEED_POSITIONS,
  posKey,
  type PosTarget,
  type PosTargetKind,
  type PositionMap,
} from "@/lib/dashboardSectionPositions";

/** Short app code (uppercased slug, e.g. RMMS / DSM), falling back to initials. */
const appShortOf = (a: { slug?: string; label: string }) =>
  (a.slug?.trim() || a.label.split(/\s+/).filter(Boolean).map((w) => w[0]).join("")).toUpperCase();

type CatalogSection = { id: string; path: string; label: string; type: string; appId: string; appLabel: string; appShort: string; group: string };

export function SectionPositionPage() {
  const [positions, setPositions] = usePersistentState<PositionMap>(SECTION_POSITIONS_KEY, SEED_POSITIONS);

  // Flattened section catalogue (every app's groups → sections), read on mount.
  const catalog = useMemo<CatalogSection[]>(() => {
    const out: CatalogSection[] = [];
    for (const a of getDashboardApps())
      for (const g of a.groups)
        for (const s of g.sections)
          out.push({ id: s.id, path: s.path, label: s.label, type: s.type, appId: a.id, appLabel: a.label, appShort: appShortOf(a), group: g.label });
    return out;
  }, []);
  const byId = useMemo(() => new Map(catalog.map((s) => [s.id, s])), [catalog]);

  // Applications that actually have sections to order.
  const appOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const s of catalog) if (!seen.has(s.appId)) seen.set(s.appId, s.appLabel);
    return [...seen.entries()];
  }, [catalog]);

  const [appId, setAppId] = useState<string>(() => (appOptions.some(([id]) => id === "rmms") ? "rmms" : appOptions[0]?.[0] ?? ""));
  const [kind, setKind] = useState<PosTargetKind>("retailer");
  const targetsOfKind = POSITION_TARGETS.filter((t) => t.kind === kind);
  const [targetId, setTargetId] = useState<string>(() => POSITION_TARGETS.find((t) => t.kind === "retailer")?.id ?? "");
  const [applyTargets, setApplyTargets] = useState<string[]>([]);
  // Facet filters for the bulk-apply list: retailers by label group, datagroups by client.
  const [retailerLabels] = usePersistentState<RetailerLabel[]>("mu:retailer-labels:v4", SEED_RETAILER_LABELS);
  const [fLabels, setFLabels] = useState<string[]>([]);
  const [fClients, setFClients] = useState<string[]>([]);
  const target = POSITION_TARGETS.find((t) => t.id === targetId) ?? null;

  const switchKind = (k: PosTargetKind) => {
    if (k === kind) return;
    setKind(k);
    setTargetId(POSITION_TARGETS.find((t) => t.kind === k)?.id ?? "");
    setApplyTargets([]);
    setFLabels([]);
    setFClients([]);
  };

  // Order for the selected application + target. The client's dashboard for that
  // app shows its sections in this order; each (app, target) keeps its own list.
  const order = (target && positions[posKey(appId, target.id)]) || [];
  const setOrder = (next: string[]) => {
    if (!target) return;
    setPositions((prev) => ({ ...prev, [posKey(appId, target.id)]: next }));
  };
  const move = (from: number, to: number) => {
    if (from === to) return;
    const a = [...order];
    const [x] = a.splice(from, 1);
    a.splice(to, 0, x);
    setOrder(a);
  };
  const removeAt = (secId: string) => setOrder(order.filter((id) => id !== secId));
  const addSection = (secId: string) => {
    if (!order.includes(secId)) setOrder([...order, secId]);
  };

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Add-section options: this application's sections not already in the order.
  const available = catalog.filter((s) => s.appId === appId && !order.includes(s.id));

  const targetLabel = (t: PosTarget) => (t.client ? `${t.client} · ${t.name}` : t.name);
  const kindLabel = kind === "retailer" ? "retailer" : "datagroup";

  // Bulk-apply target list, narrowed by the active facet: retailers by label
  // group (agency), datagroups by client name (brand).
  const labelOf = (name: string) => labelForRetailer(retailerLabels, name);
  const filteredTargets = targetsOfKind.filter((t) =>
    kind === "retailer"
      ? !fLabels.length || fLabels.includes(labelOf(t.name).id)
      : !fClients.length || (!!t.client && fClients.includes(t.client)),
  );
  const labelOptions = [...new Set(POSITION_TARGETS.filter((t) => t.kind === "retailer").map((t) => labelOf(t.name).id))];
  const clientOptions = [...new Set(POSITION_TARGETS.filter((t) => t.kind === "datagroup" && t.client).map((t) => t.client as string))];

  // Bulk apply: copy the current (app) order onto every selected target, same app.
  const allSelected = filteredTargets.length > 0 && filteredTargets.every((t) => applyTargets.includes(t.id));
  const toggleAll = () => {
    const ids = filteredTargets.map((t) => t.id);
    setApplyTargets((prev) => (allSelected ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]));
  };
  const toggleApply = (id: string) =>
    setApplyTargets((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const applyToAll = () => {
    if (!applyTargets.length) return;
    setPositions((prev) => {
      const next = { ...prev };
      for (const id of applyTargets) next[posKey(appId, id)] = [...order];
      return next;
    });
    toast.success(`Applied this order to ${applyTargets.length} ${kindLabel}${applyTargets.length === 1 ? "" : "s"}.`);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="px-6 pt-5">
          <Link
            to="/settings/dashboard-applications"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard applications
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <Layers className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Section position</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Order the dashboard sections of a retailer or datagroup. The order here is the position the client sees
            their sections in, in the dashboard.
          </p>
        </div>

        {/* Application + target selector */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
          <select
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            title="Dashboard application"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {appOptions.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-sm">
            <button
              type="button"
              onClick={() => switchKind("retailer")}
              className={cn("flex items-center gap-1.5 rounded px-2.5 py-1", kind === "retailer" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <Store className="h-3.5 w-3.5" /> Retailer
            </button>
            <button
              type="button"
              onClick={() => switchKind("datagroup")}
              className={cn("flex items-center gap-1.5 rounded px-2.5 py-1", kind === "datagroup" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              <Building2 className="h-3.5 w-3.5" /> Datagroup
            </button>
          </div>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="h-9 min-w-[240px] rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {targetsOfKind.map((t) => (
              <option key={t.id} value={t.id}>
                {targetLabel(t)}
              </option>
            ))}
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            {order.length} section{order.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Ordered section list */}
        <div className="min-h-0 flex-1 overflow-auto px-6 pb-6">
          <div className="mx-auto max-w-3xl space-y-2">
            {order.length === 0 && (
              <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No sections assigned to {target ? targetLabel(target) : "this target"} yet. Add one below.
              </p>
            )}
            {order.map((secId, i) => {
              const s = byId.get(secId);
              return (
                <div
                  key={secId}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (overIdx !== i) setOverIdx(i);
                  }}
                  onDrop={() => {
                    if (dragIdx !== null) move(dragIdx, i);
                    setDragIdx(null);
                    setOverIdx(null);
                  }}
                  onDragEnd={() => {
                    setDragIdx(null);
                    setOverIdx(null);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm transition-colors",
                    dragIdx === i && "opacity-40",
                    overIdx === i && dragIdx !== null && dragIdx !== i && "border-primary ring-1 ring-primary",
                  )}
                >
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
                  <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                  {s ? (
                    <>
                      <span className="truncate font-mono text-sm text-foreground" title={s.path}>{s.path}</span>
                      <Pill tone="slate">{s.group}</Pill>
                      <Pill tone="amber">{s.appShort}</Pill>
                    </>
                  ) : (
                    <span className="font-mono text-sm text-muted-foreground">{secId} (missing)</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(secId)}
                    aria-label="Remove section"
                    className="ml-auto shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            {/* Add section */}
            <Popover open={addOpen} onOpenChange={setAddOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={!target}
                  className="inline-flex items-center gap-1.5 px-1 pt-1 text-sm font-medium text-[var(--sidebar-active-fg)] hover:underline disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Add section
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[420px] p-0">
                <Command>
                  <CommandInput placeholder="Search sections by path, name or app" />
                  <CommandList>
                    <CommandEmpty>No sections found.</CommandEmpty>
                    <CommandGroup>
                      {available.map((s) => (
                        <CommandItem
                          key={s.id}
                          value={`${s.path} ${s.label} ${s.appLabel} ${s.type}`}
                          onSelect={() => {
                            addSection(s.id);
                            setAddOpen(false);
                          }}
                          className="flex items-center gap-2"
                        >
                          <span className="min-w-0 flex-1 truncate font-mono text-xs">{s.path}</span>
                          <Pill tone="slate">{s.group}</Pill>
                          <Pill tone="amber">{s.appShort}</Pill>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Bulk apply — push this order onto many targets of the same app at once */}
            {target && (
              <div className="mt-6 rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Apply this order to multiple {kindLabel}s</p>
                    <p className="text-xs text-muted-foreground">
                      Copies the {order.length}-section order above onto every selected {kindLabel}'s {byId.get(order[0])?.appLabel ?? "dashboard"} dashboard.
                    </p>
                  </div>
                  <Button size="sm" disabled={!applyTargets.length} onClick={applyToAll}>
                    Apply to {applyTargets.length} {kindLabel}{applyTargets.length === 1 ? "" : "s"}
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {kind === "retailer" ? (
                    <FilterChip
                      label="Label group"
                      icon={Tags}
                      options={labelOptions}
                      value={fLabels}
                      onChange={setFLabels}
                      getLabel={(id) => retailerLabels.find((l) => l.id === id)?.name ?? id}
                      searchable
                    />
                  ) : (
                    <FilterChip label="Client" icon={Building2} options={clientOptions} value={fClients} onChange={setFClients} searchable />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-border" />
                    Select all ({filteredTargets.length})
                  </label>
                  {applyTargets.length > 0 && (
                    <button type="button" onClick={() => setApplyTargets([])} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                      Clear ({applyTargets.length})
                    </button>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                  {filteredTargets.length === 0 && (
                    <p className="col-span-full px-2 py-2 text-xs text-muted-foreground">No {kindLabel}s match the filter.</p>
                  )}
                  {filteredTargets.map((t) => {
                    const lbl = kind === "retailer" ? labelOf(t.name) : null;
                    return (
                      <label key={t.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-foreground/90 hover:bg-secondary/40">
                        <input
                          type="checkbox"
                          checked={applyTargets.includes(t.id)}
                          onChange={() => toggleApply(t.id)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <span className="truncate">{targetLabel(t)}</span>
                        {lbl && <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", LABEL_COLOR_CLASSES[lbl.color])}>{lbl.name}</span>}
                        {t.id === target.id && <span className="shrink-0 text-[10px] text-muted-foreground">(current)</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
