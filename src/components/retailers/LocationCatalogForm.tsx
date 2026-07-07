import { useMemo, useState } from "react";
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
import { ChipMultiSelect } from "@/components/seeds/ChipMultiSelect";
import { LocationSetDialog } from "@/components/retailers/LocationSetDialog";
import { COUNTRY_OPTIONS, countryLabel, emptyLocationSet, getStores, PURPOSE_OPTIONS, type LocationCatalog, type LocationSet, type Purpose } from "@/lib/retailers";
import { catalogTerms } from "@/lib/catalogTerms";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, FileSpreadsheet } from "lucide-react";

export function LocationCatalogForm({
  mode, initial, onSave, onCancel, onDelete, onAutoSave,
}: {
  mode: "add" | "edit";
  initial: LocationCatalog;
  onSave: (c: LocationCatalog) => void;
  onCancel: () => void;
  onDelete?: () => void;
  /** Persist set-grid edits immediately (edit mode) so they aren't lost on navigate-away. */
  onAutoSave?: (c: LocationCatalog) => void;
}) {
  const t = catalogTerms();
  const [c, setC] = useState<LocationCatalog>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const set = <K extends keyof LocationCatalog>(k: K, v: LocationCatalog[K]) => setC((p) => ({ ...p, [k]: v }));
  const canSave = c.name.trim() && c.country.trim();

  // Store options scoped to the catalog's country (distinct names, sorted).
  const storeOptions = useMemo(
    () =>
      [...new Set(getStores().filter((s) => !c.country || s.country === c.country).map((s) => s.name))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [c.country],
  );

  // A catalog holds location sets (buckets). Each set holds locations.
  const sets = c.sets ?? [];
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const selectedSet = sets.find((x) => x.id === selectedSetId) ?? null;
  // Set-grid mutations auto-persist immediately (edit mode) — flushing the whole current
  // catalog — so add/edit/delete-set and location changes survive leaving the page without
  // clicking the outer "Save location catalog" (mirrors the Projects assignment grids).
  const commitSets = (next: LocationSet[]) => {
    const updated = { ...c, sets: next };
    setC(updated);
    onAutoSave?.(updated);
  };
  const addSet = () => {
    const ls = emptyLocationSet();
    commitSets([...sets, ls]);
    setSelectedSetId(ls.id);
  };
  const removeSet = (id: string) => commitSets(sets.filter((x) => x.id !== id));
  const saveSet = (updated: LocationSet) =>
    commitSets(sets.map((x) => (x.id === updated.id ? updated : x)));

  const handleSave = async () => {
    if (!canSave) { toast.error("Name and Country are required"); return; }
    setIsSaving(true);
    try { await new Promise((res) => setTimeout(res, 300)); onSave(c); toast.success(`${t.root} ${mode === "add" ? "created" : "saved"} successfully`); }
    catch { toast.error("Save failed. Please try again."); }
    finally { setIsSaving(false); }
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> {t.title}
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{mode === "add" ? t.addRoot : c.name || t.root}</h1>
          </div>
          {mode === "edit" && onDelete && (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label={`Delete ${t.rootLower}`}>
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
              {t.showPurpose && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">Purpose</Label>
                  <ChipMultiSelect
                    value={c.purposes ?? []}
                    onChange={(arr) => set("purposes", arr as Purpose[])}
                    options={[...PURPOSE_OPTIONS]}
                    addLabel="Add purpose"
                    emptyLabel="No specific purpose"
                  />
                  <p className="text-xs text-muted-foreground">
                    Which product flows this catalog is intended for — choose any of DASHBOARD, MSRP, ASSORTMENT, SCRAPING.
                  </p>
                </div>
              )}
              {t.showPurpose && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">Stores</Label>
                  <ChipMultiSelect
                    value={c.stores ?? []}
                    onChange={(arr) => set("stores", arr)}
                    options={storeOptions}
                    addLabel="Add store"
                    emptyLabel="All stores"
                  />
                  <p className="text-xs text-muted-foreground">
                    {c.country
                      ? `Stores this catalog applies to (in ${countryLabel(c.country)}). Leave empty for all.`
                      : "Select a country first to choose its stores. Leave empty for all."}
                  </p>
                </div>
              )}
            </div>

            {/* Location sets (buckets) */}
            {mode === "edit" && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">{t.sets}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.info("Export to Excel — coming soon")}>
                      <FileSpreadsheet className="h-3.5 w-3.5" /> Export to Excel (.xlsx)
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={addSet}><Plus className="h-3.5 w-3.5" /> {t.addSet}</Button>
                  </div>
                </div>
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60"><tr><Th>Name</Th><Th>Locations</Th><Th className="w-10" /></tr></thead>
                    <tbody>
                      {sets.length === 0 ? (
                        <tr><Td className="text-muted-foreground"><span className="block py-2">{t.noSets}</span></Td><Td /><Td /></tr>
                      ) : sets.map((ls) => (
                        <tr key={ls.id} className="border-t border-border hover:bg-secondary/40">
                          <Td><LinkText onClick={() => setSelectedSetId(ls.id)}>{ls.name}</LinkText></Td>
                          <Td className="tabular-nums text-foreground/70">{(ls.locationCount ?? (ls.locations ?? []).length).toLocaleString()}</Td>
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
          <Button onClick={handleSave} disabled={isSaving || !canSave}>{isSaving ? "Saving..." : mode === "add" ? t.addRoot : t.saveRoot}</Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {t.rootLower}</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this {t.rootLower}? This action cannot be undone.</AlertDialogDescription>
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
        country={c.country}
        entityLabel={t.setLower}
        onSave={saveSet}
        onDelete={() => { if (selectedSetId) removeSet(selectedSetId); setSelectedSetId(null); }}
      />
    </AppShell>
  );
}
