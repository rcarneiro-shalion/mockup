import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePersistentState } from "@/hooks/usePersistentState";
import { AppShell } from "@/components/layout/AppShell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { AssignProjectDialog } from "@/components/clients/AssignProjectDialog";
import { ClientBottomTabs } from "@/components/clients/ClientBottomTabs";
import { ClientUsersSection } from "@/components/clients/ClientUsersSection";
import { ClientColorPersistenceSection } from "@/components/clients/ClientColorPersistenceSection";
import { LinkText, Pagination, Th, Td } from "@/components/seeds/ListPrimitives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Client } from "@/lib/clients";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, ChevronUp, HelpCircle, Pencil, Plus, Trash2, X } from "lucide-react";

export function ClientForm({
  mode,
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  mode: "add" | "edit";
  initial: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [client, setClient] = useState<Client>(initial);
  // Section collapse/expand persists as a user preference (global across clients).
  const [metaOpen, setMetaOpen] = usePersistentState<boolean>("pref:clientForm:metaOpen", true);
  const [metaEditing, setMetaEditing] = useState(false);
  const [projectsOpen, setProjectsOpen] = usePersistentState<boolean>("pref:clientForm:projectsOpen", true);
  const [countryGroupsOpen, setCountryGroupsOpen] = usePersistentState<boolean>("pref:clientForm:countryGroupsOpen", false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const set = <K extends keyof Client>(k: K, v: Client[K]) =>
    setClient((prev) => ({ ...prev, [k]: v }));

  const assignedProjects = client.assignedProjects ?? [];

  const canSave = client.name.trim() && client.acronym.trim();

  const handleSave = async () => {
    if (!canSave) {
      toast.error("Name and Acronym are required");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onSave(client);
      toast.success(`Client ${mode === "add" ? "created" : "saved"} successfully`);
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
              Clients
            </button>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {mode === "add" ? "Add client" : client.name || "Client"}
            </h1>
          </div>
          {mode === "edit" && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label="Delete client"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="mx-auto max-w-5xl space-y-5">
            {/* Fields */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label className="text-sm font-medium text-foreground/80">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input value={client.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="flex items-center gap-1 text-sm font-medium text-foreground/80">
                    Acronym
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={client.acronym}
                    onChange={(e) => set("acronym", e.target.value.toUpperCase())}
                    maxLength={8}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-foreground/80">Account</Label>
                  <Select value={client.account || client.name} disabled>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={client.account || client.name || " "}>{client.account || client.name}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <input
                  id="is-test"
                  type="checkbox"
                  checked={client.isTest}
                  onChange={(e) => set("isTest", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border"
                />
                <label htmlFor="is-test" className="cursor-pointer">
                  <span className="text-sm font-medium text-foreground">Is test</span>
                  <p className="mt-1 text-sm text-muted-foreground">Check if this client is a fake client.</p>
                </label>
              </div>
            </div>

            {/* Meta properties */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMetaOpen((v) => !v)}
                  className="flex items-center gap-2"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                    <ChevronUp className={cn("h-4 w-4 transition-transform", !metaOpen && "rotate-180")} />
                  </span>
                  <span className="text-base font-semibold text-foreground">Meta properties</span>
                </button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground"
                    onClick={() => set("meta", "{}")}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => setMetaEditing((v) => !v)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {metaEditing ? "Done" : "Edit"}
                  </Button>
                </div>
              </div>

              {metaOpen && (
                <textarea
                  value={client.meta}
                  onChange={(e) => set("meta", e.target.value)}
                  readOnly={!metaEditing}
                  spellCheck={false}
                  rows={metaEditing ? 6 : 1}
                  className={cn(
                    "mt-4 w-full rounded-md border border-input px-3 py-2 font-mono text-sm text-emerald-700 focus:outline-none focus:ring-1 focus:ring-ring",
                    metaEditing ? "bg-background" : "bg-secondary/40",
                  )}
                />
              )}
            </div>

            {/* Country groups */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <button type="button" onClick={() => setCountryGroupsOpen((v) => !v)} className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                  <ChevronUp className={cn("h-4 w-4 transition-transform", !countryGroupsOpen && "rotate-180")} />
                </span>
                <span className="text-base font-semibold text-foreground">Country groups</span>
              </button>
              {countryGroupsOpen && (
                <p className="mt-4 text-sm text-muted-foreground">No country groups defined yet.</p>
              )}
            </div>

            {/* Projects (client-project relationship) */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setProjectsOpen((v) => !v)}
                  className="flex items-center gap-2"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                    <ChevronUp className={cn("h-4 w-4 transition-transform", !projectsOpen && "rotate-180")} />
                  </span>
                  <span className="text-base font-semibold text-foreground">Projects</span>
                </button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setAssignOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Assign project
                </Button>
              </div>

              {projectsOpen && (
                <>
                  <div className="mt-4 overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/60">
                        <tr>
                          <Th>Name</Th>
                          <Th>
                            <span className="inline-flex items-center gap-1">
                              BoM <HelpCircle className="h-3 w-3" />
                            </span>
                          </Th>
                          <Th>Active from</Th>
                          <Th>Active to</Th>
                          <Th className="w-10" />
                        </tr>
                      </thead>
                      <tbody>
                        {assignedProjects.length === 0 ? (
                          <tr>
                            <Td className="text-muted-foreground" >
                              <span className="block py-2">No projects assigned yet.</span>
                            </Td>
                            <Td /><Td /><Td /><Td />
                          </tr>
                        ) : (
                          assignedProjects.map((p) => (
                            <tr key={p.projectId} className="border-t border-border hover:bg-secondary/40">
                              <Td>
                                <LinkText onClick={() => navigate({ to: "/seeds-api/projects/$projectId", params: { projectId: p.projectId } })}>
                                  {p.name}
                                </LinkText>
                              </Td>
                              <Td className="text-foreground/80">{p.bom || "-"}</Td>
                              <Td className="text-muted-foreground">{p.activeFrom}</Td>
                              <Td className="text-muted-foreground">{p.activeTo}</Td>
                              <Td>
                                <button
                                  onClick={() => set("assignedProjects", assignedProjects.filter((x) => x.projectId !== p.projectId))}
                                  className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                                  aria-label={`Remove ${p.name}`}
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
                  <Pagination total={assignedProjects.length} />
                </>
              )}
            </div>

            {/* Color persistence (spec: client colours for chart dimensions) */}
            <ClientColorPersistenceSection client={client} />

            {/* Users (client-level pool; Datagroup column shows this client's data groups) */}
            <ClientUsersSection client={client} set={set} />

            {/* Bottom tabbed section */}
            <ClientBottomTabs
              client={client}
              set={set}
              onOpenDataGroup={(id) =>
                navigate({ to: "/clients/$clientId/data-groups/$dataGroupId", params: { clientId: client.id, dataGroupId: id } })
              }
              onAddDataGroup={() => navigate({ to: "/clients/$clientId/data-groups/new", params: { clientId: client.id } })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>
            {isSaving ? "Saving..." : mode === "add" ? "Add client" : "Save client"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onDelete?.(); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AssignProjectDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        assignedIds={assignedProjects.map((p) => p.projectId)}
        onAssign={(p) => set("assignedProjects", [...assignedProjects, p])}
      />
    </AppShell>
  );
}
