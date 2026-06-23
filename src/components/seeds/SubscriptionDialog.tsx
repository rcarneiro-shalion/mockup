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
import { SelectBox } from "@/components/seeds/SelectBox";
import { ScrappingOptionPicker } from "@/components/seeds/ScrappingOptionPicker";
import { MultiSelectPopover } from "@/components/seeds/MultiSelectPopover";
import { ChipMultiSelect } from "@/components/seeds/ChipMultiSelect";
import { CustomScheduleEditor, DEFAULT_CUSTOM_SCHEDULE } from "@/components/seeds/CustomScheduleEditor";
import { WeekdayPicker } from "@/components/seeds/WeekdayPicker";
import {
  FREQUENCY_OPTIONS,
  ROTATION_OPTIONS,
  LOCATION_SET_OPTIONS,
} from "@/lib/seedOptions";
import { getScrappingOptions } from "@/lib/scrappingOptions";
import { getProjects } from "@/lib/projects";
import { getStores } from "@/lib/retailers";
import { REAL_LOCATION_SETS } from "@/lib/scenarioSeedData";
import {
  SUBSCRIPTION_GEOLOC_OPTIONS,
  SUBSCRIPTION_STATUS_OPTIONS,
  BUSINESS_UNITS,
  emptySubscription,
  getSubscriptions,
  subRotation,
  subProjects,
  type Subscription,
  type SubscriptionStatus,
} from "@/lib/subscriptions";
import { AssignedSeeds } from "@/components/seeds/AssignedSeeds";
import type { SeedType } from "@/lib/seeds";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

