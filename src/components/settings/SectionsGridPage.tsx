import { Fragment, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { FilterChip } from "@/components/seeds/FilterChip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { fetchLive, mutateLive } from "@/lib/api/live.functions";
import { getDevTokens } from "@/lib/devTokens";
import {
  ArrowLeft,
  Search,
  Plus,
  X,
  ChevronRight,
  Layers,
  Building2,
  Sheet,
  History,
  RotateCcw,
  Save,
  PlugZap,
  Loader2,
  Rocket,
  FlaskConical,
  Check,
  Trash2,
} from "lucide-react";
import {
  DASHBOARD_APPS_KEY,
  INITIAL_DASHBOARD_APPS,
  nowStamp,
  type DashboardApp,
  type DashGroup,
  type DashSection,
  type DashDefinitionVar,
  type DashTab,
} from "@/lib/dashboardApps";
import {
  SECTION_VERSIONS_KEY,
  pushVersion,
  removeVersion,
  type SectionVersion,
  type SectionVersionMap,
} from "@/lib/dashboardSectionVersions";

type FlatRow = {
  appId: string;
  appLabel: string;
  groupId: string;
  groupLabel: string;
  section: DashSection;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Math.random()).slice(2, 10);

// ---- live → editor mapping (best-effort; real API field names may vary) ----
const str = (v: unknown) => (v == null ? "" : String(v));
const pickArr = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? (v as Record<string, unknown>[]) : Array.isArray((v as { data?: unknown })?.data) ? ((v as { data: Record<string, unknown>[] }).data) : [];

function toDefinition(raw: unknown): DashDefinitionVar[] {
  if (Array.isArray(raw)) return raw.map((d) => ({ key: str((d as { key?: unknown }).key), value: str((d as { value?: unknown }).value) })).filter((d) => d.key);
  if (raw && typeof raw === "object")
    return Object.entries(raw as Record<string, unknown>).map(([k, v]) => ({ key: k, value: typeof v === "string" ? v : JSON.stringify(v) }));
  if (typeof raw === "string") {
    try {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") return toDefinition(o);
    } catch { /* not json — ignore */ }
  }
  return [];
}

function toDashSection(s: Record<string, unknown>): DashSection {
  const rawTabs = (s.dashboardSectionTabs ?? s.tabs ?? []) as unknown;
  const tabs: DashTab[] = pickArr(rawTabs).map((t) => ({
    id: str(t.id) || `tab-${newId()}`,
    label: str(t.label),
    slug: str(t.slug),
    description: str(t.description),
    dashboardId: str(t.dashboardId ?? t.dashboard_id),
    lookerId: str(t.lookerId ?? t.looker_id),
    filterSet: str(t.filterSet ?? t.filter_set),
    panels: [],
  }));
  return {
    id: str(s.id),
    path: str(s.path),
    label: str(s.label),
    type: str(s.type) === "CUSTOM" ? "CUSTOM" : "BUILT_IN",
    definition: toDefinition(s.definition),
    tabs,
    createdAt: str(s.createdAt),
    updatedAt: str(s.updatedAt),
  };
}

/** Assemble live app/group/section rows into the editor's nested shape. */
function toDashApps(appsJson: unknown, groupRows: Record<string, unknown>[], sectionRows: Record<string, unknown>[]): DashboardApp[] {
  const apps = pickArr(appsJson).map((a) => ({ id: str(a.id), label: str(a.label), slug: str(a.slug) }));
  const groupById = new Map<string, { appSlug: string; group: DashGroup }>();
  for (const g of groupRows) {
    const app = (g.dashboardApplication ?? {}) as Record<string, unknown>;
    groupById.set(str(g.id), {
      appSlug: str(app.slug),
      group: { id: str(g.id), label: str(g.label), icon: str(g.icon), sections: [], createdAt: str(g.createdAt), updatedAt: str(g.updatedAt) },
    });
  }
  for (const s of sectionRows) {
    const grp = (s.dashboardGroup ?? {}) as Record<string, unknown>;
    const entry = groupById.get(str(grp.id));
    if (entry) entry.group.sections.push(toDashSection(s));
  }
  return apps
    .map((a) => ({
      id: a.id,
      label: a.label,
      slug: a.slug,
      groups: [...groupById.values()].filter((e) => e.appSlug === a.slug).map((e) => e.group),
      createdAt: "",
      updatedAt: "",
    }))
    .filter((a) => a.groups.length > 0);
}

/** DashSection → PATCH body (definition back to a jsonb object). Tabs are NOT
 *  pushed (separate endpoint/shape) — only section-level content. */
function toApiBody(s: DashSection) {
  return {
    path: s.path,
    label: s.label,
    type: s.type,
    definition: Object.fromEntries(s.definition.filter((v) => v.key).map((v) => [v.key, v.value])),
  };
}

/** Borderless, full-cell input — the Excel-style editable cell. */
function Cell({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:bg-primary/5 focus:ring-1 focus:ring-inset focus:ring-ring",
        mono && "font-mono text-xs",
      )}
    />
  );
}

