import { useMemo, useState } from "react";
import { X, Plus, Trash2, Check, Search, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  GROUP_COLOR_CLASSES,
  GROUP_COLOR_KEYS,
  STANDARD_GROUP_ID,
  assignRetailerToGroup,
  groupForRetailer,
  makeGroupId,
  type GroupColor,
  type RetailerGroup,
} from "@/lib/retailerGroups";

/**
 * Manage retailer groups: create / rename / recolor / delete groups, and assign
 * retailers to them (single membership). Persists via the parent's setGroups.
 */
export function RetailerGroupsModal({
  groups,
  setGroups,
  retailers,
  onClose,
}: {
  groups: RetailerGroup[];
  setGroups: (g: RetailerGroup[]) => void;
  retailers: { id: string; name: string }[];
  onClose: () => void;
}) {
  const [selId, setSelId] = useState(groups[0]?.id ?? STANDARD_GROUP_ID);
  const [q, setQ] = useState("");
  const [newName, setNewName] = useState("");

  const selected = groups.find((g) => g.id === selId) ?? groups[0];
  const ql = q.trim().toLowerCase();
  const visibleRetailers = useMemo(
    () => retailers.filter((r) => !ql || r.name.toLowerCase().includes(ql)),
    [retailers, ql],
  );
  const countFor = (g: RetailerGroup) =>
    g.id === STANDARD_GROUP_ID
      ? retailers.filter((r) => groupForRetailer(groups, r.name).id === STANDARD_GROUP_ID).length
      : g.retailers.filter((name) => retailers.some((r) => r.name === name)).length;

  const createGroup = () => {
    const name = newName.trim();
    if (!name) return;
    let id = makeGroupId(name);
    if (groups.some((g) => g.id === id)) id = `${id}-${groups.length}`;
    const next: RetailerGroup = { id, name, color: GROUP_COLOR_KEYS[groups.length % GROUP_COLOR_KEYS.length], retailers: [] };
    setGroups([...groups, next]);
    setSelId(id);
    setNewName("");
  };
  const rename = (name: string) => setGroups(groups.map((g) => (g.id === selId ? { ...g, name } : g)));
  const recolor = (color: GroupColor) => setGroups(groups.map((g) => (g.id === selId ? { ...g, color } : g)));
  const removeGroup = () => {
    if (!selected || selected.id === STANDARD_GROUP_ID) return;
    setGroups(groups.filter((g) => g.id !== selected.id)); // its retailers fall back to STANDARD
    setSelId(STANDARD_GROUP_ID);
  };
  const toggleRetailer = (name: string) => {
    const inSel = selected && selected.id !== STANDARD_GROUP_ID && selected.retailers.includes(name);
    setGroups(assignRetailerToGroup(groups, name, inSel ? STANDARD_GROUP_ID : selId));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Store className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Retailer groups</h2>
          <span className="text-sm text-muted-foreground">classify retailers by the dashboard sections they receive</span>
          <button onClick={onClose} className="ml-auto rounded-md border border-border px-2 py-1 text-sm hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[260px_1fr]">
          {/* Groups list */}
          <div className="flex min-h-0 flex-col border-r border-border">
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelId(g.id)}
                  className={cn(
                    "mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                    selId === g.id ? "bg-secondary" : "hover:bg-secondary/60",
                  )}
                >
                  <span className={cn("h-3 w-3 shrink-0 rounded-full border", GROUP_COLOR_CLASSES[g.color])} />
                  <span className="min-w-0 flex-1 truncate">{g.name}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{countFor(g)}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 border-t border-border p-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createGroup()}
                placeholder="New group name"
                className="h-8 flex-1 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="sm" className="h-8 gap-1" onClick={createGroup} disabled={!newName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Group editor */}
          {selected ? (
            <div className="flex min-h-0 flex-col">
              <div className="flex flex-col gap-3 border-b border-border p-4">
                <div className="flex items-center gap-2">
                  <input
                    value={selected.name}
                    onChange={(e) => rename(e.target.value)}
                    disabled={selected.id === STANDARD_GROUP_ID}
                    className="h-9 flex-1 rounded-md border border-border bg-background px-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
                  />
                  <span className={cn("rounded-full border px-2.5 py-1 text-xs font-medium", GROUP_COLOR_CLASSES[selected.color])}>
                    {selected.name}
                  </span>
                  {selected.id !== STANDARD_GROUP_ID && (
                    <Button variant="ghost" size="sm" className="h-9 gap-1 text-red-600 hover:text-red-700" onClick={removeGroup}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Tag color:</span>
                  {GROUP_COLOR_KEYS.map((c) => (
                    <button
                      key={c}
                      onClick={() => recolor(c)}
                      title={c}
                      className={cn(
                        "h-6 w-6 rounded-full border-2",
                        GROUP_COLOR_CLASSES[c],
                        selected.color === c ? "ring-2 ring-ring ring-offset-1" : "",
                      )}
                    />
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search retailers to assign"
                    className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {selected.id === STANDARD_GROUP_ID
                    ? "STANDARD is the default — retailers not in another group are STANDARD. Pick a retailer to move it here (clears its group)."
                    : "Check a retailer to put it in this group (it's removed from any other group)."}
                </p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {visibleRetailers.map((r) => {
                  const g = groupForRetailer(groups, r.name);
                  const inSel = g.id === selected.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleRetailer(r.name)}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary/60"
                    >
                      <span
                        className={cn(
                          "grid h-4 w-4 shrink-0 place-items-center rounded border",
                          inSel ? "border-primary bg-primary text-primary-foreground" : "border-border",
                        )}
                      >
                        {inSel && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{r.name}</span>
                      <span className={cn("shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium", GROUP_COLOR_CLASSES[g.color])}>
                        {g.name}
                      </span>
                    </button>
                  );
                })}
                {!visibleRetailers.length && (
                  <p className="px-3 py-10 text-center text-sm text-muted-foreground">No retailers match.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid place-items-center text-sm text-muted-foreground">Select a group.</div>
          )}
        </div>
      </div>
    </div>
  );
}
