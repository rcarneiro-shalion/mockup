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
import { getProjects } from "@/lib/projects";
import type { AssignedProject } from "@/lib/clients";

export function AssignProjectDialog({
  open,
  onOpenChange,
  assignedIds,
  onAssign,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignedIds: string[];
  onAssign: (p: AssignedProject) => void;
}) {
  const [projectId, setProjectId] = useState("");
  const [activeFrom, setActiveFrom] = useState("");
  const [activeTo, setActiveTo] = useState("");

  useEffect(() => {
    if (open) {
      setProjectId("");
      setActiveFrom("");
      setActiveTo("");
    }
  }, [open]);

  const available = getProjects().filter((p) => !assignedIds.includes(p.id));
  const selected = available.find((p) => p.id === projectId);

  const handleAssign = () => {
    if (!selected) return;
    onAssign({
      projectId: selected.id,
      name: selected.name,
      bom: selected.bom,
      activeFrom: activeFrom || "-",
      activeTo: activeTo || "-",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0" style={{ maxWidth: 520 }}>
        <div className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">Assign project</DialogTitle>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              Project <span className="text-destructive">*</span>
            </Label>
            <Select value={projectId || undefined} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder={available.length ? "Select a project" : "No projects available"} />
              </SelectTrigger>
              <SelectContent>
                {available.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} {p.bom ? `· ${p.bom}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Active from</Label>
              <Input type="date" value={activeFrom} onChange={(e) => setActiveFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Active to</Label>
              <Input type="date" value={activeTo} onChange={(e) => setActiveTo(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAssign} disabled={!selected}>Assign project</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
