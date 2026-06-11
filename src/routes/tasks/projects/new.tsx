import { createFileRoute } from "@tanstack/react-router";
import { EntityEditPage } from "@/components/common/EntityEditPage";
import { SPECS } from "@/lib/approxEntities";

export const Route = createFileRoute("/tasks/projects/new")({
  head: () => ({ meta: [{ title: "Add Projects — Shalion" }] }),
  component: () => <EntityEditPage spec={SPECS["tasks-projects"]} editBase={"/tasks/projects"} isNew />,
});
