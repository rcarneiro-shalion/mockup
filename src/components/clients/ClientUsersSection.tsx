import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Th, Td, GroupedPills, Pagination, usePagination } from "@/components/seeds/ListPrimitives";
import { FilterChip } from "@/components/seeds/FilterChip";
import type { Client, ClientUser, DataGroup } from "@/lib/clients";
import { nowStamp } from "@/lib/clients";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronUp, LayoutGrid, Mail, Pencil, Plus, Search, Trash2, UserPlus } from "lucide-react";

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
export function ClientUsersSection({
  client,
  set,
}: {
  client: Client;
  set: <K extends keyof Client>(k: K, v: Client[K]) => void;
}) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<ClientUser | null>(null);

  const users = client.users ?? [];
  const dataGroups = client.dataGroups ?? [];
  const dgNameById = useMemo(() => new Map(dataGroups.map((d) => [d.id, d.name])), [dataGroups]);
  const dgColorByName = useMemo(() => new Map(dataGroups.map((d) => [d.name, dataGroupColorClass(d.id)])), [dataGroups]);
  // Resolve a user's memberships to names within THIS client only (unknown / other-client ids dropped).
  const dgNames = useMemo(
    () => (u: ClientUser) => u.dataGroupIds.map((id) => dgNameById.get(id)).filter((n): n is string => !!n),
    [dgNameById],
  );

  const setUsers = (next: ClientUser[]) => set("users", next);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || dgNames(u).some((n) => n.toLowerCase().includes(q)),
    );
  }, [users, search, dgNames]);

  const pg = usePagination(filtered.length, search);
  const rows = pg.slice(filtered);

  const removeUser = (id: string) => {
    const u = users.find((x) => x.id === id);
    setUsers(users.filter((x) => x.id !== id));
    if (u) toast.success(`Removed ${u.email}`);
  };
  const saveMembership = (id: string, ids: string[]) =>
    setUsers(users.map((u) => (u.id === id ? { ...u, dataGroupIds: ids, updatedAt: nowStamp() } : u)));

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
            <ChevronUp className={cn("h-4 w-4 transition-transform", !open && "rotate-180")} />
          </span>
          <span className="text-base font-semibold text-foreground">Users</span>
          <span className="text-sm text-muted-foreground">({users.length})</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="h-8 w-52 rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setAssignOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" /> Assign user
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Create users
          </Button>
        </div>
      </div>

      {open && (
        <>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr>
                  <Th>Email</Th>
                  <Th>Datagroup</Th>
                  <Th>Status</Th>
                  <Th>Created at</Th>
                  <Th>Updated at</Th>
                  <Th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      {users.length === 0 ? "No users yet." : "No users match your search."}
                    </td>
                  </tr>
                ) : (
                  rows.map((u) => (
                    <tr key={u.id} className="border-t border-border hover:bg-secondary/40">
                      <Td className="text-foreground">{u.email}</Td>
                      <Td>
                        <GroupedPills items={dgNames(u)} noun="data group" onSeeAll={() => setEditUser(u)} colorFor={(name) => dgColorByName.get(name) ?? ""} />
                      </Td>
                      <Td><StatusPill status={u.status} /></Td>
                      <Td className="text-muted-foreground">{u.createdAt}</Td>
                      <Td className="text-muted-foreground">{u.updatedAt}</Td>
                      <Td>
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

      {assignOpen && (
        <AssignMatrixDialog
          users={users}
          dataGroups={dataGroups}
          assignable={ASSIGNABLE_POOL.filter((e) => !users.some((u) => u.email === e))}
          onClose={() => setAssignOpen(false)}
          onApply={({ existing, created }) => {
            const now = nowStamp();
            let changedCount = 0;
            const next = users.map((u) => {
              const want = existing.find((e) => e.id === u.id)?.dataGroupIds ?? u.dataGroupIds;
              const changed = want.length !== u.dataGroupIds.length || want.some((id) => !u.dataGroupIds.includes(id));
              if (changed) changedCount++;
              return changed ? { ...u, dataGroupIds: want, updatedAt: now } : u;
            });
            const createdUsers = created.map((c) => ({ id: crypto.randomUUID(), email: c.email, status: "Active" as const, dataGroupIds: c.dataGroupIds, createdAt: now, updatedAt: now }));
            setUsers([...next, ...createdUsers]);
            setAssignOpen(false);
            const parts: string[] = [];
            if (changedCount) parts.push(`updated ${changedCount}`);
            if (createdUsers.length) parts.push(`added ${createdUsers.length}`);
            toast.success(parts.length ? `Assignments — ${parts.join(", ")}` : "No changes");
          }}
        />
      )}
      {createOpen && (
        <CreateUsersDialog
          dataGroups={dataGroups}
          onClose={() => setCreateOpen(false)}
          onCreate={(emails, dgIds) => {
            const now = nowStamp();
            const existing = new Set(users.map((u) => u.email.toLowerCase()));
            const fresh = emails.filter((e) => !existing.has(e.toLowerCase()));
            setUsers([
              ...users,
              ...fresh.map((email) => ({ id: crypto.randomUUID(), email, status: "Active" as const, dataGroupIds: dgIds, createdAt: now, updatedAt: now })),
            ]);
            setCreateOpen(false);
            toast.success(`Created ${fresh.length} user${fresh.length === 1 ? "" : "s"}`);
          }}
        />
      )}
      {editUser && (
        <ManageDataGroupsDialog
          user={editUser}
          dataGroups={dataGroups}
          onClose={() => setEditUser(null)}
          onSave={(ids) => {
            saveMembership(editUser.id, ids);
            setEditUser(null);
            toast.success("Data groups updated");
          }}
        />
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
 * Users × data-groups assignment MATRIX (mirrors Massive update's relationship map):
 * rows = current client users + the assignable pool, columns = this client's data groups,
 * each intersection a toggle. Pool users with at least one tick are created on the client.
 */
function AssignMatrixDialog({
  users,
  dataGroups,
  assignable,
  onClose,
  onApply,
}: {
  users: ClientUser[];
  dataGroups: DataGroup[];
  assignable: string[];
  onClose: () => void;
  onApply: (changes: {
    existing: { id: string; dataGroupIds: string[] }[];
    created: { email: string; dataGroupIds: string[] }[];
  }) => void;
}) {
  const validIds = useMemo(() => new Set(dataGroups.map((d) => d.id)), [dataGroups]);
  // Row keys are namespaced (`u:` existing / `p:` pool) so the two key spaces are provably
  // disjoint regardless of id/email contents; tick keys are `${rowKey}::${dgId}`.
  const rows = useMemo(
    () => [
      ...users.map((u) => ({ key: `u:${u.id}`, email: u.email, isNew: false })),
      ...assignable.map((e) => ({ key: `p:${e}`, email: e, isNew: true })),
    ],
    [users, assignable],
  );
  const initialKeys = useMemo(() => {
    const s = new Set<string>();
    for (const u of users) for (const id of u.dataGroupIds) if (validIds.has(id)) s.add(`u:${u.id}::${id}`);
    return s;
  }, [users, validIds]);
  const [ticks, setTicks] = useState<Set<string>>(() => new Set(initialKeys));
  const [q, setQ] = useState("");
  const [dgFilter, setDgFilter] = useState<string[]>([]);
  const toggle = (key: string) => setTicks((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const visibleRows = rows.filter((r) => r.email.toLowerCase().includes(q.toLowerCase()));
  // Column filter is a VIEW concern only — hidden-column ticks are preserved (apply() uses the full set).
  const visibleCols = dgFilter.length ? dataGroups.filter((d) => dgFilter.includes(d.id)) : dataGroups;
  // Pending changes = toggled cells vs the initial memberships (drives the Apply label).
  const changes = useMemo(() => {
    let c = 0;
    for (const k of ticks) if (!initialKeys.has(k)) c++;
    for (const k of initialKeys) if (!ticks.has(k)) c++;
    return c;
  }, [ticks, initialKeys]);

  const apply = () => {
    const existing = users.map((u) => ({
      id: u.id,
      dataGroupIds: dataGroups.filter((d) => ticks.has(`u:${u.id}::${d.id}`)).map((d) => d.id),
    }));
    const created = assignable
      .map((e) => ({ email: e, dataGroupIds: dataGroups.filter((d) => ticks.has(`p:${e}::${d.id}`)).map((d) => d.id) }))
      .filter((c) => c.dataGroupIds.length > 0);
    onApply({ existing, created });
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[880px]">
        <DialogHeader><DialogTitle>Assign users to data groups</DialogTitle></DialogHeader>
        <p className="-mt-1 text-sm text-muted-foreground">
          Tick the intersections to set which data groups each user belongs to. Pool users (marked{" "}
          <span className="font-medium text-foreground">new</span>) are added to the client when you tick any cell.
        </p>
        {dataGroups.length === 0 ? (
          <div className="rounded-md border border-border px-3 py-6 text-center text-sm text-muted-foreground">
            This client has no data groups yet — create a data group first.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search users"
                  className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <FilterChip
                label="Data groups"
                icon={LayoutGrid}
                options={dataGroups.map((d) => d.id)}
                value={dgFilter}
                onChange={setDgFilter}
                getLabel={(id) => dataGroups.find((d) => d.id === id)?.name ?? id}
                searchable
              />
            </div>
            <div className="max-h-[55vh] overflow-auto rounded-md border border-border">
              <table className="border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 top-0 z-20 border-b border-r border-border bg-card px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      User \ Data group
                    </th>
                    {visibleCols.map((d) => (
                      <th key={d.id} className="sticky top-0 z-10 border-b border-border bg-card px-1 py-2 align-bottom">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn("h-2.5 w-2.5 rounded-full border", dataGroupColorClass(d.id))} title={d.name} />
                          <div className="mx-auto max-h-32 w-5 overflow-hidden whitespace-nowrap text-[11px] text-foreground/80 [writing-mode:vertical-rl] rotate-180" title={d.name}>
                            {d.name}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr><td colSpan={visibleCols.length + 1} className="px-3 py-6 text-center text-muted-foreground">No users match your search.</td></tr>
                  ) : (
                    visibleRows.map((r) => (
                      <tr key={r.key} className="hover:bg-secondary/40">
                        <td className="sticky left-0 z-10 border-t border-r border-border bg-card px-3 py-1.5 whitespace-nowrap">
                          <span className="text-foreground">{r.email}</span>
                          {r.isNew && <span className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">new</span>}
                        </td>
                        {visibleCols.map((d) => {
                          const key = `${r.key}::${d.id}`;
                          const on = ticks.has(key);
                          return (
                            <td key={d.id} className="border-t border-border px-1 py-1 text-center">
                              <button
                                type="button"
                                onClick={() => toggle(key)}
                                title={`${r.email} — ${d.name}`}
                                className={cn(
                                  "mx-auto grid h-5 min-w-5 place-items-center rounded border px-1 text-[10px] font-semibold transition-transform hover:scale-110",
                                  on ? dataGroupColorClass(d.id) : "border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary",
                                )}
                              >
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
          </>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={dataGroups.length === 0 || changes === 0} onClick={apply}>Apply{changes ? ` (${changes})` : ""}</Button>
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
  onCreate: (emails: string[], dgIds: string[]) => void;
}) {
  const [emails, setEmails] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
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
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>Create users</DialogTitle></DialogHeader>
        <p className="-mt-1 text-sm text-muted-foreground">New users are created on this client and added to the selected data groups.</p>
        <div className="space-y-3">
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
            <label className="text-sm font-medium text-foreground">Data groups</label>
            <DgMultiSelect dataGroups={dataGroups} selected={selected} onToggle={toggle} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!parsed.length} onClick={() => parsed.length && onCreate(parsed, [...selected])}>
            Create {parsed.length || ""} user{parsed.length === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
