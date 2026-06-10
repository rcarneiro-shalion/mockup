import { useState } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getRetailers, STORE_TYPE_OPTIONS, STORE_CLASS_OPTIONS, DEVICE_OPTIONS, COUNTRY_OPTIONS, flag,
  type Store,
} from "@/lib/retailers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";

export function StoreForm({
  mode, initial, onSave, onCancel, onDelete,
}: {
  mode: "add" | "edit";
  initial: Store;
  onSave: (s: Store) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [s, setS] = useState<Store>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const set = <K extends keyof Store>(k: K, v: Store[K]) => setS((p) => ({ ...p, [k]: v }));
  const canSave = s.name.trim() && s.domain.trim() && s.retailer.trim();
  const retailerNames = getRetailers().map((r) => r.name);

  const handleSave = async () => {
    if (!canSave) { toast.error("Name, Domain and Retailer are required"); return; }
    setIsSaving(true);
    try { await new Promise((r) => setTimeout(r, 300)); onSave(s); toast.success(`Store ${mode === "add" ? "created" : "saved"} successfully`); }
    catch { toast.error("Save failed. Please try again."); }
    finally { setIsSaving(false); }
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Stores
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{mode === "add" ? "Add store" : s.name || "Store"}</h1>
          </div>
          {mode === "edit" && onDelete && (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Delete store">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <F label="Name" required><Input value={s.name} onChange={(e) => set("name", e.target.value)} /></F>
              <F label="Domain" required><Input value={s.domain} onChange={(e) => set("domain", e.target.value)} placeholder="example.com" /></F>
              <F label="Retailer" required><Sel value={s.retailer} onChange={(v) => set("retailer", v)} options={retailerNames} /></F>
              <F label="Country"><Sel value={s.country} onChange={(v) => set("country", v)} options={COUNTRY_OPTIONS} render={(c) => `${flag(c)} ${c}`} /></F>
              <F label="Type"><Sel value={s.type} onChange={(v) => set("type", v)} options={STORE_TYPE_OPTIONS} /></F>
              <F label="Class"><Sel value={s.klass} onChange={(v) => set("klass", v)} options={STORE_CLASS_OPTIONS} /></F>
              <F label="Device"><Sel value={s.device} onChange={(v) => set("device", v)} options={DEVICE_OPTIONS} /></F>
              <F label="Status"><Sel value={s.status} onChange={(v) => set("status", v as Store["status"])} options={["Active", "Inactive"]} /></F>
            </div>
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

function F({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground/80">{label}{required && <span className="ml-0.5 text-destructive">*</span>}</Label>
      {children}
    </div>
  );
}

function Sel({ value, onChange, options, render }: { value: string; onChange: (v: string) => void; options: string[]; render?: (v: string) => string }) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Select a value" /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o} value={o}>{render ? render(o) : o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
