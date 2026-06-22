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
import {
  FREQUENCY_OPTIONS,
  ROTATION_OPTIONS,
  LOCATION_SET_OPTIONS,
} from "@/lib/seedOptions";
import { getScrappingOptions } from "@/lib/scrappingOptions";
import { getProjects } from "@/lib/projects";
import { getStores } from "@/lib/retailers";
import {
  SUBSCRIPTION_GEOLOC_OPTIONS,
  SUBSCRIPTION_STATUS_OPTIONS,
  BUSINESS_UNITS,
  emptySubscription,
  getSubscriptions,
  subRotation,
  type Subscription,
  type SubscriptionStatus,
} from "@/lib/subscriptions";
import { AssignedSeeds } from "@/components/seeds/AssignedSeeds";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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
  // Business rule: MEDIA extraction is incompatible with VIRTUAL_STORE geolocation,
  // so that option is removed from the Geolocation picker (and clamped) for MEDIA.
  const isMedia = selectedExtraction === "MEDIA";
  const geoOptions = isMedia
    ? SUBSCRIPTION_GEOLOC_OPTIONS.filter((g) => g !== "VIRTUAL_STORE")
    : SUBSCRIPTION_GEOLOC_OPTIONS;

  const handleSave = async () => {
    // A Custom frequency requires the "every N days" value.
    if (v.frequency === "Custom" && !(v.frequencyDays ?? "").trim()) {
      toast.error("Enter the number of days for a Custom frequency");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      // Normalise conditional fields on save: Location set only when geoloc = MANUAL;
      // frequencyDays only for Custom; destinationOptions only for PLP / MEDIA; and
      // drop the legacy single destinationOption.
      onSave({
        ...v,
        geo: isMedia && v.geo === "VIRTUAL_STORE" ? "NONE" : v.geo,
        locationSet: locationEnabled ? v.locationSet : "",
        frequencyDays: v.frequency === "Custom" ? v.frequencyDays : "",
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

              <Field label="Project" required>
                <SelectBox value={v.project} onChange={(x) => set("project", x)} options={projectNames} />
              </Field>
              <Field label="Store" required>
                <SelectBox value={v.store} onChange={(x) => set("store", x)} options={storeOptions} />
              </Field>

              <Field label="Scrapping option" required className="sm:col-span-2">
                <ScrappingOptionPicker
                  value={v.scrappingOption}
                  onChange={(name) =>
                    setV((prev) => {
                      // Clear an incompatible VIRTUAL_STORE geo when switching to MEDIA.
                      const geo =
                        extractionByOption.get(name) === "MEDIA" && prev.geo === "VIRTUAL_STORE"
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
                {isMedia && (
                  <p className="mt-1 text-xs text-muted-foreground">Virtual store is not available for MEDIA extraction.</p>
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
              </Field>

              <Field label="Frequency">
                <SelectBox value={v.frequency} onChange={(x) => set("frequency", x)} options={FREQUENCY_OPTIONS} clearable />
                {v.frequency === "Custom" && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Every</span>
                    <Input
                      type="number"
                      min={1}
                      value={v.frequencyDays ?? ""}
                      onChange={(e) => set("frequencyDays", e.target.value)}
                      placeholder="N"
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">days<span className="ml-0.5 text-destructive">*</span></span>
                  </div>
                )}
              </Field>
              <Field label="Rotation">
                <MultiSelectPopover
                  value={v.rotation ?? []}
                  onChange={(arr) => set("rotation", arr)}
                  options={ROTATION_OPTIONS}
                  noun="rotation"
                  placeholder="Select rotation(s)"
                  searchPlaceholder="Locations / Seeds…"
                  emptyText="No options."
                />
              </Field>
            </section>

            <section className="mt-6 border-t border-border pt-5">
              <AssignedSeeds seeds={v.seeds} onChange={(next) => set("seeds", next)} />
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

