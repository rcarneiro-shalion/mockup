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
import {
  LOCATION_SET_OPTIONS,
  SEED_SELECTION_OPTIONS,
  FRESHNESS_WINDOW_OPTIONS,
  LOCATION_SELECTION_OPTIONS,
  VOLUME_CAP_OPTIONS,
} from "@/lib/seedOptions";
import { getScrappingOptions } from "@/lib/scrappingOptions";
import { getProjects } from "@/lib/projects";
import { getStores } from "@/lib/retailers";
import { REAL_LOCATION_SETS } from "@/lib/scenarioSeedData";
import {
  SCRAPING_PLAN_GEOLOC_OPTIONS,
  SCRAPING_PLAN_STATUS_OPTIONS,
  BUSINESS_UNITS,
  emptyScrapingPlan,
  getScrapingPlans,
  subProjects,
  type ScrapingPlan,
  type ScrapingPlanStatus,
} from "@/lib/scrapingPlans";
import { AssignedSeeds } from "@/components/seeds/AssignedSeeds";
import { AssignedLocations } from "@/components/seeds/AssignedLocations";
import type { SeedType } from "@/lib/seeds";
import { getAppVersion } from "@/lib/appVersion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MapPin, Sprout, Trash2 } from "lucide-react";

export function ScrapingPlanDialog({
  open,
  onOpenChange,
  initial,
  mode,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: ScrapingPlan | null;
  mode: "add" | "edit";
  onSave: (values: ScrapingPlan) => void;
  onDelete?: () => void;
}) {
  const [v, setV] = useState<ScrapingPlan>(emptyScrapingPlan());
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // V1/V2 bottom tabs (Seeds | Locations) — the Locations tab needs MANUAL geolocation.
  const [bottomTab, setBottomTab] = useState<"seeds" | "locations">("seeds");

  useEffect(() => {
    if (open) {
      // Merge over defaults so older saved records get safe defaults (e.g. seeds[]).
      const merged = initial ? { ...emptyScrapingPlan(), ...initial } : emptyScrapingPlan();
      // Migrate legacy data: a single destinationOption → the destinationOptions array.
      merged.projects = subProjects(merged);
      if (!merged.destinationOptions?.length && merged.destinationOption) {
        merged.destinationOptions = [merged.destinationOption];
      }
      setV(merged);
      setIsSaving(false);
      setShowDeleteConfirm(false);
      setBottomTab("seeds");
    }
  }, [open, initial]);

  // Leaving MANUAL invalidates the Locations tab — snap back to Seeds.
  useEffect(() => {
    if (v.geo !== "MANUAL") setBottomTab("seeds");
  }, [v.geo]);

  const set = <K extends keyof ScrapingPlan>(k: K, val: ScrapingPlan[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  // Scrapping options drive the searchable picker plus the extraction-type logic:
  // the Destination option field (PLP / MEDIA) and the Virtual Seed tab (PDP).
  const allOptions = getScrappingOptions();
  const extractionByOption = new Map(allOptions.map((s) => [s.name, s.extractionType]));
  // Show the destination field when the scrapingPlan's single scrapping option is a
  // discovery (PLP / MEDIA) extraction.
  const selectedExtraction = extractionByOption.get(v.scrappingOption);
  const showDestination = selectedExtraction === "DIGITAL_SHELF_PLP" || selectedExtraction === "MEDIA";
  // Destination choices: sibling scrapingPlans that run a PDP scrapping option.
  const pdpScrapingPlanNames = getScrapingPlans()
    .filter((s) => s.id !== v.id && extractionByOption.get(s.scrappingOption) === "DIGITAL_SHELF_PDP")
    .map((s) => s.name);
  const projectNames = getProjects().map((p) => p.name);
  // Store options come from the Stores entity (Retailers › Stores), deduped by name.
  const storeOptions = [...new Set(getStores().map((s) => s.name))].sort((a, b) => a.localeCompare(b));

  // The V1/V2 phase cut keeps the scrapingPlan lean: no Selection parameters section,
  // and the Location-set reference is simplified to a direct "Locations" multi-select
  // (same MANUAL-only gating). v3 keeps the full As-Is form.
  const lean = getAppVersion() <= 2;

  const locationEnabled = v.geo === "MANUAL";
  // Real location set behind the selected label (real records pulled from backoffice).
  const realSet = REAL_LOCATION_SETS.find((s) => s.name === v.locationSet);
  // Business rule: VIRTUAL_STORE geolocation is ONLY available for a PDP scrapping
  // option; for every other extraction type it stays visible but disabled.
  const isPdp = selectedExtraction === "DIGITAL_SHELF_PDP";
  const geoOptions = SCRAPING_PLAN_GEOLOC_OPTIONS.map((g) =>
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

  // --- Selection parameters (replaces Rotation): independent seed + location axes. ---
  // Not part of the V1/V2 phase — all axes off there (skips their validations too).
  const isStateful = !lean && v.seedSelection === "Stateful freshness";
  const showFreshnessDays = isStateful && (v.freshnessWindow || "Last days") === "Last days";
  const locSelEnabled = !lean && (v.geo === "AUTOMATIC" || v.geo === "MANUAL");
  const showCycleLength = locSelEnabled && v.locationSelection === "N-day rotation";

  const handleSave = async () => {
    if (!(v.projects ?? []).length) {
      toast.error("Select at least one project");
      return;
    }
    if (showFreshnessDays && !String(v.lastOfferDays ?? "").trim()) {
      toast.error("Enter the number of days for the freshness window");
      return;
    }
    if (showCycleLength) {
      const n = Number(v.cycleLength);
      if (!Number.isInteger(n) || n < 2 || n > 6) {
        toast.error("Cycle length (N) must be a whole number between 2 and 6");
        return;
      }
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      // Normalise conditional fields on save: VIRTUAL_STORE only for PDP; Location set
      // only when MANUAL; destinations only for PLP/MEDIA. (Frequency moved to the scrapping option.)
      onSave({
        ...v,
        project: undefined, // drop the legacy single field
        geo: v.geo === "VIRTUAL_STORE" && !isPdp ? "NONE" : v.geo,
        destinationOptions: showDestination ? (v.destinationOptions ?? []) : [],
        destinationOption: undefined,
        rotation: undefined, // drop the legacy field
        ...(lean
          ? {
              // V1/V2 phase: direct Locations (MANUAL only); selection parameters and the
              // Location-set reference are out of scope — stored values pass through.
              locations: locationEnabled ? (v.locations ?? []) : [],
            }
          : {
              locationSet: locationEnabled ? v.locationSet : "",
              // Selection parameters — clear conditional axes that don't apply.
              seedSelection: v.seedSelection || "All seeds",
              freshnessWindow: isStateful ? (v.freshnessWindow || "Last days") : "",
              lastOfferDays: showFreshnessDays ? (v.lastOfferDays || "") : "",
              locationSelection: locSelEnabled ? (v.locationSelection || "All locations") : "",
              cycleLength: showCycleLength ? (v.cycleLength || "") : "",
              volumeCap: v.volumeCap || "Full coverage",
            }),
      });
      toast.success(`Scraping Plan ${mode === "add" ? "created" : "saved"} successfully`);
      onOpenChange(false);
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete?.();
    toast.success("Scraping Plan deleted");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] w-[min(820px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              {mode === "add" ? "Add scraping plan" : v.name || "Scraping Plan"}
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
                    onChange={(x) => set("status", x as ScrapingPlanStatus)}
                    options={SCRAPING_PLAN_STATUS_OPTIONS}
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
                <SelectBox
                  value={v.store}
                  onChange={(x) =>
                    setV((prev) => ({
                      ...prev,
                      store: x,
                      // Lean phase: locations belong to the store — a store switch invalidates them.
                      ...(lean && x !== prev.store ? { locations: [] } : {}),
                    }))
                  }
                  options={storeOptions}
                />
              </Field>

              <Field label="Scraping option" required className="sm:col-span-2">
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
                    options={pdpScrapingPlanNames}
                    noun="destination"
                    placeholder="Select PDP scraping plan(s) — optional"
                    searchPlaceholder="Search Digital Shelf PDP scraping plans…"
                    emptyText="No PDP scraping plans found."
                  />
                </Field>
              )}

              <Field label="Geolocation mode" required>
                <SelectBox value={v.geo} onChange={(x) => set("geo", x)} options={geoOptions} />
                {!isPdp && (
                  <p className="mt-1 text-xs text-muted-foreground">Virtual store is only available for a PDP scraping option.</p>
                )}
                {/* V1/V2: MANUAL locations live in the Locations tab below (Job-style grid). */}
                {lean && locationEnabled && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Assign the scraping locations in the <span className="font-medium text-foreground/80">Locations</span> tab below.
                  </p>
                )}
              </Field>
              {!lean && (
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
              )}

            </section>

            {/* Selection parameters — not part of the V1/V2 phase. */}
            {!lean && (
            <section className="mt-6 border-t border-border pt-5">
              <h3 className="text-sm font-semibold text-foreground">Selection parameters</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Replaces the legacy Rotation tag-list — independent seed &amp; location selection axes consumed by the Task Generator.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
                <Field label="Seed selection" required>
                  <SelectBox value={v.seedSelection} onChange={(x) => set("seedSelection", x)} options={SEED_SELECTION_OPTIONS} />
                  <p className="mt-1 text-xs text-muted-foreground">All seeds · Weekly bucket · Monthly bucket · Stateful freshness</p>
                </Field>
                <Field label="Freshness window">
                  <SelectBox
                    value={isStateful ? (v.freshnessWindow || "Last days") : ""}
                    onChange={(x) => set("freshnessWindow", x)}
                    options={FRESHNESS_WINDOW_OPTIONS}
                    disabled={!isStateful}
                    placeholder={isStateful ? "Select a window" : "Enabled for Stateful freshness"}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Last days · Current week · Current fortnight · Current month · Current quarter</p>
                </Field>
                <Field label="Days" required={showFreshnessDays}>
                  <Input
                    type="number"
                    value={showFreshnessDays ? (v.lastOfferDays ?? "") : ""}
                    onChange={(e) => set("lastOfferDays", e.target.value)}
                    disabled={!showFreshnessDays}
                    placeholder={showFreshnessDays ? "e.g. 14" : "Enabled for Last days"}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">From lastOfferDays</p>
                </Field>
                <Field label="Location selection">
                  <SelectBox
                    value={locSelEnabled ? (v.locationSelection ?? "All locations") : ""}
                    onChange={(x) => set("locationSelection", x)}
                    options={LOCATION_SELECTION_OPTIONS}
                    disabled={!locSelEnabled}
                    placeholder={locSelEnabled ? "Select" : "Enabled for AUTOMATIC or MANUAL geolocation"}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">All · Monthly CMI schedule · 1 random per day · N-day rotation</p>
                </Field>
                <Field label="Cycle length (N)">
                  <Input
                    type="number"
                    min={2}
                    max={6}
                    value={showCycleLength ? (v.cycleLength ?? "") : ""}
                    onChange={(e) => set("cycleLength", e.target.value)}
                    disabled={!showCycleLength}
                    placeholder={showCycleLength ? "N = 2..6" : "Enabled for N-day rotation (N = 2..6)"}
                  />
                </Field>
                <Field label="Volume cap" required>
                  <SelectBox value={v.volumeCap} onChange={(x) => set("volumeCap", x)} options={VOLUME_CAP_OPTIONS} />
                  <p className="mt-1 text-xs text-muted-foreground">Full · Top 10/day · Backfill 1.5×</p>
                </Field>
              </div>
            </section>
            )}

            <section className="mt-6 border-t border-border pt-5">
              {lean ? (
                <>
                  {/* V1/V2: Seeds | Locations tabs (Job-style) — Locations only for MANUAL geolocation. */}
                  <div className="mb-4 flex items-center gap-5 border-b border-border">
                    <button
                      type="button"
                      onClick={() => setBottomTab("seeds")}
                      className={cn(
                        "flex items-center gap-1.5 border-b-2 px-0.5 pb-2 text-sm transition-colors",
                        bottomTab === "seeds"
                          ? "border-primary font-medium text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Sprout className="h-4 w-4" /> Seeds
                      <span className="rounded-full bg-secondary px-1.5 text-[11px] text-muted-foreground">{v.seeds.length}</span>
                    </button>
                    <button
                      type="button"
                      disabled={!locationEnabled}
                      title={locationEnabled ? undefined : "Enabled when Geolocation mode is MANUAL"}
                      onClick={() => locationEnabled && setBottomTab("locations")}
                      className={cn(
                        "flex items-center gap-1.5 border-b-2 px-0.5 pb-2 text-sm transition-colors",
                        !locationEnabled
                          ? "cursor-not-allowed border-transparent text-muted-foreground/40"
                          : bottomTab === "locations"
                          ? "border-primary font-medium text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <MapPin className="h-4 w-4" /> Locations
                      <span className="rounded-full bg-secondary px-1.5 text-[11px] text-muted-foreground">{(v.locations ?? []).length}</span>
                    </button>
                  </div>
                  {bottomTab === "locations" && locationEnabled ? (
                    <AssignedLocations
                      store={v.store}
                      assigned={v.locations ?? []}
                      onChange={(next) => set("locations", next)}
                    />
                  ) : (
                    <AssignedSeeds seeds={v.seeds} onChange={(next) => set("seeds", next)} allowedTypes={allowedSeedTypes} />
                  )}
                </>
              ) : (
                <AssignedSeeds seeds={v.seeds} onChange={(next) => set("seeds", next)} allowedTypes={allowedSeedTypes} />
              )}
            </section>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : mode === "add" ? "Add scraping plan" : "Save scraping plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete scraping plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scraping plan? This action cannot be undone.
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

