import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSubscriptions } from "@/lib/subscriptions";
import { typeFromName, type AssignedSubscription } from "@/lib/projects";
import { buildQueryMatch } from "@/lib/textMatch";
import { Search } from "lucide-react";

/** Tolerantly turn a stored date ("-", ISO, or "Wed, Jun 25, 2025") into a value
 *  a <input type="date"> accepts (YYYY-MM-DD), else "". */
function toDateInput(s?: string): string {
  if (!s || s === "-") return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  // Use LOCAL date parts (not toISOString, which would shift a day in -UTC zones).
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const newId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

export function AssignSubscriptionDialog({
  open,
  onOpenChange,
  assignedNames,
  onAssign,
  onAssignMany,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignedNames: string[];
  /** Edit mode: save the single edited row. */
  onAssign: (s: AssignedSubscription) => void;
  /** Add mode: assign one or more picked subscriptions at once. */
  onAssignMany: (subs: AssignedSubscription[]) => void;
  /** When set, edit this row's Type/Expiration instead of picking new subscriptions. */
  editing?: AssignedSubscription | null;
}) {
  const isEdit = !!editing;
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [expiration, setExpiration] = useState("");

  useEffect(() => {
    if (open) {
      setPicked(new Set());
      setQuery("");
      setExpiration(toDateInput(editing?.expiration));
    }
  }, [open, editing]);

  const available = useMemo(() => getSubscriptions().filter((s) => !assignedNames.includes(s.name)), [assignedNames, open]);
  const match = useMemo(() => buildQueryMatch(query), [query]);
  const filtered = useMemo(() => available.filter((s) => match(s.name) || match(s.store)), [available, match]);

  const toggle = (name: string) =>
    setPicked((p) => { const n = new Set(p); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const selectAllFiltered = () => setPicked((p) => { const n = new Set(p); filtered.forEach((s) => n.add(s.name)); return n; });

  const canSubmit = isEdit || picked.size > 0;

  const handleSubmit = () => {
    if (isEdit && editing) {
      onAssign({ ...editing, type: typeFromName(editing.name), expiration: expiration || "-" });
    } else {
      const subs = available
        .filter((s) => picked.has(s.name))
        .map((s) => ({ id: newId(), name: s.name, store: s.store, geo: s.geo, type: typeFromName(s.name), expiration: expiration || "-" }));
      if (!subs.length) return;
      onAssignMany(subs);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0" style={{ maxWidth: 560 }}>
        <div className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">
            {isEdit ? "Edit subscription" : "Assign subscriptions"}
          </DialogTitle>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              Subscription{!isEdit && "s"} {!isEdit && <span className="text-destructive">*</span>}
            </Label>
            {isEdit ? (
              <div className="flex h-9 items-center rounded-md border border-border bg-secondary/40 px-3 text-sm text-foreground">
                {editing!.name} · {editing!.store}
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subscription (% wildcard)" className="pl-8" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{picked.size} selected · {filtered.length} of {available.length}</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={selectAllFiltered} disabled={!filtered.length} className="font-medium text-[var(--sidebar-active-fg)] hover:underline disabled:opacity-40">Select all filtered</button>
                    <button type="button" onClick={() => setPicked(new Set())} disabled={!picked.size} className="font-medium hover:text-foreground disabled:opacity-40">Clear</button>
                  </div>
                </div>
                <div className="max-h-60 overflow-auto rounded-md border border-border">
                  {available.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">No subscriptions available</div>
                  ) : filtered.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">No match.</div>
                  ) : (
                    filtered.map((s) => (
                      <label key={s.name} className="flex cursor-pointer items-center gap-2 border-b border-border px-3 py-1.5 text-sm last:border-0 hover:bg-secondary/40">
                        <input type="checkbox" checked={picked.has(s.name)} onChange={() => toggle(s.name)} className="h-3.5 w-3.5 rounded border-border" />
                        <span className="min-w-0 flex-1 truncate text-foreground/90">{s.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{s.store}</span>
                      </label>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Type</Label>
              <div className="flex h-9 items-center rounded-md border border-border bg-secondary/40 px-3 text-sm text-foreground/90">
                {isEdit ? (typeFromName(editing!.name) || "—") : "Auto from name prefix"}
              </div>
              <p className="text-xs text-muted-foreground">Derived from the subscription name prefix (e.g. ME_ → Media).</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Expiration date</Label>
              <Input type="date" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isEdit ? "Save" : `Assign ${picked.size || ""} subscription${picked.size === 1 ? "" : "s"}`.replace("  ", " ")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
