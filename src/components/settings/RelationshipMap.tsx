import { useMemo, useState } from "react";
import { X, Network, Loader2, Building2, Store, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { pairKey, type MuCatalog } from "@/lib/massiveUpdate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** A click on an assignment in the map → load it into the Massive update tool. */
export type MapEdit = { sectionId: string; kind: "dg" | "dgr"; targetId: string };

/**
 * Read-only "relationship map": for the chosen dashboard application, shows
 * group → section and where each section is currently APPLIED — the client
 * datagroups (Brand, datagroup-dashboardsections) and the retailers (Agency,
 * retailer-dashboardsections). Every target chip is clickable and loads that
 * exact section + target into the Massive update tool to edit (insert/remove).
 */
export function RelationshipMap({
  catalog,
  assigned,
  live,
  loading,
  onClose,
  onEdit,
}: {
  catalog: MuCatalog;
  assigned: Set<string>;
  live: boolean;
  loading: boolean;
  onClose: () => void;
  onEdit: (e: MapEdit) => void;
}) {
  const [appId, setAppId] = useState(catalog.apps[0]?.id ?? "");
  const [q, setQ] = useState("");
  const [onlyApplied, setOnlyApplied] = useState(true);

  const app = catalog.apps.find((a) => a.id === appId) ?? catalog.apps[0];
  const clientName = (id: string) => catalog.clients.find((c) => c.id === id)?.name ?? "—";
  const ql = q.trim().toLowerCase();

  // group → [{ section, dgs (brand), rets (agency) }]
  const groups = useMemo(() => {
    const gs = catalog.groups.filter((g) => g.appSlug === app?.slug);
    const retailers = catalog.retailers ?? [];
    return gs
      .map((g) => {
        const sections = catalog.sections
          .filter((s) => s.groupId === g.id && (!ql || `${s.label} ${s.path}`.toLowerCase().includes(ql)))
          .map((s) => {
            const dgs = catalog.dataGroups.filter((d) => assigned.has(pairKey(s.id, d.id)));
            const rets = retailers.filter((r) => assigned.has(pairKey(s.id, r.id)));
            return { section: s, dgs, rets };
          })
          .filter((r) => !onlyApplied || r.dgs.length > 0 || r.rets.length > 0);
        return { group: g, rows: sections };
      })
      .filter((g) => g.rows.length > 0);
  }, [catalog, app, assigned, ql, onlyApplied]);

  const totalBrand = groups.reduce((n, g) => n + g.rows.reduce((m, r) => m + r.dgs.length, 0), 0);
  const totalAgency = groups.reduce((n, g) => n + g.rows.reduce((m, r) => m + r.rets.length, 0), 0);
  const totalSections = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Relationship map</h2>
          <span className="text-sm text-muted-foreground">
            dashboard application → group → section, applied into datagroups (Brand) &amp; retailers (Agency)
          </span>
          <button
            onClick={onClose}
            className="ml-auto flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-sm hover:bg-secondary"
          >
            <X className="h-4 w-4" /> Close
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={appId} onValueChange={setAppId}>
            <SelectTrigger className="h-8 w-56">
              <SelectValue placeholder="Application" />
            </SelectTrigger>
            <SelectContent>
              {catalog.apps.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sections by name or path"
            className="h-8 w-72 rounded-md border border-border bg-background px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input type="checkbox" checked={onlyApplied} onChange={(e) => setOnlyApplied(e.target.checked)} />
            Only sections with assignments
          </label>
          <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>{totalSections} sections</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Building2 className="h-3.5 w-3.5" /> {totalBrand} datagroup links
            </span>
            <span className="flex items-center gap-1 text-violet-700">
              <Store className="h-3.5 w-3.5" /> {totalAgency} retailer links
            </span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {!live && (
          <p className="mb-3 rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
            Seeded sample — connect live data for the real assignment map.
          </p>
        )}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading current assignments…
          </div>
        ) : groups.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No {onlyApplied ? "applied " : ""}sections for {app?.label}.
          </p>
        ) : (
          <div className="space-y-5">
            {groups.map(({ group, rows }) => (
              <div key={group.id}>
                <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                  <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium normal-case">
                    {rows.length} section{rows.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="space-y-2">
                  {rows.map(({ section, dgs, rets }) => (
                    <div key={section.id} className="rounded-lg border border-border bg-card p-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-foreground">{section.label}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{section.path}</span>
                      </div>
                      {dgs.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                            <Building2 className="h-3 w-3" /> {dgs.length} datagroup{dgs.length === 1 ? "" : "s"}
                          </span>
                          {dgs.map((d) => (
                            <Chip
                              key={d.id}
                              tone="emerald"
                              onClick={() => onEdit({ sectionId: section.id, kind: "dg", targetId: d.id })}
                            >
                              {clientName(d.clientId)} · {d.name}
                            </Chip>
                          ))}
                        </div>
                      )}
                      {rets.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-medium text-violet-700">
                            <Store className="h-3 w-3" /> {rets.length} retailer{rets.length === 1 ? "" : "s"}
                          </span>
                          {rets.map((r) => (
                            <Chip
                              key={r.id}
                              tone="violet"
                              onClick={() => onEdit({ sectionId: section.id, kind: "dgr", targetId: r.id })}
                            >
                              {r.name}
                            </Chip>
                          ))}
                        </div>
                      )}
                      {dgs.length === 0 && rets.length === 0 && (
                        <p className="mt-1 text-[11px] text-muted-foreground">Not applied anywhere.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 border-t border-border px-6 py-2 text-center text-[11px] text-muted-foreground">
        Click any datagroup or retailer chip to open it in the Massive update tool <ArrowRight className="inline h-3 w-3" /> edit (insert / remove).
      </div>
    </div>
  );
}

function Chip({
  children,
  tone,
  onClick,
}: {
  children: React.ReactNode;
  tone: "emerald" | "violet";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title="Open in Massive update tool to edit"
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px] transition-colors",
        tone === "emerald"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          : "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100",
      )}
    >
      {children}
    </button>
  );
}
