import { Fragment, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { FilterChip } from "@/components/seeds/FilterChip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Search, Plus, X, ChevronRight, Layers, Building2, Sheet } from "lucide-react";
import {
  DASHBOARD_APPS_KEY,
  INITIAL_DASHBOARD_APPS,
  nowStamp,
  type DashboardApp,
  type DashSection,
  type DashDefinitionVar,
  type DashTab,
} from "@/lib/dashboardApps";

type FlatRow = {
  appId: string;
  appLabel: string;
  groupId: string;
  groupLabel: string;
  section: DashSection;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Math.random()).slice(2, 10);

/** Borderless, full-cell input — the Excel-style editable cell. */
function Cell({
  value,
  onChange,
  placeholder,
  mono,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:bg-primary/5 focus:ring-1 focus:ring-inset focus:ring-ring",
        mono && "font-mono text-xs",
        className,
      )}
    />
  );
}

const th = "whitespace-nowrap border-b border-border px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";
const cellTd = "border-b border-border/70 align-middle";

export function SectionsGridPage() {
  const [apps, setApps] = usePersistentState<DashboardApp[]>(DASHBOARD_APPS_KEY, INITIAL_DASHBOARD_APPS);
  const [fApps, setFApps] = useState<string[]>([]);
  const [fGroups, setFGroups] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [extraCols, setExtraCols] = useState<string[]>([]); // user-added definition keys
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingCol, setAddingCol] = useState(false);
  const [newCol, setNewCol] = useState("");

  // Flatten the app → group → section tree into editable rows.
  const allRows: FlatRow[] = useMemo(() => {
    const out: FlatRow[] = [];
    for (const a of apps)
      for (const g of a.groups)
        for (const s of g.sections)
          out.push({ appId: a.id, appLabel: a.label, groupId: g.id, groupLabel: g.label, section: s });
    return out;
  }, [apps]);

  // Group filter options, scoped to the selected application(s).
  const groupOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of apps) {
      if (fApps.length && !fApps.includes(a.id)) continue;
      for (const g of a.groups) seen.set(g.id, `${a.label} · ${g.label}`);
    }
    return [...seen.entries()];
  }, [apps, fApps]);

  const q = query.trim().toLowerCase();
  const rows = allRows.filter(
    (r) =>
      (!fApps.length || fApps.includes(r.appId)) &&
      (!fGroups.length || fGroups.includes(r.groupId)) &&
      (!q || `${r.section.label} ${r.section.path}`.toLowerCase().includes(q)),
  );

  // Dynamic definition columns = union of every key across the filtered rows,
  // plus any column the user added explicitly.
  const defKeys = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) for (const v of r.section.definition) if (v.key) set.add(v.key);
    for (const k of extraCols) if (k) set.add(k);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [rows, extraCols]);

  // --- patch helpers (write back into the nested apps tree) ---
  const patchSection = (appId: string, groupId: string, sectionId: string, patch: Partial<DashSection>) =>
    setApps((prev) =>
      prev.map((a) =>
        a.id !== appId
          ? a
          : {
              ...a,
              updatedAt: nowStamp(),
              groups: a.groups.map((g) =>
                g.id !== groupId
                  ? g
                  : {
                      ...g,
                      updatedAt: nowStamp(),
                      sections: g.sections.map((s) =>
                        s.id === sectionId ? { ...s, ...patch, updatedAt: nowStamp() } : s,
                      ),
                    },
              ),
            },
      ),
    );

  const getVar = (s: DashSection, key: string) => s.definition.find((v) => v.key === key)?.value ?? "";
  const setVar = (r: FlatRow, key: string, value: string) => {
    const def = r.section.definition;
    const idx = def.findIndex((v) => v.key === key);
    let next: DashDefinitionVar[];
    if (value === "") next = idx >= 0 ? def.filter((_, i) => i !== idx) : def; // clearing drops the var
    else if (idx >= 0) next = def.map((v, i) => (i === idx ? { ...v, value } : v));
    else next = [...def, { key, value }];
    patchSection(r.appId, r.groupId, r.section.id, { definition: next });
  };

  const addColumn = () => {
    const k = newCol.trim();
    setNewCol("");
    setAddingCol(false);
    if (!k) return;
    setExtraCols((prev) => [...new Set([...prev, k])]);
  };
  const removeColumn = (key: string) => {
    // Drop the key from every section's definition + from the user-added set.
    setApps((prev) =>
      prev.map((a) => ({
        ...a,
        groups: a.groups.map((g) => ({
          ...g,
          sections: g.sections.map((s) => ({ ...s, definition: s.definition.filter((v) => v.key !== key) })),
        })),
      })),
    );
    setExtraCols((prev) => prev.filter((k) => k !== key));
    toast.success(`Removed field "${key}" from all sections`);
  };

  // --- tabs (per-section) ---
  const setTabs = (r: FlatRow, tabs: DashTab[]) => patchSection(r.appId, r.groupId, r.section.id, { tabs });
  const patchTab = (r: FlatRow, tabId: string, patch: Partial<DashTab>) =>
    setTabs(r, r.section.tabs.map((t) => (t.id === tabId ? { ...t, ...patch } : t)));
  const addTab = (r: FlatRow) =>
    setTabs(r, [
      ...r.section.tabs,
      { id: `tab-${newId()}`, label: "", slug: "", description: "", dashboardId: "", lookerId: "", filterSet: "", panels: [] },
    ]);
  const removeTab = (r: FlatRow, tabId: string) => setTabs(r, r.section.tabs.filter((t) => t.id !== tabId));

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  // Fixed columns + dynamic ones; +1 expander, +1 tabs count.
  const colCount = 1 + 5 + defKeys.length + 1;

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
            <Sheet className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard sections — bulk edit</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit every section's parameters inline, spreadsheet-style. Definition variables (jsonb) become columns;
            expand a row to edit its tabs. Changes save automatically.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
          <div className="relative min-w-[260px] flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sections by name or path"
              className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <FilterChip
            label="Application"
            icon={Building2}
            options={apps.map((a) => a.id)}
            value={fApps}
            onChange={(v) => {
              setFApps(v);
              setFGroups([]); // groups are app-scoped — reset when the app set changes
            }}
            getLabel={(id) => apps.find((a) => a.id === id)?.label ?? id}
            searchable
          />
          <FilterChip
            label="Group"
            icon={Layers}
            options={groupOptions.map(([id]) => id)}
            value={fGroups}
            onChange={setFGroups}
            getLabel={(id) => groupOptions.find(([gid]) => gid === id)?.[1] ?? id}
            searchable
          />
          {(fApps.length > 0 || fGroups.length > 0 || query) && (
            <button
              type="button"
              onClick={() => {
                setFApps([]);
                setFGroups([]);
                setQuery("");
              }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {rows.length} section{rows.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Grid */}
        <div className="min-h-0 flex-1 overflow-auto px-6 pb-6">
          <div className="inline-block min-w-full overflow-hidden rounded-lg border border-border align-top">
            <table className="border-collapse text-sm">
              <thead className="bg-secondary/60">
                <tr>
                  <th className={cn(th, "w-8")} />
                  <th className={th}>Application</th>
                  <th className={th}>Group</th>
                  <th className={th}>Path</th>
                  <th className={th}>Label</th>
                  <th className={th}>Type</th>
                  {defKeys.map((k) => (
                    <th key={k} className={cn(th, "bg-primary/5")}>
                      <span className="inline-flex items-center gap-1">
                        <span className="font-mono normal-case tracking-normal text-foreground/70">{k}</span>
                        <button
                          type="button"
                          onClick={() => removeColumn(k)}
                          title={`Remove field "${k}" from all sections`}
                          className="rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    </th>
                  ))}
                  <th className={cn(th, "w-px")}>
                    {addingCol ? (
                      <span className="inline-flex items-center gap-1">
                        <input
                          autoFocus
                          value={newCol}
                          onChange={(e) => setNewCol(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addColumn();
                            if (e.key === "Escape") {
                              setAddingCol(false);
                              setNewCol("");
                            }
                          }}
                          placeholder="field key"
                          className="h-7 w-28 rounded border border-border bg-background px-2 font-mono text-xs lowercase tracking-normal focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        <button onClick={addColumn} className="rounded p-1 text-emerald-600 hover:bg-secondary" title="Add field">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddingCol(true)}
                        className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium normal-case tracking-normal text-[var(--sidebar-active-fg)] hover:bg-secondary"
                      >
                        <Plus className="h-3.5 w-3.5" /> Field
                      </button>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={colCount} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No sections match the filters.
                    </td>
                  </tr>
                )}
                {rows.map((r) => {
                  const open = expanded.has(r.section.id);
                  return (
                    <Fragment key={r.section.id}>
                      <tr className="hover:bg-secondary/30">
                        <td className={cn(cellTd, "px-1 text-center")}>
                          <button
                            type="button"
                            onClick={() => toggleExpand(r.section.id)}
                            title={open ? "Collapse tabs" : "Expand tabs"}
                            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-90")} />
                          </button>
                        </td>
                        <td className={cn(cellTd, "whitespace-nowrap px-2 text-foreground/70")}>{r.appLabel}</td>
                        <td className={cn(cellTd, "whitespace-nowrap px-2 text-foreground/70")}>{r.groupLabel}</td>
                        <td className={cn(cellTd, "min-w-[220px]")}>
                          <Cell
                            value={r.section.path}
                            onChange={(v) => patchSection(r.appId, r.groupId, r.section.id, { path: v })}
                            mono
                          />
                        </td>
                        <td className={cn(cellTd, "min-w-[140px]")}>
                          <Cell
                            value={r.section.label}
                            onChange={(v) => patchSection(r.appId, r.groupId, r.section.id, { label: v })}
                          />
                        </td>
                        <td className={cn(cellTd, "min-w-[110px]")}>
                          <select
                            value={r.section.type}
                            onChange={(e) =>
                              patchSection(r.appId, r.groupId, r.section.id, {
                                type: e.target.value as DashSection["type"],
                              })
                            }
                            className="w-full cursor-pointer rounded bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-primary/5 focus:ring-1 focus:ring-inset focus:ring-ring"
                          >
                            <option value="BUILT_IN">Built in</option>
                            <option value="CUSTOM">Custom</option>
                          </select>
                        </td>
                        {defKeys.map((k) => (
                          <td key={k} className={cn(cellTd, "min-w-[160px] bg-primary/[0.02]")}>
                            <Cell value={getVar(r.section, k)} onChange={(v) => setVar(r, k, v)} placeholder="—" mono />
                          </td>
                        ))}
                        <td className={cn(cellTd, "whitespace-nowrap px-2 text-center")}>
                          <button
                            type="button"
                            onClick={() => toggleExpand(r.section.id)}
                            className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground hover:bg-secondary/70"
                          >
                            {r.section.tabs.length} tab{r.section.tabs.length === 1 ? "" : "s"}
                          </button>
                        </td>
                      </tr>
                      {open && (
                        <tr>
                          <td />
                          <td colSpan={colCount - 1} className="border-b border-border bg-secondary/20 p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-semibold text-foreground">
                                Tabs — <span className="text-muted-foreground">{r.section.label || r.section.path}</span>
                              </span>
                              <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => addTab(r)}>
                                <Plus className="h-3.5 w-3.5" /> Add tab
                              </Button>
                            </div>
                            <div className="overflow-hidden rounded-md border border-border bg-card">
                              <table className="w-full border-collapse text-sm">
                                <thead className="bg-secondary/50">
                                  <tr>
                                    <th className={th}>Label</th>
                                    <th className={th}>Slug</th>
                                    <th className={th}>Description</th>
                                    <th className={th}>Dashboard Id</th>
                                    <th className={th}>Looker Id</th>
                                    <th className={th}>Filter Set</th>
                                    <th className={cn(th, "w-8")} />
                                  </tr>
                                </thead>
                                <tbody>
                                  {r.section.tabs.length === 0 && (
                                    <tr>
                                      <td colSpan={7} className="px-3 py-3 text-center text-xs text-muted-foreground">
                                        No tabs — add one.
                                      </td>
                                    </tr>
                                  )}
                                  {r.section.tabs.map((t) => (
                                    <tr key={t.id} className="hover:bg-secondary/30">
                                      <td className={cn(cellTd, "min-w-[130px]")}>
                                        <Cell value={t.label} onChange={(v) => patchTab(r, t.id, { label: v })} />
                                      </td>
                                      <td className={cn(cellTd, "min-w-[120px]")}>
                                        <Cell value={t.slug} onChange={(v) => patchTab(r, t.id, { slug: v })} mono />
                                      </td>
                                      <td className={cn(cellTd, "min-w-[160px]")}>
                                        <Cell value={t.description} onChange={(v) => patchTab(r, t.id, { description: v })} />
                                      </td>
                                      <td className={cn(cellTd, "min-w-[230px]")}>
                                        <Cell value={t.dashboardId} onChange={(v) => patchTab(r, t.id, { dashboardId: v })} mono />
                                      </td>
                                      <td className={cn(cellTd, "min-w-[120px]")}>
                                        <Cell value={t.lookerId} onChange={(v) => patchTab(r, t.id, { lookerId: v })} mono />
                                      </td>
                                      <td className={cn(cellTd, "min-w-[110px]")}>
                                        <Cell value={t.filterSet} onChange={(v) => patchTab(r, t.id, { filterSet: v })} />
                                      </td>
                                      <td className={cn(cellTd, "px-1 text-center")}>
                                        <button
                                          type="button"
                                          onClick={() => removeTab(r, t.id)}
                                          className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                                          aria-label={`Delete tab ${t.label}`}
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
