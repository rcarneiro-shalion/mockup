import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePersistentState } from "@/hooks/usePersistentState";
import { fetchLive, mutateLive, fetchAssignments } from "@/lib/api/live.functions";
import { getDevTokens } from "@/lib/devTokens";
import {
  MU_SEED,
  mapLiveDataGroups,
  mapLiveApps,
  mapLiveGroups,
  mapLiveSections,
  pairKey,
  type MuCatalog,
  type MuSection,
} from "@/lib/massiveUpdate";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Check,
  Plus,
  Minus,
  Play,
  Loader2,
  PlugZap,
  X,
  TriangleAlert,
  Building2,
  Layers,
  FlaskConical,
  Rocket,
  RefreshCw,
  Network,
  Tags,
  Info,
  Sheet,
  ListOrdered,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FilterChip } from "@/components/seeds/FilterChip";
import { buildQueryMatch } from "@/lib/textMatch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RelationshipMap, type MapEdit } from "./RelationshipMap";
import { RetailerLabelsModal } from "./RetailerLabelsModal";
import {
  LABEL_COLOR_CLASSES,
  SEED_RETAILER_LABELS,
  labelForRetailer,
  type RetailerLabel,
} from "@/lib/retailerLabels";

type CellState = "assigned" | "add" | "remove" | "none";

/** All dashboard-group ids that belong to an application (matched by its slug). */
function groupIdsForApp(catalog: MuCatalog, appId: string): string[] {
  const slug = catalog.apps.find((a) => a.id === appId)?.slug;
  return catalog.groups.filter((g) => g.appSlug === slug).map((g) => g.id);
}

type LiveEnvName = "prod" | "develop" | "staging";
type PagedResult = { ok: boolean; complete: boolean; error?: string; rows: unknown[] };

/**
 * Build the read/paginate helpers bound to a given environment + token pair.
 * Shared by connect (catalog), the brand-assignment sync, and apply, so they all
 * target the SAME env. Admin lists are paged at 100/row and ignore size/filter,
 * so pages are pulled sequentially (one retry each) and concatenated.
 */
function makeLiveCtx(env: LiveEnvName, token: string, idToken: string, service = "visualization") {
  const opts = (path: string) => ({
    data: { service, env, path, token: token || undefined, idToken: idToken || undefined },
  });
  const fetchPage = async (pathBase: string, page: number) => {
    const o = opts(`${pathBase}?page=${page}&size=100`);
    let r = await fetchLive(o);
    if (!r.ok) r = await fetchLive(o);
    return r;
  };
  // concurrency: how many pages to fetch at once. 1 = sequential (gentle, used for
  // the catalog). The big assignment lists (~33 + ~16 pages) pass a higher value so
  // the relationship map doesn't take a minute of one-page-at-a-time requests.
  const fetchAllPages = async (pathBase: string, concurrency = 1): Promise<PagedResult> => {
    const first = await fetchPage(pathBase, 0);
    if (!first.ok)
      return { ok: false, complete: false, error: first.error ?? `Request failed (${first.status}).`, rows: [] };
    let rows = Array.isArray(first.data) ? (first.data as unknown[]) : [];
    const pages = Math.min(Math.ceil((first.total ?? rows.length) / 100), 60);
    let complete = true;
    const rest = Array.from({ length: Math.max(0, pages - 1) }, (_, i) => i + 1);
    for (let i = 0; i < rest.length; i += concurrency) {
      const batch = rest.slice(i, i + concurrency);
      const results = await Promise.all(batch.map((p) => fetchPage(pathBase, p)));
      for (const r of results) {
        if (r.ok && Array.isArray(r.data)) rows = rows.concat(r.data as unknown[]);
        else complete = false;
      }
    }
    return { ok: true, complete, rows };
  };
  return { opts, fetchAllPages };
}

const BRAND_EP = "/v1.0/admin/datagroup-dashboardsections";
// Agency section assignments are keyed by RETAILER (retailer-dashboardsections),
// not datagroup. The agency datagroup only scopes which retailers are available.
const AGENCY_EP = "/v1.0/admin/retailer-dashboardsections";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// The retailer master list is ~1k; cap rendered rows for responsiveness (Select
// all / search / Label filter still operate on the full filtered set).
const RETAILER_RENDER_CAP = 250;

