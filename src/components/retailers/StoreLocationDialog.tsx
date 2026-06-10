import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StoreLocation } from "@/lib/retailers";
import { cn } from "@/lib/utils";
import { ChevronUp, Pencil, Trash2 } from "lucide-react";

export function StoreLocationDialog({
  open,
  onOpenChange,
  location,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  location: StoreLocation | null;
  onSave: (l: StoreLocation) => void;
  onDelete: () => void;
}) {
  const [l, setL] = useState<StoreLocation | null>(location);
  const [locatorOpen, setLocatorOpen] = useState(true);
  const [locatorEditing, setLocatorEditing] = useState(false);

  useEffect(() => {
    if (open && location) { setL(location); setLocatorOpen(true); setLocatorEditing(false); }
  }, [open, location]);

  if (!l) return null;
  const set = <K extends keyof StoreLocation>(k: K, v: StoreLocation[K]) => setL((p) => (p ? { ...p, [k]: v } : p));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[min(860px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">{l.name || "Location"}</DialogTitle>
          <button type="button" onClick={onDelete} className="mr-6 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Delete location">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[1fr_160px]">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Name <span className="text-destructive">*</span></Label>
              <Input value={l.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Status</Label>
              <Select value={l.status} onValueChange={(v) => set("status", v as StoreLocation["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Locator */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setLocatorOpen((v) => !v)} className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                  <ChevronUp className={cn("h-4 w-4 transition-transform", !locatorOpen && "rotate-180")} />
                </span>
                <span className="text-base font-semibold text-foreground">Locator</span>
              </button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={() => set("locator", "{}")}>Clear</Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setLocatorEditing((v) => !v)}>
                  <Pencil className="h-3.5 w-3.5" /> {locatorEditing ? "Done" : "Edit"}
                </Button>
              </div>
            </div>
            {locatorOpen && (
              <textarea
                value={l.locator}
                onChange={(e) => set("locator", e.target.value)}
                readOnly={!locatorEditing}
                spellCheck={false}
                rows={locatorEditing ? 12 : 8}
                className={cn("mt-4 w-full rounded-md border border-input px-3 py-2 font-mono text-xs leading-relaxed text-emerald-700 focus:outline-none focus:ring-1 focus:ring-ring", locatorEditing ? "bg-background" : "bg-secondary/40")}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground/80">Address <span className="text-destructive">*</span></Label>
            <Input value={l.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[1fr_180px]">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">City <span className="text-destructive">*</span></Label>
              <Input value={l.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-foreground/80">Postal code <span className="text-destructive">*</span></Label>
              <Input value={l.postal} onChange={(e) => set("postal", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onSave(l); onOpenChange(false); }} disabled={!l.name.trim()}>Save location</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
