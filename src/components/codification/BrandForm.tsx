import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getBrands, MANUFACTURERS, BRAND_CATEGORIES, type Brand } from "@/lib/brands";
import { getBrandSections, uid } from "@/lib/brandSampleSections";
import {
  BrandClassificationSection,
  CategorySelectionSection,
  EditionSelectionSection,
  ManufacturerSelectionSection,
} from "@/components/codification/BrandDetailSections";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Tag, Shuffle } from "lucide-react";

const NONE = "__none__";
const uniq = (arr: (string | undefined)[]) => [...new Set(arr.filter((v): v is string => !!v))];

export function BrandForm({
  mode,
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  mode: "add" | "edit";
  initial: Brand;
  onSave: (b: Brand) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [b, setB] = useState<Brand>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const set = <K extends keyof Brand>(k: K, v: Brand[K]) => setB((p) => ({ ...p, [k]: v }));

  const editions = b.editions ?? [];
  const hasEditions = editions.length > 0;
  // A multi-brand with editions must nominate a default edition (mirrors Default
  // category being required); a multi-brand with no editions yet cannot.
  const needsDefaultEdition = b.isMultiBrand && hasEditions;
  const canSave =
    b.name.trim() &&
    b.defaultCategory &&
    b.defaultManufacturer &&
    (!needsDefaultEdition || !!b.defaultEdition);

  // Options always include the record's current values so they remain selectable.
  const categoryOptions = uniq([b.defaultCategory, ...BRAND_CATEGORIES]);
  const manufacturerOptions = uniq([b.defaultManufacturer, ...MANUFACTURERS]);
  // Default edition can only be one of this brand's editions.
  const editionOptions = uniq(editions.map((e) => e.name));

  // Remove an edition; if it was the nominated default, clear the default too.
  const removeEdition = (id: string) => {
    const next = editions.filter((x) => x.id !== id);
    const removed = editions.find((x) => x.id === id);
    setB((p) => ({
      ...p,
      editions: next,
      defaultEdition: removed && p.defaultEdition === removed.name ? undefined : p.defaultEdition,
    }));
  };

  // Toggling multi-brand off drops the editions concept entirely.
  const setMultiBrand = (on: boolean) =>
    setB((p) => (on ? { ...p, isMultiBrand: true } : { ...p, isMultiBrand: false, defaultEdition: undefined }));

  // Richer console-style sections (illustrative prototype data, not persisted).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sections = useMemo(() => getBrandSections(b), [b.id]);
  const addEdition = (name: string, category: string) =>
    setB((p) => ({
      ...p,
      editions: [...(p.editions ?? []), { id: uid(), name, category, createdAt: new Date().toDateString() }],
    }));
  const parentOptions = uniq([
    b.parent,
    ...getBrands()
      .filter((x) => x.id !== b.id)
      .map((x) => x.name),
  ]);

  const handleSave = async () => {
    if (!canSave) {
      toast.error(
        needsDefaultEdition && !b.defaultEdition
          ? "Select a Default edition for this multi-brand"
          : "Name, Default category and Default manufacturer are required",
      );
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 300));
      onSave(b);
      toast.success(`Brand ${mode === "add" ? "created" : "saved"} successfully`);
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Brands
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {mode === "add" ? "Add brand" : b.name || "Brand"}
            </h1>
          </div>
          {mode === "edit" && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label="Delete brand"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl space-y-5">
            {/* Core fields */}
            {/* Core fields — mirrors the console: Name + White label + Multi brand,
                then Default manufacturer + Parent, then Default category (full width). */}
            <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
              {/* Row 1: Name + inline White label / Multi brand */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input value={b.name} onChange={(e) => set("name", e.target.value)} />
                </div>

                <label className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm">
                  <Checkbox
                    checked={b.isWhiteLabel}
                    onCheckedChange={(v) => set("isWhiteLabel", v === true)}
                  />
                  <span className="font-medium text-foreground">White label</span>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </label>

                <label
                  title={
                    b.isMultiBrand && hasEditions
                      ? "You must remove all editions associated with the brand to disable this field."
                      : undefined
                  }
                  className={cn(
                    "flex h-10 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-sm",
                    b.isMultiBrand && hasEditions ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                  )}
                >
                  <Checkbox
                    checked={b.isMultiBrand}
                    disabled={b.isMultiBrand && hasEditions}
                    onCheckedChange={(v) => setMultiBrand(v === true)}
                  />
                  <span className="font-medium text-foreground">Multi brand</span>
                  <Shuffle className="h-4 w-4 text-muted-foreground" />
                </label>
              </div>

              {/* Row 2: Default manufacturer + Parent */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">
                    Default manufacturer <span className="text-destructive">*</span>
                  </Label>
                  <Select value={b.defaultManufacturer} onValueChange={(v) => set("defaultManufacturer", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturerOptions.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">Parent</Label>
                  <Select
                    value={b.parent || NONE}
                    onValueChange={(v) => set("parent", v === NONE ? undefined : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No parent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>— No parent —</SelectItem>
                      {parentOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Default category (full width) */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">
                  Default category <span className="text-destructive">*</span>
                </Label>
                <Select value={b.defaultCategory} onValueChange={(v) => set("defaultCategory", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Default edition — mockup-only feature; below Default category, multi-brand only */}
              {b.isMultiBrand && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">
                    Default edition {needsDefaultEdition && <span className="text-destructive">*</span>}
                  </Label>
                  <Select
                    value={b.defaultEdition || NONE}
                    onValueChange={(v) => set("defaultEdition", v === NONE ? undefined : v)}
                    disabled={!hasEditions}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={hasEditions ? "Select an edition" : "Add an edition first"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>— No default —</SelectItem>
                      {editionOptions.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">
                    The edition applied by default for this multi-brand.
                  </span>
                </div>
              )}
            </div>

            {/* Richer console-style sections (edit mode) — mirror the real brand editor */}
            {mode === "edit" && (
              <>
                <BrandClassificationSection initial={sections.classification} />
                <CategorySelectionSection initial={sections.categories} />
                {b.isMultiBrand && (
                  <EditionSelectionSection
                    editions={editions}
                    defaultEdition={b.defaultEdition}
                    editionRegexps={sections.editionRegexps}
                    onAddEdition={addEdition}
                    onRemoveEdition={removeEdition}
                    onMakeDefault={(name) => set("defaultEdition", name)}
                  />
                )}
                <ManufacturerSelectionSection initial={sections.manufacturers} />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>
            {isSaving ? "Saving..." : mode === "add" ? "Add brand" : "Save brand"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete brand</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this brand? This action cannot be undone. (In
              production, a brand can only be deleted when nothing references it.)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete?.()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
