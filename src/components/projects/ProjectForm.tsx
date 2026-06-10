import { useState } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AssignStorePackageDialog } from "@/components/projects/AssignStorePackageDialog";
import { Th, Td, Pagination, LinkText, Pill } from "@/components/seeds/ListPrimitives";
import type { Project } from "@/lib/projects";
import { toast } from "sonner";
import { ArrowLeft, HelpCircle, Plus, Trash2, X } from "lucide-react";

export function ProjectForm({
  mode,
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  mode: "add" | "edit";
  initial: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [project, setProject] = useState<Project>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const set = <K extends keyof Project>(k: K, v: Project[K]) =>
    setProject((prev) => ({ ...prev, [k]: v }));

  const assignedStorePackages = project.assignedStorePackages ?? [];

  const canSave = project.name.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) {
      toast.error("Name is required");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onSave(project);
      toast.success(`Project ${mode === "add" ? "created" : "saved"} successfully`);
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
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Projects
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {mode === "add" ? "Add project" : project.name || "Project"}
            </h1>
          </div>
          {mode === "edit" && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label="Delete project"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-[1fr_280px_180px]">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input value={project.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="flex items-center gap-1 text-sm font-medium text-foreground/80">
                  BoM
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </Label>
                <Input value={project.bom} onChange={(e) => set("bom", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-foreground/80">Status</Label>
                <Select value={project.status} onValueChange={(v) => set("status", v as Project["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Assigned store packages */}
          <div className="mt-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Assigned store packages</h2>
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setAssignOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Assign store package
              </Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    <Th>Name</Th>
                    <Th>Store</Th>
                    <Th>Geolocation mode</Th>
                    <Th>Type</Th>
                    <Th>Expiration date</Th>
                    <Th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {assignedStorePackages.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-2">No store packages assigned yet.</span>
                      </Td>
                      <Td /><Td /><Td /><Td /><Td />
                    </tr>
                  ) : (
                    assignedStorePackages.map((sp) => (
                      <tr key={sp.id} className="border-t border-border hover:bg-secondary/40">
                        <Td><LinkText>{sp.name}</LinkText></Td>
                        <Td><LinkText>{sp.store}</LinkText></Td>
                        <Td><Pill tone={sp.geo === "VIRTUAL STORE" ? "amber" : "violet"}>{sp.geo}</Pill></Td>
                        <Td><Pill tone="slate">{sp.type}</Pill></Td>
                        <Td className="text-muted-foreground">{sp.expiration}</Td>
                        <Td>
                          <button
                            onClick={() => set("assignedStorePackages", assignedStorePackages.filter((x) => x.id !== sp.id))}
                            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                            aria-label={`Remove ${sp.name}`}
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
            <Pagination total={assignedStorePackages.length} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>
            {isSaving ? "Saving..." : mode === "add" ? "Add project" : "Save project"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete?.()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AssignStorePackageDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        assignedNames={assignedStorePackages.map((sp) => sp.name)}
        onAssign={(sp) => set("assignedStorePackages", [...assignedStorePackages, sp])}
      />
    </AppShell>
  );
}
