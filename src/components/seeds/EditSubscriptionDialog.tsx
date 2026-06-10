import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
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
import { Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { readPersistedList } from "@/lib/seedOptions";
import { getClientNames } from "@/lib/clients";

export type SubscriptionRow = {
  id: string;
  client: string;
  storePackage: string;
  seed: string;
  validFrom: string;
  validTo: string;
  status: "Active" | "Inactive";
};

export function EditSubscriptionDialog({
  row,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: {
  row: SubscriptionRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (updated: SubscriptionRow) => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<Partial<SubscriptionRow>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (row) {
      setForm({ ...row });
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [row, open]);

  if (!row) return null;

  const seedOptions = readPersistedList<{ d: string }>("seeds-api:seeds").map(
    (s) => s.d,
  );
  const storePackageOptions = readPersistedList<{ name: string }>(
    "seeds-api:store-packages",
  ).map((p) => p.name);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve, reject) =>
        setTimeout(() => (Math.random() > 0.2 ? resolve(null) : reject(new Error("Save failed"))), 400),
      );
      onSave({ ...row, ...form } as SubscriptionRow);
      toast.success("Seed subscription saved successfully");
      onOpenChange(false);
    } catch {
      toast.error("Seed subscription failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete?.();
    toast.success("Record deleted");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[780px] gap-0 p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <DialogTitle className="font-mono text-base font-semibold tracking-tight">
              {row.id}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid max-h-[60vh] gap-5 overflow-auto px-6 py-5">
            <div className="grid grid-cols-[1fr_180px] gap-4">
              <Field label="Client" required>
                <OptionSelect
                  value={form.client ?? row.client}
                  options={getClientNames()}
                  onChange={(v) => setForm((prev) => ({ ...prev, client: v }))}
                />
              </Field>
              <Field label="Status">
                <OptionSelect
                  value={form.status ?? row.status}
                  options={["Active", "Inactive"]}
                  onChange={(v) =>
                    setForm((prev) => ({
                      ...prev,
                      status: v as "Active" | "Inactive",
                    }))
                  }
                />
              </Field>
            </div>

            <Field label="Store package" required>
              <OptionSelect
                value={form.storePackage ?? row.storePackage}
                options={storePackageOptions}
                onChange={(v) =>
                  setForm((prev) => ({ ...prev, storePackage: v }))
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Valid from" required>
                <div className="relative">
                  <Input
                    value={form.validFrom ?? row.validFrom}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, validFrom: e.target.value }))
                    }
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
              <Field label="Valid to">
                <div className="relative">
                  <Input
                    value={form.validTo ?? row.validTo}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, validTo: e.target.value }))
                    }
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
            </div>

            <Field label="Seed" required>
              <OptionSelect
                value={form.seed ?? row.seed}
                options={seedOptions}
                onChange={(v) => setForm((prev) => ({ ...prev, seed: v }))}
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-foreground/80">
              <input type="checkbox" className="h-4 w-4 rounded border-border" />
              Is favourite
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save seed subscriptions"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function OptionSelect({
  value,
  options,
  onChange,
  placeholder = "Select a value",
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            No options available
          </div>
        ) : (
          options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
