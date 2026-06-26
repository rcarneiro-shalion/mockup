import { useMemo } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { PROJECTS_KEY, INITIAL_PROJECTS, BULK_PROJECTS_EXTRA, type Project } from "@/lib/projects";
import { nowStamp } from "@/lib/clients";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/seeds-api/projects/$projectId")({
  head: () => ({ meta: [{ title: "Edit project — Shalion" }] }),
  component: EditProjectPage,
});

function EditProjectPage() {
  const { projectId } = useParams({ from: "/seeds-api/projects/$projectId" });
  const [projects, setProjects] = usePersistentState<Project[]>(PROJECTS_KEY, INITIAL_PROJECTS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/seeds-api/projects" });

  // Look up across the FULL display set: the writable/persisted projects first, then the
  // read-only live bulk overlay — so a project opened from the list (incl. the ~8k real
  // projects) always resolves instead of showing "not found".
  const project = useMemo(
    () => projects.find((p) => p.id === projectId) ?? BULK_PROJECTS_EXTRA.find((p) => p.id === projectId),
    [projects, projectId],
  );

  if (!project) {
    return (
      <AppShell>
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          <p className="text-sm text-muted-foreground">Project not found.</p>
          <Button variant="outline" onClick={goBack}>Back to Projects</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <ProjectForm
      mode="edit"
      initial={project}
      onCancel={goBack}
      onSave={(updated) => {
        // The Save button commits only the header fields — the grids auto-save themselves, so
        // preserve the project's subscriptions. If this is a read-only overlay project (not yet
        // in the writable set), upsert it so the edit persists ("promote" it).
        setProjects((prev) =>
          prev.some((p) => p.id === projectId)
            ? prev.map((p) => (p.id === projectId ? { ...p, name: updated.name, bom: updated.bom, status: updated.status, updatedAt: nowStamp() } : p))
            : [...prev, { ...project, name: updated.name, bom: updated.bom, status: updated.status, updatedAt: nowStamp() }],
        );
        goBack();
      }}
      onSubscriptionsChange={(subs) => {
        // Auto-save the subscription grid (same upsert: promote an overlay project on first edit).
        setProjects((prev) =>
          prev.some((p) => p.id === projectId)
            ? prev.map((p) => (p.id === projectId ? { ...p, assignedSubscriptions: subs, updatedAt: nowStamp() } : p))
            : [...prev, { ...project, assignedSubscriptions: subs, updatedAt: nowStamp() }],
        );
      }}
      onDelete={() => {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        goBack();
      }}
    />
  );
}
