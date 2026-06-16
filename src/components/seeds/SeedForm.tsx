import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectBox } from "@/components/seeds/SelectBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pill, Th, Td, LinkText } from "@/components/seeds/ListPrimitives";
import { STORE_OPTIONS, CATEGORY_OPTIONS, PAGE_TYPE_OPTIONS } from "@/lib/seedOptions";
import { emptySeed, seedValueLabel, KEYWORD_TYPE_OPTIONS, SEED_STATUS_OPTIONS, type Seed, type SeedType, type KeywordType, type SeedStatus } from "@/lib/seeds";
import { nowStamp, getClientsForProject } from "@/lib/clients";
import { getSubscriptions } from "@/lib/subscriptions";
import { getProjects } from "@/lib/projects";
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

  // Subscriptions this seed belongs to — indirect: a subscription lists its seeds
  // by description (Subscription.seeds = seed.d), each tied to a project → client(s).
  // Keyed off the PERSISTED description (initial.d), not the live-edited one, and
  // loaded client-side (localStorage) to avoid an SSR/hydration mismatch.
  const [inSubs, setInSubs] = useState<{ id: string; name: string; project: string; clients: string[] }[]>([]);
  useEffect(() => {
    if (!initial) {
      setInSubs([]);
      return;
    }
    const projectIdByName = new Map(getProjects().map((p) => [p.name, p.id]));
    setInSubs(
      getSubscriptions()
        .filter((s) => (s.seeds ?? []).includes(initial.d))
        .map((s) => ({ id: s.id, name: s.name, project: s.project, clients: getClientsForProject(projectIdByName.get(s.project) ?? "") })),
    );
  }, [initial]);

  const set = <K extends keyof Seed>(k: K, v: Seed[K]) =>
    setSeed((prev) => ({ ...prev, [k]: v }));

  const valueLabel = seedValueLabel(effectiveType);
  const valuePlaceholder =
    effectiveType === "URL" ? "https://www.example.com/dp/…" : effectiveType === "API" ? "API origin" : "e.g. water";
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-foreground/80">Status</Label>
                <div className="w-36">
                  <SelectBox value={seed.status ?? "Active"} onChange={(v) => set("status", v as SeedStatus)} options={SEED_STATUS_OPTIONS} />
                </div>
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
                {/* Primary value — URL / API origin / Keyword, by seed type. The
                    defining field of a seed, so it leads the form, full width. */}
                <Field label={valueLabel} required>
                  <Input
                    value={seed.value ?? ""}
                    onChange={(e) => set("value", e.target.value)}
                    placeholder={valuePlaceholder}
                    className="h-11 text-base"
                  />
                </Field>
                {effectiveType === "KEYWORD" && (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <Field label="Keyword type" required>
                      <SelectBox value={seed.keywordType ?? ""} onChange={(v) => set("keywordType", v as KeywordType)} options={KEYWORD_TYPE_OPTIONS} />
                    </Field>
                    <div />
                  </div>
                )}

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
                  <Field label="Discovery key" required help>
                    <Input value={seed.discoveryKey ?? ""} onChange={(e) => set("discoveryKey", e.target.value)} />
                  </Field>
                  <Field label="Page type" required>
                    <SelectBox value={seed.pageType ?? ""} onChange={(v) => set("pageType", v)} options={PAGE_TYPE_OPTIONS} />
                  </Field>
                </div>

              </div>
            )}
          </div>

          {/* Subscriptions this seed belongs to (read-only) */}
          {isEdit && (
            <div className="mx-auto mt-5 max-w-5xl rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold text-foreground">Subscriptions</span>
                <span className="text-sm text-muted-foreground">where this seed is used</span>
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
                          <span className="block py-2">This seed isn't used in any subscription yet.</span>
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
            </div>
          )}
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

