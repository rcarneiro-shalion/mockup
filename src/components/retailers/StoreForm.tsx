import { useState } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FilterChip } from "@/components/seeds/FilterChip";
import { Th, Td, Pagination, LinkText, Pill } from "@/components/seeds/ListPrimitives";
import {
  getRetailers, STORE_CLASS_OPTIONS, DEVICE_OPTIONS, COUNTRY_OPTIONS, countryLabel,
  TIMEZONE_OPTIONS, LOCALE_OPTIONS, emptyStore, type Store, type StoreLocation,
} from "@/lib/retailers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, ChevronUp, MapPin, PlayCircle, Sprout, Pencil, Plus, Trash2, FileSpreadsheet, MoreVertical, Calendar } from "lucide-react";

type Tab = "locations" | "jobs" | "seeds";

const STORE_TYPE_CARDS = [
  { value: "FLAGSHIP", label: "Flagship", desc: "Store do not require a specific location to work" },
  { value: "GEOLOC", label: "Geoloc", desc: "Store can have multiple locations" },
];

export function StoreForm({
  mode, initial, onSave, onCancel, onDelete,
}: {
  mode: "add" | "edit";
  initial: Store;
  onSave: (s: Store) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [s, setS] = useState<Store>(() => ({ ...emptyStore(), ...initial }));
  const [metaOpen, setMetaOpen] = useState(true);
  const [metaEditing, setMetaEditing] = useState(false);
  const [tab, setTab] = useState<Tab>("locations");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const set = <K extends keyof Store>(k: K, v: Store[K]) => setS((p) => ({ ...p, [k]: v }));
  const canSave = s.name.trim() && s.domain.trim() && s.retailer.trim();
  const retailerNames = getRetailers().map((r) => r.name);
  const locations = s.locations ?? [];

  const handleSave = async () => {
    if (!canSave) { toast.error("Name, Domain url and Retailer are required"); return; }
    setIsSaving(true);
    try { await new Promise((r) => setTimeout(r, 300)); onSave(s); toast.success(`Store ${mode === "add" ? "created" : "saved"} successfully`); }
    catch { toast.error("Save failed. Please try again."); }
    finally { setIsSaving(false); }
  };

  const addLocation = () => {
    const loc: StoreLocation = { id: crypto.randomUUID?.() ?? String(Date.now()), name: "New location", locator: "{}", address: "", city: "", postal: "", status: "Active" };
    set("locations", [...locations, loc]);
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Stores
            </button>
            <div className="mt-1 flex items-center gap-2">
              {mode === "edit" && s.logoUrl ? <img src={s.logoUrl} alt="" className="h-6 w-6 rounded object-contain" /> : null}
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{mode === "add" ? "Add store" : s.name || "Store"}</h1>
              {mode === "edit" && (
                <span className="inline-flex items-center gap-1.5 text-sm text-foreground/70">
                  <span className={cn("h-1.5 w-1.5 rounded-full", s.status === "Active" ? "bg-emerald-500" : "bg-slate-400")} />
                  {s.status}
                </span>
              )}
            </div>
          </div>
          {mode === "edit" && onDelete && (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Delete store">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl space-y-5">
            {/* Fields */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                <F label="Name" required className="sm:col-span-4"><Input value={s.name} onChange={(e) => set("name", e.target.value)} /></F>
                <F label="Ecometry ID" className="sm:col-span-1"><Input value={s.ecometryId ?? ""} onChange={(e) => set("ecometryId", e.target.value)} /></F>
                <F label="Status" className="sm:col-span-1"><Sel value={s.status} onChange={(v) => set("status", v as Store["status"])} options={["Active", "Inactive"]} /></F>

                <F label="Country" required className="sm:col-span-3"><Sel value={s.country} onChange={(v) => set("country", v)} options={COUNTRY_OPTIONS} render={countryLabel} /></F>
                <F label="Default timezone" required className="sm:col-span-3"><Sel value={s.timezone ?? ""} onChange={(v) => set("timezone", v)} options={TIMEZONE_OPTIONS} /></F>

                <F label="Retailer" required className="sm:col-span-3"><Sel value={s.retailer} onChange={(v) => set("retailer", v)} options={retailerNames} /></F>
                <F label="Locale" required className="sm:col-span-3"><Sel value={s.locale ?? ""} onChange={(v) => set("locale", v)} options={LOCALE_OPTIONS} /></F>

                <F label="Domain url" required className="sm:col-span-3"><Input value={s.domain} onChange={(e) => set("domain", e.target.value)} placeholder="example.com" /></F>
                <F label="Logo url" required className="sm:col-span-3"><Input value={s.logoUrl ?? ""} onChange={(e) => set("logoUrl", e.target.value)} placeholder="https://…" /></F>

                <F label="Class" required className="sm:col-span-3"><Sel value={s.klass} onChange={(v) => set("klass", v)} options={STORE_CLASS_OPTIONS} /></F>
                <F label="Device" required className="sm:col-span-3"><Sel value={s.device} onChange={(v) => set("device", v)} options={DEVICE_OPTIONS} /></F>
              </div>

              {/* Store type radio cards */}
              <div className="mt-5">
                <Label className="text-sm font-medium text-foreground/80">Store type <span className="text-destructive">*</span></Label>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {STORE_TYPE_CARDS.map((c) => {
                    const active = s.type === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => set("type", c.value)}
                        className={cn("flex items-start gap-3 rounded-lg border p-3 text-left transition-colors", active ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40")}
                      >
                        <span className={cn("mt-0.5 grid h-4 w-4 place-items-center rounded-full border", active ? "border-primary" : "border-border")}>
                          {active && <span className="h-2 w-2 rounded-full bg-primary" />}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            <span className="block text-sm font-medium text-foreground">{c.label}</span>
                            <span className="block text-xs text-muted-foreground">{c.desc}</span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Meta object */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setMetaOpen((v) => !v)} className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                    <ChevronUp className={cn("h-4 w-4 transition-transform", !metaOpen && "rotate-180")} />
                  </span>
                  <span className="text-base font-semibold text-foreground">Meta object</span>
                </button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={() => set("meta", "{}")}>Clear</Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setMetaEditing((v) => !v)}><Pencil className="h-3.5 w-3.5" /> {metaEditing ? "Done" : "Edit"}</Button>
                </div>
              </div>
              <p className="mt-1 pl-9 text-sm text-muted-foreground">Configure the meta object to be accessible by the project templates that use this store.</p>
              {metaOpen && (
                <textarea
                  value={s.meta ?? "{}"}
                  onChange={(e) => set("meta", e.target.value)}
                  readOnly={!metaEditing}
                  spellCheck={false}
                  rows={metaEditing ? 6 : 2}
                  className={cn("mt-4 w-full rounded-md border border-input px-3 py-2 font-mono text-sm text-emerald-700 focus:outline-none focus:ring-1 focus:ring-ring", metaEditing ? "bg-background" : "bg-secondary/40")}
                />
              )}
            </div>

            {/* Tabs */}
            {mode === "edit" && (
              <div>
                <div className="flex items-center gap-6 border-b border-border">
                  <TabBtn active={tab === "locations"} onClick={() => setTab("locations")} icon={MapPin}>Locations</TabBtn>
                  <TabBtn active={tab === "jobs"} onClick={() => setTab("jobs")} icon={PlayCircle}>Jobs</TabBtn>
                  <TabBtn active={tab === "seeds"} onClick={() => setTab("seeds")} icon={Sprout}>Seeds</TabBtn>
                </div>

                {tab === "locations" && (
                  <div className="pt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <FilterChip label="Address" />
                        <FilterChip label="City" />
                        <FilterChip label="Postal code" />
                        <FilterChip label="Created at" icon={Calendar} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.info("Export to Excel — coming soon")}>
                          <FileSpreadsheet className="h-3.5 w-3.5" /> Export to Excel (.xlsx)
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={addLocation}><Plus className="h-3.5 w-3.5" /> Add location</Button>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/60">
                          <tr><Th>Name</Th><Th>Locator</Th><Th>Address</Th><Th>City</Th><Th>Postal code</Th><Th>Status</Th><Th className="w-10" /></tr>
                        </thead>
                        <tbody>
                          {locations.length === 0 ? (
                            <tr><Td className="text-muted-foreground"><span className="block py-2">No locations yet.</span></Td><Td /><Td /><Td /><Td /><Td /><Td /></tr>
                          ) : locations.map((l) => (
                            <tr key={l.id} className="border-t border-border hover:bg-secondary/40">
                              <Td><LinkText>{l.name}</LinkText></Td>
                              <Td className="max-w-[140px] truncate font-mono text-xs text-muted-foreground">{l.locator}</Td>
                              <Td className="text-foreground/80">{l.address}</Td>
                              <Td className="text-foreground/80">{l.city}</Td>
                              <Td className="text-muted-foreground">{l.postal}</Td>
                              <Td><Pill tone={l.status === "Active" ? "green" : "slate"}>{l.status}</Pill></Td>
                              <Td><button className="rounded p-1 text-muted-foreground hover:bg-secondary"><MoreVertical className="h-4 w-4" /></button></Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Pagination total={locations.length} />
                  </div>
                )}
                {tab === "jobs" && <EmptyTab icon={PlayCircle} label="No jobs linked to this store yet." />}
                {tab === "seeds" && <EmptyTab icon={Sprout} label="No seeds linked to this store yet." />}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>{isSaving ? "Saving..." : mode === "add" ? "Add store" : "Save store"}</Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete store</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this store? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete?.()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function F({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-sm font-medium text-foreground/80">{label}{required && <span className="ml-0.5 text-destructive">*</span>}</Label>
      {children}
    </div>
  );
}

function Sel({ value, onChange, options, render }: { value: string; onChange: (v: string) => void; options: string[]; render?: (v: string) => string }) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Select a value" /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{render ? render(o) : o}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function TabBtn({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof MapPin; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn("-mb-px inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors", active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
      <Icon className="h-4 w-4" /> {children}
    </button>
  );
}

function EmptyTab({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground"><Icon className="h-5 w-5" /></span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
