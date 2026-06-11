import { useState } from "react";
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
import { Th, Td, Pagination } from "@/components/seeds/ListPrimitives";
import { getBrands, MANUFACTURERS, BRAND_CATEGORIES, type Brand } from "@/lib/brands";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";

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
  const canSave = b.name.trim() && b.defaultCategory && b.defaultManufacturer;

  // Options always include the record's current values so they remain selectable.
  const categoryOptions = uniq([b.defaultCategory, ...BRAND_CATEGORIES]);
  const manufacturerOptions = uniq([b.defaultManufacturer, ...MANUFACTURERS]);
  const parentOptions = uniq([
    b.parent,
    ...getBrands()
      .filter((x) => x.id !== b.id)
      .map((x) => x.name),
  ]);

  const handleSave = async () => {
    if (!canSave) {
      toast.error("Name, Default category and Default manufacturer are required");
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
            <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input value={b.name} onChange={(e) => set("name", e.target.value)} />
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
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

                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">
                    Default manufacturer <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={b.defaultManufacturer}
                    onValueChange={(v) => set("defaultManufacturer", v)}
                  >
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
              </div>

              <div className="flex flex-col gap-1.5 md:max-w-[calc(50%-0.75rem)]">
                <Label className="text-sm font-medium text-foreground/80">Parent brand</Label>
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

              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-3">
                  <Checkbox
                    checked={b.isWhiteLabel}
                    onCheckedChange={(v) => set("isWhiteLabel", v === true)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">Is white label</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      Retailer's own-brand / private-label product line.
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <Checkbox
                    checked={b.isMultiBrand}
                    disabled={b.isMultiBrand && hasEditions}
                    onCheckedChange={(v) => set("isMultiBrand", v === true)}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">Is multi-brand</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      A brand umbrella that groups several editions.
                      {b.isMultiBrand && hasEditions
                        ? " It can't be turned off while it has editions — delete the editions first."
                        : ""}
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Editions (multi-brand only) */}
            {b.isMultiBrand && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">Editions</h2>
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60">
                      <tr>
                        <Th>Name</Th>
                        <Th>Category</Th>
                        <Th>Created at</Th>
                        <Th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {editions.length === 0 ? (
                        <tr>
                          <Td className="text-muted-foreground">
                            <span className="block py-2">No editions yet.</span>
                          </Td>
                          <Td />
                          <Td />
                          <Td />
                        </tr>
                      ) : (
                        editions.map((e) => (
                          <tr key={e.id} className="border-t border-border hover:bg-secondary/40">
                            <Td className="text-foreground/90">{e.name}</Td>
                            <Td className="text-foreground/80">{e.category}</Td>
                            <Td className="text-muted-foreground">{e.createdAt}</Td>
                            <Td>
                              <button
                                onClick={() =>
                                  set("editions", editions.filter((x) => x.id !== e.id))
                                }
                                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                                aria-label={`Remove ${e.name}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </Td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination total={editions.length} />
              </div>
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
