import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { usePersistentState } from "@/hooks/usePersistentState";
import { PROJECTS_KEY, INITIAL_PROJECTS, emptyProject, type Project } from "@/lib/projects";

export const Route = createFileRoute("/seeds-api/projects/new")({
  head: () => ({ meta: [{ title: "Add project — Shalion" }] }),
  component: AddProjectPage,
});

function AddProjectPage() {
  const [, setProjects] = usePersistentState<Project[]>(PROJECTS_KEY, INITIAL_PROJECTS);
  const navigate = useNavigate();
  const goBack = () => navigate({ to: "/seeds-api/projects" });

  return (
    <ProjectForm
      mode="add"
      initial={emptyProject()}
      onCancel={goBack}
      onSave={(project) => {
        setProjects((prev) => [...prev, project]);
        goBack();
      }}
    />
  );
}
