import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectBox } from "@/components/seeds/SelectBox";
import { getSubscriptions } from "@/lib/subscriptions";
import { ASSIGN_TYPE_OPTIONS, type AssignedSubscription } from "@/lib/projects";

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

export function AssignSubscriptionDialog({
  open,
  onOpenChange,
  assignedNames,
  onAssign,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignedNames: string[];
  onAssign: (s: AssignedSubscription) => void;
  /** When set, edit this row's Type/Expiration instead of picking a new subscription. */
  editing?: AssignedSubscription | null;
}) {
  const isEdit = !!editing;
  const [name, setName] = useState("");
  const [type, setType] = useState("BASE");
  const [expiration, setExpiration] = useState("");

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setType(editing?.type ?? "BASE");
      setExpiration(toDateInput(editing?.expiration));
    }
  }, [open, editing]);

  const available = getSubscriptions().filter((s) => !assignedNames.includes(s.name));
  const selected = available.find((s) => s.name === name);
  const canSubmit = isEdit || !!selected;

  const handleSubmit = () => {
    if (isEdit && editing) {
      onAssign({ ...editing, type, expiration: expiration || "-" });
    } else {
      if (!selected) return;
      onAssign({
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name: selected.name,
        store: selected.store,
        geo: selected.geo,
        type,
        expiration: expiration || "-",
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0" style={{ maxWidth: 520 }}>
        <div className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">
            {isEdit ? "Edit subscription" : "Assign subscription"}
          </DialogTitle>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              Subscription {!isEdit && <span className="text-destructive">*</span>}
            </Label>
            {isEdit ? (
              <div className="flex h-9 items-center rounded-md border border-border bg-secondary/40 px-3 text-sm text-foreground">
                {editing!.name} · {editing!.store}
              </div>
            ) : (
              <SelectBox
                value={name}
                onChange={setName}
                options={available.map((s) => ({ value: s.name, label: `${s.name} · ${s.store}` }))}
                disabled={!available.length}
                placeholder={available.length ? "Select a subscription" : "No subscriptions available"}
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGN_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Expiration date</Label>
              <Input type="date" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>{isEdit ? "Save" : "Assign subscription"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
