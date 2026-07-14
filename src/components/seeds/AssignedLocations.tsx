import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getStoreLocations, locationLocator, type StoreLocation } from "@/lib/storeLocations";
import { cn } from "@/lib/utils";
import { Check, MapPin, Plus, Search, X } from "lucide-react";

/**
 * Assigned locations for a scrapingPlan — the V1/V2 "Locations" tab (mirrors the
 * legacy Job's Assigned-locations grid). Shown only when geolocation mode is MANUAL.
 * `assigned` holds location NAMES (ScrapingPlan.locations); each row is resolved
 * against the store's location records for the Job-style columns.
 */
export function AssignedLocations({
  store,
  assigned,
  onChange,
}: {
  store: string;
  assigned: string[];
  onChange: (next: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const all = getStoreLocations(store);
  const byName = new Map(all.map((l) => [l.name, l]));
  const resolved: StoreLocation[] = assigned.map(
    (name) => byName.get(name) ?? { name, city: "", address: "", postal: "" },
  );

  const q = search.trim().toLowerCase();
  const rows = resolved.filter(
    (l) => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.postal.includes(q),
  );

  const remove = (name: string) => onChange(assigned.filter((x) => x !== name));
  const available = all.filter((l) => !assigned.includes(l.name));
  const assignMany = (names: string[]) => {
    const fresh = names.filter((n) => !assigned.includes(n));
    if (fresh.length) onChange([...assigned, ...fresh]);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Assigned locations
        </span>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground/80 hover:bg-secondary"
        >
          <Plus className="h-3.5 w-3.5" /> Assign location
        </button>
        <AssignLocationsDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          store={store}
          available={available}
          onAssign={assignMany}
        />
      </div>

      {/* Search within assigned */}
      <div className="relative mt-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assigned locations"
          className="h-8 pl-8 text-sm"
        />
      </div>

      {/* Grid — Job-style columns */}
      <div className="mt-2 max-h-56 overflow-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-secondary/60">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Locator</th>
              <th className="px-3 py-2 font-medium">Address</th>
              <th className="px-3 py-2 font-medium">City</th>
              <th className="px-3 py-2 font-medium">Postal code</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="w-8 px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-5 text-center text-muted-foreground">
                  {assigned.length === 0 ? "No locations assigned to this scraping plan." : "No assigned location matches the search."}
                </td>
              </tr>
            )}
            {rows.map((l) => (
              <tr key={l.name} className="border-t border-border hover:bg-secondary/40">
                <td className="whitespace-nowrap px-3 py-2 text-[var(--sidebar-active-fg)]">{l.name}</td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-foreground/70">{locationLocator(l)}</td>
                <td className="px-3 py-2 text-foreground/80">
                  <span className="block max-w-[180px] truncate" title={l.address}>{l.address || "—"}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-foreground/80">{l.city || "—"}</td>
                <td className="whitespace-nowrap px-3 py-2 text-foreground/80">{l.postal || "—"}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  <span className="inline-flex items-center gap-1.5 text-foreground/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => remove(l.name)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${l.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Searchable batch picker over the store's not-yet-assigned locations. */
function AssignLocationsDialog({
  open,
  onOpenChange,
  store,
  available,
  onAssign,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  store: string;
  available: StoreLocation[];
  onAssign: (names: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const q = search.trim().toLowerCase();
  const rows = available.filter(
    (l) => !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.postal.includes(q),
  );

  const toggle = (name: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const close = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setPicked(new Set());
      setSearch("");
    }
  };

  const assign = () => {
    onAssign([...picked]);
    close(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="flex max-h-[80vh] w-[min(640px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold tracking-tight">
            Assign locations{store ? ` — ${store}` : ""}
          </DialogTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">
            The store's locations not yet assigned to this scraping plan.
          </p>
        </div>
        <div className="px-5 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locations by name, city or postal code"
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        <div className="m-5 mt-2 flex-1 overflow-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary/60">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="w-8 px-3 py-2" />
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">City</th>
                <th className="px-3 py-2 font-medium">Postal code</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-5 text-center text-muted-foreground">
                    {available.length === 0 ? "Every location of this store is already assigned." : "No location matches the search."}
                  </td>
                </tr>
              )}
              {rows.map((l) => {
                const on = picked.has(l.name);
                return (
                  <tr
                    key={l.name}
                    onClick={() => toggle(l.name)}
                    className={cn("cursor-pointer border-t border-border", on ? "bg-secondary/60" : "hover:bg-secondary/40")}
                  >
                    <td className="px-3 py-2">
                      <Check className={cn("h-4 w-4", on ? "text-foreground" : "opacity-0")} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-foreground/90">{l.name}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-foreground/70">{l.city || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-foreground/70">{l.postal || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" size="sm" onClick={() => close(false)}>Cancel</Button>
          <Button size="sm" disabled={picked.size === 0} onClick={assign}>
            Assign {picked.size > 0 ? `${picked.size} location${picked.size === 1 ? "" : "s"}` : "locations"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
