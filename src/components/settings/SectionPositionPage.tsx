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
import { ArrowLeft, GripVertical, Plus, X, Store, Building2, Layers } from "lucide-react";
import { getDashboardApps } from "@/lib/dashboardApps";
import {
  POSITION_TARGETS,
  SECTION_POSITIONS_KEY,
  SEED_POSITIONS,
  type PosTarget,
  type PosTargetKind,
  type PositionMap,
} from "@/lib/dashboardSectionPositions";

type CatalogSection = { id: string; path: string; label: string; type: string; appLabel: string };

export function SectionPositionPage() {
  const [positions, setPositions] = usePersistentState<PositionMap>(SECTION_POSITIONS_KEY, SEED_POSITIONS);

  // Flattened section catalogue (every app's groups → sections), read on mount.
  const catalog = useMemo<CatalogSection[]>(() => {
    const out: CatalogSection[] = [];
    for (const a of getDashboardApps())
      for (const g of a.groups)
        for (const s of g.sections)
          out.push({ id: s.id, path: s.path, label: s.label, type: s.type, appLabel: a.label });
    return out;
  }, []);
  const byId = useMemo(() => new Map(catalog.map((s) => [s.id, s])), [catalog]);

  const [kind, setKind] = useState<PosTargetKind>("retailer");
  const targetsOfKind = POSITION_TARGETS.filter((t) => t.kind === kind);
  const [targetId, setTargetId] = useState<string>(() => POSITION_TARGETS.find((t) => t.kind === "retailer")?.id ?? "");
  const target = POSITION_TARGETS.find((t) => t.id === targetId) ?? null;

  const switchKind = (k: PosTargetKind) => {
    if (k === kind) return;
    setKind(k);
    setTargetId(POSITION_TARGETS.find((t) => t.kind === k)?.id ?? "");
  };

  const order = (target && positions[target.id]) || [];
  const setOrder = (next: string[]) => {
    if (!target) return;
    setPositions((prev) => ({ ...prev, [target.id]: next }));
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

  const available = catalog.filter((s) => !order.includes(s.id));

  const targetLabel = (t: PosTarget) => (t.client ? `${t.client} · ${t.name}` : t.name);

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

        {/* Target selector */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
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
                      <Pill tone="slate">{s.type}</Pill>
                      <Pill tone="amber">{s.appLabel}</Pill>
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
                          <Pill tone="slate">{s.type}</Pill>
                          <Pill tone="amber">{s.appLabel}</Pill>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
