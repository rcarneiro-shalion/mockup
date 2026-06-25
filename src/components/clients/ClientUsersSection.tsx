import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Th, Td, GroupedPills, Pagination, usePagination } from "@/components/seeds/ListPrimitives";
import type { Client, ClientUser, DataGroup } from "@/lib/clients";
import { nowStamp } from "@/lib/clients";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronUp, Mail, Pencil, Plus, Search, Trash2, UserPlus } from "lucide-react";

// Pool of existing account users that can be assigned to this client (anonymized for the mockup).
const ASSIGNABLE_POOL = [
  "ricardo.alves@coca-cola.com", "nina.petrova@kof.com", "tom.becker@ccep.com", "yuki.tanaka@coca-cola.com",
  "omar.haddad@coca-cola.com", "grace.lee@shalion.com", "pablo.ortiz@embonor.cl", "feng.li@coca-cola.com",
];

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
                        <GroupedPills items={dgNames(u)} noun="data group" tone="blue" onSeeAll={() => setEditUser(u)} />
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
        <AssignUserDialog
          dataGroups={dataGroups}
          assignable={ASSIGNABLE_POOL.filter((e) => !users.some((u) => u.email === e))}
          onClose={() => setAssignOpen(false)}
          onAssign={(email, dgIds) => {
            const now = nowStamp();
            setUsers([...users, { id: crypto.randomUUID(), email, status: "Active", dataGroupIds: dgIds, createdAt: now, updatedAt: now }]);
            setAssignOpen(false);
            toast.success(`Assigned ${email}`);
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

function AssignUserDialog({
  dataGroups,
  assignable,
  onClose,
  onAssign,
}: {
  dataGroups: DataGroup[];
  assignable: string[];
  onClose: () => void;
  onAssign: (email: string, dgIds: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const filtered = assignable.filter((e) => e.toLowerCase().includes(q.toLowerCase()));
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>Assign existing user</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">User <span className="text-destructive">*</span></label>
            <input
              value={email || q}
              onChange={(e) => { setQ(e.target.value); setEmail(""); }}
              placeholder="Search a user by email"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {!email && (
              <div className="max-h-40 overflow-auto rounded-md border border-border">
                {filtered.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">No matches.</div>
                ) : filtered.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => { setEmail(e); setQ(""); }}
                    className="block w-full border-b border-border px-3 py-2 text-left text-sm text-foreground last:border-0 hover:bg-accent"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Data groups</label>
            <DgMultiSelect dataGroups={dataGroups} selected={selected} onToggle={toggle} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!email} onClick={() => email && onAssign(email, [...selected])}>Assign user</Button>
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
