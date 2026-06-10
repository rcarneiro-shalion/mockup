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
import { COUNTRY_OPTIONS, countryLabel, type RegionSystem } from "@/lib/retailers";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, FileSpreadsheet } from "lucide-react";

export function RegionSystemForm({
  mode, initial, onSave, onCancel, onDelete,
}: {
  mode: "add" | "edit";
  initial: RegionSystem;
  onSave: (r: RegionSystem) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [r, setR] = useState<RegionSystem>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const set = <K extends keyof RegionSystem>(k: K, v: RegionSystem[K]) => setR((p) => ({ ...p, [k]: v }));
  const canSave = r.name.trim() && r.country.trim();
  const regions = r.regions ?? [];
  const addRegion = () => set("regions", [...regions, "New region"]);
  const removeRegion = (i: number) => set("regions", regions.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!canSave) { toast.error("Name and Country are required"); return; }
    setIsSaving(true);
    try { await new Promise((res) => setTimeout(res, 300)); onSave(r); toast.success(`Region system ${mode === "add" ? "created" : "saved"} successfully`); }
    catch { toast.error("Save failed. Please try again."); }
    finally { setIsSaving(false); }
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Region systems
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{mode === "add" ? "Add region system" : r.name || "Region system"}</h1>
          </div>
          {mode === "edit" && onDelete && (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Delete region system">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl space-y-5">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">Name <span className="text-destructive">*</span></Label>
                <Input value={r.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">Country <span className="text-destructive">*</span></Label>
                <Select value={r.country || undefined} onValueChange={(v) => set("country", v)} disabled={mode === "edit"}>
                  <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{countryLabel(c)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Regions */}
            {mode === "edit" && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">Regions</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => toast.info("Export to Excel — coming soon")}>
                      <FileSpreadsheet className="h-3.5 w-3.5" /> Export to Excel (.xlsx)
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={addRegion}><Plus className="h-3.5 w-3.5" /> Add region</Button>
                  </div>
                </div>
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60"><tr><Th>Name</Th><Th className="w-10" /></tr></thead>
                    <tbody>
                      {regions.length === 0 ? (
                        <tr><Td className="text-muted-foreground"><span className="block py-2">No regions yet.</span></Td><Td /></tr>
                      ) : regions.map((name, i) => (
                        <tr key={i} className="border-t border-border hover:bg-secondary/40">
                          <Td><LinkText>{name}</LinkText></Td>
                          <Td>
                            <button onClick={() => removeRegion(i)} className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label={`Remove ${name}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination total={regions.length} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>{isSaving ? "Saving..." : mode === "add" ? "Add region system" : "Save region system"}</Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete region system</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this region system? This action cannot be undone.</AlertDialogDescription>
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
