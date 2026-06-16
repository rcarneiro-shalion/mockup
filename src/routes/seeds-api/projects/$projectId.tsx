import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { PROJECTS_KEY, INITIAL_PROJECTS, type Project } from "@/lib/projects";
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

  const project = projects.find((p) => p.id === projectId);

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
        // The Save button commits only the header fields — the grids auto-save
        // themselves, so preserve the project's (already-persisted) subscriptions.
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, name: updated.name, bom: updated.bom, status: updated.status, updatedAt: nowStamp() } : p,
          ),
        );
        goBack();
      }}
      onSubscriptionsChange={(subs) => {
        // Auto-save: persist the subscription grid immediately (same setter as the
        // Save button, so neither clobbers the other).
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, assignedSubscriptions: subs, updatedAt: nowStamp() } : p)),
        );
      }}
      onDelete={() => {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        goBack();
      }}
    />
  );
}
