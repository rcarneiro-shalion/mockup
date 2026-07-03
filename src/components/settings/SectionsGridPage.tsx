import { useEffect, useMemo, useRef, useState } from "react";
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
import { buildQueryMatch } from "@/lib/textMatch";
import {
  ArrowLeft,
  Search,
  X,
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
  Braces,
  Pencil,
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
  appShort: string;
  groupId: string;
  groupLabel: string;
  section: DashSection;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Math.random()).slice(2, 10);

/** Short app code for prefixing group-filter items — the slug (MSM, RMM, DSM…),
 *  falling back to the label's initials. Keeps the group name readable. */
const appShort = (a: { slug?: string; label: string }) =>
  (a.slug?.trim() || a.label.split(/\s+/).filter(Boolean).map((w) => w[0]).join("")).toUpperCase();

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

/** Raw jsonb → canonical JSON string ("" when the column is null/absent). */
function toJsonString(raw: unknown): string {
  if (raw == null) return "";
  if (typeof raw === "string") return raw;
  try {
    return JSON.stringify(raw);
  } catch {
    return String(raw);
  }
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
  const rawLt = (s.labelTranslation ?? s.label_translation) as unknown;
  const labelTranslation: Record<string, string> =
    rawLt && typeof rawLt === "object" && !Array.isArray(rawLt)
      ? Object.fromEntries(Object.entries(rawLt as Record<string, unknown>).map(([k, v]) => [k, str(v)]))
      : {};
  return {
    id: str(s.id),
    path: str(s.path),
    label: str(s.label),
    type: str(s.type) === "CUSTOM" ? "CUSTOM" : "BUILT_IN",
    definition: toDefinition(s.definition),
    sectionConfig: toJsonString(s.sectionConfig ?? s.section_config),
    labelTranslation,
    tabs,
    createdAt: str(s.createdAt),
    updatedAt: str(s.updatedAt),
  };
}

