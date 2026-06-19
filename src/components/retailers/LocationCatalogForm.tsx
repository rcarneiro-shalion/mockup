import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Th, Td, Pagination, LinkText } from "@/components/seeds/ListPrimitives";
import { LocationSetDialog } from "@/components/retailers/LocationSetDialog";
import { COUNTRY_OPTIONS, countryLabel, emptyLocationSet, type LocationCatalog, type LocationSet } from "@/lib/retailers";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, FileSpreadsheet } from "lucide-react";

export function LocationCatalogForm({
  mode, initial, onSave, onCancel, onDelete,
}: {
  mode: "add" | "edit";
  initial: LocationCatalog;
  onSave: (c: LocationCatalog) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [c, setC] = useState<LocationCatalog>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const set = <K extends keyof LocationCatalog>(k: K, v: LocationCatalog[K]) => setC((p) => ({ ...p, [k]: v }));
  const canSave = c.name.trim() && c.country.trim();

  // A catalog holds location sets (buckets). Each set holds locations.
  const sets = c.sets ?? [];
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const selectedSet = sets.find((x) => x.id === selectedSetId) ?? null;
  const addSet = () => {
    const ls = emptyLocationSet();
    set("sets", [...sets, ls]);
    setSelectedSetId(ls.id);
  };
  const removeSet = (id: string) => set("sets", sets.filter((x) => x.id !== id));
  const saveSet = (updated: LocationSet) =>
    set("sets", sets.map((x) => (x.id === updated.id ? updated : x)));

  const handleSave = async () => {
    if (!canSave) { toast.error("Name and Country are required"); return; }
    setIsSaving(true);
    try { await new Promise((res) => setTimeout(res, 300)); onSave(c); toast.success(`Location catalog ${mode === "add" ? "created" : "saved"} successfully`); }
    catch { toast.error("Save failed. Please try again."); }
    finally { setIsSaving(false); }
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Location Catalog
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{mode === "add" ? "Add location catalog" : c.name || "Location catalog"}</h1>
          </div>
          {mode === "edit" && onDelete && (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Delete location catalog">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl space-y-5">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">Name <span className="text-destructive">*</span></Label>
                <Input value={c.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">Country <span className="text-destructive">*</span></Label>
                <Select value={c.country || undefined} onValueChange={(v) => set("country", v)} disabled={mode === "edit"}>
                  <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((cc) => <SelectItem key={cc} value={cc}>{countryLabel(cc)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location sets (buckets) */}
            {mode === "edit" && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">Location sets</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.info("Export to Excel — coming soon")}>
                      <FileSpreadsheet className="h-3.5 w-3.5" /> Export to Excel (.xlsx)
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={addSet}><Plus className="h-3.5 w-3.5" /> Add location set</Button>
                  </div>
                </div>
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60"><tr><Th>Name</Th><Th>Locations</Th><Th className="w-10" /></tr></thead>
                    <tbody>
                      {sets.length === 0 ? (
                        <tr><Td className="text-muted-foreground"><span className="block py-2">No location sets yet.</span></Td><Td /><Td /></tr>
                      ) : sets.map((ls) => (
                        <tr key={ls.id} className="border-t border-border hover:bg-secondary/40">
                          <Td><LinkText onClick={() => setSelectedSetId(ls.id)}>{ls.name}</LinkText></Td>
                          <Td className="tabular-nums text-foreground/70">{(ls.locations ?? []).length}</Td>
                          <Td>
                            <button onClick={() => removeSet(ls.id)} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label={`Remove ${ls.name}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination total={sets.length} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>{isSaving ? "Saving..." : mode === "add" ? "Add location catalog" : "Save location catalog"}</Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete location catalog</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this location catalog? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete?.()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LocationSetDialog
        open={selectedSetId !== null}
        onOpenChange={(v) => { if (!v) setSelectedSetId(null); }}
        set={selectedSet}
        onSave={saveSet}
        onDelete={() => { if (selectedSetId) removeSet(selectedSetId); setSelectedSetId(null); }}
      />
    </AppShell>
  );
}
