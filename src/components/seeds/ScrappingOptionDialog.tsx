import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pill } from "@/components/seeds/ListPrimitives";
import {
  STORE_OPTIONS,
  EXTRACTION_TYPE_OPTIONS,
  TIMEFRAME_OPTIONS,
  MODALITY_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/seedOptions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";

const STATUS_OPTIONS = ["Active", "Inactive"];

export type ScrappingOptionValues = {
  name: string;
  status: string;
  extractionType: string;
  stores: string[];
  timeframes: string[];
  // Joints (conjuntos)
  multivariants: boolean;
  pagination: boolean;
  maxPage: string;
  limitedDiscovery: boolean;
  maxRank: string;
  // Disjoints (disjuntos)
  modalities: boolean;
  modality: string;
  sorting: boolean;
  sort: string;
};

export const EMPTY_SCRAPPING_OPTION: ScrappingOptionValues = {
  name: "",
  status: "Active",
  extractionType: "MEDIA",
  stores: [],
  timeframes: ["All Day (1 x day)"],
  multivariants: false,
  pagination: false,
  maxPage: "",
  limitedDiscovery: false,
  maxRank: "",
  modalities: false,
  modality: "pickup",
  sorting: false,
  sort: "best_seller",
};

export function ScrappingOptionDialog({
  open,
  onOpenChange,
  initial,
  mode,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: ScrappingOptionValues | null;
  mode: "add" | "edit";
  onSave: (values: ScrappingOptionValues) => void;
  onDelete?: () => void;
}) {
  const [v, setV] = useState<ScrappingOptionValues>(EMPTY_SCRAPPING_OPTION);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      // Merge over defaults so older saved records (missing newer fields like
      // `timeframes`) get safe array/string defaults instead of crashing.
      setV(initial ? { ...EMPTY_SCRAPPING_OPTION, ...initial } : EMPTY_SCRAPPING_OPTION);
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [open, initial]);

  const set = <K extends keyof ScrappingOptionValues>(k: K, val: ScrappingOptionValues[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const addStore = (store: string) => {
    if (!v.stores.includes(store)) set("stores", [...v.stores, store]);
  };
  const removeStore = (store: string) =>
    set("stores", v.stores.filter((s) => s !== store));

  const availableStores = STORE_OPTIONS.filter((s) => !v.stores.includes(s));

  const addTimeframe = (t: string) => {
    if (!v.timeframes.includes(t)) set("timeframes", [...v.timeframes, t]);
  };
  const removeTimeframe = (t: string) =>
    set("timeframes", v.timeframes.filter((x) => x !== t));
  const availableTimeframes = TIMEFRAME_OPTIONS.filter((t) => !v.timeframes.includes(t));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      onSave(v);
      toast.success(`Scrapping option ${mode === "add" ? "created" : "saved"} successfully`);
      onOpenChange(false);
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete?.();
    toast.success("Scrapping option deleted");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] w-[min(880px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              {mode === "add" ? "Add scrapping option" : v.name || "Scrapping option"}
            </DialogTitle>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 space-y-5 overflow-auto px-6 py-5">
            {/* Fields */}
            <section className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-4">
              <Field label="Name" required className="sm:col-span-3">
                <Input value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. ME_KW_WATER — Amazon US" />
              </Field>
              <Field label="Status" className="sm:col-span-1">
                <SelectBox value={v.status} onChange={(x) => set("status", x)} options={STATUS_OPTIONS} />
              </Field>

              <Field label="Extraction type" required className="sm:col-span-2">
                <SelectBox value={v.extractionType} onChange={(x) => set("extractionType", x)} options={EXTRACTION_TYPE_OPTIONS} />
              </Field>
              {/* Timeframes — 1:N multi-select */}
              <Field label="Timeframes" required className="sm:col-span-2">
                <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5">
                  {v.timeframes.length === 0 && (
                    <span className="px-1 text-sm text-muted-foreground">No timeframes selected</span>
                  )}
                  {v.timeframes.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTimeframe(t)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${t}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {availableTimeframes.length > 0 && (
                    <Select value="" onValueChange={addTimeframe}>
                      <SelectTrigger className="h-6 w-auto gap-1 border-dashed px-2 text-xs text-muted-foreground">
                        <Plus className="h-3 w-3" />
                        <span>Add timeframe</span>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeframes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </Field>

              {/* Stores or retailer — n:n multi-select */}
              <Field label="Stores or retailer" required className="sm:col-span-4">
                <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5">
                  {v.stores.length === 0 && (
                    <span className="px-1 text-sm text-muted-foreground">No stores selected</span>
                  )}
                  {v.stores.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeStore(s)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${s}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {availableStores.length > 0 && (
                    <Select value="" onValueChange={addStore}>
                      <SelectTrigger className="h-6 w-auto gap-1 border-dashed px-2 text-xs text-muted-foreground">
                        <Plus className="h-3 w-3" />
                        <span>Add store</span>
                      </SelectTrigger>
                      <SelectContent>
                        {availableStores.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </Field>
            </section>

            {/* Scrapping options and values */}
            <section className="rounded-xl border border-border bg-secondary/30 p-5">
              <h3 className="text-sm font-semibold text-foreground">Scrapping options and values</h3>

              {/* Joints */}
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Joints <span className="font-normal normal-case">(conjuntos — one value covers the others)</span>
              </p>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Toggle label="Multivariants" checked={v.multivariants} onChange={(c) => set("multivariants", c)} />
                <Toggle
                  label="Pagination"
                  checked={v.pagination}
                  onChange={(c) => set("pagination", c)}
                  input={
                    <Input
                      type="number"
                      placeholder="max page"
                      value={v.maxPage}
                      disabled={!v.pagination}
                      onChange={(e) => set("maxPage", e.target.value)}
                      className="h-8"
                    />
                  }
                />
                <Toggle
                  label="Limited discovery"
                  checked={v.limitedDiscovery}
                  onChange={(c) => set("limitedDiscovery", c)}
                  input={
                    <Input
                      type="number"
                      placeholder="max rank"
                      value={v.maxRank}
                      disabled={!v.limitedDiscovery}
                      onChange={(e) => set("maxRank", e.target.value)}
                      className="h-8"
                    />
                  }
                />
              </div>

              {/* Disjoints */}
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Disjoints <span className="font-normal normal-case">(disjuntos — mutually exclusive)</span>
              </p>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Toggle
                  label="Modalities"
                  checked={v.modalities}
                  onChange={(c) => set("modalities", c)}
                  input={
                    <SelectBox
                      value={v.modality}
                      onChange={(x) => set("modality", x)}
                      options={MODALITY_OPTIONS}
                      disabled={!v.modalities}
                      className="h-8"
                    />
                  }
                />
                <Toggle
                  label="Sorting"
                  checked={v.sorting}
                  onChange={(c) => set("sorting", c)}
                  input={
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">?sort=</span>
                      <SelectBox
                        value={v.sort}
                        onChange={(x) => set("sort", x)}
                        options={SORT_OPTIONS}
                        disabled={!v.sorting}
                        className="h-8"
                      />
                    </div>
                  }
                />
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : mode === "add" ? "Add scrapping option" : "Save scrapping option"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete scrapping option</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scrapping option? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SelectBox({
  value,
  onChange,
  options,
  disabled,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a value" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  input,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
  input?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        {label}
      </label>
      {input && <div className="mt-2">{input}</div>}
    </div>
  );
}
