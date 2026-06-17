import { useEffect, useMemo, useRef, useState } from "react";
import { X, Network, Loader2, Building2, Store, ArrowRight, LayoutGrid, List, Tags, Pencil, Check, Plus, TriangleAlert, ArrowDownUp } from "lucide-react";
import { toast } from "sonner";
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

/** A click on a cell/chip in the map (read mode) → load it into the Massive update tool. */
export type MapEdit = { sectionId: string; kind: "dg" | "dgr"; targetIds: string[] };
/** A live insert/remove of ONE section↔target assignment (Edit mode). */
export type MapWrite = { op: "insert" | "remove"; sectionId: string; targetId: string; kind: "dg" | "dgr" };

type Row = {
  section: { id: string; label: string; path: string };
  dgs: { id: string; name: string; clientId: string }[];
  rets: { id: string; name: string }[];
};

/**
 * "Relationship map" of where each dashboard section is currently APPLIED. Two
 * axes via the Brand/Agency toggle:
 *  - Brand   → matrix of section (rows) × CLIENT (cols); a cell shows how many of
 *              the client's datagroups use the section (datagroup-dashboardsections).
 *  - Agency  → matrix of section (rows) × RETAILER (cols) (retailer-dashboardsections).
 *
 * Read mode: clicking a filled cell/chip opens it in the Massive update tool.
 * Edit mode (toggle): clicking a cell APPLIES the relation live — Agency cells
 * toggle the single retailer↔section assignment; Brand cells open a popover of the
 * client's datagroups, each toggleable. The map never creates new sections — it
 * only inserts/removes the relation within the existing section×target grid.
 */
