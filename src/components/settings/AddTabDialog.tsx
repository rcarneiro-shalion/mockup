import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Th, Td } from "@/components/seeds/ListPrimitives";
import { FieldLabel } from "@/components/settings/DashboardAppPrimitives";
import { Plus, X } from "lucide-react";
import type { DashTab, DashTabPanel } from "@/lib/dashboardApps";

const FILTER_SETS = ["Default", "Brand", "Category", "Retailer", "None"];

const emptyPanel = (): DashTabPanel => ({
  id: crypto.randomUUID(),
  label: "",
  slug: "",
  dashboardId: "",
});

/** Modal that builds a NEW section tab or edits an existing one (with inline-editable
 *  panels) and emits it on Save. Pass `initial` to open in edit mode (id is preserved). */
export function AddTabDialog({
  open,
  onOpenChange,
  onSave,
  initial = null,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tab: DashTab) => void;
  /** The tab being edited; omit / null for the add flow. */
  initial?: DashTab | null;
}) {
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [dashboardId, setDashboardId] = useState("");
  const [lookerId, setLookerId] = useState("");
  const [filterSet, setFilterSet] = useState(FILTER_SETS[0]);
  const [panels, setPanels] = useState<DashTabPanel[]>([]);

  // Seed the form from `initial` (edit) or blanks (add) each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setLabel(initial?.label ?? "");
    setSlug(initial?.slug ?? "");
    setDescription(initial?.description ?? "");
    setDashboardId(initial?.dashboardId ?? "");
    setLookerId(initial?.lookerId ?? "");
    setFilterSet(initial?.filterSet || FILTER_SETS[0]);
    // clone panels so edits don't mutate the stored tab until Save
    setPanels((initial?.panels ?? []).map((p) => ({ ...p })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?.id]);

  const isEdit = !!initial;

  const close = () => {
    onOpenChange(false);
  };

  const panelsInvalid = panels.some(
    (p) => !p.label.trim() || !p.slug.trim() || !p.dashboardId.trim(),
  );
  const canSave = label.trim() && slug.trim() && dashboardId.trim() && !panelsInvalid;

  const patchPanel = (id: string, patch: Partial<DashTabPanel>) =>
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      label: label.trim(),
      slug: slug.trim(),
      description: description.trim(),
      dashboardId: dashboardId.trim(),
      lookerId: lookerId.trim(),
      filterSet,
      panels,
    });
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit tab ${initial?.label}` : "Add tab"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Label</FieldLabel>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Slug</FieldLabel>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Dashboard Id</FieldLabel>
              <Input value={dashboardId} onChange={(e) => setDashboardId(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Looker Id</FieldLabel>
              <Input value={lookerId} onChange={(e) => setLookerId(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Filter Set</FieldLabel>
              <Select value={filterSet} onValueChange={setFilterSet}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_SETS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tab panels */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Tab panels</h3>
              <button
                type="button"
                onClick={() => setPanels((prev) => [...prev, emptyPanel()])}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Add panel
              </button>
            </div>

            <div className="mt-3 overflow-hidden rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    <Th>Label</Th>
                    <Th>Slug</Th>
                    <Th>Dashboard Id</Th>
                    <Th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {panels.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-1.5">No panels.</span>
                      </Td>
                      <Td />
                      <Td />
                      <Td />
                    </tr>
                  ) : (
                    panels.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <Td>
                          <Input
                            className="h-8"
                            value={p.label}
                            onChange={(e) => patchPanel(p.id, { label: e.target.value })}
                          />
                        </Td>
                        <Td>
                          <Input
                            className="h-8"
                            value={p.slug}
                            onChange={(e) => patchPanel(p.id, { slug: e.target.value })}
                          />
                        </Td>
                        <Td>
                          <Input
                            className="h-8"
                            value={p.dashboardId}
                            onChange={(e) => patchPanel(p.id, { dashboardId: e.target.value })}
                          />
                        </Td>
                        <Td>
                          <button
                            onClick={() => setPanels((prev) => prev.filter((x) => x.id !== p.id))}
                            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                            aria-label="Remove panel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {panelsInvalid && (
              <p className="mt-2 text-sm text-destructive">
                Invalid panels, check all cells are set
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
