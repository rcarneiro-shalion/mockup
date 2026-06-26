import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Th, Td, GroupedPills, Pagination, usePagination, useSort, sortRows, SortTh, parseListDate } from "@/components/seeds/ListPrimitives";
import { FilterChip } from "@/components/seeds/FilterChip";
import { LiveConnectBar } from "@/components/common/LiveConnectBar";
import { usePersistentState } from "@/hooks/usePersistentState";
import type { Client, ClientUser, DataGroup } from "@/lib/clients";
import { nowStamp } from "@/lib/clients";
import { getClientUsersSnapshot } from "@/lib/clientUsersSnapshot";
import { toCsv, downloadCsv, fileSlug } from "@/lib/csv";
import { useLiveConnection } from "@/lib/useLiveConnection";
import { syncClientUsers, applyLiveAssignments, diffMemberships, pairKey, type LiveUserGraph } from "@/lib/liveUsers";
import { bulkReadMaestroGrants, applyMaestroGrants } from "@/lib/liveMaestro";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronUp, Database, Download, LayoutGrid, Loader2, Mail, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, TriangleAlert, UserPlus, Wifi } from "lucide-react";

// Maestro (external app) permission grants, grouped for the bulk matrix exactly as the draft:
// Maestro → View / Manage / Unlimited, Slides → View / Manage. Keys are `<resource>.<grant>`
// (ClientUser.maestroGrants); the modal's resources (explorer/conversation/slides) map to these.
const MAESTRO_GROUPS: { group: string; cols: { key: string; label: string }[] }[] = [
  { group: "Maestro", cols: [
    { key: "explorer.view", label: "View" },
    { key: "conversation.manage", label: "Manage" },
    { key: "conversation.unlimited", label: "Unlimited" },
  ] },
  { group: "Slides", cols: [
    { key: "slides.view", label: "View" },
    { key: "slides.manage", label: "Manage" },
  ] },
];
const MAESTRO_COLS = MAESTRO_GROUPS.flatMap((g) => g.cols);
const MAESTRO_LABEL: Record<string, string> = Object.fromEntries(
  MAESTRO_GROUPS.flatMap((g) => g.cols.map((c) => [c.key, `${g.group} · ${c.label}`])),
);
// Maestro permissions grouped by RESOURCE for the Create-users form (matches the IAM modal):
// explorer → view · conversation → manage / unlimited · slides → view / manage. Same `<resource>.<action>` keys.
const MAESTRO_RESOURCES: { resource: string; actions: { key: string; label: string }[] }[] = [
  { resource: "explorer", actions: [{ key: "explorer.view", label: "view" }] },
  { resource: "conversation", actions: [{ key: "conversation.manage", label: "manage" }, { key: "conversation.unlimited", label: "unlimited" }] },
  { resource: "slides", actions: [{ key: "slides.view", label: "view" }, { key: "slides.manage", label: "manage" }] },
];
// Default dashboard languages offered at user creation (IAM user setting; default English).
const USER_LANGUAGES = ["English", "Spanish", "Portuguese", "French", "German", "Italian"];

// Pool of existing account users that can be assigned to this client (anonymized for the mockup).
const ASSIGNABLE_POOL = [
  "ricardo.alves@coca-cola.com", "nina.petrova@kof.com", "tom.becker@ccep.com", "yuki.tanaka@coca-cola.com",
  "omar.haddad@coca-cola.com", "grace.lee@shalion.com", "pablo.ortiz@embonor.cl", "feng.li@coca-cola.com",
];

// Distinct, identity-stable colors per data group, so the same DG reads the same everywhere
// (column pills, the assign matrix, the dialogs). Keyed by data-group id via a small hash —
// full literal class strings so Tailwind keeps them.
const DG_PALETTE = [
  "border-rose-200 bg-rose-50 text-rose-700",
  "border-amber-200 bg-amber-50 text-amber-800",
  "border-lime-200 bg-lime-50 text-lime-700",
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-teal-200 bg-teal-50 text-teal-700",
  "border-sky-200 bg-sky-50 text-sky-700",
  "border-indigo-200 bg-indigo-50 text-indigo-700",
  "border-violet-200 bg-violet-50 text-violet-700",
  "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  "border-pink-200 bg-pink-50 text-pink-700",
  "border-cyan-200 bg-cyan-50 text-cyan-700",
  "border-orange-200 bg-orange-50 text-orange-700",
];
function dataGroupColorClass(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) >>> 0;
  return DG_PALETTE[h % DG_PALETTE.length];
}

/**
 * Client-level Users grid (moved up from the per–data-group Users tab). A user can belong
 * to many data groups at once; the "Datagroup" column lists the memberships — but only the
 * data groups of THIS client (cross-client memberships, e.g. for internal CS/Sales staff,
 * are intentionally not shown here; that is a future IAM-module view).
 */
