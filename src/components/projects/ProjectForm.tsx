import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { AssignScrapingPlanDialog } from "@/components/projects/AssignScrapingPlanDialog";
import { AssignClientDialog } from "@/components/projects/AssignClientDialog";
import { Th, Td, Pagination, LinkText, Pill } from "@/components/seeds/ListPrimitives";
import { FilterChip } from "@/components/seeds/FilterChip";
import type { Project, AssignedScrapingPlan } from "@/lib/projects";
import { getStores } from "@/lib/retailers";
import { getScrapingPlans } from "@/lib/scrapingPlans";
import { getAssignedClientsForProject, setProjectClients, type ProjectClient } from "@/lib/clients";
import { toast } from "sonner";
import { ArrowLeft, Calendar, HelpCircle, MapPin, Pencil, Plus, Store, Tag, Trash2, Users, X } from "lucide-react";

export function ProjectForm({
  mode,
  initial,
  onSave,
  onCancel,
  onDelete,
  onScrapingPlansChange,
}: {
  mode: "add" | "edit";
  initial: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
  onDelete?: () => void;
  /** Persist a scrapingPlan-grid change immediately (auto-save) — edit mode only. */
  onScrapingPlansChange?: (subs: AssignedScrapingPlan[]) => void;
}) {
  const navigate = useNavigate();
  // Resolve a store name → id so the assigned-scrapingPlan store cell can deep-link
  // to the store edit page (assigned subs carry the store NAME, not its id).
  const storeIdByName = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of getStores()) m.set(s.name, s.id);
    return m;
  }, []);
  // Deep-link to the scrapingPlan's edit dialog. Assigned rows may carry a snapshot id
  // (fixtures) or a real one, so resolve against the live list by id first, then name.
  const goScrapingPlan = (sp: AssignedScrapingPlan) => {
    const subs = getScrapingPlans();
    const match = subs.find((s) => s.id === sp.id) ?? subs.find((s) => s.name === sp.name);
    if (match) navigate({ to: "/seeds-api/scraping-plans", search: { edit: match.id } });
    else navigate({ to: "/seeds-api/scraping-plans" });
  };
  const goStore = (name: string) => {
    const id = storeIdByName.get(name);
    if (id) navigate({ to: "/stores/$storeId", params: { storeId: id } });
    else navigate({ to: "/stores" });
  };

  const [project, setProject] = useState<Project>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignClientOpen, setAssignClientOpen] = useState(false);
  const [editClient, setEditClient] = useState<ProjectClient | null>(null);
  const [editSub, setEditSub] = useState<AssignedScrapingPlan | null>(null);
  // --- grid filters (Assigned clients + Assigned scrapingPlans) -----------
  const [fClient, setFClient] = useState<string[]>([]);
  const [fName, setFName] = useState<string[]>([]);
  const [fStore, setFStore] = useState<string[]>([]);
  const [fGeo, setFGeo] = useState<string[]>([]);
  const [fType, setFType] = useState<string[]>([]);
  const [fExpBy, setFExpBy] = useState(""); // YYYY-MM-DD — "expires on or before"
  // Assigned clients = the inverse of the client↔project link (lives on the client).
  const [assignedClients, setAssignedClients] = useState<ProjectClient[]>([]);
  useEffect(() => {
    setAssignedClients(getAssignedClientsForProject(initial.id));
  }, [initial.id]);

  const set = <K extends keyof Project>(k: K, v: Project[K]) =>
    setProject((prev) => ({ ...prev, [k]: v }));

  const assignedScrapingPlans = project.assignedScrapingPlans ?? [];

  // Apply the grid filters (mockup-side filtering of the displayed rows).
  const uniq = (xs: string[]) => [...new Set(xs.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const expCutoff = fExpBy ? Date.parse(`${fExpBy}T23:59:59`) : null;
  const expMatch = (exp: string) => {
    if (expCutoff === null) return true;
    const t = Date.parse(exp);
    return !Number.isNaN(t) && t <= expCutoff;
  };
  const shownClients = assignedClients.filter((c) => !fClient.length || fClient.includes(c.name));
  const shownSubs = assignedScrapingPlans.filter(
    (sp) =>
      (!fName.length || fName.includes(sp.name)) &&
      (!fStore.length || fStore.includes(sp.store)) &&
      (!fGeo.length || fGeo.includes(sp.geo)) &&
      (!fType.length || fType.includes(sp.type)) &&
      expMatch(sp.expiration),
  );
  // The two relationship grids AUTO-SAVE on every add/remove (they don't wait for
  // the Save button). Only possible for an existing project, so they're gated to
  // edit mode — in add mode you save the project first (name/BoM/status), then edit.
  const canAssign = mode === "edit";

  const canSave = project.name.trim().length > 0;

  // --- auto-save handlers (persist immediately) ---------------------------
  const projectRef = { id: initial.id, name: initial.name, bom: initial.bom };

  const assignClient = (c: ProjectClient) => {
    const next = [...assignedClients, c];
    setAssignedClients(next);
    setProjectClients(projectRef, next); // → Clients store (single source of truth)
    toast.success(`${c.name} assigned`);
  };
  const removeClient = (c: ProjectClient) => {
    const next = assignedClients.filter((x) => x.clientId !== c.clientId);
    setAssignedClients(next);
    setProjectClients(projectRef, next);
    toast.success(`${c.name} removed`);
  };
  const updateClient = (c: ProjectClient) => {
    const next = assignedClients.map((x) => (x.clientId === c.clientId ? c : x));
    setAssignedClients(next);
    setProjectClients(projectRef, next);
    toast.success(`${c.name} updated`);
  };
  const assignScrapingPlans = (list: AssignedScrapingPlan[]) => {
    if (!list.length) return;
    const next = [...assignedScrapingPlans, ...list];
    set("assignedScrapingPlans", next);
    onScrapingPlansChange?.(next); // → Projects store, via the route's setter
    toast.success(`${list.length} scraping plan${list.length === 1 ? "" : "s"} assigned`);
  };
  const removeScrapingPlan = (sp: AssignedScrapingPlan) => {
    const next = assignedScrapingPlans.filter((x) => x.id !== sp.id);
    set("assignedScrapingPlans", next);
    onScrapingPlansChange?.(next);
    toast.success(`${sp.name} removed`);
  };
  const updateScrapingPlan = (sp: AssignedScrapingPlan) => {
    const next = assignedScrapingPlans.map((x) => (x.id === sp.id ? sp : x));
    set("assignedScrapingPlans", next);
    onScrapingPlansChange?.(next);
    toast.success(`${sp.name} updated`);
  };

  // The Save button only commits the header fields (name, BoM, status). The grids
  // persist themselves above, so saving never touches them.
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

          {/* Assigned clients (inverse of the client↔project link) */}
          <div className="mt-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Assigned clients</h2>
              <Button variant="outline" size="sm" className="h-8 gap-1.5" disabled={!canAssign} onClick={() => setAssignClientOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Assign client
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <FilterChip label="Client" icon={Users} options={uniq(assignedClients.map((c) => c.name))} value={fClient} onChange={setFClient} searchable />
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    <Th>Client</Th>
                    <Th>Acronym</Th>
                    <Th>Active from</Th>
                    <Th>Active to</Th>
                    <Th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {assignedClients.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-2">{canAssign ? "No clients assigned yet." : "Save the project first to assign clients."}</span>
                      </Td>
                      <Td /><Td /><Td /><Td />
                    </tr>
                  ) : shownClients.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-2">No clients match the filter.</span>
                      </Td>
                      <Td /><Td /><Td /><Td />
                    </tr>
                  ) : (
                    shownClients.map((c) => (
                      <tr key={c.clientId} className="border-t border-border hover:bg-secondary/40">
                        <Td><LinkText>{c.name}</LinkText></Td>
                        <Td><Pill tone="slate">{c.acronym}</Pill></Td>
                        <Td className="text-muted-foreground">{c.activeFrom}</Td>
                        <Td className="text-muted-foreground">{c.activeTo}</Td>
                        <Td>
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              onClick={() => setEditClient(c)}
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                              aria-label={`Edit ${c.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeClient(c)}
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                              aria-label={`Remove ${c.name}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination total={shownClients.length} />
          </div>

          {/* Assigned scrapingPlans */}
          <div className="mt-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Assigned scraping plans</h2>
              <Button variant="outline" size="sm" className="h-8 gap-1.5" disabled={!canAssign} onClick={() => setAssignOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Assign scraping plan
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <FilterChip label="Name" options={uniq(assignedScrapingPlans.map((s) => s.name))} value={fName} onChange={setFName} searchable />
              <FilterChip label="Store" icon={Store} options={uniq(assignedScrapingPlans.map((s) => s.store))} value={fStore} onChange={setFStore} />
              <FilterChip label="Geolocation mode" icon={MapPin} options={uniq(assignedScrapingPlans.map((s) => s.geo))} value={fGeo} onChange={setFGeo} />
              <FilterChip label="Type" icon={Tag} options={uniq(assignedScrapingPlans.map((s) => s.type))} value={fType} onChange={setFType} />
              <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${fExpBy ? "border-primary bg-primary/5 text-foreground" : "border-border bg-background text-foreground/80"}`}>
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Expires by</span>
                <input type="date" value={fExpBy} onChange={(e) => setFExpBy(e.target.value)} className="bg-transparent text-sm text-foreground outline-none" aria-label="Filter by expiration date (on or before)" />
                {fExpBy && (
                  <button type="button" onClick={() => setFExpBy("")} aria-label="Clear expiration filter" className="text-muted-foreground hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
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
                  {assignedScrapingPlans.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-2">{canAssign ? "No scraping plans assigned yet." : "Save the project first to assign scraping plans."}</span>
                      </Td>
                      <Td /><Td /><Td /><Td /><Td />
                    </tr>
                  ) : shownSubs.length === 0 ? (
                    <tr>
                      <Td className="text-muted-foreground">
                        <span className="block py-2">No scraping plans match the filters.</span>
                      </Td>
                      <Td /><Td /><Td /><Td /><Td />
                    </tr>
                  ) : (
                    shownSubs.map((sp) => (
                      <tr key={sp.id} className="border-t border-border hover:bg-secondary/40">
                        <Td><LinkText onClick={() => goScrapingPlan(sp)}>{sp.name}</LinkText></Td>
                        <Td><LinkText onClick={() => goStore(sp.store)}>{sp.store}</LinkText></Td>
                        <Td><Pill tone={sp.geo === "VIRTUAL STORE" ? "amber" : "violet"}>{sp.geo}</Pill></Td>
                        <Td>{sp.type ? <Pill tone="slate">{sp.type}</Pill> : <span className="text-muted-foreground">—</span>}</Td>
                        <Td className="text-muted-foreground">{sp.expiration}</Td>
                        <Td>
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              onClick={() => setEditSub(sp)}
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                              aria-label={`Edit ${sp.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeScrapingPlan(sp)}
                              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                              aria-label={`Remove ${sp.name}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination total={shownSubs.length} />
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

      <AssignScrapingPlanDialog
        open={assignOpen || !!editSub}
        onOpenChange={(v) => { if (!v) { setAssignOpen(false); setEditSub(null); } }}
        assignedNames={assignedScrapingPlans.map((sp) => sp.name)}
        editing={editSub}
        onAssign={updateScrapingPlan}
        onAssignMany={assignScrapingPlans}
      />

      <AssignClientDialog
        open={assignClientOpen || !!editClient}
        onOpenChange={(v) => { if (!v) { setAssignClientOpen(false); setEditClient(null); } }}
        assignedIds={assignedClients.map((c) => c.clientId)}
        editing={editClient}
        onAssign={(c) => (editClient ? updateClient(c) : assignClient(c))}
      />
    </AppShell>
  );
}
