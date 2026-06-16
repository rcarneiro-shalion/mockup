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
import {
  STORE_OPTIONS,
  FREQUENCY_OPTIONS,
  ROTATION_OPTIONS,
  LOCATION_SET_OPTIONS,
  readPersistedList,
} from "@/lib/seedOptions";
import { getProjects } from "@/lib/projects";
import {
  SUBSCRIPTION_GEOLOC_OPTIONS,
  emptySubscription,
  type Subscription,
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
      setV(initial ? { ...emptySubscription(), ...initial } : emptySubscription());
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [open, initial]);

  const set = <K extends keyof Subscription>(k: K, val: Subscription[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const scrappingOptionNames = readPersistedList<{ name: string }>("seeds-api:scrapping-options").map((s) => s.name);
  const projectNames = getProjects().map((p) => p.name);

  const locationEnabled = v.geo === "MANUAL";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      // Location set only applies when geoloc is MANUAL.
      onSave({ ...v, locationSet: locationEnabled ? v.locationSet : "" });
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
              <Field label="Name" required className="sm:col-span-2">
                <Input value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. ME_KW_WATER — Amazon US" />
              </Field>

              <Field label="Project" required>
                <SelectBox value={v.project} onChange={(x) => set("project", x)} options={projectNames} />
              </Field>
              <Field label="Store" required>
                <SelectBox value={v.store} onChange={(x) => set("store", x)} options={STORE_OPTIONS} />
              </Field>

              <Field label="Scrapping option" required className="sm:col-span-2">
                <SelectBox value={v.scrappingOption} onChange={(x) => set("scrappingOption", x)} options={scrappingOptionNames} />
              </Field>

              <Field label="Geolocation mode" required>
                <SelectBox value={v.geo} onChange={(x) => set("geo", x)} options={SUBSCRIPTION_GEOLOC_OPTIONS} />
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
              </Field>
              <Field label="Rotation">
                <SelectBox value={v.rotation} onChange={(x) => set("rotation", x)} options={ROTATION_OPTIONS} clearable />
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