export function SubscriptionDialog({
  open,
  onOpenChange,
  initial,
  mode,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Subscription | null;
  mode: "add" | "edit";
  onSave: (values: Subscription) => void;
  onDelete?: () => void;
}) {
  const [v, setV] = useState<Subscription>(emptySubscription());
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      // Merge over defaults so older saved records get safe defaults (e.g. seeds[]).
      const merged = initial ? { ...emptySubscription(), ...initial } : emptySubscription();
      // Migrate legacy data: rotation single-string ("Both"/"Zipcode"/…) → array;
      // a single destinationOption → the destinationOptions array.
      merged.rotation = subRotation(merged);
      merged.projects = subProjects(merged);
      if (!merged.destinationOptions?.length && merged.destinationOption) {
        merged.destinationOptions = [merged.destinationOption];
      }
      setV(merged);
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [open, initial]);

  const set = <K extends keyof Subscription>(k: K, val: Subscription[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  // Scrapping options drive the searchable picker plus the extraction-type logic:
  // the Destination option field (PLP / MEDIA) and the Virtual Seed tab (PDP).
  const allOptions = getScrappingOptions();
  const extractionByOption = new Map(allOptions.map((s) => [s.name, s.extractionType]));
  // Show the destination field when the subscription's single scrapping option is a
  // discovery (PLP / MEDIA) extraction.
  const selectedExtraction = extractionByOption.get(v.scrappingOption);
  const showDestination = selectedExtraction === "DIGITAL_SHELF_PLP" || selectedExtraction === "MEDIA";
  // Destination choices: sibling subscriptions that run a PDP scrapping option.
  const pdpSubscriptionNames = getSubscriptions()
    .filter((s) => s.id !== v.id && extractionByOption.get(s.scrappingOption) === "DIGITAL_SHELF_PDP")
    .map((s) => s.name);
  const projectNames = getProjects().map((p) => p.name);
  // Store options come from the Stores entity (Retailers › Stores), deduped by name.
  const storeOptions = [...new Set(getStores().map((s) => s.name))].sort((a, b) => a.localeCompare(b));

  const locationEnabled = v.geo === "MANUAL";
  // Real location set behind the selected label (real records pulled from backoffice).
  const realSet = REAL_LOCATION_SETS.find((s) => s.name === v.locationSet);
  // Business rule: VIRTUAL_STORE geolocation is ONLY available for a PDP scrapping
  // option; for every other extraction type it stays visible but disabled.
  const isPdp = selectedExtraction === "DIGITAL_SHELF_PDP";
  const geoOptions = SUBSCRIPTION_GEOLOC_OPTIONS.map((g) =>
    g === "VIRTUAL_STORE" ? { value: g, label: g, disabled: !isPdp } : g,
  );
  // Seed tabs are restricted to the types valid for the chosen extraction type
  // (Seed ↔ Extraction matrix); all four until an option is picked.
  const allowedSeedTypes: SeedType[] = !selectedExtraction
    ? ["KEYWORD", "URL", "API", "PDP"]
    : selectedExtraction === "DIGITAL_SHELF_PDP"
    ? ["PDP"]
    : selectedExtraction === "SHELF"
    ? ["URL", "API"]
    : selectedExtraction === "SEARCH"
    ? ["KEYWORD"]
    : ["KEYWORD", "URL", "API"];

  const handleSave = async () => {
    if (!(v.projects ?? []).length) {
      toast.error("Select at least one project");
      return;
    }
    if (!v.frequency) {
      toast.error("Frequency is required");
      return;
    }
    // Validate the Custom recurrence.
    if (v.frequency === "Custom") {
      const cs = v.customSchedule;
      if (!cs) { toast.error("Configure the custom frequency"); return; }
      if (cs.unit === "Daily" && cs.dailyMode !== "timesPerDay" && !(cs.everyNDays ?? "").trim()) {
        toast.error("Enter the number of days for the custom frequency"); return;
      }
      if (cs.unit === "Weekly" && !(cs.weekdays ?? []).length) {
        toast.error("Pick at least one weekday for the weekly custom frequency"); return;
      }
      if (cs.ends === "On" && !(cs.endsOn ?? "").trim()) { toast.error("Pick the end date"); return; }
      if (cs.ends === "After" && !(cs.endsAfter ?? "").trim()) { toast.error("Enter the number of occurrences"); return; }
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      // Normalise conditional fields on save: VIRTUAL_STORE only for PDP; Location set
      // only when MANUAL; customSchedule only for Custom; destinations only for PLP/MEDIA.
      onSave({
        ...v,
        project: undefined, // drop the legacy single field
        geo: v.geo === "VIRTUAL_STORE" && !isPdp ? "NONE" : v.geo,
        locationSet: locationEnabled ? v.locationSet : "",
        frequencyDays: "",
        startWeekday: v.frequency === "Weekly" ? (v.startWeekday || "Mon") : "",
        startMonthDay: v.frequency === "Monthly" ? (v.startMonthDay || "1") : "",
        customSchedule: v.frequency === "Custom" ? v.customSchedule : undefined,
        destinationOptions: showDestination ? (v.destinationOptions ?? []) : [],
        destinationOption: undefined,
      });
      toast.success(`Subscription ${mode === "add" ? "created" : "saved"} successfully`);
      onOpenChange(false);
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete?.();
    toast.success("Subscription deleted");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] w-[min(820px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              {mode === "add" ? "Add subscription" : v.name || "Subscription"}
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

          <div className="flex-1 overflow-auto px-6 py-5">
            <section className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* Name + a narrow Business Unit (single-select) + Status, on one row. */}
              <div className="flex flex-col gap-x-6 gap-y-5 sm:col-span-2 sm:flex-row sm:items-start">
                <Field label="Name" required className="flex-1">
                  <Input value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. ME_KW_WATER — Amazon US" />
                </Field>
                <Field label="Business Unit" className="sm:w-36">
                  <SelectBox
                    value={v.businessUnit ?? ""}
                    onChange={(x) => set("businessUnit", x)}
                    options={BUSINESS_UNITS}
                    clearable
                    placeholder="Select"
                  />
                </Field>
                <Field label="Status" className="sm:w-36">
                  <SelectBox
                    value={v.status ?? "Active"}
                    onChange={(x) => set("status", x as SubscriptionStatus)}
                    options={SUBSCRIPTION_STATUS_OPTIONS}
                  />
                </Field>
              </div>

              <Field label="Projects" required>
                <ChipMultiSelect
                  value={v.projects ?? []}
                  onChange={(arr) => set("projects", arr)}
                  options={projectNames}
                  addLabel="Add project"
                  emptyLabel="No project selected"
                />
              </Field>
              <Field label="Store" required>
                <SelectBox value={v.store} onChange={(x) => set("store", x)} options={storeOptions} />
              </Field>

              <Field label="Scrapping option" required className="sm:col-span-2">
                <ScrappingOptionPicker
                  value={v.scrappingOption}
                  onChange={(name) =>
                    setV((prev) => {
                      // VIRTUAL_STORE is only valid for a PDP option — clear it otherwise.
                      const geo =
                        prev.geo === "VIRTUAL_STORE" && extractionByOption.get(name) !== "DIGITAL_SHELF_PDP"
                          ? "NONE"
                          : prev.geo;
                      return { ...prev, scrappingOption: name, geo };
                    })
                  }
                  options={allOptions}
                />
              </Field>

              {showDestination && (
                <Field label="Destination options" className="sm:col-span-2">
                  <MultiSelectPopover
                    value={v.destinationOptions ?? []}
                    onChange={(arr) => set("destinationOptions", arr)}
                    options={pdpSubscriptionNames}
                    noun="destination"
                    placeholder="Select PDP subscription(s) — optional"
                    searchPlaceholder="Search Digital Shelf PDP subscriptions…"
                    emptyText="No PDP subscriptions found."
                  />
                </Field>
              )}

              <Field label="Geolocation mode" required>
                <SelectBox value={v.geo} onChange={(x) => set("geo", x)} options={geoOptions} />
                {!isPdp && (
                  <p className="mt-1 text-xs text-muted-foreground">Virtual store is only available for a PDP scrapping option.</p>
                )}
              </Field>
              <Field label="Location set">
                <SelectBox
                  value={locationEnabled ? v.locationSet : ""}
                  onChange={(x) => set("locationSet", x)}
                  options={LOCATION_SET_OPTIONS}
                  disabled={!locationEnabled}
                  placeholder={locationEnabled ? "Select a location set" : "Enabled when Geolocation mode is MANUAL"}
                />
                {locationEnabled && realSet && realSet.locations.length > 0 && (
                  <div className="mt-1.5 rounded-md border border-border bg-secondary/30 px-2.5 py-2 text-xs">
                    <div className="text-muted-foreground">
                      <span className="font-medium text-foreground">{realSet.count.toLocaleString()}</span> real locations · sample:
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {realSet.locations.slice(0, 6).map((l, i) => (
                        <span key={i} className="rounded bg-background px-1.5 py-0.5 text-foreground/80" title={[l.city, l.address, l.postal].filter(Boolean).join(" · ")}>
                          {l.name}
                        </span>
                      ))}
                      {realSet.count > Math.min(6, realSet.locations.length) && (
                        <span className="self-center text-muted-foreground">+{(realSet.count - Math.min(6, realSet.locations.length)).toLocaleString()} more</span>
                      )}
                    </div>
                  </div>
                )}
              </Field>

              <Field label="Frequency" required className="sm:col-span-2">
                <div className="flex flex-wrap items-start gap-x-10 gap-y-3">
                  <SelectBox
                    value={v.frequency}
                    onChange={(x) =>
                      setV((prev) => ({
                        ...prev,
                        frequency: x,
                        customSchedule: x === "Custom" ? (prev.customSchedule ?? DEFAULT_CUSTOM_SCHEDULE) : prev.customSchedule,
                      }))
                    }
                    options={FREQUENCY_OPTIONS}
                    className="sm:w-48"
                  />
                  {v.frequency === "Weekly" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-foreground/70">Starts on</span>
                      <WeekdayPicker selected={v.startWeekday ? [v.startWeekday] : []} onToggle={(d) => set("startWeekday", d)} />
                    </div>
                  )}
                  {v.frequency === "Monthly" && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-foreground/70">Starts on day</span>
                      <SelectBox value={v.startMonthDay ?? "1"} onChange={(x) => set("startMonthDay", x)} options={MONTH_DAYS} threshold={40} className="w-24" />
                    </div>
                  )}
                </div>
                {v.frequency === "Custom" && (
                  <CustomScheduleEditor
                    value={v.customSchedule ?? DEFAULT_CUSTOM_SCHEDULE}
                    onChange={(cs) => set("customSchedule", cs)}
                  />
                )}
              </Field>
              <Field label="Rotation">
                <ChipMultiSelect
                  value={v.rotation ?? []}
                  onChange={(arr) => set("rotation", arr)}
                  options={ROTATION_OPTIONS}
                  addLabel="Add rotation"
                  emptyLabel="No rotation selected"
                />
              </Field>
            </section>

            <section className="mt-6 border-t border-border pt-5">
              <AssignedSeeds seeds={v.seeds} onChange={(next) => set("seeds", next)} allowedTypes={allowedSeedTypes} />
            </section>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : mode === "add" ? "Add subscription" : "Save subscription"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subscription? This action cannot be undone.
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

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: ReactNode }) {
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