const th = "whitespace-nowrap border-b border-border px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";
const cellTd = "border-b border-border/70 align-middle";

export function SectionsGridPage() {
  // --- data source: local (mockup) persisted vs live working copy -----------
  const [localApps, setLocalApps] = usePersistentState<DashboardApp[]>(DASHBOARD_APPS_KEY, INITIAL_DASHBOARD_APPS);
  const [liveApps, setLiveApps] = useState<DashboardApp[] | null>(null);
  const live = liveApps !== null;
  const apps = live ? (liveApps as DashboardApp[]) : localApps;

  // Mark a section as having unsaved live edits.
  const markDirty = (id: string) => setDirty((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  const setApps = (updater: DashboardApp[] | ((prev: DashboardApp[]) => DashboardApp[])) => {
    const apply = (prev: DashboardApp[]) => (typeof updater === "function" ? (updater as (p: DashboardApp[]) => DashboardApp[])(prev) : updater);
    if (live) setLiveApps((prev) => apply(prev ?? []));
    else setLocalApps((prev) => apply(prev));
  };

  // --- version history (per section) ----------------------------------------
  const [versions, setVersions] = usePersistentState<SectionVersionMap>(SECTION_VERSIONS_KEY, {});
  const backup = (section: DashSection, source: string) =>
    setVersions((prev) => pushVersion(prev, section, source, live ? loadedEnv : "local"));

  // --- filters / columns / expansion ----------------------------------------
  const [fApps, setFApps] = useState<string[]>([]);
  const [fGroups, setFGroups] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [extraCols, setExtraCols] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingCol, setAddingCol] = useState(false);
  const [newCol, setNewCol] = useState("");

  // --- live connect ----------------------------------------------------------
  const [token, setToken] = usePersistentState<string>("shalion:devToken", "");
  const [idToken, setIdToken] = usePersistentState<string>("shalion:devIdToken", "");
  const [liveEnv, setLiveEnv] = usePersistentState<"prod" | "develop">("mu:env", "prod");
  const [loadedEnv, setLoadedEnv] = useState<"prod" | "develop">("prod");
  const [connecting, setConnecting] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [draftA, setDraftA] = useState("");
  const [draftI, setDraftI] = useState("");
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);

  // --- dialogs ---------------------------------------------------------------
  const [historyForId, setHistoryForId] = useState<string | null>(null);
  const [confirmSave, setConfirmSave] = useState<FlatRow | null>(null);

  // Flatten the app → group → section tree into editable rows.
  const allRows: FlatRow[] = useMemo(() => {
    const out: FlatRow[] = [];
    for (const a of apps)
      for (const g of a.groups)
        for (const s of g.sections)
          out.push({ appId: a.id, appLabel: a.label, groupId: g.id, groupLabel: g.label, section: s });
    return out;
  }, [apps]);

  // The Group filter cascades off the Application filter: it lists every group of
  // the selected application(s) — including empty ones — and nothing until an
  // application is chosen. With a single app the app prefix is dropped (it's the
  // context); with several, groups are prefixed to disambiguate.
  const groupOptions = useMemo(() => {
    if (!fApps.length) return [] as [string, string][];
    const single = fApps.length === 1;
    const seen = new Map<string, string>();
    for (const a of apps) {
      if (!fApps.includes(a.id)) continue;
      for (const g of a.groups) seen.set(g.id, single ? g.label : `${a.label} · ${g.label}`);
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

  const defKeys = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) for (const v of r.section.definition) if (v.key) set.add(v.key);
    for (const k of extraCols) if (k) set.add(k);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [rows, extraCols]);

  // --- patch helpers ---------------------------------------------------------
  const patchSection = (appId: string, groupId: string, sectionId: string, patch: Partial<DashSection>) => {
    if (live) markDirty(sectionId);
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
                      sections: g.sections.map((s) => (s.id === sectionId ? { ...s, ...patch, updatedAt: nowStamp() } : s)),
                    },
              ),
            },
      ),
    );
  };

  const getVar = (s: DashSection, key: string) => s.definition.find((v) => v.key === key)?.value ?? "";
  const setVar = (r: FlatRow, key: string, value: string) => {
    const def = r.section.definition;
    const idx = def.findIndex((v) => v.key === key);
    let next: DashDefinitionVar[];
    if (value === "") next = idx >= 0 ? def.filter((_, i) => i !== idx) : def;
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
    setApps((prev) =>
      prev.map((a) => ({
        ...a,
        groups: a.groups.map((g) => ({
          ...g,
          sections: g.sections.map((s) => {
            if (live && s.definition.some((v) => v.key === key)) markDirty(s.id);
            return { ...s, definition: s.definition.filter((v) => v.key !== key) };
          }),
        })),
      })),
    );
    setExtraCols((prev) => prev.filter((k) => k !== key));
    toast.success(`Removed field "${key}" from all sections`);
  };

  // --- tabs ------------------------------------------------------------------
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

  // --- version history actions ----------------------------------------------
  const restoreVersion = (sectionId: string, v: SectionVersion) => {
    const row = allRows.find((r) => r.section.id === sectionId);
    if (!row) return;
    backup(row.section, "Before restore"); // make the restore itself reversible
    patchSection(row.appId, row.groupId, sectionId, {
      path: v.section.path,
      label: v.section.label,
      type: v.section.type,
      definition: v.section.definition,
      tabs: v.section.tabs,
    });
    toast.success(live ? "Restored — review, then Save to push live" : "Section restored from backup");
  };

  // --- live connect ----------------------------------------------------------
  const fetchAllPages = async (base: string, env: "prod" | "develop", a: string, i: string) => {
    const get = (page: number) =>
      fetchLive({ data: { service: "visualization", env, path: `${base}?page=${page}&size=100`, token: a, idToken: i } });
    const first = await get(0);
    if (!first.ok) return { ok: false, rows: [] as Record<string, unknown>[], error: first.error };
    let rows = (Array.isArray(first.data) ? first.data : []) as Record<string, unknown>[];
    const pages = Math.min(Math.ceil((first.total ?? rows.length) / 100), 30);
    for (let p = 1; p < pages; p++) {
      const r = await get(p);
      if (r.ok && Array.isArray(r.data)) rows = rows.concat(r.data as Record<string, unknown>[]);
    }
    return { ok: true, rows };
  };

  const connectLive = async (env: "prod" | "develop") => {
    const saved = getDevTokens();
    const a = (draftA || token || saved.token).trim();
    const i = (draftI || idToken || saved.idToken).trim();
    if (a && a !== token) setToken(a);
    if (i && i !== idToken) setIdToken(i);
    if (!a || !i) {
      setShowConnect(true);
      toast.error("Both an access token and an id token are required.");
      return;
    }
    setConnecting(true);
    try {
      const [appsRes, groupsRes, sectionsRes] = await Promise.all([
        fetchLive({ data: { service: "visualization", env, path: "/v1.0/admin/dashboardapplications", token: a, idToken: i } }),
        fetchAllPages("/v1.0/admin/dashboardgroups", env, a, i),
        fetchAllPages("/v1.0/admin/dashboardsections", env, a, i),
      ]);
      if (!sectionsRes.ok) {
        toast.error(sectionsRes.error || "Couldn't load sections.");
        setShowConnect(true);
        return;
      }
      const mapped = toDashApps(appsRes.ok ? appsRes.data : [], groupsRes.rows, sectionsRes.rows);
      if (!mapped.length) {
        toast.error("No dashboard sections returned (check the token / env).");
        return;
      }
      const total = mapped.reduce((n, app) => n + app.groups.reduce((m, g) => m + g.sections.length, 0), 0);
      setLiveApps(mapped);
      setLoadedEnv(env);
      setDirty(new Set());
      setExpanded(new Set());
      setShowConnect(false);
      toast.success(`Live (${env}): ${mapped.length} apps · ${total} sections loaded.`);
    } catch (e) {
      toast.error(`Couldn't connect: ${(e as Error).message}`);
      setShowConnect(true);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setLiveApps(null);
    setDirty(new Set());
    setExpanded(new Set());
  };

  // --- save a single section to live (PATCH) ---------------------------------
  const saveSectionLive = async (row: FlatRow) => {
    setConfirmSave(null);
    const saved = getDevTokens();
    const tok = token || saved.token;
    const idt = idToken || saved.idToken;
    backup(row.section, "Before save"); // safety snapshot — always, before any write
    setSavingId(row.section.id);
    try {
      const res = await mutateLive({
        data: {
          service: "visualization",
          env: loadedEnv,
          method: "PATCH",
          path: `/v1.0/admin/dashboardsections/${row.section.id}`,
          body: toApiBody(row.section),
          token: tok || undefined,
          idToken: idt || undefined,
        },
      });
      if (res.ok) {
        setDirty((prev) => {
          const n = new Set(prev);
          n.delete(row.section.id);
          return n;
        });
        toast.success(`Saved "${row.section.label || row.section.path}" to ${loadedEnv.toUpperCase()}.`);
      } else {
        toast.error(res.error || `Save failed (${res.status}).`);
      }
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    } finally {
      setSavingId(null);
    }
  };

  const colCount = 1 + 5 + defKeys.length + 2; // expander + fixed(5) + dyn + Tabs + Actions
  const historyRow = historyForId ? allRows.find((r) => r.section.id === historyForId) : null;
  const historyList = historyForId ? versions[historyForId] ?? [] : [];

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
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
              Edit section parameters inline. Definition (jsonb) becomes columns; expand a row to edit tabs. Every row
              keeps a <strong>version history</strong> — back up &amp; restore from the <History className="inline h-3.5 w-3.5" /> menu.
            </p>
          </div>
          {/* Live connect controls */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-xs" title="Environment for live load + save">
              <button
                type="button"
                onClick={() => setLiveEnv("develop")}
                className={cn("flex items-center gap-1 rounded px-2 py-1", liveEnv === "develop" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <FlaskConical className="h-3.5 w-3.5" /> Dev
              </button>
              <button
                type="button"
                onClick={() => setLiveEnv("prod")}
                className={cn("flex items-center gap-1 rounded px-2 py-1", liveEnv === "prod" ? "bg-rose-600 font-medium text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <Rocket className="h-3.5 w-3.5" /> Prod
              </button>
            </div>
            {live ? (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={disconnect}>
                <PlugZap className="h-4 w-4 text-emerald-600" /> Live ({loadedEnv}) · disconnect
              </Button>
            ) : connecting ? (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" disabled>
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setShowConnect((s) => !s)}>
                <PlugZap className="h-4 w-4" /> Connect live
              </Button>
            )}
          </div>
        </div>

        {/* Live connect panel */}
        {showConnect && !live && (
          <div className="mx-6 mt-3 rounded-lg border border-border bg-card p-3 shadow-sm">
            <p className="mb-2 text-xs text-muted-foreground">
              Load the <strong>real dashboard sections</strong> from the Visualization API ({liveEnv}) via the server proxy.
              Editing then targets live; each <strong>Save</strong> PATCHes that section (a version is snapshotted first).
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="password"
                value={draftA}
                onChange={(e) => setDraftA(e.target.value)}
                placeholder="Authorization bearer token"
                className="h-8 min-w-[220px] flex-1 rounded-md border border-border bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                type="password"
                value={draftI}
                onChange={(e) => setDraftI(e.target.value)}
                placeholder="x-id-token"
                className="h-8 min-w-[220px] flex-1 rounded-md border border-border bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="sm" className="h-8" onClick={() => void connectLive(liveEnv)} disabled={connecting}>
                {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-4">
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
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
              setFGroups([]);
            }}
            getLabel={(id) => apps.find((a) => a.id === id)?.label ?? id}
            searchable
          />
          {fApps.length === 0 ? (
            <span
              title="Filter an application first to choose its groups"
              className="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 text-sm text-muted-foreground/60"
            >
              <Layers className="h-3.5 w-3.5" /> Group
            </span>
          ) : (
            <FilterChip
              label="Group"
              icon={Layers}
              options={groupOptions.map(([id]) => id)}
              value={fGroups}
              onChange={setFGroups}
              getLabel={(id) => groupOptions.find(([gid]) => gid === id)?.[1] ?? id}
              searchable
            />
          )}
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
                className="h-8 w-32 rounded-md border border-border bg-background px-2 font-mono text-xs lowercase focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="sm" variant="outline" className="h-8" onClick={addColumn}>
                Add
              </Button>
            </span>
          ) : (
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setAddingCol(true)}>
              <Plus className="h-3.5 w-3.5" /> Add field
            </Button>
          )}
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
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            {live && dirty.size > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">{dirty.size} unsaved</span>
            )}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-medium",
                !live ? "bg-secondary text-muted-foreground" : loadedEnv === "prod" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800",
              )}
            >
              {live ? `LIVE (${loadedEnv})` : "Local · mockup"}
            </span>
            <span>
              {rows.length} section{rows.length === 1 ? "" : "s"}
            </span>
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
                  <th className={th}>Tabs</th>
                  <th className={cn(th, "text-right")}>Actions</th>
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
                  const isDirty = dirty.has(r.section.id);
                  const vCount = versions[r.section.id]?.length ?? 0;
                  return (
                    <Fragment key={r.section.id}>
                      <tr className={cn("hover:bg-secondary/30", isDirty && "bg-amber-50/60")}>
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
                          <Cell value={r.section.path} onChange={(v) => patchSection(r.appId, r.groupId, r.section.id, { path: v })} mono />
                        </td>
                        <td className={cn(cellTd, "min-w-[140px]")}>
                          <Cell value={r.section.label} onChange={(v) => patchSection(r.appId, r.groupId, r.section.id, { label: v })} />
                        </td>
                        <td className={cn(cellTd, "min-w-[110px]")}>
                          <select
                            value={r.section.type}
                            onChange={(e) => patchSection(r.appId, r.groupId, r.section.id, { type: e.target.value as DashSection["type"] })}
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
                        <td className={cn(cellTd, "whitespace-nowrap px-2")}>
                          <div className="flex items-center justify-end gap-1">
                            {live && (
                              <button
                                type="button"
                                disabled={!isDirty || savingId === r.section.id}
                                onClick={() => setConfirmSave(r)}
                                title={isDirty ? `Save to ${loadedEnv.toUpperCase()}` : "No unsaved changes"}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
                                  isDirty
                                    ? loadedEnv === "prod"
                                      ? "bg-rose-600 text-white hover:bg-rose-700"
                                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "cursor-not-allowed text-muted-foreground/50",
                                )}
                              >
                                {savingId === r.section.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                Save
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                backup(r.section, "Manual backup");
                                toast.success("Backup created");
                              }}
                              title="Back up this section's current state"
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setHistoryForId(r.section.id)}
                              title="Version history"
                              className="relative rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                            >
                              <History className="h-4 w-4" />
                              {vCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-[var(--sidebar-active-fg)] px-0.5 text-[9px] font-semibold text-white">
                                  {vCount}
                                </span>
                              )}
                            </button>
                          </div>
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

      {/* Version history drawer */}
      <Dialog open={historyForId !== null} onOpenChange={(v) => !v && setHistoryForId(null)}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="flex items-center gap-2">
            <History className="h-4 w-4" /> Version history
          </DialogTitle>
          {historyRow && (
            <p className="-mt-1 text-sm text-muted-foreground">
              {historyRow.section.label || historyRow.section.path}
            </p>
          )}
          <div className="mt-2 max-h-[55vh] space-y-2 overflow-auto">
            {historyList.length === 0 && (
              <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                No versions yet. Use the backup button on the row, or a Save snapshots one automatically.
              </p>
            )}
            {historyList.map((v) => (
              <div key={v.id} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{v.source}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        v.env === "prod" ? "bg-rose-100 text-rose-800" : v.env === "develop" ? "bg-emerald-100 text-emerald-800" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {v.env}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {v.savedAt} · {v.section.definition.length} var{v.section.definition.length === 1 ? "" : "s"} · {v.section.tabs.length} tab
                    {v.section.tabs.length === 1 ? "" : "s"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    restoreVersion(v.section.id, v);
                    setHistoryForId(null);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-secondary"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Restore
                </button>
                <button
                  type="button"
                  onClick={() => setVersions((prev) => removeVersion(prev, v.section.id, v.id))}
                  className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                  aria-label="Delete version"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save-to-live confirm */}
      <AlertDialog open={confirmSave !== null} onOpenChange={(v) => !v && setConfirmSave(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Save to {loadedEnv.toUpperCase()}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This PATCHes <strong>{confirmSave?.section.label || confirmSave?.section.path}</strong> on the live{" "}
              <strong>{loadedEnv}</strong> environment (path, label, type and definition). A version is snapshotted first,
              so you can restore it from the history.
              {loadedEnv === "prod" && (
                <span className="mt-2 block font-medium text-rose-700">This is PRODUCTION — it affects the real client dashboard.</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmSave && void saveSectionLive(confirmSave)}
              className={cn(loadedEnv === "prod" && "bg-rose-600 hover:bg-rose-700")}
            >
              <Check className="mr-1.5 h-4 w-4" /> Save to {loadedEnv}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