/** definition var-list → the raw jsonb object string ({"key":"value",…}). */
function definitionJson(defs: DashDefinitionVar[]): string {
  return defs.length ? JSON.stringify(Object.fromEntries(defs.filter((d) => d.key).map((d) => [d.key, d.value]))) : "";
}
const LOCALE_FLAG: Record<string, string> = { es: "🇪🇸", pt: "🇧🇷", en: "🇺🇸", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹" };

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
  // Keep EVERY application (even ones with no groups/sections yet) so the live
  // dashboard-application list is complete; empty apps just contribute no rows.
  return apps.map((a) => ({
    id: a.id,
    label: a.label,
    slug: a.slug,
    groups: [...groupById.values()].filter((e) => e.appSlug === a.slug).map((e) => e.group),
    createdAt: "",
    updatedAt: "",
  }));
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

// ---- jsonb filters (definition / section_config) ---------------------------
// "Intelligent" contains / not-contains filters over the two jsonb columns: find
// the dashboard_section rows where a specific value IS (or is NOT) present.
type JsonbFilter = { mode: "contains" | "not"; q: string };
const EMPTY_JSONB_FILTER: JsonbFilter = { mode: "contains", q: "" };

/** Searchable text for the `definition` jsonb: key:value pairs + the raw JSON. */
const definitionHay = (s: DashSection) => {
  const pairs = s.definition.map((v) => `${v.key}:${v.value}`).join(" ");
  return `${pairs} ${JSON.stringify(Object.fromEntries(s.definition.map((v) => [v.key, v.value])))}`;
};

function JsonbFilterChip({
  column,
  value,
  onChange,
}: {
  column: string;
  value: JsonbFilter;
  onChange: (v: JsonbFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = value.q.trim() !== "";
  return (
    <span className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-sm",
          active
            ? "border-[var(--sidebar-active-fg)]/40 bg-primary/5 font-medium text-foreground"
            : "border-border text-muted-foreground hover:text-foreground",
        )}
        title={`Filter rows by the ${column} jsonb`}
      >
        <Braces className="h-3.5 w-3.5" />
        <span className="font-mono text-xs">{column}</span>
        {active && (
          <span className="max-w-[160px] truncate text-xs text-muted-foreground">
            {value.mode === "contains" ? "has" : "not"} “{value.q}”
          </span>
        )}
        {active && (
          <X
            className="h-3 w-3 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onChange(EMPTY_JSONB_FILTER);
            }}
          />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-9 z-50 w-72 rounded-md border border-border bg-card p-3 shadow-md">
            <p className="mb-2 text-xs text-muted-foreground">
              Show sections where <span className="font-mono text-foreground/80">{column}</span>…
            </p>
            <div className="mb-2 flex items-center gap-1 rounded-md border border-border bg-secondary/40 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onChange({ ...value, mode: "contains" })}
                className={cn("flex-1 rounded px-2 py-1", value.mode === "contains" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                contains the value
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...value, mode: "not" })}
                className={cn("flex-1 rounded px-2 py-1", value.mode === "not" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                does NOT contain
              </button>
            </div>
            <input
              autoFocus
              value={value.q}
              onChange={(e) => onChange({ ...value, q: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && setOpen(false)}
              placeholder={`value to look for — % = wildcard`}
              className="h-8 w-full rounded-md border border-border bg-background px-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Matches keys and values inside the jsonb, case-insensitive. “does NOT contain” also matches rows with an empty {column}.
            </p>
          </div>
        </>
      )}
    </span>
  );
}

/** Borderless, full-cell input — the Excel-style editable cell. */
function Cell({
  value,
  onChange,
  placeholder,
  mono,
  grow,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  /** Size the input to its content so the full value (e.g. the path) stays visible. */
  grow?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size={grow ? Math.max(24, value.length + 2) : undefined}
      className={cn(
        "rounded bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:bg-primary/5 focus:ring-1 focus:ring-inset focus:ring-ring",
        grow ? "min-w-[240px]" : "w-full",
        mono && "font-mono text-xs",
      )}
    />
  );
}

const th = "whitespace-nowrap border-b border-border px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";
const cellTd = "border-b border-border/70 align-middle";

/** Compact, read-only preview of a raw jsonb value; click opens the detail modal. */
function JsonbCell({ value, onOpen }: { value: string; onOpen: () => void }) {
  return (
    <td className={cn(cellTd, "max-w-[240px] bg-primary/[0.02] px-2")}>
      {value ? (
        <button
          type="button"
          onClick={onOpen}
          title={value}
          className="block max-w-full truncate text-left font-mono text-xs text-foreground/70 hover:text-[var(--sidebar-active-fg)] hover:underline"
        >
          {value}
        </button>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </td>
  );
}

/** Pretty-print a raw JSON string for the detail modal; passthrough if unparseable. */
function prettyJson(raw: string): string {
  if (!raw) return "";
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

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
  // jsonb filters: contains / not-contains a value inside definition / section_config.
  const [fDef, setFDef] = useState<JsonbFilter>(EMPTY_JSONB_FILTER);
  const [fCfg, setFCfg] = useState<JsonbFilter>(EMPTY_JSONB_FILTER);

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
  const [confirmDelete, setConfirmDelete] = useState<FlatRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Read-only "view all" modal — the row's fields parsed from the jsonb columns
  // (mirrors the real dashboard-section detail page).
  const [editRow, setEditRow] = useState<FlatRow | null>(null);

  // Flatten the app → group → section tree into editable rows.
  const allRows: FlatRow[] = useMemo(() => {
    const out: FlatRow[] = [];
    for (const a of apps)
      for (const g of a.groups)
        for (const s of g.sections)
          out.push({ appId: a.id, appLabel: a.label, appShort: appShort(a), groupId: g.id, groupLabel: g.label, section: s });
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
      for (const g of a.groups) seen.set(g.id, single ? g.label : `${appShort(a)} · ${g.label}`);
    }
    return [...seen.entries()];
  }, [apps, fApps]);

  const matchQuery = useMemo(() => buildQueryMatch(query), [query]);
  const matchDef = useMemo(() => buildQueryMatch(fDef.q), [fDef.q]);
  const matchCfg = useMemo(() => buildQueryMatch(fCfg.q), [fCfg.q]);
  // contains → keep on hit; not-contains → keep on miss (incl. rows with an empty jsonb).
  const jsonbPass = (f: JsonbFilter, match: (hay: string) => boolean, hay: string) =>
    !f.q.trim() || (f.mode === "contains") === match(hay);
  const rows = allRows.filter(
    (r) =>
      (!fApps.length || fApps.includes(r.appId)) &&
      (!fGroups.length || fGroups.includes(r.groupId)) &&
      matchQuery(`${r.section.label} ${r.section.path}`) &&
      jsonbPass(fDef, matchDef, definitionHay(r.section)) &&
      jsonbPass(fCfg, matchCfg, r.section.sectionConfig ?? ""),
  );

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
    const pages = Math.min(Math.ceil((first.total ?? rows.length) / 100), 60);
    for (let p = 1; p < pages; p++) {
      const r = await get(p);
      if (r.ok && Array.isArray(r.data)) rows = rows.concat(r.data as Record<string, unknown>[]);
    }
    return { ok: true, rows };
  };

  const connectLive = async (env: "prod" | "develop"): Promise<boolean> => {
    const saved = getDevTokens();
    const a = (draftA || token || saved.token).trim();
    const i = (draftI || idToken || saved.idToken).trim();
    if (a && a !== token) setToken(a);
    if (i && i !== idToken) setIdToken(i);
    if (!a || !i) {
      setShowConnect(true);
      toast.error("Both an access token and an id token are required.");
      return false;
    }
    setConnecting(true);
    try {
      const [appsRes, groupsRes, sectionsRes] = await Promise.all([
        fetchLive({ data: { service: "visualization", env, path: "/v1.0/admin/dashboardapplications", token: a, idToken: i } }),
        fetchAllPages("/v1.0/admin/dashboardgroups", env, a, i),
        fetchAllPages("/v1.0/admin/dashboardsections", env, a, i),
      ]);
      if (!appsRes.ok) {
        toast.error(appsRes.error || `Couldn't load dashboard applications from ${env}.`);
        return false;
      }
      const mapped = toDashApps(appsRes.data, groupsRes.rows, sectionsRes.rows);
      if (!mapped.length) {
        toast.error(`No dashboard applications returned from ${env} (check the token / env).`);
        return false;
      }
      const groupCount = mapped.reduce((n, app) => n + app.groups.length, 0);
      const sectionCount = mapped.reduce((n, app) => n + app.groups.reduce((m, g) => m + g.sections.length, 0), 0);
      setLiveApps(mapped);
      setLoadedEnv(env);
      setDirty(new Set());
      setShowConnect(false);
      // Surface what actually came back so partial loads are visible (not silent).
      const msg = `Live (${env}): ${mapped.length} apps · ${groupCount} groups · ${sectionCount} sections.`;
      const partial = [!groupsRes.ok && "groups", !sectionsRes.ok && "sections"].filter(Boolean);
      if (partial.length) toast.warning(`${msg} Partial — ${partial.join(" & ")} failed to load; reconnect to retry.`);
      else toast.success(msg);
      return true;
    } catch (e) {
      toast.error(`Couldn't connect to ${env}: ${(e as Error).message}`);
      return false;
    } finally {
      setConnecting(false);
    }
  };

  // Switch env (Dev ↔ Prod) and reconnect to it. Failures drop back to local +
  // open the connect panel, so the toggle never silently shows the wrong env.
  const onEnvChange = (next: "prod" | "develop") => {
    if (next === liveEnv && live) return;
    setLiveEnv(next);
    const saved = getDevTokens();
    const haveTokens = !!((token || saved.token) && (idToken || saved.idToken));
    if (!live && !haveTokens) {
      setShowConnect(true);
      return;
    }
    void connectLive(next).then((ok) => {
      if (ok) return;
      setLiveApps(null);
      setShowConnect(true);
      toast.error(
        next === "develop"
          ? "Couldn't connect to develop — it's a separate environment needing a develop token + VPN (a prod token won't work there)."
          : "Couldn't connect to production — paste a fresh token.",
      );
    });
  };

  // Auto-connect on open when tokens are already saved (top-bar 🔑), so live data
  // loads without a manual connect — same as Massive update.
  const autoTried = useRef(false);
  useEffect(() => {
    if (autoTried.current) return;
    autoTried.current = true;
    const { token: t, idToken: i } = getDevTokens();
    if (t && i) void connectLive(liveEnv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnect = () => {
    setLiveApps(null);
    setDirty(new Set());
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

  // --- delete a section row (live DELETE or local removal) -------------------
  const removeSectionFromState = (appId: string, groupId: string, sectionId: string) => {
    setApps((prev) =>
      prev.map((a) =>
        a.id !== appId
          ? a
          : { ...a, groups: a.groups.map((g) => (g.id !== groupId ? g : { ...g, sections: g.sections.filter((s) => s.id !== sectionId) })) },
      ),
    );
    setDirty((prev) => {
      if (!prev.has(sectionId)) return prev;
      const n = new Set(prev);
      n.delete(sectionId);
      return n;
    });
  };

  const deleteSection = async (row: FlatRow) => {
    setConfirmDelete(null);
    backup(row.section, "Before delete"); // safety snapshot — restorable from history
    if (!live) {
      removeSectionFromState(row.appId, row.groupId, row.section.id);
      toast.success(`Deleted "${row.section.label || row.section.path}" (local mockup) — a backup is in the version history.`);
      return;
    }
    const saved = getDevTokens();
    setDeletingId(row.section.id);
    try {
      const res = await mutateLive({
        data: {
          service: "visualization",
          env: loadedEnv,
          method: "DELETE",
          path: `/v1.0/admin/dashboardsections/${row.section.id}`,
          token: (token || saved.token) || undefined,
          idToken: (idToken || saved.idToken) || undefined,
        },
      });
      if (res.ok) {
        removeSectionFromState(row.appId, row.groupId, row.section.id);
        toast.success(`Deleted "${row.section.label || row.section.path}" from ${loadedEnv.toUpperCase()} — a backup snapshot is in the version history.`);
      } else {
        toast.error(res.error || `Delete failed (${res.status}).`);
      }
    } catch (e) {
      toast.error(`Delete failed: ${(e as Error).message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const colCount = 5 + 3 + 1; // fixed(App/Group/Path/Label/Type) + 3 jsonb + Actions
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
              Edit Path, Label and Type inline; the <strong>definition</strong>, <strong>section_config</strong> and{" "}
              <strong>label_translation</strong> jsonb show raw — open <strong>Edit</strong> for the full parsed view. Every row
              keeps a <strong>version history</strong> — back up &amp; restore from the <History className="inline h-3.5 w-3.5" /> menu.
            </p>
          </div>
          {/* Live connect controls */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-xs" title="Environment for live load + save">
              <button
                type="button"
                onClick={() => onEnvChange("develop")}
                className={cn("flex items-center gap-1 rounded px-2 py-1", liveEnv === "develop" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <FlaskConical className="h-3.5 w-3.5" /> Dev
              </button>
              <button
                type="button"
                onClick={() => onEnvChange("prod")}
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
              placeholder="Search by name or path — % = wildcard"
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
          <JsonbFilterChip column="definition" value={fDef} onChange={setFDef} />
          <JsonbFilterChip column="section_config" value={fCfg} onChange={setFCfg} />
          {(fApps.length > 0 || fGroups.length > 0 || query || fDef.q || fCfg.q) && (
            <button
              type="button"
              onClick={() => {
                setFApps([]);
                setFGroups([]);
                setQuery("");
                setFDef(EMPTY_JSONB_FILTER);
                setFCfg(EMPTY_JSONB_FILTER);
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
                  <th className={th}>Application</th>
                  <th className={th}>Group</th>
                  <th className={th}>Path</th>
                  <th className={th}>Label</th>
                  <th className={th}>Type</th>
                  {/* Raw jsonb columns — full parsed view is in the Edit modal. */}
                  <th className={cn(th, "bg-primary/5")}>
                    <span className="font-mono normal-case tracking-normal text-foreground/70">definition</span>
                  </th>
                  <th className={cn(th, "bg-primary/5")}>
                    <span className="font-mono normal-case tracking-normal text-foreground/70">section_config</span>
                  </th>
                  <th className={cn(th, "bg-primary/5")}>
                    <span className="font-mono normal-case tracking-normal text-foreground/70">label_translation</span>
                  </th>
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
                  const isDirty = dirty.has(r.section.id);
                  const vCount = versions[r.section.id]?.length ?? 0;
                  const defStr = definitionJson(r.section.definition);
                  const ltStr =
                    r.section.labelTranslation && Object.keys(r.section.labelTranslation).length
                      ? JSON.stringify(r.section.labelTranslation)
                      : "";
                  return (
                    <tr key={r.section.id} className={cn("hover:bg-secondary/30", isDirty && "bg-amber-50/60")}>
                      <td className={cn(cellTd, "whitespace-nowrap px-2 font-medium text-foreground/70")} title={r.appLabel}>{r.appShort}</td>
                      <td className={cn(cellTd, "whitespace-nowrap px-2 text-foreground/70")}>{r.groupLabel}</td>
                      <td className={cellTd}>
                        <Cell value={r.section.path} onChange={(v) => patchSection(r.appId, r.groupId, r.section.id, { path: v })} mono grow />
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
                      {/* Raw jsonb previews — click Edit for the full parsed view. */}
                      <JsonbCell value={defStr} onOpen={() => setEditRow(r)} />
                      <JsonbCell value={r.section.sectionConfig ?? ""} onOpen={() => setEditRow(r)} />
                      <JsonbCell value={ltStr} onOpen={() => setEditRow(r)} />
                      <td className={cn(cellTd, "whitespace-nowrap px-2")}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setEditRow(r)}
                            title="View / edit all fields"
                            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground/80 hover:bg-secondary"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
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
                          <button
                            type="button"
                            disabled={deletingId === r.section.id}
                            onClick={() => setConfirmDelete(r)}
                            title={live ? `Delete this section from ${loadedEnv.toUpperCase()}` : "Delete this section (local)"}
                            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                          >
                            {deletingId === r.section.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
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

      {/* Section detail — all fields parsed from the jsonb columns (mirrors the
          real dashboard-section detail page). Read-only viewer. */}
      <Dialog open={editRow !== null} onOpenChange={(v) => !v && setEditRow(null)}>
        <DialogContent className="max-h-[88vh] w-[min(760px,94vw)] max-w-none overflow-auto">
          {editRow && (() => {
            const s = editRow.section;
            const lt = Object.entries(s.labelTranslation ?? {});
            const cfg = prettyJson(s.sectionConfig ?? "");
            return (
              <div className="space-y-5">
                <div>
                  <DialogTitle className="text-lg font-semibold tracking-tight">{s.label || s.path}</DialogTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {editRow.appLabel} › {editRow.groupLabel}
                    <span className="ml-2 rounded-full bg-secondary px-1.5 py-0.5 font-mono">{s.id}</span>
                  </p>
                </div>

                {/* Base fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Detail label="Path"><span className="font-mono text-sm">{s.path || "—"}</span></Detail>
                  <Detail label="Type">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                      {s.type === "CUSTOM" ? "Custom" : "Built in"}
                    </span>
                  </Detail>
                  <Detail label="Label" className="sm:col-span-2">
                    <span className="inline-flex items-center gap-1.5">{LOCALE_FLAG.en} {s.label || "—"}</span>
                  </Detail>
                </div>

                {/* label_translation */}
                <Section title="label_translation" count={lt.length}>
                  {lt.length === 0 ? (
                    <Empty>No translations.</Empty>
                  ) : (
                    <div className="space-y-1.5">
                      {lt.map(([loc, val]) => (
                        <div key={loc} className="flex items-center gap-2 text-sm">
                          <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">{LOCALE_FLAG[loc] ?? ""} {loc}</span>
                          <span className="text-foreground/90">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>

                {/* definition */}
                <Section title="definition" count={s.definition.length}>
                  {s.definition.length === 0 ? (
                    <Empty>No definition variables.</Empty>
                  ) : (
                    <div className="overflow-hidden rounded-md border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/50 text-left text-xs text-muted-foreground">
                          <tr><th className="px-3 py-1.5 font-medium">Key</th><th className="px-3 py-1.5 font-medium">Value</th></tr>
                        </thead>
                        <tbody>
                          {s.definition.map((v) => (
                            <tr key={v.key} className="border-t border-border">
                              <td className="px-3 py-1.5 font-mono text-xs text-foreground/80">{v.key}</td>
                              <td className="px-3 py-1.5 font-mono text-xs text-foreground/70">
                                <span className="block max-w-[420px] truncate" title={v.value}>{v.value}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Section>

                {/* section_config raw jsonb */}
                <Section title="section_config">
                  {cfg ? (
                    <pre className="max-h-56 overflow-auto rounded-md border border-border bg-secondary/30 p-3 font-mono text-xs text-foreground/80">{cfg}</pre>
                  ) : (
                    <Empty>No section_config.</Empty>
                  )}
                </Section>

                {/* Section tabs (parsed) */}
                <Section title="Section tabs" count={s.tabs.length}>
                  {s.tabs.length === 0 ? (
                    <Empty>No tabs.</Empty>
                  ) : (
                    <div className="overflow-auto rounded-md border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/50 text-left text-xs text-muted-foreground">
                          <tr>
                            <th className="px-3 py-1.5 font-medium">Label</th>
                            <th className="px-3 py-1.5 font-medium">Slug</th>
                            <th className="px-3 py-1.5 font-medium">Description</th>
                            <th className="px-3 py-1.5 font-medium">Dashboard Id</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.tabs.map((t) => (
                            <tr key={t.id} className="border-t border-border">
                              <td className="whitespace-nowrap px-3 py-1.5 text-foreground/90">{t.label || "—"}</td>
                              <td className="whitespace-nowrap px-3 py-1.5 font-mono text-xs text-foreground/70">{t.slug || "—"}</td>
                              <td className="px-3 py-1.5 text-foreground/70"><span className="block max-w-[220px] truncate" title={t.description}>{t.description || "—"}</span></td>
                              <td className="whitespace-nowrap px-3 py-1.5 font-mono text-xs text-foreground/70">{t.dashboardId || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Section>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={confirmDelete !== null} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete section{live ? ` from ${loadedEnv.toUpperCase()}` : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {live ? (
                <>
                  This <strong>DELETEs</strong> the dashboard_section row{" "}
                  <strong>{confirmDelete?.section.label || confirmDelete?.section.path}</strong> on the live{" "}
                  <strong>{loadedEnv}</strong> environment. A version is snapshotted first (restorable content, but the
                  row itself must be re-created by hand).
                  {loadedEnv === "prod" && (
                    <span className="mt-2 block font-medium text-rose-700">
                      This is PRODUCTION — the section disappears from the real client dashboard.
                    </span>
                  )}
                </>
              ) : (
                <>
                  This removes <strong>{confirmDelete?.section.label || confirmDelete?.section.path}</strong> from the
                  local mockup data. A version is snapshotted first.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && void deleteSection(confirmDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete{live ? ` from ${loadedEnv}` : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

// ---- detail-modal presentational helpers -----------------------------------
function Detail({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}
function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="font-mono text-xs font-semibold text-foreground/80">{title}</span>
        {count !== undefined && (
          <span className="rounded-full bg-secondary px-1.5 text-[11px] text-muted-foreground">{count}</span>
        )}
      </div>
      {children}
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed border-border px-3 py-3 text-center text-xs text-muted-foreground">{children}</p>;
}