export function MassiveUpdatePage() {
  const [catalog, setCatalog] = useState<MuCatalog>(MU_SEED);
  const [liveOn, setLiveOn] = useState(false);

  const [appId, setAppId] = useState<string>("app-dsm");
  // Group ids of the selected app — auto-filled to ALL of the app's groups on select.
  const [groupSel, setGroupSel] = useState<string[]>(() => groupIdsForApp(MU_SEED, "app-dsm"));
  const [sectionQ, setSectionQ] = useState("");
  const [clientQ, setClientQ] = useState("");
  const [retailerQ, setRetailerQ] = useState(""); // retailer search (agency mode list)
  const [selLabels, setSelLabels] = useState<string[]>([]); // retailer-label ids to filter the agency list
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);
  // User-defined retailer labels (classification by section kind) — persisted.
  const [retailerLabels, setRetailerLabels] = usePersistentState<RetailerLabel[]>(
    // v4: full groups_of_retailers.xlsx classification (col D, 84 classified) —
    // STANDARD is its own 54-retailer label and everything not in the sheet
    // defaults to NON-CLASSIFIED. Bumped from v3 to FORCE a re-seed and restore
    // the classification for any browser whose stored copy got emptied/cleared.
    "mu:retailer-labels:v4",
    SEED_RETAILER_LABELS,
  );
  const [selClients, setSelClients] = useState<string[]>([]); // client ids; empty = all
  // Target: send the section to a datagroup (Brand) or a datagroup + retailer (Agency).
  const [target, setTarget] = useState<"dg" | "dgr">("dg");
  const [selRetailers, setSelRetailers] = useState<string[]>([]); // retailer ids (dgr mode)

  const [selSections, setSelSections] = useState<Set<string>>(new Set());
  const [selDgs, setSelDgs] = useState<Set<string>>(new Set());
  const [assigned, setAssigned] = useState<Set<string>>(new Set(MU_SEED.assignments));
  const [staged, setStaged] = useState<Map<string, "insert" | "remove">>(new Map());
  const [applying, setApplying] = useState(false);

  // Selected environment (toggle) vs the env the currently-loaded data actually
  // came from. Writes + the "Live (…)" label use loadedEnv, so they can never
  // target a different env than the data on screen (even if a switch failed).
  const [liveEnv, setLiveEnv] = usePersistentState<"prod" | "develop">("mu:env", "prod");
  const [loadedEnv, setLoadedEnv] = useState<"prod" | "develop">("prod");
  // pairKey(section, colKey) -> existing assignment record id (needed to DELETE).
  const [recordIds, setRecordIds] = useState<Map<string, string>>(new Map());
  // colKey (dataGroupId | retailerId) -> highest `position` currently used by that
  // target. The (colKey, position) pair is UNIQUE upstream, so new inserts must use
  // a free position — we append at max+1 (and bump on a 409 position conflict).
  const [colMaxPos, setColMaxPos] = useState<Map<string, number>>(new Map());
  // pairKey(section, colKey) -> live `position` of that assignment, so the
  // relationship map can order rows by the first retailer + flag out-of-order cells.
  const [positions, setPositions] = useState<Map<string, number>>(new Map());
  // Current assignments are large (~3k brand, ~1.5k agency) so they load on demand
  // per target: a target is in `synced` once its assignments have been pulled.
  const [synced, setSynced] = useState<Set<"dg" | "dgr">>(new Set());
  const [syncing, setSyncing] = useState(false);
  // Section ids that were CHECKED automatically (req #1: a picked target loads its
  // assigned sections). Tracked so deselecting that target can drop the ones it no
  // longer justifies, without touching the user's manual section picks.
  const autoSections = useRef<Set<string>>(new Set());
  // In-flight syncAssignments promise per target — dedups concurrent picks (the
  // `synced` flag only flips AFTER a multi-second pull completes).
  const syncInflight = useRef<Map<"dg" | "dgr", Promise<{ ids: Map<string, string>; maxPos: Map<string, number> }>>>(new Map());
  // pairKeys with an in-flight single-change write (relationship-map inline edit).
  // A synchronous ref (not state) so a double-click can't slip a duplicate POST
  // through before setAssigned/setPending commit.
  const inFlightWrites = useRef<Set<string>>(new Set());
  // Next position reserved per target across rapid same-target inline inserts, so
  // two quick inserts don't both pick maxPos+1 and force a 409 retry.
  const reservedPos = useRef<Map<string, number>>(new Map());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [applyLog, setApplyLog] = useState<string>("");
  const [mapOpen, setMapOpen] = useState(false);

  // --- live connect (clients & datagroups from prod) ----------------------
  const [token, setToken] = usePersistentState<string>("shalion:devToken", "");
  const [idToken, setIdToken] = usePersistentState<string>("shalion:devIdToken", "");
  const [showConnect, setShowConnect] = useState(false);
  const [draftA, setDraftA] = useState("");
  const [draftI, setDraftI] = useState("");
  const [liveStatus, setLiveStatus] = useState<"idle" | "loading" | "error">("idle");
  const [liveMsg, setLiveMsg] = useState("");

  // --- derived ------------------------------------------------------------
  const selectedApp = useMemo(
    () => catalog.apps.find((a) => a.id === appId) ?? catalog.apps[0],
    [catalog, appId],
  );
  const appGroups = useMemo(
    () => catalog.groups.filter((g) => g.appSlug === selectedApp?.slug),
    [catalog, selectedApp],
  );
  const appSections = useMemo(
    () => catalog.sections.filter((s) => appGroups.some((g) => g.id === s.groupId)),
    [catalog, appGroups],
  );
  // `%` wildcard search (SQL-LIKE) over label + path — e.g. "rmm%-lang".
  const matchSection = useMemo(() => buildQueryMatch(sectionQ), [sectionQ]);
  const visibleSections = appSections.filter(
    (s) =>
      (groupSel.length === 0 || groupSel.includes(s.groupId)) &&
      matchSection(`${s.label} ${s.path}`),
  );

  // A datagroup belongs to a target by its dashboard type: BRAND → "Datagroup"
  // (datagroup-dashboardsections); AGENCY → "Datagroup + retailer"
  // (datagroup-retailer-dashboardsections). Only show the type matching the target.
  const targetType: "BRAND" | "AGENCY" = target === "dgr" ? "AGENCY" : "BRAND";
  const dgsOfType = useMemo(
    () => catalog.dataGroups.filter((d) => d.dashboardType === targetType),
    [catalog, targetType],
  );
  const clientsWithDg = useMemo(
    () => catalog.clients.filter((c) => dgsOfType.some((d) => d.clientId === c.id)),
    [catalog, dgsOfType],
  );
  // The text box filters by DATAGROUP name with `%` wildcard support (the Clients
  // chip still narrows by client). Datagroups stay grouped under their client.
  const matchDg = useMemo(() => buildQueryMatch(clientQ), [clientQ]);
  const visibleDgs = useMemo(
    () =>
      dgsOfType.filter(
        (d) =>
          (selClients.length === 0 || selClients.includes(d.clientId)) &&
          matchDg(d.name),
      ),
    [dgsOfType, selClients, matchDg],
  );
  const filteredClients = clientsWithDg.filter((c) => visibleDgs.some((d) => d.clientId === c.id));
  const clientName = (id: string) => catalog.clients.find((c) => c.id === id)?.name ?? "—";

  const selSectionList = catalog.sections.filter((s) => selSections.has(s.id));
  const selDgList = catalog.dataGroups.filter((d) => selDgs.has(d.id));
  // Agency sections attach to a RETAILER (retailer-dashboardsections), so in
  // "Datagroup + retailer" mode the right-side list IS retailers (not datagroups).
  const allRetailers = catalog.retailers ?? [];
  const retailerName = (id: string) => allRetailers.find((r) => r.id === id)?.name ?? id;
  // Retailer → its label (for the colored tag + the Label filter facilitator).
  const labelForRet = (name: string) => labelForRetailer(retailerLabels, name);
  // Search (with `%` wildcard) narrows the list; the Label chip no longer HIDES
  // non-members — instead it GROUPS the selected label's retailers on top (see
  // labelGroups) and keeps the rest below, so a whole label can be picked while
  // other retailers stay reachable.
  const matchRet = useMemo(() => buildQueryMatch(retailerQ), [retailerQ]);
  const visibleRetailers = useMemo(
    () => allRetailers.filter((r) => matchRet(r.name)),
    [allRetailers, matchRet],
  );
  const selRetailerList = allRetailers.filter((r) => selRetailers.includes(r.id));

  // When every filtered result is already selected, the results list just repeats
  // the Selected tray — collapse it (show only the tray) until the filter surfaces
  // an unselected item. Applied to both boxes.
  const sectionsResultsRedundant = visibleSections.length > 0 && visibleSections.every((s) => selSections.has(s.id));
  const dgsResultsRedundant = visibleDgs.length > 0 && visibleDgs.every((d) => selDgs.has(d.id));
  const retailersResultsRedundant = visibleRetailers.length > 0 && visibleRetailers.every((r) => selRetailers.includes(r.id));

  // When ≥1 label is selected, partition the (search-filtered) retailers into one
  // group per selected label (members on top, under a colored header) + "the rest".
  const labelGroups = useMemo(() => {
    if (!selLabels.length) return null;
    const chosen = retailerLabels.filter((l) => selLabels.includes(l.id));
    const memberIds = new Set<string>();
    const groups = chosen.map((l) => {
      const members = visibleRetailers.filter((r) => labelForRetailer(retailerLabels, r.name).id === l.id);
      members.forEach((m) => memberIds.add(m.id));
      return { label: l, members };
    });
    const others = visibleRetailers.filter((r) => !memberIds.has(r.id));
    return { groups, others, memberCount: memberIds.size };
  }, [selLabels, retailerLabels, visibleRetailers]);

  // The "target" columns of the matrix:
  //  - Brand → one column per selected datagroup (key = dataGroupId; datagroup-dashboardsections).
  //  - Agency → one column per selected retailer (key = retailerId; retailer-dashboardsections).
  type TargetCol = { key: string; label: string };
  const targetColumns: TargetCol[] =
    target === "dg"
      ? selDgList.map((d) => ({ key: d.id, label: `${clientName(d.clientId)} · ${d.name}` }))
      : selRetailerList.map((r) => ({ key: r.id, label: r.name }));
  const colKeys = targetColumns.map((c) => c.key);

  const cellState = (sectionId: string, colKey: string): CellState => {
    const k = pairKey(sectionId, colKey);
    const st = staged.get(k);
    if (st === "insert") return "add";
    if (st === "remove") return "remove";
    return assigned.has(k) ? "assigned" : "none";
  };

  const stagedInserts = [...staged.values()].filter((v) => v === "insert").length;
  const stagedRemoves = [...staged.values()].filter((v) => v === "remove").length;

  // --- selection helpers --------------------------------------------------
  const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  const chooseTarget = (t: "dg" | "dgr") => {
    if (t === target) return;
    setTarget(t);
    // Targets differ entirely between modes (Brand → datagroups, Agency → retailers)
    // → reset the picks + staged matrix (keys differ between targets).
    setSelDgs(new Set());
    setSelClients([]);
    setSelRetailers([]);
    setSelSections(new Set()); // auto-loaded sections were for the old target
    autoSections.current = new Set();
    setStaged(new Map());
  };

  // --- auto-load current setup (req #1) -----------------------------------
  // Section ids that belong to a given application (the left list is app-scoped).
  const sectionIdsOfApp = (appIdent: string): Set<string> => {
    const grpIds = new Set(groupIdsForApp(catalog, appIdent));
    return new Set(catalog.sections.filter((s) => grpIds.has(s.groupId)).map((s) => s.id));
  };

  // When target column(s) are newly picked, tick the dashboard sections (of the
  // current app) already assigned to them — i.e. load the live setup so it can be
  // seen and edited. Auto-syncs the target's assignments first if not loaded yet.
  const loadAssignedSections = async (cols: string[], forAppId: string = appId, kind: "dg" | "dgr" = target) => {
    if (!cols.length) return;
    let keys: Iterable<string> = assigned;
    if (liveOn && !synced.has(kind)) {
      const r = await syncAssignments(kind);
      keys = r.ids.keys();
    }
    const colSet = new Set(cols);
    const appSecs = sectionIdsOfApp(forAppId);
    const add = new Set<string>();
    for (const key of keys) {
      const [secId, tgtId] = key.split("::");
      if (colSet.has(tgtId) && appSecs.has(secId)) add.add(secId);
    }
    if (!add.size) return;
    add.forEach((id) => autoSections.current.add(id));
    // Keep the left list, the matrix and the "selected" count consistent: reveal
    // the groups of every auto-checked section and drop a section search that would
    // otherwise hide some of them (auto-check is the one path that bypasses filters).
    const grpIds = new Set<string>();
    for (const s of catalog.sections) if (add.has(s.id)) grpIds.add(s.groupId);
    setGroupSel((prev) => [...new Set([...prev, ...grpIds])]);
    setSectionQ("");
    setSelSections((prev) => new Set([...prev, ...add]));
  };

  // Drop auto-checked sections no longer justified by any still-selected target
  // (manual section picks are left untouched). Called when a target is deselected.
  const pruneAutoSections = (remainingCols: string[]) => {
    if (!autoSections.current.size) return;
    const colSet = new Set(remainingCols);
    const keep = new Set<string>();
    for (const key of assigned) {
      const [secId, tgtId] = key.split("::");
      if (autoSections.current.has(secId) && colSet.has(tgtId)) keep.add(secId);
    }
    const drop = [...autoSections.current].filter((id) => !keep.has(id));
    if (!drop.length) return;
    autoSections.current = keep;
    setSelSections((prev) => {
      const n = new Set(prev);
      drop.forEach((id) => n.delete(id));
      return n;
    });
  };

  // Add retailers to the agency selection (+ auto-load their assigned sections).
  const selectRetailers = (ids: string[]) => {
    const added = ids.filter((id) => !selRetailers.includes(id));
    if (!added.length) return;
    setSelRetailers((prev) => [...new Set([...prev, ...ids])]);
    void loadAssignedSections(added);
  };

  // Toggle a single retailer; selecting auto-loads its sections, deselecting prunes them.
  const toggleRetailer = (id: string) => {
    if (selRetailers.includes(id)) {
      const remaining = selRetailers.filter((x) => x !== id);
      setSelRetailers(remaining);
      pruneAutoSections(remaining);
    } else selectRetailers([id]);
  };

  // Toggle a single datagroup (brand); selecting auto-loads its sections, deselecting prunes.
  const toggleDatagroup = (id: string) => {
    if (selDgs.has(id)) {
      const remaining = [...selDgs].filter((x) => x !== id);
      toggle(selDgs, id, setSelDgs);
      pruneAutoSections(remaining);
    } else {
      toggle(selDgs, id, setSelDgs);
      void loadAssignedSections([id]);
    }
  };

  // A single retailer row (used flat and inside label groups).
  const renderRetailerRow = (r: { id: string; name: string }) => {
    const l = labelForRet(r.name);
    return (
      <Row
        key={r.id}
        checked={selRetailers.includes(r.id)}
        onToggle={() => toggleRetailer(r.id)}
        title={r.name}
        badge={l.name}
        badgeClass={LABEL_COLOR_CLASSES[l.color]}
      />
    );
  };

  // A section the user toggles by hand is no longer auto-managed (so a later target
  // deselect won't prune it). Used by the left-list rows.
  const toggleSection = (id: string) => {
    autoSections.current.delete(id);
    toggle(selSections, id, setSelSections);
  };

  // Fresh start after a successful Apply: drop the section + target picks so the
  // next massive update is deliberate (no accidental re-apply of stale selections).
  const clearSelections = () => {
    setSelSections(new Set());
    setSelDgs(new Set());
    setSelRetailers([]);
    autoSections.current = new Set();
  };

  // Switching application auto-fills ALL of its dashboard groups, resets the
  // section picks (sections belong to the previous app's groups), then re-loads
  // the current setup for any already-selected target(s) in the NEW app. The
  // Relationship-map edit opts OUT (it sets the exact target+section itself).
  const onAppChange = (id: string, opts: { autoLoad?: boolean } = {}) => {
    setAppId(id);
    setGroupSel(groupIdsForApp(catalog, id));
    setSelSections(new Set());
    autoSections.current = new Set();
    if (opts.autoLoad === false) return;
    const cols = target === "dg" ? [...selDgs] : selRetailers;
    if (cols.length) void loadAssignedSections(cols, id);
  };

  const stageInsert = () => {
    if (!selSections.size || !colKeys.length) return;
    const next = new Map(staged);
    let n = 0;
    for (const s of selSections)
      for (const c of colKeys) {
        const k = pairKey(s, c);
        if (next.get(k) === "remove") next.delete(k); // cancel a pending remove
        if (!assigned.has(k) && next.get(k) !== "insert") {
          next.set(k, "insert");
          n++;
        }
      }
    setStaged(next);
    toast.info(n ? `${n} insertion(s) staged` : "Nothing new to insert (already assigned)");
  };

  const stageRemove = () => {
    if (!selSections.size || !colKeys.length) return;
    const next = new Map(staged);
    let n = 0;
    for (const s of selSections)
      for (const c of colKeys) {
        const k = pairKey(s, c);
        if (next.get(k) === "insert") {
          next.delete(k); // cancel a pending insert
          continue;
        }
        if (assigned.has(k) && next.get(k) !== "remove") {
          next.set(k, "remove");
          n++;
        }
      }
    setStaged(next);
    toast.info(n ? `${n} removal(s) staged` : "Nothing to remove (none assigned)");
  };

  // Pull ALL current assignments for a target on demand (Brand ~3k from
  // datagroup-dashboardsections keyed by dataGroupId; Agency ~1.5k from
  // retailer-dashboardsections keyed by retailerId) so removes can resolve their
  // record id and the matrix shows current state.
  const syncAssignments = (
    kind: "dg" | "dgr",
  ): Promise<{ ids: Map<string, string>; maxPos: Map<string, number> }> => {
    // Dedup concurrent pulls for the same target (the `synced` flag only flips
    // after the multi-second fetch completes, so back-to-back picks would each
    // launch a full pull). Share one in-flight promise per kind.
    const inflight = syncInflight.current.get(kind);
    if (inflight) return inflight;
    const p = runSyncAssignments(kind);
    syncInflight.current.set(kind, p);
    void p.finally(() => {
      if (syncInflight.current.get(kind) === p) syncInflight.current.delete(kind);
    });
    return p;
  };

  const runSyncAssignments = async (
    kind: "dg" | "dgr",
  ): Promise<{ ids: Map<string, string>; maxPos: Map<string, number> }> => {
    const saved = getDevTokens();
    const tok = token || saved.token;
    const idt = idToken || saved.idToken;
    setSyncing(true);
    let merged = new Map(recordIds);
    let nextMaxPos = new Map(colMaxPos);
    try {
      const res = await fetchAssignments({
        data: { kind: kind === "dgr" ? "agency" : "brand", token: tok || undefined, idToken: idt || undefined, env: loadedEnv },
      });
      const pairs = (res.pairs ?? []).map((p) => ({ id: p.id, key: pairKey(p.sectionId, p.targetId), targetId: p.targetId, position: p.position }));
      const nextAssigned = new Set(assigned);
      const nextPositions = new Map(positions);
      for (const p of pairs) {
        merged.set(p.key, p.id);
        nextAssigned.add(p.key);
        nextPositions.set(p.key, p.position);
        // Track the highest occupied position per target column so inserts can
        // append at a free slot (the upstream (target, position) pair is unique).
        const cur = nextMaxPos.get(p.targetId) ?? 0;
        if (p.position > cur) nextMaxPos.set(p.targetId, p.position);
      }
      setRecordIds(merged);
      setAssigned(nextAssigned);
      setColMaxPos(nextMaxPos);
      setPositions(nextPositions);
      if (res.ok && res.complete) setSynced((s) => new Set(s).add(kind));
      if (!res.ok) toast.error(res.error || "Couldn't load assignments.");
      else
        toast[res.complete ? "success" : "warning"](
          `Loaded ${pairs.length} ${kind === "dgr" ? "retailer" : "brand"} assignment(s)${res.complete ? "" : " (partial — retry)"}.`,
        );
    } catch (e) {
      toast.error(`Couldn't load assignments: ${(e as Error).message}`);
    } finally {
      setSyncing(false);
    }
    return { ids: merged, maxPos: nextMaxPos };
  };

  // --- single-change live writers (shared by doApply + the relationship map) ---
  // POST one assignment, appending at `startPos` and bumping + retrying on a 409
  // position conflict (the (target, position) pair is unique upstream). Pure
  // network — does NOT touch React state. Returns the new record id + landed pos.
  const postAssignment = async (
    ep: string,
    kind: "dg" | "dgr",
    colKey: string,
    sectionId: string,
    startPos: number,
    tok: string,
    idt: string,
  ): Promise<{ ok: boolean; recordId?: string; position?: number; status: number; error?: string }> => {
    let pos = startPos;
    let lastStatus = 0;
    let lastErr = "";
    for (let attempt = 0; attempt < 80; attempt++, pos++) {
      const body: Record<string, unknown> =
        kind === "dgr"
          ? { retailerId: colKey, dashboardSectionId: sectionId, position: pos }
          : { dataGroupId: colKey, dashboardSectionId: sectionId, position: pos };
      const res = await mutateLive({
        data: { service: "visualization", env: loadedEnv, method: "POST", path: ep, body, token: tok || undefined, idToken: idt || undefined },
      });
      if (res.ok) return { ok: true, recordId: (res.data as { id?: string } | null)?.id, position: pos, status: res.status };
      if (res.status === 409) {
        lastStatus = 409;
        lastErr = res.error ?? "conflict";
        continue;
      }
      return { ok: false, status: res.status, error: res.error ?? String(res.status) };
    }
    void lastErr;
    return { ok: false, status: lastStatus || 409, error: "no free position (80 tries)" };
  };

  const deleteAssignment = async (
    ep: string,
    recordId: string,
    tok: string,
    idt: string,
  ): Promise<{ ok: boolean; status: number; error?: string }> => {
    const res = await mutateLive({
      data: { service: "visualization", env: loadedEnv, method: "DELETE", path: `${ep}/${recordId}`, token: tok || undefined, idToken: idt || undefined },
    });
    return { ok: res.ok, status: res.status, error: res.error };
  };

  // Apply ONE assignment change live (used by the relationship map's inline edit).
  // Updates assigned / recordIds / colMaxPos so the map AND the main tool stay in
  // sync. Inserts append at a free position; removes need the synced record id.
  const writeAssignment = async (
    change: { op: "insert" | "remove"; sectionId: string; targetId: string; kind: "dg" | "dgr" },
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!liveOn) return { ok: false, error: "Not connected to live data." };
    const k = pairKey(change.sectionId, change.targetId);
    // Synchronous re-entrancy guard: a double-click fires two handlers against the
    // same render before setAssigned/setPending commit — without this, both would
    // POST and create a duplicate row (the unique constraint is on position, so the
    // second lands at a different position rather than 409-ing).
    if (inFlightWrites.current.has(k)) return { ok: true };
    inFlightWrites.current.add(k);
    try {
      const saved = getDevTokens();
      const tok = token || saved.token;
      const idt = idToken || saved.idToken;
      const ep = change.kind === "dgr" ? AGENCY_EP : BRAND_EP;
      if (change.op === "insert") {
        if (assigned.has(k)) return { ok: true };
        // Inserting while the axis is only partially loaded risks duplicating an
        // assignment that exists upstream but isn't in `assigned` yet.
        if (!synced.has(change.kind)) return { ok: false, error: "Assignments still loading — reload the map, then retry." };
        // Reserve a position synchronously so rapid same-target inserts don't all
        // pick maxPos+1 (which would force 409 retries).
        const base = Math.max(reservedPos.current.get(change.targetId) ?? 0, (colMaxPos.get(change.targetId) ?? 99) + 1);
        reservedPos.current.set(change.targetId, base + 1);
        const r = await postAssignment(ep, change.kind, change.targetId, change.sectionId, base, tok, idt);
        if (!r.ok) return { ok: false, error: r.error };
        setAssigned((prev) => new Set(prev).add(k));
        if (r.recordId) setRecordIds((prev) => new Map(prev).set(k, r.recordId!));
        if (r.position != null) {
          if (r.position + 1 > (reservedPos.current.get(change.targetId) ?? 0)) reservedPos.current.set(change.targetId, r.position + 1);
          setColMaxPos((prev) => {
            if (r.position! <= (prev.get(change.targetId) ?? 0)) return prev;
            return new Map(prev).set(change.targetId, r.position!);
          });
          setPositions((prev) => new Map(prev).set(k, r.position!));
        }
        return { ok: true };
      }
      const rid = recordIds.get(k);
      if (!rid) return { ok: false, error: "Assignment id not loaded — reload the map." };
      const r = await deleteAssignment(ep, rid, tok, idt);
      if (!r.ok) return { ok: false, error: r.error };
      setAssigned((prev) => {
        const n = new Set(prev);
        n.delete(k);
        return n;
      });
      setRecordIds((prev) => {
        const n = new Map(prev);
        n.delete(k);
        return n;
      });
      setPositions((prev) => {
        const n = new Map(prev);
        n.delete(k);
        return n;
      });
      return { ok: true };
    } finally {
      inFlightWrites.current.delete(k);
    }
  };

  // Real apply: sequential POST (insert) / DELETE (remove) through the write
  // proxy, against the loaded environment. Brand → datagroup-dashboardsections
  // (keyed by dataGroupId); Agency → retailer-dashboardsections (keyed by retailerId).
  const doApply = async () => {
    setConfirmOpen(false);
    if (!staged.size) return;
    setApplying(true);
    setApplyLog("");

    // Offline (no live connection) → keep the old simulation.
    if (!liveOn) {
      const next = new Set(assigned);
      for (const [k, op] of staged) {
        await sleep(50);
        if (op === "insert") next.add(k);
        else next.delete(k);
      }
      setAssigned(next);
      setStaged(new Map());
      clearSelections();
      setApplying(false);
      toast.success(`Simulated ${staged.size} change(s) (no live connection).`);
      return;
    }

    const saved = getDevTokens();
    const tok = token || saved.token;
    const idt = idToken || saved.idToken;
    const ep = target === "dgr" ? AGENCY_EP : BRAND_EP;

    // Inserts AND removes both need the target's current assignments loaded:
    //  - removes need the record id to DELETE;
    //  - inserts need the occupied positions (the upstream (target, position) pair
    //    is UNIQUE, so a new row must use a free position) and need to know which
    //    sections are already assigned (so we don't create a duplicate).
    // Load once per target per session (gated by `synced`).
    let ids = recordIds;
    let maxPos = colMaxPos;
    if (staged.size && !synced.has(target)) {
      const r = await syncAssignments(target);
      ids = r.ids;
      maxPos = r.maxPos;
    }

    const nextAssigned = new Set(assigned);
    const nextIds = new Map(ids);
    const nextMaxPos = new Map(maxPos);
    // Next free position to try per target column — start one above the highest
    // currently-occupied position (append at the end), then increment locally.
    const nextPosByCol = new Map<string, number>();
    const freePosFor = (colKey: string): number =>
      nextPosByCol.get(colKey) ?? (nextMaxPos.get(colKey) ?? 99) + 1;
    let createdN = 0; // real new rows written (2xx)
    let existedN = 0; // already assigned — no change
    let removedN = 0;
    let failN = 0;
    const errs: string[] = [];

    for (const [k, op] of staged) {
      const [sectionId, colKey] = k.split("::");
      try {
        if (op === "insert") {
          // Already assigned to this target? Don't create a duplicate row.
          if (nextAssigned.has(k) || ids.has(k)) {
            existedN++;
            await sleep(20);
            continue;
          }
          // Append at the next free position (bump + retry on a 409 position conflict).
          const r = await postAssignment(ep, target, colKey, sectionId, freePosFor(colKey), tok, idt);
          if (r.ok) {
            nextAssigned.add(k);
            if (r.recordId) nextIds.set(k, r.recordId);
            createdN++;
            if (r.position != null) {
              nextPosByCol.set(colKey, r.position + 1); // reserve: next insert tries +1
              if (r.position > (nextMaxPos.get(colKey) ?? 0)) nextMaxPos.set(colKey, r.position);
            }
          } else {
            failN++;
            errs.push(`insert ${k.slice(0, 28)}: ${r.error}`);
          }
        } else {
          const rid = nextIds.get(k);
          if (!rid) {
            failN++;
            errs.push(`remove ${k.slice(0, 28)}: record id unknown`);
            continue;
          }
          const r = await deleteAssignment(ep, rid, tok, idt);
          if (r.ok) {
            nextAssigned.delete(k);
            nextIds.delete(k);
            removedN++;
          } else {
            failN++;
            errs.push(`remove ${k.slice(0, 28)}: ${r.error ?? r.status}`);
          }
        }
      } catch (e) {
        failN++;
        errs.push(`${k.slice(0, 28)}: ${(e as Error).message}`);
      }
      await sleep(150);
    }

    setAssigned(nextAssigned);
    setRecordIds(nextIds);
    setColMaxPos(nextMaxPos);
    setStaged(new Map());
    // Fresh start on full success; keep the picks if anything failed so they can retry.
    if (!failN) clearSelections();
    setApplying(false);
    setApplyLog(errs.slice(0, 10).join("\n"));
    const parts = [
      createdN && `${createdN} created`,
      removedN && `${removedN} removed`,
      existedN && `${existedN} already existed`,
      failN && `${failN} failed`,
    ].filter(Boolean);
    const env = loadedEnv.toUpperCase();
    if (failN) toast.warning(`Applied to ${env}: ${parts.join(" · ")} (see details).`);
    else if (createdN || removedN) toast.success(`Applied to ${env}: ${parts.join(" · ")}.`);
    else toast.info(`${env}: nothing to write — ${existedN} already existed.`);
  };

  // --- live connect -------------------------------------------------------
  const connect = async (envArg?: "prod" | "develop"): Promise<boolean> => {
    const env = envArg ?? liveEnv;
    const saved = getDevTokens(); // read latest saved tokens at click time
    const a = (draftA || token || saved.token).trim();
    const i = (draftI || idToken || saved.idToken).trim();
    if (a && a !== token) setToken(a);
    if (i && i !== idToken) setIdToken(i);
    if (!a || !i) {
      setLiveStatus("error");
      setLiveMsg("Both the access token and the id token are required for the Visualization API.");
      return false;
    }
    setLiveStatus("loading");
    setLiveMsg("");
    try {
      const { opts, fetchAllPages } = makeLiveCtx(env, a, i);
      // The agency target is ANY retailer (retailer-dashboardsections keyed by
      // retailerId), so load the FULL retailer master list from backoffice-api —
      // not just the agency-linked ones — so every retailer is pickable.
      const boRetailers = makeLiveCtx(env, a, i, "backoffice").fetchAllPages;
      // Assignments (~3k brand, ~1.5k agency) load on demand via "Sync current state".
      const [dgAll, appRes, groupAll, sectionAll, retAll] = await Promise.all([
        fetchAllPages("/v1.0/admin/datagroups"),
        fetchLive(opts("/v1.0/admin/dashboardapplications")),
        fetchAllPages("/v1.0/admin/dashboardgroups"),
        fetchAllPages("/v1.0/admin/dashboardsections"),
        boRetailers("/v1.0/admin/retailers", 5),
      ]);
      if (!dgAll.ok) {
        setLiveStatus("error");
        setLiveMsg(dgAll.error ?? "Request failed.");
        return false;
      }
      const { clients, dataGroups } = mapLiveDataGroups(dgAll.rows);
      if (!dataGroups.length) {
        setLiveStatus("error");
        setLiveMsg("No datagroups returned (check the token).");
        return false;
      }
      const liveApps = appRes.ok ? mapLiveApps(appRes.data) : [];
      const apps = liveApps.length ? liveApps : MU_SEED.apps;
      const liveGroups = mapLiveGroups(groupAll.rows);
      const liveSections = mapLiveSections(sectionAll.rows);
      const groups = liveGroups.length ? liveGroups : MU_SEED.groups;
      const sections = liveSections.length ? liveSections : MU_SEED.sections;

      // Full retailer master list (backoffice) → {id, name}, excluding archived.
      const liveRetailers = (retAll.rows as Array<Record<string, unknown>>)
        .filter((r) => r && r.id && !r.isArchived)
        .map((r) => ({ id: String(r.id), name: String(r.name ?? r.id) }))
        .sort((x, y) => x.name.localeCompare(y.name));
      const retailers = liveRetailers.length ? liveRetailers : MU_SEED.retailers;

      const nextCatalog = { ...MU_SEED, apps, groups, sections, clients, dataGroups, retailers };
      setCatalog(nextCatalog);
      const dsm = apps.find((a2) => a2.slug === "dsm") ?? apps[0];
      setAppId(dsm?.id ?? "");
      setGroupSel(dsm ? groupIdsForApp(nextCatalog, dsm.id) : []);
      setAssigned(new Set()); // assignments load on demand via "Sync current state"
      setRecordIds(new Map());
      setColMaxPos(new Map());
      reservedPos.current = new Map();
      setSynced(new Set());
      setSelDgs(new Set());
      setSelSections(new Set());
      autoSections.current = new Set();
      setSelClients([]);
      setStaged(new Map());
      setLiveOn(true);
      setLoadedEnv(env);
      setLiveStatus("idle");
      setShowConnect(false);
      const incomplete = [
        !dgAll.complete && "datagroups",
        !groupAll.complete && "groups",
        !sectionAll.complete && "sections",
        !retAll.complete && "retailers",
      ].filter(Boolean);
      const summary = `Live (${env}): ${apps.length} apps · ${groups.length} groups · ${sections.length} sections · ${dataGroups.length} datagroups · ${retailers.length} retailers.`;
      if (incomplete.length)
        toast.warning(`${summary} Partial: ${incomplete.join(", ")} — reconnect to retry.`);
      else toast.success(summary);
      return true;
    } catch (e) {
      setLiveStatus("error");
      setLiveMsg((e as Error).message);
      return false;
    }
  };

  // Flip environment (prod ↔ develop) and reconnect with the new env. The toggle
  // moves immediately; on a failed connect we DON'T silently snap back (that felt
  // like a dead toggle) — instead we disconnect, open the connect panel, and say
  // why (develop is a separate env needing a develop token + VPN — a prod token
  // won't authenticate there; it is NOT a token-format issue).
  const onEnvChange = (next: "prod" | "develop") => {
    if (next === liveEnv) return;
    setLiveEnv(next);
    const saved = getDevTokens();
    const haveToken = !!(token || idToken || saved.token);
    if (!liveOn && !haveToken) return; // nothing to connect with yet
    void connect(next).then((ok) => {
      if (ok) return;
      setLiveOn(false); // don't keep showing the other env's data as "live"
      setShowConnect(true);
      toast.error(
        next === "develop"
          ? "Couldn't connect to develop — it's a separate environment. Paste a develop access + id token (and make sure VPN is on). A prod token won't work there."
          : "Couldn't connect to production with the saved token — paste a fresh one.",
      );
    });
  };

  const disconnect = () => {
    setCatalog(MU_SEED);
    setAppId("app-dsm");
    setGroupSel(groupIdsForApp(MU_SEED, "app-dsm"));
    setAssigned(new Set(MU_SEED.assignments));
    setRecordIds(new Map());
    setSynced(new Set());
    setSelDgs(new Set());
    setSelSections(new Set());
    autoSections.current = new Set();
    setSelClients([]);
    setStaged(new Map());
    setLiveOn(false);
  };

  // Open the relationship map. The map loads only the ACTIVE axis's assignments
  // (brand or agency) lazily via onLoad → syncAssignments, so the heavy brand list
  // (~9MB) isn't pulled unless you're looking at it.
  const openMap = () => setMapOpen(true);

  // Click an assignment in the map → load that exact section + target(s) into the
  // tool so it can be edited (insert/remove). A brand client cell carries all of
  // that client's datagroups that use the section.
  const editFromMap = (e: MapEdit) => {
    setMapOpen(false);
    const sec = catalog.sections.find((s) => s.id === e.sectionId);
    const grp = catalog.groups.find((g) => g.id === sec?.groupId);
    const app = catalog.apps.find((a) => a.slug === grp?.appSlug);
    // The map gives the EXACT section + target(s) to edit, so opt out of the
    // auto-load (it would otherwise async-union the previous target's sections in).
    if (app) onAppChange(app.id, { autoLoad: false });
    setTarget(e.kind);
    setStaged(new Map());
    autoSections.current = new Set();
    setSelSections(new Set([e.sectionId]));
    if (e.kind === "dg") {
      setSelDgs(new Set(e.targetIds));
      setSelRetailers([]);
    } else {
      setSelRetailers([...e.targetIds]);
      setSelDgs(new Set());
    }
  };

  // The catalog is live data — auto-load it on open when tokens are already
  // saved (top-bar 🔑), so you see the real apps/groups/sections without a manual
  // connect. Seed stays as the fallback when there are no tokens / the fetch fails.
  const autoTried = useRef(false);
  useEffect(() => {
    if (autoTried.current) return;
    autoTried.current = true;
    const { token: t, idToken: i } = getDevTokens();
    if (t && i) void connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <div className="mt-1 flex items-center gap-1.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Massive update</h1>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label="About massive update" className="text-muted-foreground hover:text-foreground">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start" className="max-w-xs text-xs leading-relaxed">
                    Push a dashboard <strong>section</strong> into many clients' <strong>datagroups</strong> at once (or
                    remove) — instead of one client at a time. Select sections on the left, datagroups on the right,
                    then insert/remove and review the matrix.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* Relationship map: where every section is currently applied. */}
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => void openMap()}>
              <Network className="h-4 w-4" /> Relationship map
            </Button>
            {/* Sibling tools (moved here from the Dashboard applications top bar). */}
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5">
              <Link to="/settings/dashboard-applications/sections-editor">
                <Sheet className="h-4 w-4" /> Section editor
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5">
              <Link to="/settings/dashboard-applications/section-position">
                <ListOrdered className="h-4 w-4" /> Section position
              </Link>
            </Button>
            {/* Environment for ALL live reads + writes. Prod = real changes. */}
            <div
              className="flex items-center gap-0.5 rounded-md border border-border bg-secondary/40 p-0.5 text-xs"
              title="Environment for live reads + writes"
            >
              <button
                type="button"
                onClick={() => onEnvChange("develop")}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 transition-colors",
                  liveEnv === "develop" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <FlaskConical className="h-3.5 w-3.5" /> Dev
              </button>
              <button
                type="button"
                onClick={() => onEnvChange("prod")}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 transition-colors",
                  liveEnv === "prod" ? "bg-rose-600 font-medium text-white shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Rocket className="h-3.5 w-3.5" /> Prod
              </button>
            </div>
            {liveOn ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5"
                  title="Reload the latest data from live (apps, datagroups, sections, retailers)"
                  disabled={liveStatus === "loading"}
                  onClick={() => void connect()}
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", liveStatus === "loading" && "animate-spin")} /> Refresh
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={disconnect}>
                  <PlugZap className="h-4 w-4 text-emerald-600" /> Live ({loadedEnv}) · disconnect
                </Button>
              </>
            ) : liveStatus === "loading" ? (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" disabled>
                <Loader2 className="h-4 w-4 animate-spin" /> Loading live data…
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setShowConnect((s) => !s)}>
                <PlugZap className="h-4 w-4" /> Connect live clients
              </Button>
            )}
          </div>
        </div>

        {/* Live connect panel */}
        {showConnect && !liveOn && (
          <div className="mx-6 mt-3 rounded-lg border border-border bg-card p-3 shadow-sm">
            <p className="mb-2 text-xs text-muted-foreground">
              Load the <strong>real clients & datagroups</strong> from the prod Visualization API (read-only,
              via the server proxy). Paste a develop/prod access token and id token — kept in this browser only.
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
              <Button size="sm" className="h-8" onClick={() => void connect()} disabled={liveStatus === "loading"}>
                {liveStatus === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
              </Button>
            </div>
            {liveStatus === "error" && <p className="mt-2 text-xs text-amber-700">{liveMsg}</p>}
          </div>
        )}

        {/* Status line + flow hint */}
        <div className="mx-6 mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-xs text-muted-foreground">
            Filter <strong className="text-foreground">application → group</strong>, pick sections, then send to a{" "}
            <strong className="text-foreground">datagroup</strong> or <strong className="text-foreground">datagroup + retailer</strong>.
          </span>
          <span
            className={cn(
              "ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium",
              !liveOn
                ? "bg-secondary text-muted-foreground"
                : loadedEnv === "prod"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800",
            )}
          >
            {liveOn ? `LIVE (${loadedEnv}) — reads + writes are real` : "Catalog: sample · writes simulated"}
          </span>
        </div>

        {/* Transfer */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto px-6 py-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* LEFT: dashboard sections — filter cascade application → group → section */}
          <Panel title="Dashboard sections" count={selSections.size}>
            <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-xs font-medium text-muted-foreground">Application</span>
                <Select value={appId} onValueChange={onAppChange}>
                  <SelectTrigger className="h-8 flex-1">
                    <SelectValue placeholder="Select application">{selectedApp?.label}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {catalog.apps.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <SearchInput value={sectionQ} onChange={setSectionQ} placeholder="Search sections — % = wildcard" />
                </div>
                <FilterChip
                  label="Groups"
                  icon={Layers}
                  options={appGroups.map((g) => g.id)}
                  value={groupSel}
                  onChange={setGroupSel}
                  getLabel={(id) => appGroups.find((g) => g.id === id)?.label ?? id}
                  searchable
                />
              </div>
              <div className="flex items-center justify-between">
                <SelectAllRow
                  label={`Select all filtered (${visibleSections.length})`}
                  onAll={() => setSelSections(new Set([...selSections, ...visibleSections.map((s) => s.id)]))}
                  onClear={() => setSelSections(new Set())}
                />
                <span className="text-xs text-muted-foreground">
                  {groupSel.length
                    ? `${groupSel.length} group${groupSel.length === 1 ? "" : "s"}`
                    : `All groups (${appGroups.length})`}
                </span>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
              <SelectedTray
                items={selSectionList.map((s) => ({
                  id: s.id,
                  title: s.label,
                  subtitle: s.path,
                  badge: catalog.groups.find((g) => g.id === s.groupId)?.label,
                }))}
                onToggle={toggleSection}
                onClear={() => setSelSections(new Set())}
              />
              {sectionsResultsRedundant ? (
                <p className="px-3 py-2 text-center text-[11px] text-muted-foreground">
                  All {visibleSections.length} matching section{visibleSections.length === 1 ? "" : "s"} selected — change the search to add more.
                </p>
              ) : (
                <>
                  {visibleSections.map((s) => (
                    <Row
                      key={s.id}
                      checked={selSections.has(s.id)}
                      onToggle={() => toggleSection(s.id)}
                      title={s.label}
                      subtitle={s.path}
                      badge={appGroups.find((g) => g.id === s.groupId)?.label}
                    />
                  ))}
                  {!visibleSections.length && <Empty>No sections match.</Empty>}
                </>
              )}
            </div>
          </Panel>

          {/* MIDDLE: actions */}
          <div className="flex flex-row items-center justify-center gap-2 lg:flex-col">
            <Button
              size="sm"
              className="h-9 gap-1.5"
              disabled={!selSections.size || !targetColumns.length}
              onClick={stageInsert}
            >
              <ArrowRight className="h-4 w-4" /> Insert
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-1.5"
              disabled={!selSections.size || !targetColumns.length}
              onClick={stageRemove}
            >
              <ArrowLeft className="h-4 w-4" /> Remove
            </Button>
          </div>

          {/* RIGHT: Brand → clients→datagroups; Agency → retailers */}
          <Panel title={target === "dg" ? "Datagroups" : "Retailers"} count={targetColumns.length}>
            <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
              {/* Send-to target: datagroup (Brand) vs datagroup + retailer (Agency) */}
              <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/40 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => chooseTarget("dg")}
                  className={cn("flex-1 rounded px-2 py-1 transition-colors", target === "dg" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                >
                  Datagroup
                </button>
                <button
                  type="button"
                  onClick={() => chooseTarget("dgr")}
                  className={cn("flex-1 rounded px-2 py-1 transition-colors", target === "dgr" ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                >
                  Datagroup + retailer
                </button>
              </div>

              {target === "dg" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <SearchInput value={clientQ} onChange={setClientQ} placeholder="Filter datagroups — % = wildcard" />
                    </div>
                    <FilterChip
                      label="Clients"
                      icon={Building2}
                      options={clientsWithDg.map((c) => c.id)}
                      value={selClients}
                      onChange={setSelClients}
                      getLabel={clientName}
                      searchable
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <SelectAllRow
                      label={`Select all filtered (${visibleDgs.length})`}
                      onAll={() => {
                        const added = visibleDgs.map((d) => d.id).filter((id) => !selDgs.has(id));
                        setSelDgs(new Set([...selDgs, ...visibleDgs.map((d) => d.id)]));
                        void loadAssignedSections(added);
                      }}
                      onClear={() => {
                        setSelDgs(new Set());
                        pruneAutoSections([]);
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {selClients.length
                        ? `${selClients.length} client${selClients.length === 1 ? "" : "s"} · ${filteredClients.length} shown`
                        : `All clients (${clientsWithDg.length})`}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <SearchInput value={retailerQ} onChange={setRetailerQ} placeholder="Filter retailers — % = wildcard" />
                    </div>
                    <FilterChip
                      label="Label"
                      icon={Tags}
                      options={retailerLabels.map((l) => l.id)}
                      value={selLabels}
                      onChange={setSelLabels}
                      getLabel={(id) => retailerLabels.find((l) => l.id === id)?.name ?? id}
                      searchable
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <SelectAllRow
                      label={
                        labelGroups
                          ? `Select all in label${selLabels.length === 1 ? "" : "s"} (${labelGroups.memberCount})`
                          : `Select all filtered (${visibleRetailers.length})`
                      }
                      onAll={() =>
                        selectRetailers(
                          labelGroups
                            ? labelGroups.groups.flatMap((g) => g.members.map((m) => m.id))
                            : visibleRetailers.map((r) => r.id),
                        )
                      }
                      onClear={() => {
                        setSelRetailers([]);
                        pruneAutoSections([]);
                      }}
                    />
                    <button
                      onClick={() => setLabelsModalOpen(true)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Tags className="h-3.5 w-3.5" /> Manage labels
                    </button>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {selRetailers.length
                      ? `${selRetailers.length} selected`
                      : labelGroups
                        ? `${labelGroups.memberCount} in ${selLabels.length} label${selLabels.length === 1 ? "" : "s"} · ${labelGroups.others.length} others`
                        : `${allRetailers.length} retailers`}{" "}
                    · pick a Label to group its retailers on top
                  </span>
                </>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
              {target === "dg" ? (
                <SelectedTray
                  items={selDgList.map((d) => ({
                    id: d.id,
                    title: d.name,
                    subtitle: d.country,
                    badge: d.dashboardType,
                    badgeTone: d.dashboardType === "AGENCY" ? "violet" : "slate",
                  }))}
                  onToggle={toggleDatagroup}
                  onClear={() => {
                    setSelDgs(new Set());
                    pruneAutoSections([]);
                  }}
                />
              ) : (
                <SelectedTray
                  items={selRetailerList.map((r) => {
                    const l = labelForRet(r.name);
                    return { id: r.id, title: r.name, badge: l.name, badgeClass: LABEL_COLOR_CLASSES[l.color] };
                  })}
                  onToggle={toggleRetailer}
                  onClear={() => {
                    setSelRetailers([]);
                    pruneAutoSections([]);
                  }}
                />
              )}
              {target === "dg" ? (
                dgsResultsRedundant ? (
                  <p className="px-3 py-2 text-center text-[11px] text-muted-foreground">
                    All {visibleDgs.length} matching datagroup{visibleDgs.length === 1 ? "" : "s"} selected — change the search to add more.
                  </p>
                ) : (
                <>
                  {filteredClients.map((c) => {
                    const dgs = visibleDgs.filter((d) => d.clientId === c.id);
                    if (!dgs.length) return null;
                    return (
                      <div key={c.id} className="mb-1">
                        <div className="px-2 pb-0.5 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {c.name}
                        </div>
                        {dgs.map((d) => (
                          <Row
                            key={d.id}
                            checked={selDgs.has(d.id)}
                            onToggle={() => toggleDatagroup(d.id)}
                            title={d.name}
                            subtitle={d.country}
                            badge={d.dashboardType}
                            badgeTone={d.dashboardType === "AGENCY" ? "violet" : "slate"}
                          />
                        ))}
                      </div>
                    );
                  })}
                  {!visibleDgs.length && <Empty>No datagroups match.</Empty>}
                </>
                )
              ) : retailersResultsRedundant ? (
                <p className="px-3 py-2 text-center text-[11px] text-muted-foreground">
                  All {visibleRetailers.length} matching retailer{visibleRetailers.length === 1 ? "" : "s"} selected — change the search to add more.
                </p>
              ) : labelGroups ? (
                <>
                  {/* Selected label(s): members grouped + prioritized on top */}
                  {labelGroups.groups.map(({ label, members }) =>
                    members.length ? (
                      <div key={label.id} className="mb-1">
                        <div className="flex items-center justify-between px-2 pb-0.5 pt-1.5">
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            <span className={cn("h-2 w-2 shrink-0 rounded-full border", LABEL_COLOR_CLASSES[label.color])} />
                            {label.name} ({members.length})
                          </span>
                          <button
                            onClick={() => selectRetailers(members.map((m) => m.id))}
                            className="text-[11px] font-medium text-[var(--sidebar-active-fg)] hover:underline"
                          >
                            Select all
                          </button>
                        </div>
                        {members.slice(0, RETAILER_RENDER_CAP).map(renderRetailerRow)}
                        {members.length > RETAILER_RENDER_CAP && (
                          <p className="px-2 py-1 text-[11px] text-muted-foreground">
                            Showing {RETAILER_RENDER_CAP} of {members.length} — search to narrow.
                          </p>
                        )}
                      </div>
                    ) : null,
                  )}
                  {/* Everything not in the selected label(s), kept below */}
                  {labelGroups.others.length > 0 && (
                    <div className="mb-1">
                      <div className="px-2 pb-0.5 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Other retailers ({labelGroups.others.length})
                      </div>
                      {labelGroups.others.slice(0, RETAILER_RENDER_CAP).map(renderRetailerRow)}
                      {labelGroups.others.length > RETAILER_RENDER_CAP && (
                        <p className="px-2 py-1 text-[11px] text-muted-foreground">
                          Showing {RETAILER_RENDER_CAP} of {labelGroups.others.length} others — search to narrow.
                        </p>
                      )}
                    </div>
                  )}
                  {!visibleRetailers.length && <Empty>No retailers match.</Empty>}
                </>
              ) : (
                <>
                  {visibleRetailers.slice(0, RETAILER_RENDER_CAP).map(renderRetailerRow)}
                  {visibleRetailers.length > RETAILER_RENDER_CAP && (
                    <p className="px-2 py-2 text-[11px] text-muted-foreground">
                      Showing {RETAILER_RENDER_CAP} of {visibleRetailers.length} — search or filter by Label to narrow.
                    </p>
                  )}
                  {!visibleRetailers.length && <Empty>No retailers match.</Empty>}
                </>
              )}
            </div>
          </Panel>
        </div>

        {/* Staged + apply */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-secondary/30 px-6 py-3 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <Plus className="h-4 w-4" /> {stagedInserts} to insert
          </span>
          <span className="flex items-center gap-1.5 text-red-600">
            <Minus className="h-4 w-4" /> {stagedRemoves} to remove
          </span>
          {staged.size > 0 && (
            <button onClick={() => setStaged(new Map())} className="text-muted-foreground hover:text-foreground">
              Clear staged
            </button>
          )}
          {/* Current-state sync for the active target (assignment lists are big,
              ~3k brand / ~1.5k agency, so they load on demand). */}
          {liveOn && (
            <button
              onClick={() => void syncAssignments(target)}
              disabled={syncing}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
              title="Load current assignments so the matrix shows current state and removes can resolve their record id"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
              {synced.has(target) ? "Current state synced" : syncing ? "Syncing…" : "Sync current state"}
            </button>
          )}
          <span className="ml-auto flex items-center gap-2">
            <span
              className={cn(
                "hidden items-center gap-1 text-xs sm:flex",
                liveOn && loadedEnv === "prod" ? "text-rose-600" : "text-muted-foreground",
              )}
            >
              <TriangleAlert className={cn("h-3.5 w-3.5", liveOn && loadedEnv === "prod" ? "text-rose-500" : "text-amber-500")} />
              {!liveOn
                ? "Simulation (no live connection)"
                : loadedEnv === "prod"
                  ? "Writes to PRODUCTION"
                  : "Writes to develop"}
            </span>
            <Button
              size="sm"
              className={cn("h-8 gap-1.5", liveOn && loadedEnv === "prod" && "bg-rose-600 hover:bg-rose-700")}
              disabled={!staged.size || applying}
              onClick={() => (liveOn ? setConfirmOpen(true) : void doApply())}
            >
              {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Apply {staged.size} change{staged.size === 1 ? "" : "s"}
            </Button>
          </span>
        </div>

        {applyLog && (
          <div className="border-t border-border bg-rose-50 px-6 py-2 text-xs text-rose-700">
            <pre className="whitespace-pre-wrap font-mono">{applyLog}</pre>
          </div>
        )}

        {/* Matrix */}
        {selSectionList.length > 0 && targetColumns.length > 0 && (
          <Matrix sections={selSectionList} columns={targetColumns} cellState={cellState} targetKind={target} />
        )}
      </div>

      {/* Apply confirmation — names the environment, with a PROD warning */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setConfirmOpen(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              {loadedEnv === "prod" ? (
                <Rocket className="h-5 w-5 text-rose-600" />
              ) : (
                <FlaskConical className="h-5 w-5 text-foreground" />
              )}
              <h2 className="text-base font-semibold">
                Apply to {loadedEnv === "prod" ? "PRODUCTION" : "develop"}?
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This writes <strong>real changes</strong> to the {loadedEnv === "prod" ? "production" : "develop"} Visualization
              API via {target === "dgr" ? "retailer-dashboardsections" : "datagroup-dashboardsections"}:
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li className="flex items-center gap-1.5 text-emerald-700">
                <Plus className="h-4 w-4" /> {stagedInserts} insert{stagedInserts === 1 ? "" : "s"} (POST)
              </li>
              <li className="flex items-center gap-1.5 text-red-600">
                <Minus className="h-4 w-4" /> {stagedRemoves} remove{stagedRemoves === 1 ? "" : "s"} (DELETE)
              </li>
            </ul>
            {loadedEnv === "prod" && (
              <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <TriangleAlert className="mr-1 inline h-3.5 w-3.5" />
                Production is live and client-facing. These changes take effect immediately.
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className={cn("gap-1.5", loadedEnv === "prod" && "bg-rose-600 hover:bg-rose-700")}
                onClick={() => void doApply()}
              >
                <Play className="h-4 w-4" /> Apply to {loadedEnv === "prod" ? "production" : "develop"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {mapOpen && (
        <RelationshipMap
          catalog={catalog}
          assigned={assigned}
          positions={positions}
          live={liveOn}
          loading={syncing}
          synced={synced}
          retailerLabels={retailerLabels}
          onLoad={(kind) => void syncAssignments(kind)}
          onClose={() => setMapOpen(false)}
          onEdit={editFromMap}
          onWrite={writeAssignment}
          loadedEnv={loadedEnv}
        />
      )}

      {labelsModalOpen && (
        <RetailerLabelsModal
          labels={retailerLabels}
          setLabels={setRetailerLabels}
          retailers={allRetailers}
          onClose={() => setLabelsModalOpen(false)}
        />
      )}
    </AppShell>
  );
}

// ---- small building blocks -----------------------------------------------
function Panel({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-secondary/40 px-3 py-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="rounded-full bg-[var(--sidebar-active)] px-2 py-0.5 text-[11px] font-medium text-[var(--sidebar-active-fg)]">
          {count} selected
        </span>
      </div>
      {children}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

function SelectAllRow({ label, onAll, onClear }: { label: string; onAll: () => void; onClear: () => void }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <button onClick={onAll} className="font-medium text-[var(--sidebar-active-fg)] hover:underline">
        {label}
      </button>
      <button onClick={onClear} className="text-muted-foreground hover:text-foreground">
        Clear
      </button>
    </div>
  );
}

function Row({
  checked,
  onToggle,
  title,
  subtitle,
  badge,
  badgeTone = "slate",
  badgeClass,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeTone?: "slate" | "violet";
  /** Full color classes for the badge (overrides badgeTone) — e.g. retailer group tag. */
  badgeClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary/60",
        checked && "bg-[var(--sidebar-active)]/60",
      )}
    >
      <span
        className={cn(
          "grid h-4 w-4 shrink-0 place-items-center rounded border",
          checked ? "border-[var(--sidebar-active-fg)] bg-[var(--sidebar-active-fg)] text-white" : "border-border",
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-foreground">{title}</span>
        {subtitle && <span className="block truncate font-mono text-[11px] text-muted-foreground">{subtitle}</span>}
      </span>
      {badge && (
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
            badgeClass
              ? cn("border", badgeClass)
              : badgeTone === "violet"
                ? "bg-violet-100 text-violet-700"
                : "bg-secondary text-muted-foreground",
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-3 py-10 text-center text-sm text-muted-foreground">{children}</p>;
}

/**
 * Pinned "Selected (N)" group at the top of a picker list — the items currently
 * checked, regardless of the active search/filter, so a scattered selection is
 * easy to review (and uncheck) before applying. Each row toggles itself off.
 */
function SelectedTray({
  items,
  onToggle,
  onClear,
}: {
  items: { id: string; title: string; subtitle?: string; badge?: string; badgeTone?: "slate" | "violet"; badgeClass?: string }[];
  onToggle: (id: string) => void;
  onClear: () => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mb-2 rounded-md border border-[var(--sidebar-active-fg)]/30 bg-[var(--sidebar-active)]/30">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--sidebar-active-fg)]">
          <Check className="h-3 w-3" /> Selected ({items.length})
        </span>
        <button type="button" onClick={onClear} className="text-[11px] font-medium text-muted-foreground hover:text-foreground">
          Clear all
        </button>
      </div>
      <div className="max-h-40 overflow-y-auto px-1 pb-1">
        {items.map((it) => (
          <Row key={it.id} checked onToggle={() => onToggle(it.id)} title={it.title} subtitle={it.subtitle} badge={it.badge} badgeTone={it.badgeTone} badgeClass={it.badgeClass} />
        ))}
      </div>
    </div>
  );
}

function Matrix({
  sections,
  columns,
  cellState,
  targetKind,
}: {
  sections: MuSection[];
  columns: { key: string; label: string }[];
  cellState: (sectionId: string, colKey: string) => CellState;
  targetKind: "dg" | "dgr";
}) {
  const colNoun = targetKind === "dgr" ? "retailer" : "datagroup";
  return (
    <div className="border-t border-border">
      <div className="px-6 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Matrix · {sections.length} section{sections.length === 1 ? "" : "s"} × {columns.length} {colNoun}
        {columns.length === 1 ? "" : "s"}
      </div>
      <div className="max-h-[40vh] overflow-auto px-6 pb-5">
        <table className="border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background px-2 py-1.5 text-left text-xs font-medium text-muted-foreground">
                Section \ {targetKind === "dgr" ? "Retailer" : "Datagroup"}
              </th>
              {columns.map((c) => (
                <th key={c.key} className="px-1.5 py-1.5 align-bottom">
                  <div className="mx-auto w-6 whitespace-nowrap text-[11px] text-foreground/80 [writing-mode:vertical-rl] rotate-180">
                    {c.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id}>
                <td className="sticky left-0 z-10 max-w-[220px] truncate bg-background px-2 py-1 font-mono text-[11px] text-foreground/80" title={s.path}>
                  {s.path}
                </td>
                {columns.map((c) => (
                  <td key={c.key} className="px-1.5 py-1 text-center">
                    <Cell state={cellState(s.id, c.key)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ state }: { state: CellState }) {
  const map = {
    assigned: { cls: "bg-emerald-100 text-emerald-700", icon: <Check className="h-3.5 w-3.5" /> },
    add: { cls: "bg-blue-100 text-blue-700 ring-1 ring-blue-300", icon: <Plus className="h-3.5 w-3.5" /> },
    remove: { cls: "bg-red-100 text-red-700 ring-1 ring-red-300", icon: <Minus className="h-3.5 w-3.5" /> },
    none: { cls: "text-muted-foreground/30", icon: <X className="h-3 w-3" /> },
  } as const;
  const m = map[state];
  return <span className={cn("inline-grid h-5 w-5 place-items-center rounded", m.cls)}>{m.icon}</span>;
}
