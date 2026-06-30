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
import { SelectBox } from "@/components/seeds/SelectBox";
import { ChipMultiSelect } from "@/components/seeds/ChipMultiSelect";
import { Pill, Th, Td, LinkText } from "@/components/seeds/ListPrimitives";
import {
  EXTRACTION_TYPE_OPTIONS,
  MODALITY_OPTIONS,
  SORT_OPTIONS,
  FREQUENCY_OPTIONS,
  TIMES_PER_DAY_OPTIONS,
} from "@/lib/seedOptions";
import { getTaskGroups } from "@/lib/settings";
import { getSubscriptions, subProjects } from "@/lib/subscriptions";
import { getProjects } from "@/lib/projects";
import { getClientsForProject } from "@/lib/clients";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronUp, Pencil, Plus, Trash2, X } from "lucide-react";

const STATUS_OPTIONS = ["Active", "Inactive"];

export type ScrappingOptionValues = {
  name: string;
  status: string;
  extractionType: string;
  taskGroups: string[]; // 1:N → Settings TaskGroup catalog (renamed from the legacy "timeframes")
  // How often the option re-runs (moved here from the subscription). "Custom" → a simple
  // Days field + times-per-day selector. Daily/Weekly/Monthly carry no extra config.
  frequency: string;
  customDays?: string;        // Custom only: which/how many days (free field)
  customTimesPerDay?: string; // Custom only: 1x | 2x | 3x | 4x
  // Joints (conjuntos)
  multivariants: boolean;
  pagination: boolean;
  maxPage: string;
  limitedDiscovery: boolean;
  maxRank: string;
  // Disjoints (disjuntos) — modalities is now multi-select
  modalities: boolean;
  modalityValues: string[];
  sorting: boolean;
  sort: string;
  // Free-form JSON meta properties (mirrors the Clients form)
  meta: string;
  createdAt?: string;
  updatedAt?: string;
};

export const EMPTY_SCRAPPING_OPTION: ScrappingOptionValues = {
  name: "",
  status: "Active",
  extractionType: "MEDIA",
  taskGroups: ["group_1"],
  frequency: "Daily",
  customDays: "",
  customTimesPerDay: "1x",
  multivariants: false,
  pagination: false,
  maxPage: "",
  limitedDiscovery: false,
  maxRank: "",
  modalities: false,
  modalityValues: [],
  sorting: false,
  sort: "best_seller",
  meta: "{}",
  createdAt: "",
  updatedAt: "",
};

// --- Auto-suggested name convention (scraping option) ----------------------
// A scraping option's name follows its OWN convention, distinct from the
// subscription/Job one (ME_KW_WATER — Amazon US, which encodes client + store).
// It instead encodes the extraction config:
//   EXTRACTION _ FREQUENCY _ MULTIVARIANTS [_ MODALITY]   e.g. SE_DAY_MONO_SHIP
// Surfaced as the Name placeholder (a live suggestion that tracks the form); it
// nudges the convention without auto-filling the field.
const EXTRACTION_ABBR: Record<string, string> = {
  SEARCH: "SE",
  SHELF: "SH",
  AD: "AD",
  DIGITAL_SHELF_PLP: "PLP",
  DIGITAL_SHELF_PDP: "PDP",
  MEDIA: "ME",
};
const FREQUENCY_ABBR: Record<string, string> = {
  Daily: "DAY",
  Weekly: "WEEK",
  Monthly: "MONTH",
  Custom: "CUSTOM",
};
const MODALITY_ABBR: Record<string, string> = {
  pickup: "PICK",
  delivery: "DLV",
  shipping: "SHIP",
};

