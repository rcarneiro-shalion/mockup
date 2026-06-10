import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeFrom, setActiveFrom] = useState("");
  const [activeTo, setActiveTo] = useState("");

  useEffect(() => {
    if (open) {
      setProjectId("");
      setPickerOpen(false);
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
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  role="combobox"
                  disabled={!available.length}
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                >
                  <span className={cn(!selected && "text-muted-foreground")}>
                    {selected
                      ? `${selected.name}${selected.bom ? ` · ${selected.bom}` : ""}`
                      : available.length
                        ? "Select a project"
                        : "No projects available"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search projects" />
                  <CommandList>
                    <CommandEmpty>No projects found.</CommandEmpty>
                    <CommandGroup>
                      {available.map((p) => (
                        <CommandItem
                          key={p.id}
                          value={`${p.name} ${p.bom ?? ""}`}
                          onSelect={() => { setProjectId(p.id); setPickerOpen(false); }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", projectId === p.id ? "opacity-100" : "opacity-0")} />
                          {p.name} {p.bom ? `· ${p.bom}` : ""}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
