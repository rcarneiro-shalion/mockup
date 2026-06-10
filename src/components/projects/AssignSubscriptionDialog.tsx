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
import { getSubscriptions } from "@/lib/subscriptions";
import { ASSIGN_TYPE_OPTIONS, type AssignedSubscription } from "@/lib/projects";

export function AssignSubscriptionDialog({
  open,
  onOpenChange,
  assignedNames,
  onAssign,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignedNames: string[];
  onAssign: (s: AssignedSubscription) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("BASE");
  const [expiration, setExpiration] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setType("BASE");
      setExpiration("");
    }
  }, [open]);

  const available = getSubscriptions().filter((s) => !assignedNames.includes(s.name));
  const selected = available.find((s) => s.name === name);

  const handleAssign = () => {
    if (!selected) return;
    onAssign({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: selected.name,
      store: selected.store,
      geo: selected.geo,
      type,
      expiration: expiration || "-",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0" style={{ maxWidth: 520 }}>
        <div className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">Assign subscription</DialogTitle>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              Subscription <span className="text-destructive">*</span>
            </Label>
            <Select value={name || undefined} onValueChange={setName}>
              <SelectTrigger>
                <SelectValue placeholder={available.length ? "Select a subscription" : "No subscriptions available"} />
              </SelectTrigger>
              <SelectContent>
                {available.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name} · {s.store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Button onClick={handleAssign} disabled={!selected}>Assign subscription</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
