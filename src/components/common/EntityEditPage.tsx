import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { usePersistentState } from "@/hooks/usePersistentState";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { ApproxSpec, ApproxRow } from "./EntityListPage";

type FormValue = string | number | boolean;
const NONE = "__none__";

const stamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export function EntityEditPage({
  spec,
  editBase,
  rowId,
  isNew,
}: {
  spec: ApproxSpec;
  editBase: string;
  rowId?: string;
  isNew?: boolean;
}) {
  const fields = spec.fields ?? [];
  const [rows, setRows] = usePersistentState<ApproxRow[]>(`approx:${spec.key}:v2`, spec.rows);
  const navigate = useNavigate();
  const back = () => navigate({ to: editBase } as never);

  const existing = !isNew ? rows.find((r) => r.id === rowId) : undefined;

  const [form, setForm] = useState<Record<string, FormValue>>(() => {
    const init: Record<string, FormValue> = {};
    for (const f of fields) {
      const v = existing?.[f.key];
      init[f.key] = v !== undefined ? v : f.type === "checkbox" ? false : "";
    }
    return init;
  });
  const [showDelete, setShowDelete] = useState(false);

  if (!isNew && !existing) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">{spec.title} record not found.</p>
          <Button variant="outline" onClick={back}>
            Back to {spec.title}
          </Button>
        </div>
      </AppShell>
    );
  }

  const set = (k: string, v: FormValue) => setForm((p) => ({ ...p, [k]: v }));
  const canSave = fields
    .filter((f) => f.required && f.type !== "checkbox")
    .every((f) => String(form[f.key] ?? "").trim() !== "");

  const save = () => {
    if (!canSave) {
      toast.error("Please fill in the required fields");
      return;
    }
    const base: ApproxRow = (existing ?? { id: crypto.randomUUID() }) as ApproxRow;
    const next: ApproxRow = { ...base };
    for (const f of fields) next[f.key] = form[f.key];
    for (const c of spec.columns) {
      if (/created|creation/i.test(c.key) && isNew && !next[c.key]) next[c.key] = stamp();
      if (/updated/i.test(c.key)) next[c.key] = stamp();
    }
    setRows((prev) => (isNew ? [next, ...prev] : prev.map((r) => (r.id === next.id ? next : r))));
    toast.success(`${spec.title} ${isNew ? "created" : "saved"} successfully`);
    back();
  };

  const titleField = fields[0];
  const heading = isNew
    ? spec.addLabel || `Add ${spec.title}`
    : (titleField && String(form[titleField.key] || "")) || spec.title;

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {spec.title}
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{heading}</h1>
          </div>
          {!isNew && (
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label={`Delete ${spec.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Notice (e.g. deprecation) */}
        {spec.notice ? (
          <div className="mx-6 mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
            {spec.notice}
          </div>
        ) : null}

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-2">
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This form will be designed in upcoming iterations.
                </p>
              ) : (
                fields.map((f) => (
                  <div
                    key={f.key}
                    className={f.type === "textarea" ? "flex flex-col gap-1.5 md:col-span-2" : "flex flex-col gap-1.5"}
                  >
                    {f.type === "checkbox" ? (
                      <label className="flex items-center gap-2.5 pt-6">
                        <Checkbox
                          checked={!!form[f.key]}
                          onCheckedChange={(v) => set(f.key, v === true)}
                        />
                        <span className="text-sm font-medium text-foreground">{f.label}</span>
                      </label>
                    ) : (
                      <>
                        <Label className="text-sm font-medium text-foreground/80">
                          {f.label}
                          {f.required && <span className="ml-0.5 text-destructive">*</span>}
                        </Label>
                        {f.type === "textarea" ? (
                          <textarea
                            value={String(form[f.key] ?? "")}
                            onChange={(e) => set(f.key, e.target.value)}
                            rows={4}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        ) : f.type === "select" ? (
                          <Select
                            value={String(form[f.key] || "") || NONE}
                            onValueChange={(v) => set(f.key, v === NONE ? "" : v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${f.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {!f.required && <SelectItem value={NONE}>—</SelectItem>}
                              {(f.options ?? []).map((o) => (
                                <SelectItem key={o} value={o}>
                                  {o}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                            value={String(form[f.key] ?? "")}
                            onChange={(e) => set(f.key, e.target.value)}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={back}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!canSave}>
            {isNew ? spec.addLabel || `Add ${spec.title}` : `Save ${spec.title}`}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {spec.title} record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone. (In production, a record can only be
              deleted when nothing references it.)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDelete(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRows((prev) => prev.filter((r) => r.id !== rowId));
                back();
              }}
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
