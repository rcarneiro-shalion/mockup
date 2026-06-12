import { useMemo, useState } from "react";
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
import { fetchLive } from "@/lib/api/live.functions";
import {
  MU_SEED,
  mapLiveDataGroups,
  mapLiveApps,
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
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FilterChip } from "@/components/seeds/FilterChip";

type CellState = "assigned" | "add" | "remove" | "none";

export function MassiveUpdatePage() {
  const [catalog, setCatalog] = useState<MuCatalog>(MU_SEED);
  const [liveOn, setLiveOn] = useState(false);

  const [appId, setAppId] = useState<string>("app-dsm");
  const [groupSel, setGroupSel] = useState<string[]>([]); // group ids of the app; empty = all groups
  const [sectionQ, setSectionQ] = useState("");
  const [clientQ, setClientQ] = useState("");
  const [selClients, setSelClients] = useState<string[]>([]); // client ids; empty = all
  // Target: send the section to a datagroup (Brand) or a datagroup + retailer (Agency).
  const [target, setTarget] = useState<"dg" | "dgr">("dg");
  const [selRetailers, setSelRetailers] = useState<string[]>([]); // retailer ids (dgr mode)

  const [selSections, setSelSections] = useState<Set<string>>(new Set());
  const [selDgs, setSelDgs] = useState<Set<string>>(new Set());
  const [assigned, setAssigned] = useState<Set<string>>(new Set(MU_SEED.assignments));
  const [staged, setStaged] = useState<Map<string, "insert" | "remove">>(new Map());
  const [applying, setApplying] = useState(false);

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
  const sq = sectionQ.trim().toLowerCase();
  const visibleSections = appSections.filter(
    (s) =>
      (groupSel.length === 0 || groupSel.includes(s.groupId)) &&
      (!sq || `${s.label} ${s.path}`.toLowerCase().includes(sq)),
  );

  const clientsWithDg = useMemo(
    () => catalog.clients.filter((c) => catalog.dataGroups.some((d) => d.clientId === c.id)),
    [catalog],
  );
  const cq = clientQ.trim().toLowerCase();
  const filteredClients = clientsWithDg.filter(
    (c) =>
      (selClients.length === 0 || selClients.includes(c.id)) &&
      (!cq || c.name.toLowerCase().includes(cq)),
  );
  const visibleDgs = useMemo(
    () => catalog.dataGroups.filter((d) => filteredClients.some((c) => c.id === d.clientId)),
    [catalog, filteredClients],
  );
  const clientName = (id: string) => catalog.clients.find((c) => c.id === id)?.name ?? "—";

  const selSectionList = catalog.sections.filter((s) => selSections.has(s.id));
  const selDgList = catalog.dataGroups.filter((d) => selDgs.has(d.id));
  const retailers = catalog.retailers ?? [];
  const retailerName = (id: string) => retailers.find((r) => r.id === id)?.name ?? id;
  const selRetailerList = retailers.filter((r) => selRetailers.includes(r.id));

  // The "target" columns of the matrix: datagroups (Brand →
  // datagroup-dashboardsections), or datagroup × retailer (Agency →
  // datagroup-retailer-dashboardsections).
  type TargetCol = { key: string; label: string };
  const targetColumns: TargetCol[] =
    target === "dg"
      ? selDgList.map((d) => ({ key: d.id, label: `${clientName(d.clientId)} · ${d.name}` }))
      : selDgList.flatMap((d) =>
          selRetailerList.map((r) => ({ key: `${d.id}#${r.id}`, label: `${d.name} · ${r.name}` })),
        );
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
    setStaged(new Map()); // keys differ between targets
  };

  // Switching application changes its groups + sections → reset those selections.
  const onAppChange = (id: string) => {
    setAppId(id);
    setGroupSel([]);
    setSelSections(new Set());
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

  const apply = async () => {
    if (!staged.size) return;
    setApplying(true);
    const entries = [...staged.entries()];
    const next = new Set(assigned);
    // Simulate the sequential POST/DELETE to /v1.0/admin/datagroup-dashboardsections.
    for (let i = 0; i < entries.length; i++) {
      const [k, op] = entries[i];
      await new Promise((r) => setTimeout(r, 90));
      if (op === "insert") next.add(k);
      else next.delete(k);
    }
    setAssigned(next);
    setStaged(new Map());
    setApplying(false);
    toast.success(
      `Simulated ${entries.length} change(s): ${entries.filter((e) => e[1] === "insert").length} inserted, ${entries.filter((e) => e[1] === "remove").length} removed.`,
    );
  };

  // --- live connect -------------------------------------------------------
  const connect = async () => {
    const a = (draftA || token).trim();
    const i = (draftI || idToken).trim();
    if (a && a !== token) setToken(a);
    if (i && i !== idToken) setIdToken(i);
    if (!a || !i) {
      setLiveStatus("error");
      setLiveMsg("Both the access token and the id token are required for the Visualization API.");
      return;
    }
    setLiveStatus("loading");
    setLiveMsg("");
    try {
      const opts = (path: string) => ({ data: { service: "visualization", env: "prod" as const, path, token: a, idToken: i } });
      const [dgRes, appRes] = await Promise.all([
        fetchLive(opts("/v1.0/admin/datagroups?size=200")),
        fetchLive(opts("/v1.0/admin/dashboardapplications")),
      ]);
      if (!dgRes.ok) {
        setLiveStatus("error");
        setLiveMsg(dgRes.error ?? `Request failed (${dgRes.status}).`);
        return;
      }
      const { clients, dataGroups } = mapLiveDataGroups(dgRes.data);
      if (!dataGroups.length) {
        setLiveStatus("error");
        setLiveMsg("No datagroups returned.");
        return;
      }
      const liveApps = appRes.ok ? mapLiveApps(appRes.data) : [];
      const apps = liveApps.length ? liveApps : MU_SEED.apps;
      setCatalog({ ...MU_SEED, apps, clients, dataGroups });
      // re-point the app selector at a live app (prefer Digital Shelf Maestro).
      const dsm = apps.find((a2) => a2.slug === "dsm") ?? apps[0];
      setAppId(dsm?.id ?? "");
      setAssigned(new Set()); // assignment state for live datagroups is unknown → simulate fresh
      setSelDgs(new Set());
      setSelSections(new Set());
      setSelClients([]);
      setStaged(new Map());
      setLiveOn(true);
      setLiveStatus("idle");
      setShowConnect(false);
      toast.success(
        `Live (prod): ${apps.length} dashboard apps · ${dataGroups.length} datagroups across ${clients.length} clients.`,
      );
    } catch (e) {
      setLiveStatus("error");
      setLiveMsg((e as Error).message);
    }
  };

  const disconnect = () => {
    setCatalog(MU_SEED);
    setAppId("app-dsm");
    setAssigned(new Set(MU_SEED.assignments));
    setSelDgs(new Set());
    setSelSections(new Set());
    setSelClients([]);
    setStaged(new Map());
    setLiveOn(false);
  };

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
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Massive update</h1>
            <p className="mt-0.5 max-w-3xl text-sm text-muted-foreground">
              Push a dashboard <strong>section</strong> into many clients' <strong>datagroups</strong> at once
              (or remove) — instead of one client at a time. Select sections on the left, datagroups on the
              right, then insert/remove and review the matrix.
            </p>
          </div>
          <div className="shrink-0">
            {liveOn ? (
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={disconnect}>
                <PlugZap className="h-4 w-4 text-emerald-600" /> Live (prod) · disconnect
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
              <Button size="sm" className="h-8" onClick={connect} disabled={liveStatus === "loading"}>
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
              liveOn ? "bg-emerald-100 text-emerald-800" : "bg-secondary text-muted-foreground",
            )}
          >
            Clients/datagroups: {liveOn ? "LIVE (prod)" : "sample"} · sections & assignments: simulated
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
                  <SearchInput value={sectionQ} onChange={setSectionQ} placeholder="Search sections by name or path" />
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
              {visibleSections.map((s) => (
                <Row
                  key={s.id}
                  checked={selSections.has(s.id)}
                  onToggle={() => toggle(selSections, s.id, setSelSections)}
                  title={s.label}
                  subtitle={s.path}
                  badge={appGroups.find((g) => g.id === s.groupId)?.label}
                />
              ))}
              {!visibleSections.length && <Empty>No sections match.</Empty>}
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

          {/* RIGHT: clients → datagroups (+ optional retailer) */}
          <Panel title={target === "dg" ? "Datagroups" : "Datagroups + retailer"} count={targetColumns.length}>
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
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <SearchInput value={clientQ} onChange={setClientQ} placeholder="Filter clients by name" />
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
                {target === "dgr" && (
                  <FilterChip
                    label="Retailers"
                    icon={Store}
                    options={retailers.map((r) => r.id)}
                    value={selRetailers}
                    onChange={setSelRetailers}
                    getLabel={retailerName}
                    searchable
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <SelectAllRow
                  label={`Select all filtered (${visibleDgs.length})`}
                  onAll={() => setSelDgs(new Set([...selDgs, ...visibleDgs.map((d) => d.id)]))}
                  onClear={() => setSelDgs(new Set())}
                />
                <span className="text-xs text-muted-foreground">
                  {target === "dgr"
                    ? `${selDgs.size} dg × ${selRetailers.length} retailer = ${targetColumns.length} target${targetColumns.length === 1 ? "" : "s"}`
                    : selClients.length
                      ? `${selClients.length} client${selClients.length === 1 ? "" : "s"} · ${filteredClients.length} shown`
                      : `All clients (${clientsWithDg.length})`}
                </span>
              </div>
              {target === "dgr" && !selRetailers.length && (
                <p className="text-xs text-amber-700">Pick one or more retailers to define the datagroup × retailer targets.</p>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
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
                        onToggle={() => toggle(selDgs, d.id, setSelDgs)}
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
          <span className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              <TriangleAlert className="h-3.5 w-3.5 text-amber-500" /> Simulation — no real prod writes
            </span>
            <Button size="sm" className="h-8 gap-1.5" disabled={!staged.size || applying} onClick={apply}>
              {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Apply {staged.size} change{staged.size === 1 ? "" : "s"}
            </Button>
          </span>
        </div>

        {/* Matrix */}
        {selSectionList.length > 0 && targetColumns.length > 0 && (
          <Matrix sections={selSectionList} columns={targetColumns} cellState={cellState} targetKind={target} />
        )}
      </div>
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
    <div className="flex items-center justify-between text-xs">
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
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeTone?: "slate" | "violet";
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
            badgeTone === "violet" ? "bg-violet-100 text-violet-700" : "bg-secondary text-muted-foreground",
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
  const colNoun = targetKind === "dgr" ? "datagroup × retailer" : "datagroup";
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
                Section \ {targetKind === "dgr" ? "Datagroup · Retailer" : "Datagroup"}
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
