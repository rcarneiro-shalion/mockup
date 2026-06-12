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
  pairKey,
  type MuCatalog,
  type MuSection,
  type MuDataGroup,
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CellState = "assigned" | "add" | "remove" | "none";

export function MassiveUpdatePage() {
  const [catalog, setCatalog] = useState<MuCatalog>(MU_SEED);
  const [liveOn, setLiveOn] = useState(false);

  const [appId, setAppId] = useState<string>("app-dsm");
  const [groupId, setGroupId] = useState<string>(""); // "" = all groups
  const [sectionQ, setSectionQ] = useState("");
  const [clientQ, setClientQ] = useState("");

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
  const appGroups = useMemo(() => catalog.groups.filter((g) => g.appId === appId), [catalog, appId]);
  const appSections = useMemo(
    () => catalog.sections.filter((s) => appGroups.some((g) => g.id === s.groupId)),
    [catalog, appGroups],
  );
  const sq = sectionQ.trim().toLowerCase();
  const visibleSections = appSections.filter(
    (s) => (!groupId || s.groupId === groupId) && (!sq || `${s.label} ${s.path}`.toLowerCase().includes(sq)),
  );

  const clientsWithDg = useMemo(
    () => catalog.clients.filter((c) => catalog.dataGroups.some((d) => d.clientId === c.id)),
    [catalog],
  );
  const cq = clientQ.trim().toLowerCase();
  const filteredClients = clientsWithDg.filter((c) => !cq || c.name.toLowerCase().includes(cq));
  const visibleDgs = useMemo(
    () => catalog.dataGroups.filter((d) => filteredClients.some((c) => c.id === d.clientId)),
    [catalog, filteredClients],
  );
  const clientName = (id: string) => catalog.clients.find((c) => c.id === id)?.name ?? "—";

  const selSectionList = catalog.sections.filter((s) => selSections.has(s.id));
  const selDgList = catalog.dataGroups.filter((d) => selDgs.has(d.id));

  const cellState = (sectionId: string, dgId: string): CellState => {
    const k = pairKey(sectionId, dgId);
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

  const stageInsert = () => {
    if (!selSections.size || !selDgs.size) return;
    const next = new Map(staged);
    let n = 0;
    for (const s of selSections)
      for (const d of selDgs) {
        const k = pairKey(s, d);
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
    if (!selSections.size || !selDgs.size) return;
    const next = new Map(staged);
    let n = 0;
    for (const s of selSections)
      for (const d of selDgs) {
        const k = pairKey(s, d);
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
      const res = await fetchLive({
        data: { service: "visualization-prod", path: "/v1.0/admin/datagroups?size=200", token: a, idToken: i },
      });
      if (!res.ok) {
        setLiveStatus("error");
        setLiveMsg(res.error ?? `Request failed (${res.status}).`);
        return;
      }
      const { clients, dataGroups } = mapLiveDataGroups(res.data);
      if (!dataGroups.length) {
        setLiveStatus("error");
        setLiveMsg("No datagroups returned.");
        return;
      }
      setCatalog({ ...MU_SEED, clients, dataGroups });
      setAssigned(new Set()); // assignment state for live datagroups is unknown → simulate fresh
      setSelDgs(new Set());
      setStaged(new Map());
      setLiveOn(true);
      setLiveStatus("idle");
      setShowConnect(false);
      toast.success(`Live: ${dataGroups.length} datagroups across ${clients.length} clients (prod).`);
    } catch (e) {
      setLiveStatus("error");
      setLiveMsg((e as Error).message);
    }
  };

  const disconnect = () => {
    setCatalog(MU_SEED);
    setAssigned(new Set(MU_SEED.assignments));
    setSelDgs(new Set());
    setStaged(new Map());
    setLiveOn(false);
  };

  const app = catalog.apps.find((a) => a.id === appId) ?? catalog.apps[0];

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

        {/* App selector + status line */}
        <div className="mx-6 mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground">Dashboard application</span>
          <Select value={appId} onValueChange={setAppId}>
            <SelectTrigger className="h-8 w-[260px]">
              <SelectValue placeholder="Select application">{app?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {catalog.apps.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              liveOn ? "bg-emerald-100 text-emerald-800" : "bg-secondary text-muted-foreground",
            )}
          >
            Clients/datagroups: {liveOn ? "LIVE (prod)" : "sample"} · sections & assignments: simulated
          </span>
        </div>

        {/* Transfer */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto px-6 py-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* LEFT: dashboard sections */}
          <Panel title="Dashboard sections" count={selSections.size}>
            <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
              <Select value={groupId || "__all__"} onValueChange={(v) => setGroupId(v === "__all__" ? "" : v)}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All dashboard groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All dashboard groups</SelectItem>
                  {appGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <SearchInput value={sectionQ} onChange={setSectionQ} placeholder="Search sections by name or path" />
              <SelectAllRow
                label={`Select all filtered (${visibleSections.length})`}
                onAll={() => setSelSections(new Set([...selSections, ...visibleSections.map((s) => s.id)]))}
                onClear={() => setSelSections(new Set())}
              />
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
              disabled={!selSections.size || !selDgs.size}
              onClick={stageInsert}
            >
              <ArrowRight className="h-4 w-4" /> Insert
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-1.5"
              disabled={!selSections.size || !selDgs.size}
              onClick={stageRemove}
            >
              <ArrowLeft className="h-4 w-4" /> Remove
            </Button>
          </div>

          {/* RIGHT: clients → datagroups */}
          <Panel title="Datagroups" count={selDgs.size}>
            <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
              <SearchInput value={clientQ} onChange={setClientQ} placeholder="Filter clients by name" />
              <SelectAllRow
                label={`Select all filtered (${visibleDgs.length})`}
                onAll={() => setSelDgs(new Set([...selDgs, ...visibleDgs.map((d) => d.id)]))}
                onClear={() => setSelDgs(new Set())}
              />
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
        {selSectionList.length > 0 && selDgList.length > 0 && (
          <Matrix sections={selSectionList} dgs={selDgList} clientName={clientName} cellState={cellState} />
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
  dgs,
  clientName,
  cellState,
}: {
  sections: MuSection[];
  dgs: MuDataGroup[];
  clientName: (id: string) => string;
  cellState: (sectionId: string, dgId: string) => CellState;
}) {
  return (
    <div className="border-t border-border">
      <div className="px-6 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Matrix · {sections.length} section{sections.length === 1 ? "" : "s"} × {dgs.length} datagroup
        {dgs.length === 1 ? "" : "s"}
      </div>
      <div className="max-h-[40vh] overflow-auto px-6 pb-5">
        <table className="border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background px-2 py-1.5 text-left text-xs font-medium text-muted-foreground">
                Section \ Datagroup
              </th>
              {dgs.map((d) => (
                <th key={d.id} className="px-1.5 py-1.5 align-bottom">
                  <div className="mx-auto w-6 whitespace-nowrap text-[11px] text-foreground/80 [writing-mode:vertical-rl] rotate-180">
                    {clientName(d.clientId)} · {d.name}
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
                {dgs.map((d) => {
                  const st = cellState(s.id, d.id);
                  return (
                    <td key={d.id} className="px-1.5 py-1 text-center">
                      <Cell state={st} />
                    </td>
                  );
                })}
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
