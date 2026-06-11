import { useState } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pill } from "@/components/seeds/ListPrimitives";
import { STORE_OPTIONS, CATEGORY_OPTIONS, PAGE_TYPE_OPTIONS } from "@/lib/seedOptions";
import { emptySeed, seedValueLabel, KEYWORD_TYPE_OPTIONS, SEED_STATUS_OPTIONS, type Seed, type SeedType, type KeywordType, type SeedStatus } from "@/lib/seeds";
import { nowStamp } from "@/lib/clients";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, ChevronUp, HelpCircle, MoreHorizontal, Sprout, Trash2 } from "lucide-react";

export function SeedForm({
  type,
  initial = null,
  onSave,
  onCancel,
  onDelete,
}: {
  type: SeedType;
  initial?: Seed | null;
  onSave: (seed: Seed) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const effectiveType: SeedType = initial?.type ?? type;
  const isEdit = !!initial;
  const [seed, setSeed] = useState<Seed>(() =>
    initial ? { ...emptySeed(effectiveType), ...initial } : emptySeed(type),
  );
  const [fieldsOpen, setFieldsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const set = <K extends keyof Seed>(k: K, v: Seed[K]) =>
    setSeed((prev) => ({ ...prev, [k]: v }));

  const valueLabel = seedValueLabel(effectiveType);
  const canSave =
    seed.d.trim() && seed.store.trim() && seed.discoveryKey?.trim() && seed.pageType?.trim() && seed.value?.trim() &&
    (effectiveType !== "KEYWORD" || !!seed.keywordType);

  const handleSave = async () => {
    if (!canSave) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onSave({ ...seed, u: nowStamp() });
      toast.success(isEdit ? "Seed updated successfully" : "Seed created successfully");
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
        <div className="px-6 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Seeds
          </button>
          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {isEdit ? seed.d || "Seed" : "Add seed"}
              </h1>
              <Pill tone="blue">{effectiveType}</Pill>
            </div>
            {isEdit && onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-secondary" aria-label="More options">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete seed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl rounded-xl border border-border bg-card p-6 shadow-sm">
            <button type="button" onClick={() => setFieldsOpen((v) => !v)} className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                <ChevronUp className={cn("h-4 w-4 transition-transform", !fieldsOpen && "rotate-180")} />
              </span>
              <span className="text-base font-semibold text-foreground">Fields</span>
            </button>

            {fieldsOpen && (
              <div className="mt-5 space-y-5">
                <Field label="Description" required>
                  <textarea
                    value={seed.d}
                    onChange={(e) => set("d", e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Store" required>
                    <SelectBox value={seed.store} onChange={(v) => set("store", v)} options={STORE_OPTIONS} />
                  </Field>
                  <Field label="Category">
                    <SelectBox value={seed.cat} onChange={(v) => set("cat", v)} options={CATEGORY_OPTIONS} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Status">
                    <SelectBox value={seed.status ?? "Active"} onChange={(v) => set("status", v as SeedStatus)} options={SEED_STATUS_OPTIONS} />
                  </Field>
                  <div />
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Discovery key" required help>
                    <Input value={seed.discoveryKey ?? ""} onChange={(e) => set("discoveryKey", e.target.value)} />
                  </Field>
                  <Field label="Page type" required>
                    <SelectBox value={seed.pageType ?? ""} onChange={(v) => set("pageType", v)} options={PAGE_TYPE_OPTIONS} />
                  </Field>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="is-from-discovery"
                    type="checkbox"
                    checked={!!seed.isFromDiscovery}
                    onChange={(e) => set("isFromDiscovery", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border"
                  />
                  <label htmlFor="is-from-discovery" className="cursor-pointer">
                    <span className="text-sm font-medium text-foreground">Is from discovery</span>
                    <p className="mt-1 text-sm text-muted-foreground">Indicates if this seed was automatically generated by a PLP discovery seed.</p>
                  </label>
                </div>

                {effectiveType === "KEYWORD" ? (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <Field label="Keyword type" required>
                      <SelectBox value={seed.keywordType ?? ""} onChange={(v) => set("keywordType", v as KeywordType)} options={KEYWORD_TYPE_OPTIONS} />
                    </Field>
                    <Field label={valueLabel} required>
                      <Input value={seed.value ?? ""} onChange={(e) => set("value", e.target.value)} />
                    </Field>
                  </div>
                ) : (
                  <Field label={valueLabel} required>
                    <Input value={seed.value ?? ""} onChange={(e) => set("value", e.target.value)} />
                  </Field>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>
            {isSaving ? "Saving..." : isEdit ? "Save seed" : "Add seed"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, required, help, children }: { label: string; required?: boolean; help?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="flex items-center gap-1 text-sm font-medium text-foreground/80">
        {label}
        {help && <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SelectBox({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger>
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