// Client Users × data-groups section with one environment selector: Simulated (seeded mockup)
// · Dev · Prod (the real visualization-api). Dev/Prod are localhost-only; Vercel locks Simulated.
export function ClientUsersSection({
  client,
  set,
}: {
  client: Client;
  set: <K extends keyof Client>(k: K, v: Client[K]) => void;
}) {
  const [open, setOpen] = usePersistentState<boolean>("pref:clientForm:usersOpen", true);
  const [search, setSearch] = useState("");
  const [dgFilter, setDgFilter] = useState<string[]>([]); // data-group ids to narrow the grid
  const [assignOpen, setAssignOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<ClientUser | null>(null);

  // Live (real-API) connection — the Massive update pattern, via the shared useLiveConnection
  // hook + <LiveConnectBar/>: a Dev/Prod choice, a token gate, and Connect / Refresh / disconnect.
  // When NOT connected we render the pre-fetched snapshot (so the hosted/Vercel build, where the
  // live API isn't reachable, still shows realistic data); on localhost the user can Connect to
  // read + write against the real visualization-api. Defaults to prod (public — the env that loads).
  const conn = useLiveConnection<LiveUserGraph>({
    storageKey: `pref:clientUsers:${client.id}`,
    defaultEnv: "prod",
    load: ({ env, token, idToken, onProgress }) =>
      syncClientUsers({ clientName: client.account || client.name, env, token, idToken, onProgress }),
  });
  const live = conn.connected; // true ⇒ the grid shows real live data (else: snapshot)
  const liveGraph = conn.data;
  const liveEnv = conn.loadedEnv;
  const hasToken = conn.hasToken;
  const [applying, setApplying] = useState(false);
  const [liveConfirm, setLiveConfirm] = useState<{ adds: { userId: string; dataGroupId: string }[]; removes: { relationId: string; userId: string; dataGroupId: string }[]; skipped: { userId: string; dataGroupId: string }[]; permChanges: { userId: string; desiredKeys: string[] }[] } | null>(null);
  // Live Maestro permission grants (IAM), read on demand when the live "Assign & permissions"
  // matrix opens: userId -> granted mockup keys. Reset whenever the live graph changes
  // (connect / refresh / disconnect) so a re-open re-reads fresh.
  const [livePerms, setLivePerms] = useState<Map<string, string[]> | null>(null);
  const [permLoading, setPermLoading] = useState(false);
  useEffect(() => { setLivePerms(null); }, [liveGraph]);
  // The data-group id space differs between snapshot and live, so clear the grid filter when the
  // source flips (stale ids would just silently match nothing).
  useEffect(() => { setDgFilter([]); }, [live]);
  // Toast the specifics after a Connect/Refresh (LiveConnectBar drives the generic flow).
  const onSynced = (g: LiveUserGraph | null) => {
    if (g) toast.success(`Synced ${g.users.length} users · ${g.dataGroups.length} data groups${g.truncated ? " (partial)" : ""}`);
  };

  // Effective data source: the pre-fetched snapshot (disconnected) or the live visualization-api graph.
  const liveUsersList = useMemo<ClientUser[]>(() => {
    if (!liveGraph) return [];
    return liveGraph.users.map((u) => ({
      id: u.id,
      email: u.email,
      status: u.isActive ? "Active" : "Inactive",
      dataGroupIds: liveGraph.dataGroups.filter((d) => liveGraph.memberships.has(pairKey(u.id, d.id))).map((d) => d.id),
      createdAt: "—",
      updatedAt: "—",
    }));
  }, [liveGraph]);
  const liveDgList = useMemo<DataGroup[]>(
    () => (liveGraph?.dataGroups ?? []).map((d) => ({ id: d.id, name: d.name, dashboardType: "", createdAt: "", updatedAt: "" })),
    [liveGraph],
  );
  // Live users enriched with their (live-read) Maestro grants — fed to the live unified matrix.
  const liveUsersWithGrants = useMemo<ClientUser[]>(
    () => liveUsersList.map((u) => ({ ...u, maestroGrants: livePerms?.get(u.id) ?? [] })),
    [liveUsersList, livePerms],
  );
  const effUsers = live ? liveUsersList : getClientUsersSnapshot(client);
  const effDataGroups = live ? liveDgList : (client.dataGroups ?? []);

  const dgNameById = useMemo(() => new Map(effDataGroups.map((d) => [d.id, d.name])), [effDataGroups]);
  const dgColorByName = useMemo(() => new Map(effDataGroups.map((d) => [d.name, dataGroupColorClass(d.id)])), [effDataGroups]);
  // Resolve a user's memberships to names within THIS client only (unknown ids dropped).
  const dgNames = useMemo(
    () => (u: ClientUser) => u.dataGroupIds.map((id) => dgNameById.get(id)).filter((n): n is string => !!n),
    [dgNameById],
  );

  const setUsers = (next: ClientUser[]) => set("users", next);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const dgSel = new Set(dgFilter);
    return effUsers.filter((u) => {
      if (dgSel.size && !u.dataGroupIds.some((id) => dgSel.has(id))) return false;
      if (!q) return true;
      return u.email.toLowerCase().includes(q) || dgNames(u).some((n) => n.toLowerCase().includes(q));
    });
  }, [effUsers, search, dgNames, dgFilter]);

  // Sortable columns; the chosen column + direction persist across reloads (one global pref for
  // this grid, `pref:sort:clientUsers`). Date columns parse the display strings to epoch; the
  // Datagroup column sorts by its (resolved, client-scoped) joined names.
  const sort = useSort("clientUsers", "email", "asc");
  const sortAccessors = useMemo(
    () => ({
      email: (u: ClientUser) => u.email,
      datagroups: (u: ClientUser) => dgNames(u).join(", "),
      status: (u: ClientUser) => u.status,
      createdAt: (u: ClientUser) => parseListDate(u.createdAt),
      updatedAt: (u: ClientUser) => parseListDate(u.updatedAt),
    }),
    [dgNames],
  );
  const sorted = useMemo(() => sortRows(filtered, sort, sortAccessors), [filtered, sort, sortAccessors]);

  const pg = usePagination(sorted.length, `${search}|${dgFilter.join(",")}|${sort.key}|${sort.dir}`);
  const rows = pg.slice(sorted);
  const hasFilter = !!search.trim() || dgFilter.length > 0;

  // Export the FULL filtered + sorted set (every matching user — not just the visible page).
  const exportUsersCsv = () => {
    const header = ["Email", "Data groups", "Status", "Created at", "Updated at"];
    const body = sorted.map((u) => [u.email, dgNames(u).join("; "), u.status, u.createdAt, u.updatedAt]);
    downloadCsv(`${fileSlug(client.name)}-users`, toCsv([header, ...body]));
    const partial = live && !!liveGraph?.truncated; // live sync hit its safety cap → set is incomplete
    toast[partial ? "warning" : "success"](`Exported ${sorted.length} user${sorted.length === 1 ? "" : "s"}${partial ? " — LIVE data is partial, some users may be missing" : ""} to CSV`);
  };

  const emptyMsg = effUsers.length === 0
    ? (live ? "No live users found for this client (check the client name matches production)." : "No users yet.")
    : "No users match your search.";

  const removeUser = (id: string) => {
    const cur = client.users ?? [];
    const u = cur.find((x) => x.id === id);
    setUsers(cur.filter((x) => x.id !== id));
    if (u) toast.success(`Removed ${u.email}`);
  };
  const saveMembership = (id: string, ids: string[]) => {
    const cur = client.users ?? [];
    setUsers(cur.map((u) => (u.id === id ? { ...u, dataGroupIds: ids, updatedAt: nowStamp() } : u)));
  };
  // Unified Mockup apply (data-group membership + Maestro permissions in one matrix): update
  // each existing user (bump updatedAt only when its memberships or grants changed), and create
  // pool users who got any tick.
  const sameSet = (a: string[], b: string[]) => a.slice().sort().join(",") === b.slice().sort().join(",");
  const applyUnified = ({
    existing,
    created,
  }: {
    existing: { id: string; dataGroupIds: string[]; maestroGrants: string[] }[];
    created: { email: string; dataGroupIds: string[]; maestroGrants: string[] }[];
  }) => {
    const cur = client.users ?? [];
    const now = nowStamp();
    let changed = 0;
    const next = cur.map((u) => {
      const e = existing.find((x) => x.id === u.id);
      if (!e) return u;
      if (sameSet(e.dataGroupIds, u.dataGroupIds) && sameSet(e.maestroGrants, u.maestroGrants ?? [])) return u;
      changed++;
      return { ...u, dataGroupIds: e.dataGroupIds, maestroGrants: e.maestroGrants, updatedAt: now };
    });
    const createdUsers = created.map((c) => ({ id: crypto.randomUUID(), email: c.email, status: "Active" as const, dataGroupIds: c.dataGroupIds, maestroGrants: c.maestroGrants, createdAt: now, updatedAt: now }));
    setUsers([...next, ...createdUsers]);
    setAssignOpen(false);
    const parts: string[] = [];
    if (changed) parts.push(`updated ${changed}`);
    if (createdUsers.length) parts.push(`added ${createdUsers.length}`);
    toast.success(parts.length ? `Assignments & permissions — ${parts.join(", ")}` : "No changes");
  };

  // Open the live "Assign & permissions" matrix: lazily bulk-read each live user's Maestro grants
  // from IAM (so the permission columns reflect reality), then open. Cached until the graph changes.
  const openLiveAssign = async () => {
    if (!liveGraph) return;
    if (livePerms) { setAssignOpen(true); return; }
    setPermLoading(true);
    const tid = toast.loading("Reading Maestro permissions…");
    try {
      const map = await bulkReadMaestroGrants(
        liveUsersList.map((u) => u.id),
        { token: conn.token, idToken: conn.idToken, env: liveEnv },
        (d, t) => toast.loading(`Reading Maestro permissions… ${d}/${t}`, { id: tid }),
      );
      setLivePerms(map);
      toast.dismiss(tid);
      setAssignOpen(true);
    } catch (e) {
      toast.error(`Couldn’t read permissions: ${(e as Error).message}`, { id: tid });
    } finally {
      setPermLoading(false);
    }
  };

  // Live unified apply: diff desired DG memberships vs the synced graph AND desired Maestro grants
  // vs the live-read grants → confirm → real writes (visualization-api + IAM).
  const requestLiveApply = ({ existing }: { existing: { id: string; dataGroupIds: string[]; maestroGrants: string[] }[] }) => {
    if (!liveGraph) return;
    setAssignOpen(false);
    // Safety gate: never write unless the sync resolved to exactly ONE live client (the
    // exact-name match should give 0 or 1; >1 means an ambiguous/duplicate name — block).
    if (liveGraph.matchedClients.length !== 1) {
      toast.error(`Sync matched ${liveGraph.matchedClients.length} live clients — refine to exactly one before assigning.`);
      return;
    }
    const desired = new Set<string>();
    for (const e of existing) for (const dg of e.dataGroupIds) desired.add(pairKey(e.id, dg));
    const { adds, removes, skipped } = diffMemberships(liveGraph, desired);
    const permChanges = existing
      .filter((e) => !sameSet(e.maestroGrants ?? [], livePerms?.get(e.id) ?? []))
      .map((e) => ({ userId: e.id, desiredKeys: e.maestroGrants ?? [] }));
    if (!adds.length && !removes.length && !permChanges.length) {
      toast.success(skipped.length ? `No applicable changes — ${skipped.length} unassign(s) skipped (no relation id)` : "No changes");
      return;
    }
    setLiveConfirm({ adds, removes, skipped, permChanges });
  };
  const runLiveApply = async () => {
    if (!liveConfirm || !hasToken) return;
    const { adds, removes, skipped, permChanges } = liveConfirm;
    setLiveConfirm(null); setApplying(true);
    try {
      const parts: string[] = [];
      let failed = 0;
      if (adds.length || removes.length) {
        const results = await applyLiveAssignments({ env: liveEnv, token: conn.token, idToken: conn.idToken, adds, removes });
        const f = results.filter((r) => r.status === "error").length;
        failed += f;
        parts.push(`data groups: ${results.length - f} applied${f ? `, ${f} failed` : ""}`);
      }
      if (permChanges.length) {
        const pres = await applyMaestroGrants({ env: liveEnv, token: conn.token, idToken: conn.idToken, changes: permChanges });
        const pf = pres.filter((r) => r.status === "error").length;
        failed += pf;
        parts.push(`permissions: ${pres.length - pf} applied${pf ? `, ${pf} failed` : ""}`);
      }
      if (skipped.length) parts.push(`${skipped.length} skipped`);
      toast[failed || skipped.length ? "warning" : "success"](`Live ${liveEnv} — ${parts.join(" · ") || "no changes"}`);
      setLivePerms(null); // force a fresh grant re-read on the next open
      onSynced(await conn.refresh()); // re-pull memberships so the grid reflects the writes
    } catch (e) {
      toast.error(`Apply failed: ${(e as Error).message}`);
    } finally { setApplying(false); }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
            <ChevronUp className={cn("h-4 w-4 transition-transform", !open && "rotate-180")} />
          </span>
          <span className="text-base font-semibold text-foreground">Users</span>
          <span className="text-sm text-muted-foreground">({hasFilter ? `${filtered.length} of ${effUsers.length}` : effUsers.length})</span>
          {live && <span className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700"><Wifi className="h-3 w-3" /> live</span>}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <LiveConnectBar conn={conn} serviceLabel="visualization-api" onData={onSynced} />
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="h-8 w-52 rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <FilterChip
            label="Data groups"
            icon={LayoutGrid}
            options={effDataGroups.map((d) => d.id)}
            value={dgFilter}
            onChange={setDgFilter}
            getLabel={(id) => dgNameById.get(id) ?? id}
            searchable
          />
          {!live && (
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Create users
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8 gap-1.5" disabled={live && (!liveGraph || !hasToken || applying || permLoading)} onClick={() => (live ? openLiveAssign() : setAssignOpen(true))}>
            {permLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />} Assign &amp; permissions
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" disabled={!sorted.length} onClick={exportUsersCsv} title="Export all matching users (CSV)" aria-label="Export CSV">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {live && liveGraph && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-xs text-sky-900/80">
          <span className="inline-flex items-center gap-1.5 font-semibold text-sky-900"><Wifi className="h-3.5 w-3.5" /> Live · visualization-api · <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white", liveEnv === "prod" ? "bg-rose-600" : "bg-emerald-600")}>{liveEnv}</span></span>
          <span>{liveGraph.users.length} users · {liveGraph.dataGroups.length} data groups{liveGraph.matchedClients.length ? ` · ${liveGraph.matchedClients.join(", ")}` : ""}{liveGraph.truncated ? " · partial" : ""}</span>
          {conn.connectedAt && <span className="text-sky-900/60">· connected {conn.connectedAt}</span>}
          <span className="w-full text-sky-900/70">Real reads + writes hit <span className="font-medium">{liveEnv}</span>: data-group assigns (visualization-api) + Maestro permissions (IAM). Disconnect to return to the snapshot. Creating users stays local.</span>
        </div>
      )}

      {open && (
        <>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr>
                  <SortTh label="Email" sortKey="email" sort={sort} />
                  <SortTh label="Datagroup" sortKey="datagroups" sort={sort} />
                  <SortTh label="Status" sortKey="status" sort={sort} />
                  <SortTh label="Created at" sortKey="createdAt" sort={sort} />
                  <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
                  <Th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">{emptyMsg}</td>
                  </tr>
                ) : (
                  rows.map((u) => (
                    <tr key={u.id} className="border-t border-border hover:bg-secondary/40">
                      <Td className="text-foreground">{u.email}</Td>
                      <Td>
                        <GroupedPills items={dgNames(u)} noun="data group" onSeeAll={live ? undefined : () => setEditUser(u)} colorFor={(name) => dgColorByName.get(name) ?? ""} />
                      </Td>
                      <Td><StatusPill status={u.status} /></Td>
                      <Td className="text-muted-foreground">{u.createdAt}</Td>
                      <Td className="text-muted-foreground">{u.updatedAt}</Td>
                      <Td>
                        {live ? (
                          <span className="block text-right text-xs text-muted-foreground">via Assign</span>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditUser(u)}
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                              aria-label={`Edit data groups for ${u.email}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toast.success(`Invitation sent to ${u.email}`)}
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                              aria-label={`Email ${u.email}`}
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeUser(u.id)}
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                              aria-label={`Remove ${u.email}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            total={filtered.length}
            page={pg.page}
            pageSize={pg.pageSize}
            onPageChange={pg.setPage}
            onPageSizeChange={pg.setPageSize}
          />
        </>
      )}

      {assignOpen && live && (
        <UnifiedMatrixDialog
          users={liveUsersWithGrants}
          dataGroups={effDataGroups}
          assignable={[]}
          partial={!!liveGraph?.truncated}
          onClose={() => setAssignOpen(false)}
          onApply={requestLiveApply}
        />
      )}
      {assignOpen && !live && (
        <UnifiedMatrixDialog
          users={client.users ?? []}
          dataGroups={client.dataGroups ?? []}
          assignable={ASSIGNABLE_POOL.filter((e) => !(client.users ?? []).some((u) => u.email === e))}
          onClose={() => setAssignOpen(false)}
          onApply={applyUnified}
        />
      )}
      {createOpen && (
        <CreateUsersDialog
          dataGroups={client.dataGroups ?? []}
          onClose={() => setCreateOpen(false)}
          onCreate={(emails, dgIds, language, maestroGrants) => {
            const now = nowStamp();
            const cur = client.users ?? [];
            const existing = new Set(cur.map((u) => u.email.toLowerCase()));
            const fresh = emails.filter((e) => !existing.has(e.toLowerCase()));
            setUsers([
              ...cur,
              ...fresh.map((email) => ({ id: crypto.randomUUID(), email, status: "Active" as const, dataGroupIds: dgIds, maestroGrants, language, createdAt: now, updatedAt: now })),
            ]);
            setCreateOpen(false);
            toast.success(`Created ${fresh.length} user${fresh.length === 1 ? "" : "s"}`);
          }}
        />
      )}
      {editUser && (
        <ManageDataGroupsDialog
          user={editUser}
          dataGroups={client.dataGroups ?? []}
          onClose={() => setEditUser(null)}
          onSave={(ids) => {
            saveMembership(editUser.id, ids);
            setEditUser(null);
            toast.success("Data groups updated");
          }}
        />
      )}
      {liveConfirm && (
        <Dialog open onOpenChange={(o) => { if (!o) setLiveConfirm(null); }}>
          <DialogContent className="sm:max-w-[460px]">
            <DialogHeader><DialogTitle>Apply to {liveEnv === "prod" ? "PRODUCTION" : "Develop"}?</DialogTitle></DialogHeader>
            <p className={cn("rounded-md border px-3 py-2 text-sm", liveEnv === "prod" ? "border-rose-300 bg-rose-50 text-rose-900" : "border-amber-300 bg-amber-50 text-amber-900")}>
              <span className="inline-flex items-center gap-1.5 font-semibold"><TriangleAlert className="h-4 w-4" /> Real write to {liveEnv === "prod" ? "PRODUCTION" : "Develop"}.</span>{" "}
              Data-group memberships via visualization-api; Maestro permissions via IAM (reversible by re-applying).
            </p>
            <ul className="space-y-1 rounded-md border border-border bg-secondary/40 p-3 text-[13px]">
              <li className="text-emerald-700">Assign (data group): <span className="font-medium">{liveConfirm.adds.length}</span></li>
              <li className="text-rose-600">Unassign (data group): <span className="font-medium">{liveConfirm.removes.length}</span></li>
              <li className="text-indigo-700">Permission changes (Maestro): <span className="font-medium">{liveConfirm.permChanges.length}</span> user(s)</li>
              {liveConfirm.skipped.length > 0 && <li className="text-amber-700">Skipped (no relation id): <span className="font-medium">{liveConfirm.skipped.length}</span></li>}
            </ul>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLiveConfirm(null)}>Cancel</Button>
              <Button className={cn("gap-1.5", liveEnv === "prod" && "bg-rose-600 text-white hover:bg-rose-700")} disabled={!hasToken} onClick={runLiveApply}>
                {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Apply on {liveEnv}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: "Active" | "Inactive" }) {
  const active = status === "Active";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        active ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-border bg-secondary text-muted-foreground",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-muted-foreground/50")} />
      {status}
    </span>
  );
}

/** Searchable checkbox list of the client's data groups (the only assignable scope). */
function DgMultiSelect({
  dataGroups,
  selected,
  onToggle,
}: {
  dataGroups: DataGroup[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const list = dataGroups.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search data groups"
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="max-h-48 overflow-auto rounded-md border border-border">
        {dataGroups.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">This client has no data groups yet.</div>
        ) : list.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">No matches.</div>
        ) : (
          list.map((d) => (
            <label
              key={d.id}
              className="flex cursor-pointer items-center gap-2 border-b border-border px-3 py-2 text-sm last:border-0 hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={selected.has(d.id)}
                onChange={() => onToggle(d.id)}
                className="h-4 w-4 rounded border-border"
              />
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full border", dataGroupColorClass(d.id))} />
              <span className="text-foreground">{d.name}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

function ManageDataGroupsDialog({
  user,
  dataGroups,
  onClose,
  onSave,
}: {
  user: ClientUser;
  dataGroups: DataGroup[];
  onClose: () => void;
  onSave: (ids: string[]) => void;
}) {
  const valid = new Set(dataGroups.map((d) => d.id));
  const [selected, setSelected] = useState<Set<string>>(new Set(user.dataGroupIds.filter((id) => valid.has(id))));
  const toggle = (id: string) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>Data groups — {user.email}</DialogTitle></DialogHeader>
        <p className="-mt-1 text-sm text-muted-foreground">Choose which of this client's data groups the user belongs to.</p>
        <DgMultiSelect dataGroups={dataGroups} selected={selected} onToggle={toggle} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave([...selected])}>Save ({selected.size})</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Unified bulk matrix (Mockup): users (rows) × [Maestro permission grants — grouped permissions →
 * Maestro View/Manage/Unlimited · Slides View/Manage] + [this client's data-group membership
 * columns, colored + / ✓ toggles]. Per-column select-all over visible rows; user search +
 * data-group column filter + "only members" row filter; pool users created on any tick. Apply
 * returns both memberships and grants.
 */
function UnifiedMatrixDialog({
  users,
  dataGroups,
  assignable,
  partial,
  onClose,
  onApply,
}: {
  users: ClientUser[];
  dataGroups: DataGroup[];
  assignable: string[];
  partial?: boolean;
  onClose: () => void;
  onApply: (changes: {
    existing: { id: string; dataGroupIds: string[]; maestroGrants: string[] }[];
    created: { email: string; dataGroupIds: string[]; maestroGrants: string[] }[];
  }) => void;
}) {
  const rows = useMemo(
    () => [
      ...users.map((u) => ({ key: `u:${u.id}`, email: u.email, isNew: false })),
      ...assignable.map((e) => ({ key: `p:${e}`, email: e, isNew: true })),
    ],
    [users, assignable],
  );
  const validIds = useMemo(() => new Set(dataGroups.map((d) => d.id)), [dataGroups]);
  const initialTicks = useMemo(() => {
    const s = new Set<string>();
    for (const u of users) for (const id of u.dataGroupIds) if (validIds.has(id)) s.add(`u:${u.id}::${id}`);
    return s;
  }, [users, validIds]);
  const initialGrants = useMemo(() => new Map(users.map((u) => [`u:${u.id}`, new Set(u.maestroGrants ?? [])])), [users]);

  const [ticks, setTicks] = useState<Set<string>>(() => new Set(initialTicks));
  const [grants, setGrants] = useState<Map<string, Set<string>>>(() => new Map([...initialGrants].map(([k, v]) => [k, new Set(v)])));
  const [q, setQ] = useState("");
  const [dgFilter, setDgFilter] = useState<string[]>([]);
  const [permFilter, setPermFilter] = useState<string[]>([]);
  const [onlyMembers, setOnlyMembers] = useState(false);

  const visibleCols = dgFilter.length ? dataGroups.filter((d) => dgFilter.includes(d.id)) : dataGroups;
  const memberScope = dgFilter.length ? dgFilter : dataGroups.map((d) => d.id);
  const visibleRows = rows.filter(
    (r) =>
      r.email.toLowerCase().includes(q.toLowerCase()) &&
      (!onlyMembers || memberScope.some((id) => ticks.has(`${r.key}::${id}`))) &&
      (!permFilter.length || permFilter.some((k) => grants.get(r.key)?.has(k))),
  );

  const toggleTick = (key: string) => setTicks((p) => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const toggleGrant = (rk: string, gk: string) => setGrants((p) => { const m = new Map(p); const s = new Set(m.get(rk) ?? []); s.has(gk) ? s.delete(gk) : s.add(gk); m.set(rk, s); return m; });
  const dgCol = (id: string): "none" | "some" | "all" => { if (!visibleRows.length) return "none"; const n = visibleRows.filter((r) => ticks.has(`${r.key}::${id}`)).length; return n === 0 ? "none" : n === visibleRows.length ? "all" : "some"; };
  const toggleDgCol = (id: string) => setTicks((p) => { const n = new Set(p); const all = visibleRows.every((r) => n.has(`${r.key}::${id}`)); for (const r of visibleRows) { const k = `${r.key}::${id}`; all ? n.delete(k) : n.add(k); } return n; });
  const grCol = (gk: string): "none" | "some" | "all" => { if (!visibleRows.length) return "none"; const n = visibleRows.filter((r) => grants.get(r.key)?.has(gk)).length; return n === 0 ? "none" : n === visibleRows.length ? "all" : "some"; };
  const toggleGrCol = (gk: string) => setGrants((p) => { const m = new Map(p); const all = visibleRows.every((r) => (m.get(r.key) ?? new Set()).has(gk)); for (const r of visibleRows) { const s = new Set(m.get(r.key) ?? []); all ? s.delete(gk) : s.add(gk); m.set(r.key, s); } return m; });

  const changes = useMemo(() => {
    let c = 0;
    for (const r of rows) {
      const dgNow = dataGroups.filter((d) => ticks.has(`${r.key}::${d.id}`)).map((d) => d.id).sort().join(",");
      const dgInit = r.isNew ? "" : dataGroups.filter((d) => initialTicks.has(`${r.key}::${d.id}`)).map((d) => d.id).sort().join(",");
      const grNow = [...(grants.get(r.key) ?? [])].sort().join(",");
      const grInit = [...(initialGrants.get(r.key) ?? [])].sort().join(",");
      if (dgNow !== dgInit || grNow !== grInit) c++;
    }
    return c;
  }, [rows, dataGroups, ticks, grants, initialTicks, initialGrants]);

  const apply = () => {
    const existing = users.map((u) => ({
      id: u.id,
      dataGroupIds: dataGroups.filter((d) => ticks.has(`u:${u.id}::${d.id}`)).map((d) => d.id),
      maestroGrants: [...(grants.get(`u:${u.id}`) ?? [])],
    }));
    const created = assignable
      .map((e) => ({
        email: e,
        dataGroupIds: dataGroups.filter((d) => ticks.has(`p:${e}::${d.id}`)).map((d) => d.id),
        maestroGrants: [...(grants.get(`p:${e}`) ?? [])],
      }))
      .filter((c) => c.dataGroupIds.length > 0 || c.maestroGrants.length > 0);
    onApply({ existing, created });
  };

  // Export every matching row (respects the matrix filters) with its current permissions + data
  // groups — email, permissions, data groups.
  const exportCsv = () => {
    const header = ["Email", "Permissions", "Data groups"];
    const body = visibleRows.filter((r) => !r.isNew).map((r) => [
      r.email,
      MAESTRO_COLS.filter((c) => grants.get(r.key)?.has(c.key)).map((c) => MAESTRO_LABEL[c.key]).join("; "),
      dataGroups.filter((d) => ticks.has(`${r.key}::${d.id}`)).map((d) => d.name).join("; "),
    ]);
    downloadCsv("assign-permissions", toCsv([header, ...body]));
    toast[partial ? "warning" : "success"](`Exported ${body.length} user${body.length === 1 ? "" : "s"}${partial ? " — LIVE data is partial, some users may be missing" : ""} to CSV`);
  };

  const selAll = (st: "none" | "some" | "all", onChange: () => void, title: string) => (
    <input type="checkbox" checked={st === "all"} ref={(el) => { if (el) el.indeterminate = st === "some"; }} onChange={onChange} title={title} className="h-3.5 w-3.5 rounded border-border" />
  );

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[1040px]">
        <DialogHeader><DialogTitle>Assign data groups & Maestro permissions</DialogTitle></DialogHeader>
        <p className="-mt-1 text-sm text-muted-foreground">
          Set Maestro / Slides permissions and data-group membership in one grid. Column headers select all
          (visible) users; pool users (marked <span className="font-medium text-foreground">new</span>) are added on any tick.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-60">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users" className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <FilterChip label="Data groups" icon={LayoutGrid} options={dataGroups.map((d) => d.id)} value={dgFilter} onChange={setDgFilter} getLabel={(id) => dataGroups.find((d) => d.id === id)?.name ?? id} searchable />
          <FilterChip label="Permissions" icon={ShieldCheck} options={MAESTRO_COLS.map((c) => c.key)} value={permFilter} onChange={setPermFilter} getLabel={(k) => MAESTRO_LABEL[k] ?? k} />
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" title="Show only users that belong to the filtered data groups.">
            <input type="checkbox" checked={onlyMembers} onChange={(e) => setOnlyMembers(e.target.checked)} className="h-4 w-4 rounded border-border" /> Only in data groups
          </label>
        </div>
        <div className="max-h-[58vh] overflow-auto rounded-md border border-border">
          <table className="border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th rowSpan={3} className="sticky left-0 z-20 border-b border-r border-border bg-card px-3 text-left text-xs font-medium text-muted-foreground">User \ Data group</th>
                <th colSpan={MAESTRO_COLS.length} className="border-b border-l border-border bg-secondary/40 px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">permissions</th>
                {visibleCols.map((d) => (
                  <th key={d.id} rowSpan={3} className="border-b border-l border-border bg-card px-1 pt-1 align-bottom">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn("h-2.5 w-2.5 rounded-full border", dataGroupColorClass(d.id))} title={d.name} />
                      <div className="mx-auto max-h-32 w-5 overflow-hidden whitespace-nowrap text-[11px] text-foreground/80 [writing-mode:vertical-rl] rotate-180" title={d.name}>{d.name}</div>
                      {selAll(dgCol(d.id), () => toggleDgCol(d.id), `Select all visible for ${d.name}`)}
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                {MAESTRO_GROUPS.map((g) => (
                  <th key={g.group} colSpan={g.cols.length} className="border-b border-l border-border bg-card px-2 py-1 text-center text-xs font-semibold text-foreground">{g.group}</th>
                ))}
              </tr>
              <tr>
                {MAESTRO_COLS.map((c, i) => (
                  <th key={c.key} className={cn("border-b border-border bg-card px-1 py-1 align-bottom", i === 0 && "border-l")}>
                    <div className="flex flex-col items-center gap-1"><span className="text-[11px] text-foreground/80">{c.label}</span>{selAll(grCol(c.key), () => toggleGrCol(c.key), `Select all visible for ${c.label}`)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr><td colSpan={MAESTRO_COLS.length + visibleCols.length + 1} className="px-3 py-6 text-center text-muted-foreground">No users match your filters.</td></tr>
              ) : (
                visibleRows.map((r) => (
                  <tr key={r.key} className="hover:bg-secondary/40">
                    <td className="sticky left-0 z-10 border-t border-r border-border bg-card px-3 py-1.5 whitespace-nowrap">
                      <span className="text-foreground">{r.email}</span>
                      {r.isNew && <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">new</span>}
                    </td>
                    {MAESTRO_COLS.map((c, i) => (
                      <td key={c.key} className={cn("border-t border-border px-1 py-1 text-center", i === 0 && "border-l")}>
                        <input type="checkbox" checked={!!grants.get(r.key)?.has(c.key)} onChange={() => toggleGrant(r.key, c.key)} className="h-4 w-4 rounded border-border" />
                      </td>
                    ))}
                    {visibleCols.map((d) => {
                      const on = ticks.has(`${r.key}::${d.id}`);
                      return (
                        <td key={d.id} className="border-t border-l border-border px-1 py-1 text-center">
                          <button type="button" onClick={() => toggleTick(`${r.key}::${d.id}`)} title={`${r.email} — ${d.name}`} className={cn("mx-auto grid h-5 min-w-5 place-items-center rounded border px-1 text-[10px] font-semibold transition-transform hover:scale-110", on ? dataGroupColorClass(d.id) : "border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary")}>
                            {on ? "✓" : <Plus className="h-3 w-3" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button variant="outline" className="mr-auto gap-1.5" disabled={!visibleRows.length} onClick={exportCsv} title="Export these users — email, permissions, data groups (CSV)">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={changes === 0} onClick={apply}>Apply{changes ? ` (${changes})` : ""}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateUsersDialog({
  dataGroups,
  onClose,
  onCreate,
}: {
  dataGroups: DataGroup[];
  onClose: () => void;
  onCreate: (emails: string[], dgIds: string[], language: string, maestroGrants: string[]) => void;
}) {
  const [emails, setEmails] = useState("");
  const [language, setLanguage] = useState("English");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [grants, setGrants] = useState<Set<string>>(new Set());
  const [permsOpen, setPermsOpen] = useState(true);
  const toggleDg = (id: string) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleGrant = (k: string) => setGrants((prev) => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  // De-duplicate the pasted batch case-insensitively (keeps first-seen casing).
  const parsed = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of emails.split(/[,;\s]+/).map((x) => x.trim()).filter(Boolean)) {
      const k = s.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out.push(s); }
    }
    return out;
  }, [emails]);
  const dgName = (id: string) => dataGroups.find((d) => d.id === id)?.name ?? id;
  const unselected = dataGroups.filter((d) => !selected.has(d.id));
  const canCreate = parsed.length > 0 && selected.size > 0;
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader><DialogTitle>Create users</DialogTitle></DialogHeader>
        <p className="-mt-1 text-sm text-muted-foreground">New users are created on this client and assigned to the selected data group(s), with the chosen language and Maestro permissions.</p>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Emails <span className="text-destructive">*</span></label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={3}
              placeholder="Enter emails separated by commas, semicolons, or whitespace…"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Language <span className="text-destructive">*</span></label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {USER_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Datagroup <span className="text-destructive">*</span></label>
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2">
              {[...selected].map((id) => (
                <span key={id} className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", dataGroupColorClass(id))}>
                  {dgName(id)}
                  <button type="button" onClick={() => toggleDg(id)} aria-label={`Remove ${dgName(id)}`} className="leading-none opacity-70 hover:opacity-100">×</button>
                </span>
              ))}
              {unselected.length > 0 && (
                <select
                  value=""
                  onChange={(e) => { if (e.target.value) toggleDg(e.target.value); }}
                  aria-label="Add datagroup"
                  className="rounded-md border border-dashed border-border bg-background px-2 py-1 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">+ Add datagroup</option>
                  {unselected.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              )}
              {selected.size === 0 && unselected.length === 0 && <span className="px-1 text-xs text-muted-foreground">No data groups on this client.</span>}
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <button type="button" onClick={() => setPermsOpen((v) => !v)} className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-secondary text-muted-foreground"><ChevronUp className={cn("h-4 w-4 transition-transform", !permsOpen && "rotate-180")} /></span>
              Maestro permissions
            </button>
            {permsOpen && (
              <div className="mt-3">
                {MAESTRO_RESOURCES.map((r, i) => (
                  <div key={r.resource} className={cn("flex items-center gap-6 py-2", i > 0 && "border-t border-border")}>
                    <span className="w-32 text-sm text-foreground">{r.resource}</span>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                      {r.actions.map((a) => (
                        <label key={a.key} className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-foreground">
                          <input type="checkbox" checked={grants.has(a.key)} onChange={() => toggleGrant(a.key)} className="h-4 w-4 rounded border-border" />
                          {a.label}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!canCreate} onClick={() => canCreate && onCreate(parsed, [...selected], language, [...grants])}>
            Create user{parsed.length === 1 ? "" : "s"}{parsed.length ? ` (${parsed.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
