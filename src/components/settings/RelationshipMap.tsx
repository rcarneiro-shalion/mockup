import { useEffect, useMemo, useRef, useState } from "react";
import { X, Network, Loader2, Building2, Store, ArrowRight, LayoutGrid, List, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { pairKey, type MuCatalog } from "@/lib/massiveUpdate";
import { FilterChip } from "@/components/seeds/FilterChip";
import { LABEL_COLOR_CLASSES, labelForRetailer, type RetailerLabel } from "@/lib/retailerLabels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** A click on a cell/chip in the map → load it into the Massive update tool. */
export type MapEdit = { sectionId: string; kind: "dg" | "dgr"; targetIds: string[] };

type Row = {
  section: { id: string; label: string; path: string };
  dgs: { id: string; name: string; clientId: string }[];
  rets: { id: string; name: string }[];
};

/**
 * Read-only "relationship map" of where each dashboard section is currently
 * APPLIED. Two axes via the Brand/Agency toggle:
 *  - Brand   → matrix of section (rows) × CLIENT (cols); a cell shows how many of
 *              the client's datagroups use the section (datagroup-dashboardsections).
 *  - Agency  → matrix of section (rows) × RETAILER (cols) (retailer-dashboardsections).
 * Every filled cell (and every list chip) is clickable → opens that section +
 * target in the Massive update tool to edit (insert/remove).
 */
export function RelationshipMap({
  catalog,
  assigned,
  live,
  loading,
  synced,
  retailerLabels,
  onLoad,
  onClose,
  onEdit,
}: {
  catalog: MuCatalog;
  assigned: Set<string>;
  live: boolean;
  loading: boolean;
  /** Which axes' assignments are fully loaded ("dg" = brand, "dgr" = agency). */
  synced: Set<"dg" | "dgr">;
  /** Retailer labels — to filter the agency retailer columns by label. */
  retailerLabels: RetailerLabel[];
  /** Request loading an axis's assignments (heavy → lazy, only the active one). */
  onLoad: (kind: "dg" | "dgr") => void;
  onClose: () => void;
  onEdit: (e: MapEdit) => void;
}) {
  const [appId, setAppId] = useState(catalog.apps[0]?.id ?? "");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"dg" | "dgr">("dg");
  const [view, setView] = useState<"matrix" | "list">("matrix");
  // Column filter: client ids (Brand) or retailer ids (Agency) to narrow columns.
  const [colFilter, setColFilter] = useState<string[]>([]);
  // Retailer-label filter (Agency only) — narrows columns to retailers in a label.
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  const labelForName = (name: string) => labelForRetailer(retailerLabels, name);

  // Lazily load the ACTIVE axis's assignments once (the brand list is ~9MB, so we
  // never pull both). requested guards against re-firing on partial loads.
  const requested = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!live || loading) return;
    if (synced.has(mode) || requested.current.has(mode)) return;
    requested.current.add(mode);
    onLoad(mode);
  }, [live, loading, synced, mode, onLoad]);
  const reload = () => {
    requested.current.delete(mode);
    onLoad(mode);
  };

  const app = catalog.apps.find((a) => a.id === appId) ?? catalog.apps[0];
  const clientName = (id: string) => catalog.clients.find((c) => c.id === id)?.name ?? "—";
  const ql = q.trim().toLowerCase();
  const retailers = catalog.retailers ?? [];

  // The option set changes with the application + axis → reload (reset) the filter
  // whenever either changes, so stale picks from another app can't linger.
  useEffect(() => {
    setColFilter([]);
    setLabelFilter([]);
  }, [appId, mode]);

  // Group → rows; a row is shown only if it has assignments in the active mode.
  const groups = useMemo(() => {
    const gs = catalog.groups.filter((g) => g.appSlug === app?.slug);
    return gs
      .map((g) => {
        const rows: Row[] = catalog.sections
          .filter((s) => s.groupId === g.id && (!ql || `${s.label} ${s.path}`.toLowerCase().includes(ql)))
          .map((s) => ({
            section: s,
            dgs: catalog.dataGroups.filter((d) => assigned.has(pairKey(s.id, d.id))),
            rets: retailers.filter((r) => assigned.has(pairKey(s.id, r.id))),
          }))
          .filter((r) => (mode === "dg" ? r.dgs.length > 0 : r.rets.length > 0));
        return { group: g, rows };
      })
      .filter((g) => g.rows.length > 0);
  }, [catalog, app, assigned, ql, mode, retailers]);

  const allRows = groups.flatMap((g) => g.rows);

  // The full column set for this app + axis (drives the filter chip options).
  const allColumns = useMemo(() => {
    if (mode === "dg") {
      const ids = new Set<string>();
      for (const r of allRows) for (const d of r.dgs) ids.add(d.clientId);
      return [...ids].map((id) => ({ key: id, label: clientName(id) })).sort((a, b) => a.label.localeCompare(b.label));
    }
    const ids = new Set<string>();
    for (const r of allRows) for (const ret of r.rets) ids.add(ret.id);
    return retailers
      .filter((r) => ids.has(r.id))
      .map((r) => ({ key: r.id, label: r.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRows, mode, retailers]);

  // Apply the column filter(s) → visible columns + visible rows (a row is kept
  // only if it still has a target in the visible columns). Two filters can apply:
  // the per-column id filter (Clients/Retailers) and — Agency only — the retailer
  // LABEL filter (col.label is the retailer name).
  const filterSet = useMemo(() => new Set(colFilter), [colFilter]);
  const labelSet = useMemo(() => new Set(labelFilter), [labelFilter]);
  const columns = allColumns.filter(
    (c) =>
      (!colFilter.length || filterSet.has(c.key)) &&
      (mode !== "dgr" || !labelFilter.length || labelSet.has(labelForName(c.label).id)),
  );
  const colKeySet = useMemo(() => new Set(columns.map((c) => c.key)), [columns]);
  const filtersActive = colFilter.length > 0 || (mode === "dgr" && labelFilter.length > 0);
  const rowInFilter = (r: Row) =>
    !filtersActive ||
    (mode === "dg" ? r.dgs.some((d) => colKeySet.has(d.clientId)) : r.rets.some((x) => colKeySet.has(x.id)));
  const allDisplayGroups = groups
    .map((g) => ({ group: g.group, rows: g.rows.filter(rowInFilter) }))
    .filter((g) => g.rows.length > 0);
  const displayRows = allDisplayGroups.flatMap((g) => g.rows);

  // Cap rendered rows so a big app (hundreds of applied sections × dozens of
  // columns) can't choke the renderer — narrow with search / the column filter.
  const ROW_CAP = 120;
  const truncated = displayRows.length > ROW_CAP;
  const displayGroups = (() => {
    let budget = ROW_CAP;
    const out: typeof allDisplayGroups = [];
    for (const g of allDisplayGroups) {
      if (budget <= 0) break;
      const rows = g.rows.slice(0, budget);
      budget -= rows.length;
      out.push({ group: g.group, rows });
    }
    return out;
  })();

  // cell value: Brand = # of the client's datagroups using the section (with their
  // ids, to drive the edit); Agency = assigned (0/1).
  const cell = (row: Row, colKey: string): { n: number; ids: string[] } => {
    if (mode === "dg") {
      const ids = row.dgs.filter((d) => d.clientId === colKey).map((d) => d.id);
      return { n: ids.length, ids };
    }
    return row.rets.some((r) => r.id === colKey) ? { n: 1, ids: [colKey] } : { n: 0, ids: [] };
  };

  const totalLinks = displayRows.reduce(
    (n, r) =>
      n +
      (mode === "dg"
        ? r.dgs.filter((d) => columns.some((c) => c.key === d.clientId)).length
        : r.rets.filter((x) => columns.some((c) => c.key === x.id)).length),
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Relationship map</h2>
          <span className="hidden text-sm text-muted-foreground lg:inline">
            which {mode === "dg" ? "clients" : "retailers"} use which sections — click a cell to edit
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
            <SelectTrigger className="h-8 w-52">
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

          {/* Brand (clients) vs Agency (retailers) */}
          <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-xs">
            <Toggle active={mode === "dg"} onClick={() => setMode("dg")}>
              <Building2 className="h-3.5 w-3.5" /> Clients
            </Toggle>
            <Toggle active={mode === "dgr"} onClick={() => setMode("dgr")}>
              <Store className="h-3.5 w-3.5" /> Retailers
            </Toggle>
          </div>

          {/* Matrix vs list */}
          <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-xs">
            <Toggle active={view === "matrix"} onClick={() => setView("matrix")}>
              <LayoutGrid className="h-3.5 w-3.5" /> Matrix
            </Toggle>
            <Toggle active={view === "list"} onClick={() => setView("list")}>
              <List className="h-3.5 w-3.5" /> List
            </Toggle>
          </div>

          {/* Filter columns by client (Brand) or retailer (Agency) */}
          <FilterChip
            label={mode === "dg" ? "Clients" : "Retailers"}
            icon={mode === "dg" ? Building2 : Store}
            options={allColumns.map((c) => c.key)}
            value={colFilter}
            onChange={setColFilter}
            getLabel={(id) => allColumns.find((c) => c.key === id)?.label ?? id}
            searchable
          />
          {/* Agency: also filter the retailer columns by retailer LABEL */}
          {mode === "dgr" && (
            <FilterChip
              label="Label"
              icon={Tags}
              options={retailerLabels.map((l) => l.id)}
              value={labelFilter}
              onChange={setLabelFilter}
              getLabel={(id) => retailerLabels.find((l) => l.id === id)?.name ?? id}
              searchable
            />
          )}

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sections"
            className="h-8 w-48 rounded-md border border-border bg-background px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>{displayRows.length} sections</span>
            <span>
              {columns.length}
              {columns.length !== allColumns.length ? `/${allColumns.length}` : ""} {mode === "dg" ? "clients" : "retailers"}
            </span>
            <span className={mode === "dg" ? "text-emerald-700" : "text-violet-700"}>{totalLinks} links</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
        {!live && (
          <p className="mb-3 rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
            Seeded sample — connect live data for the real assignment map.
          </p>
        )}
        {truncated && !loading && (
          <p className="mb-3 rounded-md bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
            Showing the first {ROW_CAP} of {displayRows.length} sections — narrow with search or the{" "}
            {mode === "dg" ? "Clients" : "Retailers"} filter.
          </p>
        )}
        {live && !loading && !synced.has(mode) && displayRows.length > 0 && (
          <p className="mb-3 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
            {mode === "dg" ? "Client" : "Retailer"} assignments may be incomplete.
            <button onClick={reload} className="font-medium underline hover:no-underline">
              Reload
            </button>
          </p>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading {mode === "dg" ? "client" : "retailer"} assignments…
            <span className="text-xs">Large catalogs can take a moment.</span>
          </div>
        ) : displayRows.length === 0 ? (
          live && !synced.has(mode) ? (
            <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
              Couldn't load {mode === "dg" ? "client" : "retailer"} assignments.
              <button onClick={reload} className="rounded-md border border-border px-3 py-1.5 hover:bg-secondary">
                Reload
              </button>
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              {allRows.length === 0
                ? `No applied sections for ${app?.label} (${mode === "dg" ? "Brand / datagroups" : "Agency / retailers"}).`
                : `No sections match the ${mode === "dg" ? "client" : "retailer"} filter.`}
            </p>
          )
        ) : view === "matrix" ? (
          <table className="border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-20 border-b border-border bg-background px-2 py-1.5 text-left text-xs font-medium text-muted-foreground">
                  Section \ {mode === "dg" ? "Client" : "Retailer"}
                </th>
                {columns.map((c) => (
                  <th key={c.key} className="sticky top-0 z-10 border-b border-border bg-background px-1 py-1.5 align-bottom">
                    <div className="flex flex-col items-center gap-1">
                      {mode === "dgr" && (
                        <span
                          className={cn("h-2 w-2 rounded-full border", LABEL_COLOR_CLASSES[labelForName(c.label).color])}
                          title={labelForName(c.label).name}
                        />
                      )}
                      <div className="mx-auto max-h-44 w-5 overflow-hidden whitespace-nowrap text-[11px] text-foreground/80 [writing-mode:vertical-rl] rotate-180" title={c.label}>
                        {c.label}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayGroups.map(({ group, rows }) => (
                <FragmentRows
                  key={group.id}
                  group={group.label}
                  rows={rows}
                  columns={columns}
                  mode={mode}
                  cell={cell}
                  onEdit={onEdit}
                />
              ))}
            </tbody>
          </table>
        ) : (
          // List view (detailed chips)
          <div className="space-y-5">
            {displayGroups.map(({ group, rows }) => (
              <div key={group.id}>
                <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</div>
                <div className="space-y-2">
                  {rows.map((r) => (
                    <div key={r.section.id} className="rounded-lg border border-border bg-card p-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium">{r.section.label}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{r.section.path}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(mode === "dg"
                          ? r.dgs.filter((d) => !colFilter.length || filterSet.has(d.clientId))
                          : r.rets.filter((x) => !colFilter.length || filterSet.has(x.id))
                        ).map((t) => (
                          <Chip
                            key={t.id}
                            tone={mode === "dg" ? "emerald" : "violet"}
                            onClick={() => onEdit({ sectionId: r.section.id, kind: mode, targetIds: [t.id] })}
                          >
                            {mode === "dg" ? `${clientName((t as Row["dgs"][number]).clientId)} · ${t.name}` : t.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 border-t border-border px-6 py-2 text-center text-[11px] text-muted-foreground">
        Click a filled cell to open that section + {mode === "dg" ? "client's datagroups" : "retailer"} in the Massive update tool{" "}
        <ArrowRight className="inline h-3 w-3" /> edit (insert / remove).
      </div>
    </div>
  );
}

function FragmentRows({
  group,
  rows,
  columns,
  mode,
  cell,
  onEdit,
}: {
  group: string;
  rows: Row[];
  columns: { key: string; label: string }[];
  mode: "dg" | "dgr";
  cell: (row: Row, colKey: string) => { n: number; ids: string[] };
  onEdit: (e: MapEdit) => void;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={columns.length + 1}
          className="sticky left-0 bg-secondary/50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {group}
        </td>
      </tr>
      {rows.map((r) => (
        <tr key={r.section.id} className="hover:bg-secondary/30">
          <td
            className="sticky left-0 z-10 max-w-[240px] truncate bg-background px-2 py-1 font-mono text-[11px] text-foreground/80"
            title={`${r.section.label} — ${r.section.path}`}
          >
            {r.section.path}
          </td>
          {columns.map((c) => {
            const { n, ids } = cell(r, c.key);
            return (
              <td key={c.key} className="px-1 py-1 text-center">
                {n > 0 ? (
                  <button
                    onClick={() => onEdit({ sectionId: r.section.id, kind: mode, targetIds: ids })}
                    title={`${c.label} — ${n} ${mode === "dg" ? "datagroup(s)" : ""} · click to edit`}
                    className={cn(
                      "mx-auto grid h-5 min-w-5 place-items-center rounded px-1 text-[10px] font-semibold transition-transform hover:scale-110",
                      mode === "dgr"
                        ? "bg-violet-500 text-white"
                        : n >= 4
                          ? "bg-emerald-600 text-white"
                          : n >= 2
                            ? "bg-emerald-300 text-emerald-900"
                            : "bg-emerald-100 text-emerald-800",
                    )}
                  >
                    {mode === "dg" ? n : "✓"}
                  </button>
                ) : (
                  <span className="mx-auto block h-1 w-1 rounded-full bg-border" />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded px-2 py-1 transition-colors",
        active ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Chip({ children, tone, onClick }: { children: React.ReactNode; tone: "emerald" | "violet"; onClick: () => void }) {
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
