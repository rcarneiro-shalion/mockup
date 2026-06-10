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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Th, Td, LinkText, Pill } from "@/components/seeds/ListPrimitives";
import { STORE_OPTIONS, GEOLOC_OPTIONS, readPersistedList } from "@/lib/seedOptions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUp,
  ChevronUp,
  MapPin,
  MoreHorizontal,
  MoreVertical,
  PlayCircle,
  Plus,
  Sprout,
  Trash2,
} from "lucide-react";

const STATUS_OPTIONS = ["Active", "Inactive"];

export type StorePackageValues = {
  name: string;
  store: string;
  status: string;
  geo: string;
  isAdHoc: boolean;
  limit: string;
};

type JobRow = {
  name: string;
  store: string;
  pkg: string;
  type: string;
  typeTone?: "amber" | "slate";
  geo: string;
  geoTone?: "violet" | "amber";
  bu: string;
};

const FALLBACK_JOBS: JobRow[] = [
  { name: "ME_KW_WATER - Amazon US", store: "Amazon US", pkg: "PKG Amazon US", type: "MEDIA", geo: "MANUAL", geoTone: "violet", bu: "CMI" },
  { name: "PDP_BEAM_US_Amazon US", store: "Amazon US", pkg: "PKG Amazon US", type: "DIGITAL_SHELF_PDP", geo: "VIRTUAL STORE", geoTone: "amber", bu: "DSM" },
];

type Tab = "scrapping" | "locations" | "seeds";

export function StorePackageDetailDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: StorePackageValues | null;
  onSave: (values: StorePackageValues) => void;
  onDelete?: () => void;
}) {
  const [values, setValues] = useState<StorePackageValues>({
    name: "",
    store: "",
    status: "Active",
    geo: "MANUAL",
    isAdHoc: false,
    limit: "5",
  });
  const [fieldsOpen, setFieldsOpen] = useState(true);
  const [tab, setTab] = useState<Tab>("scrapping");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open && initial) {
      setValues(initial);
      setFieldsOpen(true);
      setTab("scrapping");
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  }, [open, initial]);

  const set = <K extends keyof StorePackageValues>(key: K, v: StorePackageValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const jobs = readPersistedList<JobRow>("seeds-api:jobs");
  const relatedJobs = (jobs.length ? jobs : FALLBACK_JOBS).filter(
    (j) => j.pkg === initial?.name,
  );
  const tabJobs = relatedJobs.length ? relatedJobs : FALLBACK_JOBS;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      onSave(values);
      toast.success("Store package saved successfully");
      onOpenChange(false);
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete?.();
    toast.success("Store package deleted");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="flex max-h-[90vh] w-[min(960px,94vw)] max-w-none flex-col gap-0 overflow-hidden p-0"
        >
          {/* Header */}
          <div className="border-b border-border px-6 pb-4 pt-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Store packages
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-secondary"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DialogTitle className="mt-2 text-xl font-semibold tracking-tight">
              {values.name || "Store package"}
            </DialogTitle>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto px-6 py-5">
            {/* Fields card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <button
                type="button"
                onClick={() => setFieldsOpen((v) => !v)}
                className="flex items-center gap-2"
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                  <ChevronUp
                    className={cn("h-4 w-4 transition-transform", !fieldsOpen && "rotate-180")}
                  />
                </span>
                <span className="text-base font-semibold text-foreground">Fields</span>
              </button>

              {fieldsOpen && (
                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-4">
                  <Field label="Name" required className="sm:col-span-3">
                    <Input value={values.name} onChange={(e) => set("name", e.target.value)} />
                  </Field>

                  <Field label="Status" className="sm:col-span-1">
                    <Select value={values.status} onValueChange={(v) => set("status", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Store" required className="sm:col-span-4">
                    <Select value={values.store} onValueChange={(v) => set("store", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                      <SelectContent>
                        {STORE_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Geolocation mode" required className="sm:col-span-2">
                    <Select value={values.geo} onValueChange={(v) => set("geo", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GEOLOC_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="flex items-start gap-3 sm:col-span-2 sm:pt-7">
                    <input
                      id="is-ad-hoc"
                      type="checkbox"
                      checked={values.isAdHoc}
                      onChange={(e) => set("isAdHoc", e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="is-ad-hoc" className="cursor-pointer">
                      <span className="text-sm font-medium text-foreground">Is ad-hoc</span>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Ad-hoc store packages are those created for a particular purpose.
                      </p>
                    </label>
                  </div>

                  <Field label="Limit" className="sm:col-span-2">
                    <Input
                      type="number"
                      value={values.limit}
                      onChange={(e) => set("limit", e.target.value)}
                    />
                  </Field>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex items-center gap-6 border-b border-border">
                <TabButton active={tab === "scrapping"} onClick={() => setTab("scrapping")} icon={PlayCircle}>
                  Scrapping options
                </TabButton>
                <TabButton active={tab === "locations"} onClick={() => setTab("locations")} icon={MapPin}>
                  Locations
                </TabButton>
                <TabButton active={tab === "seeds"} onClick={() => setTab("seeds")} icon={Sprout}>
                  Seeds
                </TabButton>
              </div>

              {tab === "scrapping" && (
                <div className="pt-5">
                  <div className="mb-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => toast.info("Create job — coming soon")}
                    >
                      <Plus className="h-4 w-4" />
                      Create job
                    </Button>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/60">
                        <tr>
                          <Th>
                            <span className="inline-flex items-center gap-1">
                              Name <ArrowUp className="h-3 w-3" />
                            </span>
                          </Th>
                          <Th>Store</Th>
                          <Th>Store package</Th>
                          <Th>Extraction type</Th>
                          <Th>Geolocation mode</Th>
                          <Th>Business</Th>
                          <Th>Active</Th>
                          <Th className="w-10" />
                        </tr>
                      </thead>
                      <tbody>
                        {tabJobs.map((j) => (
                          <tr key={j.name} className="border-t border-border hover:bg-secondary/40">
                            <Td><LinkText>{j.name}</LinkText></Td>
                            <Td><LinkText>{j.store}</LinkText></Td>
                            <Td><LinkText>{j.pkg}</LinkText></Td>
                            <Td><Pill tone={j.typeTone ?? "slate"}>{j.type}</Pill></Td>
                            <Td><Pill tone={j.geoTone ?? "violet"}>{j.geo}</Pill></Td>
                            <Td className="text-foreground/80">{j.bu}</Td>
                            <Td><Switch defaultChecked /></Td>
                            <Td>
                              <button className="rounded p-1 text-muted-foreground hover:bg-secondary">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "locations" && (
                <EmptyTab icon={MapPin} label="No locations configured for this store package yet." />
              )}
              {tab === "seeds" && (
                <EmptyTab icon={Sprout} label="No seeds assigned to this store package yet." />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save store package"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete store package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this store package? This action cannot be undone.
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

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof PlayCircle;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "-mb-px inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
        active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function EmptyTab({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