export function RelationshipMap({
  catalog,
  assigned,
  positions,
  live,
  loading,
  synced,
  retailerLabels,
  loadedEnv,
  onLoad,
  onClose,
  onEdit,
  onWrite,
}: {
  catalog: MuCatalog;
  assigned: Set<string>;
  /** pairKey(sectionId, targetId) → live `position` (Agency: order rows by the first retailer). */
  positions: Map<string, number>;
  live: boolean;
  loading: boolean;
  /** Which axes' assignments are fully loaded ("dg" = brand, "dgr" = agency). */
  synced: Set<"dg" | "dgr">;
  /** Retailer labels — to filter the agency retailer columns by label. */
  retailerLabels: RetailerLabel[];
  /** Environment the on-screen data came from (for the live-write warning). */
  loadedEnv: "prod" | "develop";
  /** Request loading an axis's assignments (heavy → lazy, only the active one). */
  onLoad: (kind: "dg" | "dgr") => void;
  onClose: () => void;
  onEdit: (e: MapEdit) => void;
  /** Apply ONE assignment change live (Edit mode). Resolves to {ok,error}. */
  onWrite: (w: MapWrite) => Promise<{ ok: boolean; error?: string }>;
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

  // --- inline edit state --------------------------------------------------
  const [editMode, setEditMode] = useState(false);
  const [confirmedWrites, setConfirmedWrites] = useState(false); // confirmed once per map session
  const [pending, setPending] = useState<Set<string>>(new Set()); // pairKeys with an in-flight write
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [brandPopover, setBrandPopover] = useState<{ sectionId: string; clientId: string } | null>(null);
  // pairKeys touched during this edit session — their section row + target column
  // stay rendered even at 0 assignments, so a remove → re-add round-trip is stable.
  const [touched, setTouched] = useState<Set<string>>(new Set());

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

  // Section ids / target keys touched this edit session (kept visible at 0 assigns).
  const touchedSecs = useMemo(() => new Set([...touched].map((k) => k.split("::")[0])), [touched]);
  const touchedTargets = useMemo(() => new Set([...touched].map((k) => k.split("::")[1])), [touched]);
  // Brand columns are CLIENTS, so map a touched dataGroupId back to its client.
  const touchedClients = useMemo(() => {
    const s = new Set<string>();
    for (const id of touchedTargets) {
      const dg = catalog.dataGroups.find((d) => d.id === id);
      if (dg) s.add(dg.clientId);
    }
    return s;
  }, [touchedTargets, catalog]);

  // The option set changes with the application + axis → reload (reset) the filter
  // whenever either changes, so stale picks from another app can't linger.
  useEffect(() => {
    setColFilter([]);
    setLabelFilter([]);
    setBrandPopover(null);
    setTouched(new Set());
  }, [appId, mode]);

  // --- live write helpers (Edit mode) -------------------------------------
  const runWrite = async (w: MapWrite) => {
    const k = pairKey(w.sectionId, w.targetId);
    setTouched((t) => new Set(t).add(k)); // keep this row + column visible for re-add
    setPending((p) => new Set(p).add(k));
    const res = await onWrite(w);
    setPending((p) => {
      const n = new Set(p);
      n.delete(k);
      return n;
    });
    const noun = w.kind === "dgr" ? "retailer" : "datagroup";
    if (!res.ok) toast.error(`${w.op === "insert" ? "Add" : "Remove"} failed: ${res.error ?? ""}`);
    else toast.success(`${w.op === "insert" ? "Added to" : "Removed from"} ${noun} (live).`);
  };
  // Gate the FIRST live write of the session behind a PRODUCTION confirmation.
  const gatedWrite = (w: MapWrite) => {
    const k = pairKey(w.sectionId, w.targetId);
    if (pending.has(k)) return; // already writing this cell
    if (confirmedWrites) {
      void runWrite(w);
      return;
    }
    setConfirmAction(() => () => {
      setConfirmedWrites(true);
      void runWrite(w);
    });
  };

  // A click on a matrix cell: read mode → jump to tool; edit mode → toggle live
  // (Agency) or open the datagroup popover (Brand).
  const handleCellClick = (sectionId: string, colKey: string, info: { n: number; ids: string[] }) => {
    if (!editMode) {
      if (info.n > 0) onEdit({ sectionId, kind: mode, targetIds: info.ids });
      return;
    }
    if (mode === "dgr") {
      gatedWrite({ op: info.n > 0 ? "remove" : "insert", sectionId, targetId: colKey, kind: "dgr" });
    } else {
      setBrandPopover({ sectionId, clientId: colKey });
    }
  };

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
          .filter((r) => (mode === "dg" ? r.dgs.length > 0 : r.rets.length > 0) || (editMode && touchedSecs.has(r.section.id)));
        return { group: g, rows };
      })
      .filter((g) => g.rows.length > 0);
  }, [catalog, app, assigned, ql, mode, retailers, editMode, touchedSecs]);

  const allRows = groups.flatMap((g) => g.rows);

  // The full column set for this app + axis (drives the filter chip options).
  const allColumns = useMemo(() => {
    if (mode === "dg") {
      const ids = new Set<string>();
      for (const r of allRows) for (const d of r.dgs) ids.add(d.clientId);
      if (editMode) for (const c of touchedClients) ids.add(c); // keep edited client cols
      return [...ids].map((id) => ({ key: id, label: clientName(id) })).sort((a, b) => a.label.localeCompare(b.label));
    }
    const ids = new Set<string>();
    for (const r of allRows) for (const ret of r.rets) ids.add(ret.id);
    if (editMode) for (const id of touchedTargets) ids.add(id); // keep edited retailer cols
    return retailers
      .filter((r) => ids.has(r.id))
      .map((r) => ({ key: r.id, label: r.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRows, mode, retailers, editMode, touchedClients, touchedTargets]);

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
  // Agency: use the FIRST visible retailer column as the order reference — rows
  // follow that retailer's live section order (by `position`), within each group
  // and across groups (groups ordered by their earliest ref-ranked section).
  const refKey = mode === "dgr" ? columns[0]?.key : undefined;
  const refName = mode === "dgr" ? columns[0]?.label : undefined;
  const refRank = useMemo(() => {
    const m = new Map<string, number>();
    if (!refKey) return m;
    const withPos: { sec: string; pos: number }[] = [];
    for (const r of allRows) {
      const k = pairKey(r.section.id, refKey);
      if (assigned.has(k)) withPos.push({ sec: r.section.id, pos: positions.get(k) ?? 0 });
    }
    withPos.sort((a, b) => a.pos - b.pos);
    withPos.forEach((x, i) => m.set(x.sec, i));
    return m;
  }, [refKey, allRows, assigned, positions]);
  const rankOf = (secId: string) => (refRank.has(secId) ? refRank.get(secId)! : Number.POSITIVE_INFINITY);

  const orderedGroups = groups
    .map((g) => {
      let rows = g.rows.filter(rowInFilter);
      if (refKey) rows = rows.slice().sort((a, b) => rankOf(a.section.id) - rankOf(b.section.id));
      return { group: g.group, rows };
    })
    .filter((g) => g.rows.length > 0);
  const allDisplayGroups = refKey
    ? orderedGroups
        .slice()
        .sort(
          (ga, gb) =>
            Math.min(...ga.rows.map((r) => rankOf(r.section.id))) - Math.min(...gb.rows.map((r) => rankOf(r.section.id))),
        )
    : orderedGroups;
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

  // Out-of-order flags (Agency): walking the rows (ordered by the ref retailer),
  // a non-ref retailer is "out of order" at a section whose position sits below
  // one already shown above it — i.e. that retailer sequences it differently.
  const outOfOrder = (() => {
    const s = new Set<string>();
    if (mode !== "dgr" || !refKey) return s;
    const flat = displayGroups.flatMap((g) => g.rows);
    for (const c of columns) {
      if (c.key === refKey) continue;
      let maxSoFar = -1;
      for (const r of flat) {
        const k = pairKey(r.section.id, c.key);
        if (!assigned.has(k)) continue;
        const p = positions.get(k) ?? 0;
        if (p < maxSoFar) s.add(k);
        maxSoFar = Math.max(maxSoFar, p);
      }
    }
    return s;
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
            which {mode === "dg" ? "clients" : "retailers"} use which sections
            {editMode ? " — click a cell to insert / remove live" : " — click a cell to edit"}
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

          {/* Edit toggle — only meaningful with live data + the matrix view */}
          {live && view === "matrix" && (
            <button
              type="button"
              onClick={() => {
                if (editMode) setTouched(new Set()); // turning off → forget kept-visible cells
                setEditMode((v) => !v);
              }}
              className={cn(
                "flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                editMode
                  ? loadedEnv === "prod"
                    ? "border-rose-300 bg-rose-50 text-rose-700"
                    : "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              title="Toggle inline editing — clicking a cell inserts/removes the assignment live"
            >
              <Pencil className="h-3.5 w-3.5" /> {editMode ? "Editing" : "Edit"}
            </button>
          )}

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
        {editMode && (
          <p
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs",
              loadedEnv === "prod" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700",
            )}
          >
            <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
            Edit mode — every click writes to <strong>{loadedEnv.toUpperCase()}</strong> live.{" "}
            {mode === "dg"
              ? "Click a Clients cell to pick which datagroups get the section."
              : "Click a cell to add/remove the retailer. To wire up a retailer or section not shown in this grid, use the main Massive update tool."}
          </p>
        )}
        {mode === "dgr" && refKey && view === "matrix" && (
          <p className="flex flex-wrap items-center gap-1.5 rounded-md bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground">
            <ArrowDownUp className="h-3.5 w-3.5 shrink-0" />
            Rows ordered by <strong className="text-foreground">{refName}</strong> (first column).
            <TriangleAlert className="ml-1 h-3.5 w-3.5 shrink-0 text-amber-500" />
            marks a section another retailer keeps in a different order.
          </p>
        )}
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
                  editMode={editMode}
                  pending={pending}
                  outOfOrder={outOfOrder}
                  onCell={handleCellClick}
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
        {editMode ? (
          <>
            Clicking a cell inserts / removes the relation live (existing sections only — no new sections).
            {mode === "dg" ? " Clients cells open a datagroup picker." : ""}
          </>
        ) : (
          <>
            Click a filled cell to open that section + {mode === "dg" ? "client's datagroups" : "retailer"} in the Massive update tool{" "}
            <ArrowRight className="inline h-3 w-3" /> edit — or use <strong>Edit</strong> to insert/remove here.
          </>
        )}
      </div>

      {/* Brand datagroup popover (Edit mode, Clients axis) */}
      {brandPopover &&
        (() => {
          const sec = catalog.sections.find((s) => s.id === brandPopover.sectionId);
          // The client's BRAND datagroups (for new inserts) PLUS any datagroup
          // already assigned to this section (so a legacy/non-BRAND assignment the
          // cell counted is still removable — the cell count and list never diverge).
          const dgs = catalog.dataGroups.filter(
            (d) =>
              d.clientId === brandPopover.clientId &&
              (d.dashboardType === "BRAND" || assigned.has(pairKey(brandPopover.sectionId, d.id))),
          );
          return (
            <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" onClick={() => setBrandPopover(null)}>
              <div
                className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <Building2 className="h-4 w-4 text-primary" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{clientName(brandPopover.clientId)}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{sec?.label} · datagroups</div>
                  </div>
                  <button onClick={() => setBrandPopover(null)} className="ml-auto rounded-md border border-border px-2 py-1 hover:bg-secondary">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="border-b border-border px-4 py-2 text-[11px] text-muted-foreground">
                  Toggle a datagroup to insert / remove this section (writes to {loadedEnv.toUpperCase()} live).
                </p>
                <div className="min-h-0 flex-1 overflow-y-auto p-2">
                  {dgs.map((d) => {
                    const k = pairKey(brandPopover.sectionId, d.id);
                    const on = assigned.has(k);
                    const busy = pending.has(k);
                    return (
                      <button
                        key={d.id}
                        disabled={busy}
                        onClick={() => gatedWrite({ op: on ? "remove" : "insert", sectionId: brandPopover.sectionId, targetId: d.id, kind: "dg" })}
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary/60 disabled:opacity-60"
                      >
                        <span
                          className={cn(
                            "grid h-4 w-4 shrink-0 place-items-center rounded border",
                            on ? "border-emerald-600 bg-emerald-600 text-white" : "border-border",
                          )}
                        >
                          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : on ? <Check className="h-3 w-3" /> : null}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{d.name}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{d.country}</span>
                      </button>
                    );
                  })}
                  {!dgs.length && (
                    <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                      No BRAND datagroups for this client.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      {/* First-write PRODUCTION confirmation */}
      {confirmAction && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" onClick={() => setConfirmAction(null)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <TriangleAlert className={cn("h-5 w-5", loadedEnv === "prod" ? "text-rose-500" : "text-amber-500")} />
              <h3 className="text-base font-semibold">Write to {loadedEnv.toUpperCase()} live?</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Editing in the map applies to{" "}
              <strong className={loadedEnv === "prod" ? "text-rose-600" : "text-amber-600"}>
                {loadedEnv === "prod" ? "PRODUCTION" : "develop"}
              </strong>{" "}
              immediately — each click inserts or removes a real dashboard-section assignment. You won't be asked again while the map is open.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const fn = confirmAction;
                  setConfirmAction(null);
                  fn();
                }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-white",
                  loadedEnv === "prod" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700",
                )}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FragmentRows({
  group,
  rows,
  columns,
  mode,
  cell,
  editMode,
  pending,
  outOfOrder,
  onCell,
}: {
  group: string;
  rows: Row[];
  columns: { key: string; label: string }[];
  mode: "dg" | "dgr";
  cell: (row: Row, colKey: string) => { n: number; ids: string[] };
  editMode: boolean;
  pending: Set<string>;
  outOfOrder: Set<string>;
  onCell: (sectionId: string, colKey: string, info: { n: number; ids: string[] }) => void;
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
            const info = cell(r, c.key);
            const { n } = info;
            const busy = pending.has(pairKey(r.section.id, c.key));
            const filled = n > 0;
            const oo = mode === "dgr" && filled && outOfOrder.has(pairKey(r.section.id, c.key));
            // Edit mode: every cell is clickable (filled → remove/edit, empty → add).
            // Read mode: only filled cells are clickable (→ open in tool).
            if (!editMode && !filled) {
              return (
                <td key={c.key} className="px-1 py-1 text-center">
                  <span className="mx-auto block h-1 w-1 rounded-full bg-border" />
                </td>
              );
            }
            return (
              <td key={c.key} className="px-1 py-1 text-center">
                <button
                  disabled={busy}
                  onClick={() => onCell(r.section.id, c.key, info)}
                  title={
                    editMode
                      ? filled
                        ? mode === "dg"
                          ? `${c.label} — ${n} datagroup(s) · click to edit`
                          : `${c.label} · click to remove`
                        : `${c.label} · click to add`
                      : `${c.label} — ${n} ${mode === "dg" ? "datagroup(s)" : ""} · click to edit`
                  }
                  className={cn(
                    "mx-auto grid h-5 min-w-5 place-items-center rounded px-1 text-[10px] font-semibold transition-transform hover:scale-110 disabled:opacity-60",
                    filled
                      ? mode === "dgr"
                        ? oo
                          ? "bg-amber-500 text-white ring-2 ring-amber-300"
                          : "bg-violet-500 text-white"
                        : n >= 4
                          ? "bg-emerald-600 text-white"
                          : n >= 2
                            ? "bg-emerald-300 text-emerald-900"
                            : "bg-emerald-100 text-emerald-800"
                      : "border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {busy ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : filled ? (
                    mode === "dg" ? n : oo ? <TriangleAlert className="h-3 w-3" /> : "✓"
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </button>
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
