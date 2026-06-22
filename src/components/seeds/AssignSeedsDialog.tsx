import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterChip } from "@/components/seeds/FilterChip";
import { Pill } from "@/components/seeds/ListPrimitives";
import { distinct } from "@/components/seeds/ListPrimitives";
import { SEED_STATUS_OPTIONS, type Seed, type SeedType } from "@/lib/seeds";
import { getSubscriptions } from "@/lib/subscriptions";
import { cn } from "@/lib/utils";
import { Search, Maximize2, Minimize2, Store, FolderKanban, Layers, ChevronLeft, ChevronRight } from "lucide-react";

// PDP seeds are the Virtual Seeds produced by Discovery over a PLP extraction.
const TYPE_LABEL: Record<SeedType, string> = { KEYWORD: "Keyword", URL: "URL", API: "API", PDP: "PDP" };
const TYPE_ORDER: SeedType[] = ["KEYWORD", "URL", "API", "PDP"];

/** Origin of a seed: Virtual = produced by Discovery (PLP→PDP); Physical = added
 *  through the interface. Only PDP seeds can be Virtual. */
function OriginPill({ value }: { value?: boolean }) {
  return value ? <Pill tone="violet">Virtual</Pill> : <Pill tone="slate">Physical</Pill>;
}

function StatusDot({ status }: { status?: Seed["status"] }) {
  const active = (status ?? "Active") !== "Inactive";
  return (
    <span className="inline-flex items-center gap-1.5 text-foreground/80">
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
      {status ?? "Active"}
    </span>
  );
}

/**
 * Full "Assign seeds" modal — a tabbed (by seed type), filterable, multi-select
 * grid of the seeds NOT yet assigned to the subscription. Checking rows and
 * confirming with "Assign seeds" returns the chosen seed descriptions.
 *
 * Filters: Store (seed.store, direct) plus Projects / Subscriptions, resolved
 * indirectly from which subscriptions already use each seed (Subscription.seeds
 * holds seed descriptions; the subscription's project gives the project). The
 * Discovery key and Origin (Physical / Virtual) columns/filters show only on the
 * PDP tab, where they are meaningful.
 */
