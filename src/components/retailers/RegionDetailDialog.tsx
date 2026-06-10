import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Th, Td, Pagination, LinkText } from "@/components/seeds/ListPrimitives";
import { emptyRegion, type Region, type RegionLocation } from "@/lib/retailers";
import { toast } from "sonner";
import { Plus, Trash2, FileSpreadsheet } from "lucide-react";

export function RegionDetailDialog({
  open,
  onOpenChange,
  region,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  region: Region | null;
  onSave: (r: Region) => void;
  onDelete: () => void;
}) {
  const [r, setR] = useState<Region>(emptyRegion());

  useEffect(() => {
    if (open && region) setR({ ...region, locations: region.locations ?? [] });
  }, [open, region]);

  const set = <K extends keyof Region>(k: K, v: Region[K]) => setR((p) => ({ ...p, [k]: v }));
  const locations = r.locations ?? [];

  const addLocation = () => {
    const loc: RegionLocation = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: "New location", city: "", address: "", postal: "", store: "",
    };
    set("locations", [...locations, loc]);
  };
  const removeLocation = (id: string) => set("locations", locations.filter((l) => l.id !== id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[min(820px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">{r.name || "Region"}</DialogTitle>
          <button
            type="button"
            onClick={onDelete}
            className="mr-6 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
            aria-label="Delete region"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-auto px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">Name <span className="text-destructive">*</span></Label>
            <Input value={r.name} onChange={(e) => set("name", e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Locations</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.info("Export to Excel — coming soon")}>
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Export to Excel (.xlsx)
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={addLocation}>
                  <Plus className="h-3.5 w-3.5" /> Assign location
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <Select defaultValue="Locations">
                <SelectTrigger className="h-8 w-[150px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Locations">Locations</SelectItem>
                  <SelectItem value="Stores">Stores</SelectItem>
                </SelectContent>
              </Select>
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
          <Button onClick={() => { onSave(r); onOpenChange(false); }} disabled={!r.name.trim()}>Save region</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
