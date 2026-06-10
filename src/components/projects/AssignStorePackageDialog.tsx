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
import { readPersistedList } from "@/lib/seedOptions";
import { ASSIGN_TYPE_OPTIONS, type AssignedStorePackage } from "@/lib/projects";

type StorePackageRow = { name: string; store: string; geo?: string };

export function AssignStorePackageDialog({
  open,
  onOpenChange,
  assignedNames,
  onAssign,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignedNames: string[];
  onAssign: (sp: AssignedStorePackage) => void;
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

  const packages = readPersistedList<StorePackageRow>("seeds-api:store-packages");
  const source = packages.length
    ? packages
    : [
        { name: "PKG Amazon US", store: "Amazon US", geo: "MANUAL" },
        { name: "PKG - MAT Amazon US", store: "Amazon US", geo: "MANUAL" },
      ];
  const available = source.filter((p) => !assignedNames.includes(p.name));
  const selected = available.find((p) => p.name === name);

  const handleAssign = () => {
    if (!selected) return;
    onAssign({
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: selected.name,
      store: selected.store,
      geo: selected.geo ?? "MANUAL",
      type,
      expiration: expiration || "-",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0" style={{ maxWidth: 520 }}>
        <div className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">Assign store package</DialogTitle>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              Store package <span className="text-destructive">*</span>
            </Label>
            <Select value={name || undefined} onValueChange={setName}>
              <SelectTrigger>
                <SelectValue placeholder={available.length ? "Select a store package" : "No store packages available"} />
              </SelectTrigger>
              <SelectContent>
                {available.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.name} · {p.store}
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
          <Button onClick={handleAssign} disabled={!selected}>Assign store package</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
