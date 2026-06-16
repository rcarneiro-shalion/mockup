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
import { getClients, type ProjectClient } from "@/lib/clients";

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

export function AssignClientDialog({
  open,
  onOpenChange,
  assignedIds,
  onAssign,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignedIds: string[];
  onAssign: (c: ProjectClient) => void;
  /** When set, edit this row's Active from/to instead of picking a new client. */
  editing?: ProjectClient | null;
}) {
  const isEdit = !!editing;
  const [clientId, setClientId] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeFrom, setActiveFrom] = useState("");
  const [activeTo, setActiveTo] = useState("");

  useEffect(() => {
    if (open) {
      setClientId(editing?.clientId ?? "");
      setPickerOpen(false);
      setActiveFrom(toDateInput(editing?.activeFrom));
      setActiveTo(toDateInput(editing?.activeTo));
    }
  }, [open, editing]);

  const available = getClients().filter((c) => !assignedIds.includes(c.id));
  const selected = available.find((c) => c.id === clientId);
  const canSubmit = isEdit || !!selected;

  const handleSubmit = () => {
    if (isEdit && editing) {
      onAssign({ ...editing, activeFrom: activeFrom || "-", activeTo: activeTo || "-" });
    } else {
      if (!selected) return;
      onAssign({
        clientId: selected.id,
        name: selected.name,
        acronym: selected.acronym,
        activeFrom: activeFrom || "-",
        activeTo: activeTo || "-",
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0" style={{ maxWidth: 520 }}>
        <div className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">{isEdit ? "Edit client" : "Assign client"}</DialogTitle>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">
              Client {!isEdit && <span className="text-destructive">*</span>}
            </Label>
            {isEdit ? (
              <div className="flex h-9 items-center rounded-md border border-border bg-secondary/40 px-3 text-sm text-foreground">
                {editing!.name}{editing!.acronym ? ` · ${editing!.acronym}` : ""}
              </div>
            ) : (
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
                        ? `${selected.name}${selected.acronym ? ` · ${selected.acronym}` : ""}`
                        : available.length
                          ? "Select a client"
                          : "No clients available"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Search clients" />
                    <CommandList>
                      <CommandEmpty>No clients found.</CommandEmpty>
                      <CommandGroup>
                        {available.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={`${c.name} ${c.acronym ?? ""}`}
                            onSelect={() => { setClientId(c.id); setPickerOpen(false); }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", clientId === c.id ? "opacity-100" : "opacity-0")} />
                            {c.name} {c.acronym ? `· ${c.acronym}` : ""}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
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
          <Button onClick={handleSubmit} disabled={!canSubmit}>{isEdit ? "Save" : "Assign client"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