export function suggestScrapingName(v: ScrappingOptionValues): string {
  const parts = [
    EXTRACTION_ABBR[v.extractionType] ?? "EXT",
    FREQUENCY_ABBR[v.frequency] ?? "FREQ",
    v.multivariants ? "MULTI" : "MONO",
  ];
  if (v.modalities && v.modalityValues?.length) {
    parts.push(v.modalityValues.map((m) => MODALITY_ABBR[m] ?? m.toUpperCase()).join("-"));
  }
  return parts.join("_");
}

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
  const [metaOpen, setMetaOpen] = useState(true);
  const [metaEditing, setMetaEditing] = useState(false);
  // Subscriptions using this scrapping option — indirect: a subscription references
  // its scrapping option by name (Subscription.scrappingOption), each tied to a
  // project → client(s). Keyed off the persisted name; loaded client-side.
  const [inSubs, setInSubs] = useState<{ id: string; name: string; project: string; clients: string[] }[]>([]);

  useEffect(() => {
    if (open) {
      // Merge over defaults so older saved records (missing newer fields like
      // `timeframes` / `modalityValues` / `meta`) get safe defaults instead of crashing.
      setV(initial ? { ...EMPTY_SCRAPPING_OPTION, ...initial } : EMPTY_SCRAPPING_OPTION);
      setIsSaving(false);
      setShowDeleteConfirm(false);
      setMetaEditing(false);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open || mode !== "edit" || !initial) {
      setInSubs([]);
      return;
    }
    const projectIdByName = new Map(getProjects().map((p) => [p.name, p.id]));
    setInSubs(
      getSubscriptions()
        .filter((s) => s.scrappingOption === initial.name)
        .map((s) => ({
          id: s.id,
          name: s.name,
          project: subProjects(s).join(", "),
          clients: [...new Set(subProjects(s).flatMap((pn) => getClientsForProject(projectIdByName.get(pn) ?? "")))],
        })),
    );
  }, [open, initial, mode]);

  const set = <K extends keyof ScrappingOptionValues>(k: K, val: ScrappingOptionValues[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const addModality = (m: string) => {
    if (!v.modalityValues.includes(m)) set("modalityValues", [...v.modalityValues, m]);
  };
  const removeModality = (m: string) =>
    set("modalityValues", v.modalityValues.filter((x) => x !== m));
  const availableModalities = MODALITY_OPTIONS.filter((m) => !v.modalityValues.includes(m));
  // TaskGroup options come from the Settings › TaskGroup catalog (1:N). Replaces the legacy static timeframe list.
  const taskGroupOptions = getTaskGroups().map((t) => t.name);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      onSave(v);
      toast.success(`Scraping option ${mode === "add" ? "created" : "saved"} successfully`);
      onOpenChange(false);
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete?.();
    toast.success("Scraping option deleted");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] w-[min(880px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              {mode === "add" ? "Add scraping option" : v.name || "Scraping option"}
            </DialogTitle>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="mr-6 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
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
                <Input value={v.name} onChange={(e) => set("name", e.target.value)} placeholder={`e.g. ${suggestScrapingName(v)}`} />
              </Field>
              <Field label="Status" className="sm:col-span-1">
                <SelectBox value={v.status} onChange={(x) => set("status", x)} options={STATUS_OPTIONS} />
              </Field>

              <Field label="Extraction type" required className="sm:col-span-2">
                <SelectBox value={v.extractionType} onChange={(x) => set("extractionType", x)} options={EXTRACTION_TYPE_OPTIONS} />
              </Field>
              {/* TaskGroup — 1:N multi-select (shared ChipMultiSelect) */}
              <Field label="TaskGroup" required className="sm:col-span-2">
                <ChipMultiSelect
                  value={v.taskGroups}
                  onChange={(arr) => set("taskGroups", arr)}
                  options={taskGroupOptions}
                  addLabel="Add task group"
                  emptyLabel="No task groups selected"
                />
              </Field>

              {/* Frequency — moved here from the subscription. Custom = Days + times/day. */}
              <Field label="Frequency" required className="sm:col-span-2">
                <div className="flex flex-wrap items-end gap-4">
                  <SelectBox value={v.frequency} onChange={(x) => set("frequency", x)} options={FREQUENCY_OPTIONS} className="w-40" />
                  {v.frequency === "Custom" && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-foreground/70">Days</span>
                        <Input value={v.customDays ?? ""} onChange={(e) => set("customDays", e.target.value)} placeholder="e.g. 1, 3, 5" className="h-9 w-40" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-foreground/70">Times</span>
                        <SelectBox value={v.customTimesPerDay ?? "1x"} onChange={(x) => set("customTimesPerDay", x)} options={TIMES_PER_DAY_OPTIONS} className="w-24" />
                      </div>
                    </>
                  )}
                </div>
              </Field>
            </section>

            {/* Scrapping options and values */}
            <section className="rounded-xl border border-border bg-secondary/30 p-5">
              <h3 className="text-sm font-semibold text-foreground">Scraping options and values</h3>

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
                    <div
                      className={cn(
                        "flex min-h-8 flex-wrap items-center gap-1 rounded-md border border-input bg-background px-2 py-1",
                        !v.modalities && "opacity-50",
                      )}
                    >
                      {v.modalityValues.length === 0 && (
                        <span className="px-1 text-xs text-muted-foreground">No modalities selected</span>
                      )}
                      {v.modalityValues.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground"
                        >
                          {m}
                          <button
                            type="button"
                            disabled={!v.modalities}
                            onClick={() => removeModality(m)}
                            className="text-muted-foreground hover:text-destructive disabled:cursor-not-allowed"
                            aria-label={`Remove ${m}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {v.modalities && availableModalities.length > 0 && (
                        <Select value="" onValueChange={addModality}>
                          <SelectTrigger className="h-6 w-auto gap-1 border-dashed px-2 text-xs text-muted-foreground">
                            <Plus className="h-3 w-3" />
                            <span>Add</span>
                          </SelectTrigger>
                          <SelectContent>
                            {availableModalities.map((m) => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
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

            {/* Meta properties — mirrors the Clients form edit */}
            <section className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setMetaOpen((s) => !s)} className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                    <ChevronUp className={cn("h-4 w-4 transition-transform", !metaOpen && "rotate-180")} />
                  </span>
                  <span className="text-base font-semibold text-foreground">Meta properties</span>
                </button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={() => set("meta", "{}")}>
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setMetaEditing((s) => !s)}>
                    <Pencil className="h-3.5 w-3.5" />
                    {metaEditing ? "Done" : "Edit"}
                  </Button>
                </div>
              </div>
              {metaOpen && (
                <textarea
                  value={v.meta}
                  onChange={(e) => set("meta", e.target.value)}
                  readOnly={!metaEditing}
                  spellCheck={false}
                  rows={metaEditing ? 6 : 1}
                  className={cn(
                    "mt-4 w-full rounded-md border border-input px-3 py-2 font-mono text-sm text-emerald-700 focus:outline-none focus:ring-1 focus:ring-ring",
                    metaEditing ? "bg-background" : "bg-secondary/40",
                  )}
                />
              )}
            </section>

            {/* Subscriptions using this scrapping option (read-only) — same layout as the seed form */}
            {mode === "edit" && (
              <section className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold text-foreground">Subscriptions</span>
                  <span className="text-sm text-muted-foreground">where this scraping option is used</span>
                </div>
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60">
                      <tr>
                        <Th>Subscription name</Th>
                        <Th>Projects assigned</Th>
                        <Th>Clients belongs</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {inSubs.length === 0 ? (
                        <tr>
                          <Td className="text-muted-foreground">
                            <span className="block py-2">This scraping option isn't used in any subscription yet.</span>
                          </Td>
                          <Td /><Td />
                        </tr>
                      ) : (
                        inSubs.map((s) => (
                          <tr key={s.id} className="border-t border-border hover:bg-secondary/40">
                            <Td><LinkText>{s.name}</LinkText></Td>
                            <Td>{s.project ? <LinkText>{s.project}</LinkText> : <span className="text-muted-foreground">—</span>}</Td>
                            <Td>
                              <div className="flex flex-wrap gap-1">
                                {s.clients.length ? (
                                  s.clients.map((c) => <Pill key={c} tone="green">{c}</Pill>)
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </div>
                            </Td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : mode === "add" ? "Add scraping option" : "Save scraping option"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete scraping option</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scraping option? This action cannot be undone.
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
