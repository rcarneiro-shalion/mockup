import { useState, useEffect } from "react";
import type { ReactNode } from "react";
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
import { Trash2, ChevronDown, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type FieldDef =
  | {
      kind: "select";
      label: string;
      value: string;
      required?: boolean;
      muted?: boolean;
      stepper?: boolean;
      span?: 1 | 2;
      options?: string[];
      placeholder?: string;
    }
  | {
      kind: "text";
      label: string;
      value: string;
      required?: boolean;
      span?: 1 | 2;
    }
  | {
      kind: "date";
      label: string;
      value: string;
      required?: boolean;
      span?: 1 | 2;
    }
  | {
      kind: "checkbox";
      label: string;
      checked?: boolean;
      span?: 1 | 2;
    }
  | {
      kind: "textarea";
      label: string;
      value: string;
      required?: boolean;
      span?: 1 | 2;
    };

export function EditRecordDialog({
  open,
  onOpenChange,
  title,
  saveLabel,
  fields,
  onSave,
  onDelete,
  width = 780,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  saveLabel: string;
  fields: FieldDef[];
  onSave: (values: Record<string, string | boolean>) => void;
  onDelete?: () => void;
  width?: number;
}) {
  const [formValues, setFormValues] = useState<Record<string, string | boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      const initial: Record<string, string | boolean> = {};
      fields.forEach((f) => {
        if (f.kind === "checkbox") {
          initial[f.label] = f.checked ?? false;
        } else {
          initial[f.label] = f.value ?? "";
        }
      });
      setFormValues(initial);
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [open, fields]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve, reject) =>
        setTimeout(() => (Math.random() > 0.2 ? resolve(null) : reject(new Error("Save failed"))), 400),
      );
      onSave(formValues);
      toast.success(`${saveLabel} saved successfully`);
      onOpenChange(false);
    } catch {
      toast.error(`${saveLabel} failed. Please try again.`);
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
        <DialogContent className="gap-0 p-0" style={{ maxWidth: width }}>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <DialogTitle className="font-mono text-base font-semibold tracking-tight">
              {title}
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

          <div className="grid max-h-[60vh] grid-cols-2 gap-x-4 gap-y-5 overflow-auto px-6 py-5">
            {fields.map((f, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col gap-1.5",
                  (f.span ?? 1) === 2 && "col-span-2",
                )}
              >
                <FieldBody
                  field={f}
                  value={formValues[f.label]}
                  onChange={(v) =>
                    setFormValues((prev) => ({ ...prev, [f.label]: v }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : saveLabel}
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

function FieldBody({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | boolean | undefined;
  onChange: (v: string | boolean) => void;
}) {
  if (field.kind === "checkbox") {
    return (
      <label className="mt-5 flex items-center gap-2 text-sm text-foreground/80">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        {field.label}
      </label>
    );
  }

  const labelNode: ReactNode = (
    <Label className="text-sm font-medium text-foreground/80">
      {field.label}
      {"required" in field && field.required && (
        <span className="ml-0.5 text-destructive">*</span>
      )}
    </Label>
  );

  if (field.kind === "select") {
    if (field.options && field.options.length > 0) {
      return (
        <>
          {labelNode}
          <Select
            value={typeof value === "string" && value ? value : undefined}
            onValueChange={(v) => onChange(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder ?? "Select a value"} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      );
    }
    return (
      <>
        {labelNode}
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-left text-sm",
            field.muted ? "text-muted-foreground" : "text-foreground",
          )}
        >
          <span className="truncate">{String(value ?? "")}</span>
          {field.stepper ? (
            <div className="flex flex-col text-muted-foreground">
              <ChevronDown className="h-3 w-3 rotate-180" />
              <ChevronDown className="h-3 w-3" />
            </div>
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </>
    );
  }

  if (field.kind === "date") {
    return (
      <>
        {labelNode}
        <div className="relative">
          <Input
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
          <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </>
    );
  }

  if (field.kind === "textarea") {
    return (
      <>
        {labelNode}
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </>
    );
  }

  return (
    <>
      {labelNode}
      <Input
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
}
