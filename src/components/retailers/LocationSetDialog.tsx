import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Th, Td, Pagination, LinkText } from "@/components/seeds/ListPrimitives";
import { emptyLocationSet, ASSIGNABLE_LOCATIONS, type LocationSet, type SetLocation } from "@/lib/retailers";
import { toast } from "sonner";
import { Plus, Trash2, FileSpreadsheet, X, ChevronDown } from "lucide-react";

export function LocationSetDialog({
  open,
  onOpenChange,
  set: locationSet,
  onSave,
  onDelete,
  entityLabel = "location set",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  set: LocationSet | null;
  onSave: (s: LocationSet) => void;
  onDelete: () => void;
  /** Label for the edited entity (default "location set"). */
  entityLabel?: string;
}) {
  const cap = entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);
  const [r, setR] = useState<LocationSet>(emptyLocationSet());
  const [assignOpen, setAssignOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locFilter, setLocFilter] = useState("");

  useEffect(() => {
    if (open && locationSet) { setR({ ...locationSet, locations: locationSet.locations ?? [] }); setAssignOpen(false); setLocFilter(""); }
  }, [open, locationSet]);

  const upd = <K extends keyof LocationSet>(k: K, v: LocationSet[K]) => setR((p) => ({ ...p, [k]: v }));
  const allLocations = r.locations ?? [];
  const locations = locFilter
    ? allLocations.filter((l) => l.name.toLowerCase().includes(locFilter.toLowerCase()))
    : allLocations;

  const assignLocation = (name: string) => {
    const loc: SetLocation = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name, city: "", address: "", postal: "", store: "",
    };
    upd("locations", [...locations, loc]);
  };
  const removeLocation = (id: string) => upd("locations", locations.filter((l) => l.id !== id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[min(820px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">{r.name || cap}</DialogTitle>
          <button
            type="button"
            onClick={onDelete}
            className="mr-6 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
            aria-label={`Delete ${entityLabel}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-auto px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">Name <span className="text-destructive">*</span></Label>
            <Input value={r.name} onChange={(e) => upd("name", e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Locations</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.info("Export to Excel — coming soon")}>
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Export to Excel (.xlsx)
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setAssignOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Assign location
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <button className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground/80 hover:bg-secondary">
                    {locFilter || "Locations"}
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[320px] p-0">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList>
                      <CommandEmpty>No results.</CommandEmpty>
                      <CommandGroup>
                        {ASSIGNABLE_LOCATIONS.map((n) => (
                          <CommandItem key={n} value={n} onSelect={() => { setLocFilter(n); setFilterOpen(false); }}>
                            {n}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    <div className="border-t border-border p-1">
                      <button
                        type="button"
                        onClick={() => { setLocFilter(""); setFilterOpen(false); }}
                        className="w-full rounded px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-secondary"
                      >
                        Clear
                      </button>
                    </div>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr><Th>Name</Th><Th>City</Th><Th>Address</Th><Th>Postal code</Th><Th>Store</Th><Th className="w-10" /></tr>
                </thead>
                <tbody>
                  {locations.length === 0 ? (
                    <tr><Td className="text-muted-foreground"><span className="block py-2">No locations assigned yet.</span></Td><Td /><Td /><Td /><Td /><Td /></tr>
                  ) : locations.map((l) => (
                    <tr key={l.id} className="border-t border-border hover:bg-secondary/40">
                      <Td className="text-foreground/80">{l.name}</Td>
                      <Td className="text-foreground/80">{l.city}</Td>
                      <Td className="max-w-[160px] truncate text-foreground/80">{l.address}</Td>
                      <Td className="text-muted-foreground">{l.postal}</Td>
                      <Td>{l.store ? <LinkText>{l.store}</LinkText> : <span className="text-muted-foreground">—</span>}</Td>
                      <Td>
                        <button onClick={() => removeLocation(l.id)} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label={`Remove ${l.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination total={locations.length} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSave(r); onOpenChange(false); }} disabled={!r.name.trim()}>Save {entityLabel}</Button>
        </div>

        {/* Nested: Assign location picker */}
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogContent className="gap-0 p-0" style={{ maxWidth: 520 }}>
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <DialogTitle className="text-base font-semibold tracking-tight">Assign location</DialogTitle>
              <button type="button" onClick={() => setAssignOpen(false)} className="mr-6 rounded-md p-1 text-muted-foreground hover:bg-secondary" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-5">
              <Label className="text-sm font-medium text-foreground/80">Location <span className="text-destructive">*</span></Label>
              <div className="mt-1.5">
                <Select
                  value=""
                  onValueChange={(v) => { assignLocation(v); setAssignOpen(false); }}
                >
                  <SelectTrigger><SelectValue placeholder=" " /></SelectTrigger>
                  <SelectContent>
                    {ASSIGNABLE_LOCATIONS.filter((n) => !locations.some((l) => l.name === n)).map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