export function AssignSeedsDialog({
  open,
  onOpenChange,
  available,
  onAssign,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Seeds available to assign (already excludes the ones on the subscription). */
  available: Seed[];
  onAssign: (descriptions: string[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [fStore, setFStore] = useState<string[]>([]);
  const [fProject, setFProject] = useState<string[]>([]);
  const [fSub, setFSub] = useState<string[]>([]);
  const [fCat, setFCat] = useState<string[]>([]);
  const [fStatus, setFStatus] = useState<string[]>([]);
  const [fDk, setFDk] = useState<string[]>([]);
  const [fOrigin, setFOrigin] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Subscriptions (client-side) → which subscriptions/projects use each seed.
  // Loaded on open to avoid an SSR/hydration mismatch over localStorage.
  const [subs, setSubs] = useState<{ name: string; project: string; seeds: string[] }[]>([]);
  useEffect(() => {
    if (open) setSubs(getSubscriptions().map((s) => ({ name: s.name, project: s.project, seeds: s.seeds ?? [] })));
  }, [open]);

  // seed description → the subscriptions + projects that use it.
  const seedUsage = useMemo(() => {
    const m = new Map<string, { subs: Set<string>; projects: Set<string> }>();
    for (const sub of subs) {
      for (const d of sub.seeds) {
        let e = m.get(d);
        if (!e) { e = { subs: new Set(), projects: new Set() }; m.set(d, e); }
        e.subs.add(sub.name);
        if (sub.project) e.projects.add(sub.project);
      }
    }
    return m;
  }, [subs]);

  // Tabs: the seed types actually present among available seeds (stable order).
  const types = useMemo(() => {
    const present = new Set(available.map((s) => s.type ?? "KEYWORD"));
    const list = TYPE_ORDER.filter((t) => present.has(t));
    return list.length ? list : (["KEYWORD"] as SeedType[]);
  }, [available]);
  const [tab, setTab] = useState<SeedType>(types[0]);
  const isPdp = tab === "PDP";

  // Reset transient state each time the modal opens or the tab list changes.
  useEffect(() => {
    if (open) {
      setSelected(new Set());
      setSearch("");
      setFStore([]); setFProject([]); setFSub([]);
      setFCat([]); setFStatus([]); setFDk([]); setFOrigin([]);
      setTab(types[0]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const inTab = useMemo(() => available.filter((s) => (s.type ?? "KEYWORD") === tab), [available, tab]);

  const q = search.trim().toLowerCase();
  const rows = inTab.filter((s) => {
    const usage = seedUsage.get(s.d);
    return (
      (!q || s.d.toLowerCase().includes(q) || (s.value ?? "").toLowerCase().includes(q) || (s.discoveryKey ?? "").toLowerCase().includes(q)) &&
      (!fStore.length || fStore.includes(s.store)) &&
      (!fProject.length || (!!usage && [...usage.projects].some((p) => fProject.includes(p)))) &&
      (!fSub.length || (!!usage && [...usage.subs].some((n) => fSub.includes(n)))) &&
      (!fCat.length || fCat.includes(s.cat)) &&
      (!fStatus.length || fStatus.includes(s.status ?? "Active")) &&
      (!isPdp || !fDk.length || fDk.includes(s.discoveryKey ?? "")) &&
      (!isPdp || !fOrigin.length || fOrigin.includes(s.isFromDiscovery ? "Virtual" : "Physical"))
    );
  });

  // Filter options. Store is direct; Projects/Subscriptions come from all subs
  // (so the chips are stable across tabs). Category/Discovery key are per-tab.
  const storeOptions = [...new Set(available.map((s) => s.store).filter(Boolean))].sort();
  const projectOptions = [...new Set(subs.map((s) => s.project).filter(Boolean))].sort();
  const subOptions = [...new Set(subs.map((s) => s.name).filter(Boolean))].sort();
  const catOptions = distinct(inTab, (s) => s.cat);
  const dkOptions = distinct(inTab, (s) => s.discoveryKey ?? "").filter(Boolean);

  const valueHeader = tab === "URL" || tab === "PDP" ? "URL" : tab === "API" ? "API origin" : "Keyword";
  const colCount = 5 + (isPdp ? 2 : 0);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const visibleIds = rows.map((s) => s.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));
  const toggleAllVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
      else visibleIds.forEach((id) => next.add(id));
      return next;
    });

  const confirm = () => {
    const descs = [...new Set(available.filter((s) => selected.has(s.id)).map((s) => s.d))];
    if (descs.length) onAssign(descs);
    onOpenChange(false);
  };

  const countByType = (t: SeedType) => available.filter((s) => (s.type ?? "KEYWORD") === t).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0",
          expanded ? "sm:max-w-6xl" : "sm:max-w-4xl",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <DialogTitle className="text-base font-semibold text-foreground">Assign seeds</DialogTitle>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mr-7 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-5 border-b border-border px-5">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-0.5 py-2.5 text-sm transition-colors",
                tab === t
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {TYPE_LABEL[t]}
              <span className="rounded-full bg-secondary px-1.5 text-[11px] text-muted-foreground">{countByType(t)}</span>
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-3">
          <div className="relative w-44">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="h-8 pl-8 text-sm" />
          </div>
          <FilterChip label="Store" icon={Store} options={storeOptions} value={fStore} onChange={setFStore} searchable />
          <FilterChip label="Projects" icon={FolderKanban} options={projectOptions} value={fProject} onChange={setFProject} searchable />
          <FilterChip label="Subscriptions" icon={Layers} options={subOptions} value={fSub} onChange={setFSub} searchable />
          <FilterChip label="Category" options={catOptions} value={fCat} onChange={setFCat} searchable />
          <FilterChip label="Status" options={[...SEED_STATUS_OPTIONS]} value={fStatus} onChange={setFStatus} />
          {isPdp && <FilterChip label="Discovery key" options={dkOptions} value={fDk} onChange={setFDk} searchable />}
          {isPdp && <FilterChip label="Origin" options={["Physical", "Virtual"]} value={fOrigin} onChange={setFOrigin} />}
        </div>

        {/* Grid */}
        <div className="min-h-0 flex-1 overflow-auto border-y border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-secondary/60">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAllVisible}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-3 py-2.5 font-medium">Description</th>
                {isPdp && <th className="px-3 py-2.5 font-medium">Discovery key</th>}
                <th className="px-3 py-2.5 font-medium">{valueHeader}</th>
                {isPdp && <th className="px-3 py-2.5 font-medium">Origin</th>}
                <th className="px-3 py-2.5 font-medium">Category</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="px-3 py-16 text-center text-muted-foreground">There are no data</td>
                </tr>
              ) : (
                rows.map((s) => {
                  const checked = selected.has(s.id);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => toggle(s.id)}
                      className={cn("cursor-pointer border-t border-border hover:bg-secondary/40", checked && "bg-primary/5")}
                    >
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={checked} onCheckedChange={() => toggle(s.id)} aria-label={`Select ${s.d}`} />
                      </td>
                      <td className="px-3 py-2.5 text-[var(--sidebar-active-fg)]">{s.d}</td>
                      {isPdp && (
                        <td className="px-3 py-2.5">
                          {s.discoveryKey ? (
                            <span className="block max-w-[160px] truncate font-mono text-xs text-foreground/80" title={s.discoveryKey}>{s.discoveryKey}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      )}
                      <td className="px-3 py-2.5 text-foreground/80">
                        <span className="block max-w-[220px] truncate" title={s.value}>{s.value || "—"}</span>
                      </td>
                      {isPdp && <td className="px-3 py-2.5"><OriginPill value={s.isFromDiscovery} /></td>}
                      <td className="px-3 py-2.5 text-foreground/80">
                        <span className="block max-w-[200px] truncate" title={s.cat}>{s.cat || "—"}</span>
                      </td>
                      <td className="px-3 py-2.5"><StatusDot status={s.status} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-4 px-5 py-2.5 text-sm text-muted-foreground">
          <span>Rows per page: 100</span>
          <span>{rows.length === 0 ? "0–0" : `1–${rows.length}`} of {rows.length}</span>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-secondary disabled:opacity-40" aria-label="Previous" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="rounded p-1 hover:bg-secondary disabled:opacity-40" aria-label="Next" disabled>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3.5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={confirm} disabled={selected.size === 0}>
            Assign seeds{selected.size ? ` (${selected.size})` : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
